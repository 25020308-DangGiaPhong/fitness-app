import { exercises } from '@/modules/exercise-catalog/catalog';

import { MAX_CONCERN_LENGTH } from './model';
import { editTargets, textBoundary } from './mobility';

export type SessionAdjustmentRequest = { text: string; exerciseId: string; sets: number; amount: number; setsDone: number };
export type SessionAdjustmentReply = { message: string; target?: { sets: number; amount: number } };

export function readSessionAdjustment(value: unknown): SessionAdjustmentRequest | undefined {
  if (!value || typeof value !== 'object' || !('text' in value) || typeof value.text !== 'string' || !value.text.trim() || value.text.length > MAX_CONCERN_LENGTH ||
      !('exerciseId' in value) || typeof value.exerciseId !== 'string' || !exercises.some(({ id }) => id === value.exerciseId) ||
      !('sets' in value) || !('amount' in value) || !validTarget(value.sets, value.amount) ||
      !('setsDone' in value) || typeof value.setsDone !== 'number' || !Number.isInteger(value.setsDone) || value.setsDone < 0 || typeof value.sets !== 'number' || value.setsDone > value.sets || typeof value.amount !== 'number') return;
  return { text: value.text.trim(), exerciseId: value.exerciseId, sets: value.sets, amount: value.amount, setsDone: value.setsDone };
}

function validTarget(sets: unknown, amount: unknown) {
  return typeof sets === 'number' && Number.isInteger(sets) && sets >= 1 && sets <= 5 && typeof amount === 'number' && Number.isInteger(amount) && amount >= 1 && amount <= 60;
}

export function readSessionAdjustmentReply(value: unknown, input: SessionAdjustmentRequest): SessionAdjustmentReply | undefined {
  if (!value || typeof value !== 'object' || !('message' in value) || typeof value.message !== 'string' || !value.message.trim() || value.message.length > 400) return;
  if (!('target' in value) || value.target === null || value.target === undefined) return { message: value.message.trim() };
  const target = value.target;
  if (!target || typeof target !== 'object' || !('sets' in target) || !('amount' in target) || !validTarget(target.sets, target.amount) ||
      typeof target.sets !== 'number' || typeof target.amount !== 'number' || target.sets < input.setsDone) return;
  return { message: value.message.trim(), target: { sets: target.sets, amount: target.amount } };
}

export function localSessionAdjustment(input: SessionAdjustmentRequest): SessionAdjustmentReply | undefined {
  const boundary = textBoundary(input.text);
  if (boundary?.step === 'stop') return { message: 'Keep the session paused. I won’t suggest targets for pain or injury. You can end the session here.' };
  if (boundary?.step === 'rest') return { message: 'Rest is okay. Keep the session paused or choose Finish early. No targets have changed.' };
  const edit = editTargets(input.text, [{ exerciseId: input.exerciseId, sets: input.sets, amount: input.amount }]);
  if (!edit) return;
  const target = edit.targets?.[0];
  if (target && target.sets < input.setsDone) return { message: `You’ve already completed ${input.setsDone} sets. Those sets cannot be removed.` };
  return { message: target ? 'Here’s your proposed target. Apply it when you’re ready.' : edit.message,
    ...(target ? { target: { sets: target.sets, amount: target.amount } } : {}) };
}
