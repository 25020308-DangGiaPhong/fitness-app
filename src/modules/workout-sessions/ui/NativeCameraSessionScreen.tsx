
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCameraPermissions } from 'expo-camera';
import {
  PoseCameraView,
  getImageJointAngle,
} from 'expo-mediapipe-pose';
import type { PoseFrame } from 'expo-mediapipe-pose';
import { useIsFocused } from 'expo-router';
import {
  AppState,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getExercise } from '@/modules/exercise-catalog';
import { AppText, Button, colors, Screen } from '@/ui';

import { useSessions } from '../index';
import { PausedSessionTargets } from './PausedSessionTargets';
import { elapsed, restRemaining } from '../model';

type Props = {
  id: string;
  onProgress: () => void;
  onTrain: () => void;
};

type SquatPhase = 'standing' | 'lowered';

function clock(ms: number) {
  const seconds = Math.floor(ms / 1000);

  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(
    seconds % 60
  )
    .toString()
    .padStart(2, '0')}`;
}

export function CameraSessionScreen({
  id,
  onProgress,
  onTrain,
}: Props) {
  const { snapshot, command, updateAiData, adjust } = useSessions();

  const session = snapshot.sessions.find((item) => item.id === id);
  const exercise = session ? getExercise(session.exerciseId) : undefined;

  const [permission, requestPermission] = useCameraPermissions();

  const reps = session?.repsCompleted ?? 0;
  const [editing, setEditing] = useState<'sets' | 'amount' | null>(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [angle, setAngle] = useState<number | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');
  const [feedback, setFeedback] = useState(
    'Stand upright and position your full body in the camera.',
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now);

  const phase = useRef<SquatPhase>('standing');
  const repsRef = useRef(session?.repsCompleted ?? 0);
  const lastRepAt = useRef(0);
  useEffect(() => {
    repsRef.current = reps;
    phase.current = 'standing';
  }, [reps, session?.status]);
  const lock = useRef(false);

  const switchCamera = () => {
    phase.current = 'standing';
    lastRepAt.current = Date.now();
    setAngle(null);
    setFeedback('Camera switched. Stand upright to begin.');
    setCameraFacing((current) =>
      current === 'back' ? 'front' : 'back',
    );
  };

  const isFocused = useIsFocused();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      setAppState,
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);


  const handleLandmark = useCallback(
    (frame: PoseFrame) => {
      if (!session || session.status !== 'active' || !isFocused || appState !== 'active' || restRemaining(session) > 0) return;

      const { width, height } = frame.additionalData;

      if (
        !width ||
        !height ||
        frame.landmarks.length < 33
      ) {
        setAngle(null);
        setFeedback(
          'Move back so your full body is visible.',
        );
        return;
      }

      const details = {
        landmarks: frame.landmarks,
        imageSize: { width, height },
      };

      const settings = { minVisibility: 0.6 };

      const left = getImageJointAngle(
        details,
        'leftHip',
        'leftKnee',
        'leftAnkle',
        settings,
      );

      const right = getImageJointAngle(
        details,
        'rightHip',
        'rightKnee',
        'rightAnkle',
        settings,
      );

      const validAngles: number[] = [];

      if (left.status === 'available') {
        validAngles.push(left.value);
      }

      if (right.status === 'available') {
        validAngles.push(right.value);
      }

      if (validAngles.length === 0) {
        setAngle(null);
        setFeedback(
          'Pose not clear enough. Adjust your position and lighting.',
        );
        return;
      }

      const currentAngle =
        validAngles.reduce((sum, value) => sum + value, 0) /
        validAngles.length;

      if (!Number.isFinite(currentAngle)) return;
      setAngle(Math.round(currentAngle));

      if (currentAngle <= 110) {
        phase.current = 'lowered';
        setFeedback(
          'Lower position detected. Return to standing.',
        );
        return;
      }

      if (
        phase.current === 'lowered' &&
        currentAngle >= 160
      ) {
        phase.current = 'standing';

        const timestamp = Date.now();

        if (timestamp - lastRepAt.current >= 700) {
          lastRepAt.current = timestamp;

          const nextReps = repsRef.current + 1;
          repsRef.current = nextReps;

          setFeedback('One repetition detected. Keep a controlled pace.');

          void updateAiData(id, {
            repsCompleted: nextReps,
            formFeedback: [
              'Squat repetition detected using knee joint angles.',
            ],
          }).catch(() => {
            repsRef.current = session.repsCompleted ?? 0;
            setError('Could not save the detected rep. Keep paused and try again.');
          });
        }

        return;
      }

      if (currentAngle >= 160) {
        setFeedback('Stand upright to begin your next repetition.');
      } else {
        setFeedback('Continue moving with control.');
      }
    },
    [id, session, updateAiData, isFocused, appState],
  );

  const act = async (
    action: 'pause' | 'resume' | 'complete' | 'cancel' | 'set',
  ) => {
    if (lock.current) return;

    lock.current = true;
    setBusy(true);
    setError(null);

    try {
      await command(id, action);
      setEditing(null); setCoachOpen(false);
    } catch {
      setError(
        'Could not save your session. Please try again.',
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };

  const changeVolume = async (sets: number, amount: number) => {
    if (lock.current || session?.status !== 'paused') return;
    lock.current = true; setBusy(true); setError(null);
    try { await adjust(id, sets, amount); }
    catch { setError('Could not save that change. Please try again.'); }
    finally { lock.current = false; setBusy(false); }
  };

  if (!session) {
    return (
      <Screen hasNavigationHeader>
        <AppText variant="title">Session unavailable</AppText>
        <Button label="Back to Train" onPress={onTrain} />
      </Screen>
    );
  }

  if (!exercise) {
    return (
      <Screen hasNavigationHeader>
        <AppText variant="title">Exercise unavailable</AppText>
        <Button label="Back to Train" onPress={onTrain} />
      </Screen>
    );
  }

  if (exercise.id !== 'bodyweight-squat' || session.workoutMode !== 'camera-ai') {
    return <Screen hasNavigationHeader>
      <AppText variant="title">Camera AI supports Squat sessions</AppText>
      <AppText tone="secondary">Choose Start session with Camera AI from Bodyweight Squat to begin. Your existing session has not changed.</AppText>
      <Button label="Back to Train" onPress={onTrain} />
    </Screen>;
  }

  if (session.status === 'completed') {
    return (
      <Screen hasNavigationHeader>
        <View style={styles.completed}>
          <Ionicons
            name="checkmark-circle"
            size={64}
            color={colors.action}
          />

          <AppText variant="screenTitle">
            Workout saved!
          </AppText>

          <AppText tone="secondary">
            Your Camera AI session has been saved.
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant="heading">{exercise.name}</AppText>

          <AppText variant="title">
            {session.repsCompleted ?? reps} reps
          </AppText>

          <AppText tone="secondary">
            Session time: {clock(elapsed(session))}
          </AppText>
        </View>

        <Button
          label="See your progress"
          onPress={onProgress}
        />

        <View style={styles.gap}>
          <Button label="Back to Train" onPress={onTrain} />
        </View>
      </Screen>
    );
  }

  if (session.status === 'cancelled') {
    return (
      <Screen hasNavigationHeader>
        <AppText variant="title">Session ended</AppText>
        <AppText tone="secondary">
          This session was not added to completed workouts.
        </AppText>
        <Button label="Back to Train" onPress={onTrain} />
      </Screen>
    );
  }

  if (!permission) {
    return (
      <Screen hasNavigationHeader>
        <AppText variant="title">
          Checking camera permission...
        </AppText>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen hasNavigationHeader>
        <Ionicons
          name="camera-outline"
          size={56}
          color={colors.action}
        />

        <AppText variant="title">
          Camera permission required
        </AppText>

        <AppText tone="secondary">
          Camera access is needed to detect your body landmarks.
          Camera frames are processed on this device.
        </AppText>

        {permission.canAskAgain && (
          <Button
            label="Allow camera"
            onPress={() => {
              void requestPermission();
            }}
          />
        )}

        <Button
          label="Back to Train"
          onPress={onTrain}
        />
      </Screen>
    );
  }

  const cameraActive =
    isFocused &&
    appState === 'active' &&
    session.status === 'active' && restRemaining(session, now) === 0;

  const paused = session.status === 'paused';

  return (
    <Screen hasNavigationHeader>
      <AppText variant="label" style={styles.accent}>
        CAMERA AI WORKOUT
      </AppText>

      <AppText variant="title">
        {exercise.name}
      </AppText>

      <AppText tone="secondary">{session.totalSets} sets · {exercise.reps.replace(/^\d+/, String(session.targetAmount ?? Number.parseInt(exercise.reps, 10)))} per set · {session.setsDone} sets marked complete</AppText>
      <View style={styles.cameraContainer}>
        <PoseCameraView
          style={styles.camera}
          isActive={cameraActive}
          cameraFacing={cameraFacing}
          previewFps={30}
          callbackFps={15}
          frameLimit={30}
          maxPoses={1}
          minPoseDetectionConfidence={0.6}
          minPosePresenceConfidence={0.6}
          minTrackingConfidence={0.6}
          skeleton
          onLandmark={handleLandmark}
          onInferenceError={() => {
            setFeedback(
              'Pose detection encountered an issue. Reposition and try again.',
            );
          }}
        />

        {!cameraActive && (
          <View style={styles.cameraOverlay}>
            <AppText style={styles.overlayText}>
              {paused ? 'Workout paused' : restRemaining(session, now) > 0 ? 'Resting between sets' : 'Camera inactive'}
            </AppText>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            cameraFacing === 'back'
              ? 'Switch to front camera'
              : 'Switch to back camera'
          }
          accessibilityHint="Changes the camera used for pose detection."
          onPress={switchCamera}
          style={({ pressed }) => [
            styles.cameraToggle,
            pressed && styles.cameraTogglePressed,
          ]}
        >
          <Ionicons
            name="camera-reverse-outline"
            size={24}
            color={colors.textPrimary}
            accessible={false}
          />
        </Pressable>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <AppText variant="label" tone="secondary">
            REPS
          </AppText>

          <AppText variant="screenTitle" style={styles.repNumber}>
            {reps}
          </AppText>
        </View>

        <View style={styles.statCard}>
          <AppText variant="label" tone="secondary">
            KNEE ANGLE
          </AppText>

          <AppText variant="screenTitle">
            {angle === null ? '--' : `${angle}°`}
          </AppText>
        </View>
      </View>

      <View style={styles.feedback}>
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={colors.action}
        />

        <AppText style={styles.feedbackText}>
          {paused
            ? 'Resume when you are ready.'
            : feedback}
        </AppText>
      </View>

      <AppText tone="secondary" variant="caption">
        Reps are estimated from detected joint angles. Keep your
        full body visible. This feature does not provide medical
        or definitive form assessment.
      </AppText>

      {error && (
        <AppText accessibilityRole="alert" style={styles.error}>
          {error}
        </AppText>
      )}

      <View style={styles.card}>
        <AppText variant="label" tone="secondary">
          SESSION TIME
        </AppText>

        <AppText variant="title">
          {clock(elapsed(session, now))}
        </AppText>

        <Button
          label={busy ? 'Saving...' : paused ? 'Resume workout' : 'Pause workout'}
          disabled={busy}
          onPress={() => {
            void act(paused ? 'resume' : 'pause');
          }}
        />

        {!paused && session.setsDone < session.totalSets && <Button label="Mark set complete"
          disabled={busy || restRemaining(session, now) > 0} onPress={() => { void act('set'); }} />}
        {paused && <PausedSessionTargets session={session} busy={busy} editing={editing} onEditingChange={setEditing}
          coachOpen={coachOpen} onCoachToggle={() => setCoachOpen(!coachOpen)} onAdjust={changeVolume} />}
        <Button
          label="Finish & save session"
          disabled={busy || (session.repsCompleted ?? 0) === 0 && session.setsDone < session.totalSets}
          onPress={() => {
            void act('complete');
          }}
        />

        <Button
          label="End without completing"
          disabled={busy}
          onPress={() => {
            Alert.alert(
              'End this session?',
              'This session will not appear in completed workout history.',
              [
                { text: 'Keep training', style: 'cancel' },
                {
                  text: 'End session',
                  style: 'destructive',
                  onPress: () => {
                    void act('cancel');
                  },
                },
              ],
            );
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  accent: {
    color: colors.action,
  },
  cameraContainer: {
    width: '100%',
    height: 390,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#171717',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  cameraToggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  cameraTogglePressed: {
    backgroundColor: colors.surfaceMuted,
  },
  overlayText: {
    color: '#FFFFFF',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.accentSurface,
    gap: 8,
  },
  repNumber: {
    color: colors.action,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.accentSurface,
  },
  feedbackText: {
    flex: 1,
  },
  card: {
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    gap: 16,
  },
  completed: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  gap: {
    marginTop: 12,
  },
  error: {
    color: colors.action,
  },
});
