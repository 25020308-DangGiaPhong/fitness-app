import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

import { adjustVolume, changeSession, emptySnapshot, startSession, parseSnapshot, updateCameraData } from '../src/modules/workout-sessions/model.ts';

const root = path.resolve(import.meta.dirname, '..');
const flush = () => new Promise((resolve) => setImmediate(resolve));
function load(file, require, globals = {}) {
  const exports = {};
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } });
  vm.runInNewContext(outputText, { exports, require, Date, ...globals });
  return exports;
}
const catalog = load('src/modules/exercise-catalog/catalog.ts');
const images = load('src/modules/exercise-catalog/exerciseImages.ts', (name) => name);
const tokens = load('src/ui/tokens.ts');

function harness() {
  const slots = [];
  let cursor = 0, tree;
  let snapshot = startSession(emptySnapshot, 'bodyweight-squat', 2, 30000, 'one', 1000, 10);
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], (next) => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }];
    },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useEffect() {},
  };
  const sessions = { useSessions: () => ({
    snapshot,
    command: async (id, action) => { snapshot = changeSession(snapshot, id, action, Date.now()); },
    adjust: async (id, sets, amount) => { snapshot = adjustVolume(snapshot, id, sets, amount); },
  }) };
  const native = Object.fromEntries(['View', 'Pressable', 'Image'].map((name) => [name, name]));
  Object.assign(native, { StyleSheet: { create: (value) => value }, Alert: { alert() {} } });
  const ui = { ...tokens, ...Object.fromEntries(['AppText', 'Button', 'Screen', 'TargetPicker'].map((name) => [name, name])) };
  const module = load('src/modules/workout-sessions/ui/SessionScreen.tsx', (name) => {
    if (name === 'react') return react;
    if (name === 'react-native') return native;
    if (name === './CameraSessionScreen') return { CameraSessionScreen: 'CameraSessionScreen' };
    if (name === './PausedSessionTargets') return load('src/modules/workout-sessions/ui/PausedSessionTargets.tsx', (dependency) => ({
      '@expo/vector-icons/Ionicons': 'Ionicons', 'react-native': native, '@/ui': ui,
      '@/modules/exercise-catalog': catalog, '@/modules/ai-coach': { PausedSessionCoach: 'PausedSessionCoach' },
    })[dependency], { React: react });
    if (name === 'expo-image') return { Image: 'ExpoImage' };
    if (name === '@expo/vector-icons/Ionicons') return 'Ionicons';
    if (name === '@/ui') return ui;
    if (name === '@/modules/exercise-catalog') return catalog;
    if (name === '@/modules/ai-coach') return { PausedSessionCoach: 'PausedSessionCoach' };
    if (name === '../index') return sessions;
    if (name === '../model') return { elapsed: () => 0, restRemaining: () => 0 };
    if (name.endsWith('.gif')) return name;
    throw new Error(name);
  }, { React: react });
  function render() { cursor = 0; tree = module.SessionScreen({ id: 'one', onProgress() {}, onTrain() {} }); }
  function* walk(node) {
    if (Array.isArray(node)) { for (const child of node) yield* walk(child); return; }
    if (!node || typeof node !== 'object') return;
    yield node;
    if (typeof node.type === 'function') yield* walk(node.type(node.props));
    else yield* walk(node.props?.children);
  }
  const nodes = () => [...walk(tree)];
  const find = (predicate) => nodes().find(predicate)?.props;
  async function press(label) {
    const control = find((node) => node.props.label === label || node.props.accessibilityLabel === label);
    assert.ok(control, label);
    control.onPress(); await flush(); render();
  }
  render();
  return { render, press, find, nodes, snapshot: () => snapshot, react, sessions, ui, native };
}

test('Running session hides edits; Pause reveals manual wheels and Coach; Resume rejects a stale apply', async () => {
  const ui = harness();
  assert.equal(ui.find((node) => node.props.accessibilityLabel === 'Adjust total sets'), undefined);
  assert.equal(ui.find((node) => node.type === 'PausedSessionCoach'), undefined);
  assert.equal(ui.find((node) => node.props.label === 'More sets'), undefined);
  await ui.press('Pause session');
  await ui.press('Adjust total sets');
  const picker = ui.find((node) => node.type === 'TargetPicker');
  assert.equal(picker.min, 1);
  picker.onConfirm(3); await flush(); ui.render();
  assert.equal(ui.snapshot().sessions[0].totalSets, 3);
  const toggle = ui.find((node) => node.props.accessibilityState?.expanded === false);
  toggle.onPress(); ui.render();
  const coach = ui.find((node) => node.type === 'PausedSessionCoach');
  assert.equal(coach.amount, 10);
  await coach.onApply(2, 8); ui.render();
  assert.equal(ui.snapshot().sessions[0].targetAmount, 8);
  await ui.press('Resume session');
  await coach.onApply(4, 12); ui.render();
  assert.equal(ui.snapshot().sessions[0].totalSets, 2);
  assert.equal(ui.snapshot().sessions[0].targetAmount, 8);
  assert.equal(ui.find((node) => node.type === 'PausedSessionCoach'), undefined);
});

test('Workout preview uses the same per-exercise cover as the Train list', () => {
  const ui = harness();
  const module = load('src/modules/exercise-catalog/ui/WorkoutPreviewScreen.tsx', (name) => {
    if (name === 'react') return ui.react;
    if (name === 'react-native') return ui.native;
    if (name === '@/ui') return ui.ui;
    if (name === '@/modules/workout-sessions') return ui.sessions;
    if (name === '../catalog') return catalog;
    if (name === '../exerciseImages') return images;
    throw new Error(name);
  }, { React: ui.react });
  const tree = module.WorkoutPreviewScreen({ exerciseId: 'bodyweight-squat', onStart() {} });
  const art = tree.props.children[0].props.children[0];
  assert.equal(art.type, 'Image');
  assert.equal(art.props.source, images.exerciseImages['bodyweight-squat']);
  assert.equal(art.props.accessibilityLabel, 'Bodyweight Squat');
});


test('Camera metadata and Coach targets coexist, persist, and reject late/invalid camera updates', () => {
  let snapshot = startSession(emptySnapshot, 'bodyweight-squat', 3, 30000, 'camera', 1000, 12, 'camera-ai');
  assert.equal(snapshot.sessions[0].workoutMode, 'camera-ai');
  assert.equal(changeSession(snapshot, 'camera', 'complete', 1500), snapshot, 'No empty camera completion');
  snapshot = updateCameraData(snapshot, 'camera', { repsCompleted: 2, formFeedback: ['Squat rep estimate'] });
  assert.equal(startSession(snapshot, 'bodyweight-squat', 1, 0, 'other', 2000, 4, 'camera-ai'), snapshot);
  const paused = changeSession(snapshot, 'camera', 'pause', 2500);
  assert.equal(updateCameraData(paused, 'camera', { repsCompleted: 3 }), paused, 'Late frame cannot count during Pause');
  const adjusted = adjustVolume(paused, 'camera', 2, 8);
  assert.equal(adjusted.sessions[0].repsCompleted, 2);
  assert.equal(adjusted.sessions[0].targetAmount, 8);
  const restored = parseSnapshot(JSON.parse(JSON.stringify(adjusted)));
  assert.equal(restored.sessions[0].workoutMode, 'camera-ai');
  assert.equal(restored.sessions[0].formFeedback[0], 'Squat rep estimate');
  const active = changeSession(restored, 'camera', 'resume', 3000);
  assert.equal(updateCameraData(active, 'camera', { repsCompleted: 1 }), active);
  for (const repsCompleted of [-1, 1.5, NaN, Infinity]) {
    assert.throws(() => updateCameraData(active, 'camera', { repsCompleted }));
  }
  const sanitized = updateCameraData(active, 'camera', { repsCompleted: 3, status: 'completed', totalSets: 0 });
  assert.equal(sanitized.sessions[0].status, 'active');
  assert.equal(sanitized.sessions[0].totalSets, 2);
  const complete = changeSession(active, 'camera', 'complete', 4000);
  assert.equal(complete.sessions[0].status, 'completed');
  assert.equal(complete.sessions[0].setsDone, 0, 'Camera completion must not invent completed sets');
  assert.equal(parseSnapshot(JSON.parse(JSON.stringify(complete))).sessions[0].targetAmount, 8);
  assert.equal(updateCameraData(complete, 'camera', { repsCompleted: 4 }), complete);
  assert.equal(changeSession(complete, 'camera', 'complete', 5000), complete);
  assert.throws(() => startSession(emptySnapshot, 'glute-bridge', 2, 0, 'bad', 1000, 10, 'camera-ai'));
});

test('Camera screen can open in Expo Go without loading the native pose implementation', () => {
  let loaderCalled = false;
  const react = { createElement: (type, props, ...children) => ({ type, props: { ...props, children } }), lazy: () => {
    return 'LazyNativeScreen';
  }, Suspense: 'Suspense' };
  const module = load('src/modules/workout-sessions/ui/CameraSessionScreen.tsx', (name) => {
    if (name === 'expo') return { requireOptionalNativeModule: () => null };
    if (name === 'react') return react;
    if (name === 'react-native') return { Platform: { OS: 'ios' } };
    if (name === '@/ui') return { AppText: 'AppText', Button: 'Button', Screen: 'Screen' };
    loaderCalled = true;
    throw new Error('Native module should stay unloaded');
  }, { React: react });
  assert.equal(module.isCameraAiAvailable(), false);
  const tree = module.CameraSessionScreen({ id: '', onProgress() {}, onTrain() {} });
  assert.equal(tree.type, 'Screen');
  assert.equal(tree.props.children[0].props.children[0], 'Camera AI needs a development build');
  assert.equal(loaderCalled, false);
});

test('Camera launch keeps Coach targets and never starts a session when the native module is absent', async () => {
  for (const available of [false, true]) {
    const started = [], opened = [];
    const react = {
      createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
      useState: (initial) => [typeof initial === 'function' ? initial() : initial, () => {}],
    };
    const module = load('src/modules/exercise-catalog/ui/WorkoutPreviewScreen.tsx', (name) => {
      if (name === 'react') return react;
      if (name === 'react-native') return { Image: 'Image', Pressable: 'Pressable', View: 'View', StyleSheet: { create: (value) => value } };
      if (name === '@/ui') return { ...tokens, AppText: 'AppText', Button: 'Button', Screen: 'Screen', TargetPicker: 'TargetPicker' };
      if (name === '../catalog') return catalog;
      if (name === '../exerciseImages') return images;
      if (name === '@/modules/workout-sessions') return {
        isCameraAiAvailable: () => available,
        useSessions: () => ({ snapshot: emptySnapshot, command: async () => {},
          start: async (id, volume) => { started.push({ id, volume }); return 'camera-id'; } }),
      };
      throw new Error(name);
    }, { React: react });
    const tree = module.WorkoutPreviewScreen({ exerciseId: 'bodyweight-squat', suggestedSets: '3', suggestedAmount: '8',
      onStart: () => assert.fail('Should route to camera'), onStartWithCamera: (id) => opened.push(id) });
    function* walk(node) {
      if (Array.isArray(node)) { for (const child of node) yield* walk(child); return; }
      if (!node || typeof node !== 'object') return;
      yield node; yield* walk(node.props?.children);
    }
    const button = [...walk(tree)].find((node) => node.props.label === 'Start session with Camera AI');
    assert.ok(button);
    button.props.onPress(); await flush();
    assert.equal(started.length, available ? 1 : 0);
    assert.equal(opened.length, available ? 1 : 0);
    if (available) {
      assert.equal(started[0].volume.sets, 3);
      assert.equal(started[0].volume.amount, 8);
      assert.equal(started[0].volume.workoutMode, 'camera-ai');
    }
  }
});
