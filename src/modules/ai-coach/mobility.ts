import { getExercise } from '@/modules/exercise-catalog/catalog';

export type Posture = 'seated' | 'standing';
export type MobilityRequest = { text: string } | { posture: Posture };
export type CoachStep = 'confirm' | 'posture' | 'stop' | 'clarify' | 'unavailable' | 'suggest';
export type CoachReply = { step: Exclude<CoachStep, 'suggest'> } | { step: 'suggest'; exerciseId: string };

export const demoMovements = [
  { id: 'shoulder-roll', area: 'shoulders and upper back, near the neck', postures: ['seated', 'standing'], equipment: 'none' },
  { id: 'ankle-circle', area: 'ankles', postures: ['seated'], equipment: 'chair' },
  { id: 'wall-slide', area: 'shoulders and upper back', postures: ['standing'], equipment: 'wall' },
];

export function demoCandidates(posture: Posture) {
  return demoMovements.filter((movement) =>
    movement.area.startsWith('shoulders') && movement.equipment === 'none' && movement.postures.includes(posture),
  );
}

export function textBoundary(text: string): 'stop' | 'confirm' | undefined {
  const normalized = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
  if (/\b(pain|painful|hurt|hurts|injur\w*|numb\w*|tingl\w*|swollen|swelling|sprain\w*|dau|chan thuong|te bi|sung)\b/.test(normalized)) {
    return 'stop';
  }
  if (/\b(neck|shoulders?|co|vai|gay)\b/.test(normalized) &&
      /\b(moi|cang|stiff\w*|sore\w*|tight\w*|discomfort)\b/.test(normalized)) {
    return 'confirm';
  }
}

export function readCoachReply(value: unknown): CoachReply | undefined {
  if (!value || typeof value !== 'object' || !('step' in value)) return;
  switch (value.step) {
    case 'suggest':
      if ('exerciseId' in value && typeof value.exerciseId === 'string' &&
          demoMovements.some(({ id }) => id === value.exerciseId) && getExercise(value.exerciseId)) {
        return { step: 'suggest', exerciseId: value.exerciseId };
      }
      return;
    case 'confirm':
    case 'posture':
    case 'stop':
    case 'clarify':
      return { step: value.step };
  }
}
