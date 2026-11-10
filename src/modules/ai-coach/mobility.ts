import { exercises } from '@/modules/exercise-catalog/catalog';

const areaPatterns = {
  neck: ['neck', 'cổ', 'gáy'],
  shoulders: ['shoulder', 'shoulders', 'vai'],
  'upper back': ['upper back', 'lưng trên'],
  'lower back': ['lower back', 'low back', 'lumbar', 'lưng dưới', 'thắt lưng'],
  wrists: ['wrist', 'wrists', 'cổ tay'],
  chest: ['chest', 'ngực'],
  core: ['core', 'abs', 'bụng'],
  hips: ['hip', 'hips', 'hông'],
  knees: ['knee', 'knees', 'đầu gối'],
  hamstrings: ['hamstring', 'hamstrings', 'back of my thigh', 'back of the thigh', 'đùi sau', 'mặt sau đùi'],
  calves: ['calves', 'calf', 'bắp chân'],
  ankles: ['ankle', 'ankles', 'cổ chân', 'mắt cá'],
};

export type MobilityArea = keyof typeof areaPatterns;
export type Posture = 'seated' | 'standing' | 'floor';
export type MobilityRequest = { text: string } | { posture: Posture; area: MobilityArea };
export type CoachReply =
  | { step: 'confirm' | 'posture'; area: MobilityArea }
  | { step: 'stop' | 'area_needed' | 'clarify' | 'no_match' | 'unavailable' }
  | { step: 'suggest'; exerciseId: string };
export type CoachStep = CoachReply['step'];

export const demoMovements = exercises.flatMap(({ id, name, minutes, mobility }) =>
  mobility ? [{ id, name, minutes, ...mobility }] : [],
);

export function demoCandidates(area: MobilityArea, posture: Posture) {
  return demoMovements.filter((movement) =>
    movement.areas.includes(area) &&
    movement.postures.some((position) => posture === 'floor' ? position.endsWith('the floor') : position === posture),
  );
}

export function isMobilityArea(value: unknown): value is MobilityArea {
  return typeof value === 'string' && Object.hasOwn(areaPatterns, value);
}

function normalize(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
}

export function findMobilityArea(text: string): MobilityArea | undefined {
  const words = ` ${(text.toLowerCase().normalize('NFC').match(/\p{L}+/gu) ?? []).join(' ')} `;
  const unaccented = words === normalize(words);
  const matches = Object.keys(areaPatterns).filter(isMobilityArea).filter((area) => {
    const source = area === 'neck' ? words.replace(/ (?:cổ (?:tay|chân)|co (?:tay|chan))(?= )/g, '') : words;
    return areaPatterns[area].some((alias) => source.includes(` ${unaccented ? normalize(alias) : alias} `));
  });
  return matches.length === 1 ? matches[0] : undefined;
}

export function textBoundary(text: string): CoachReply | undefined {
  const lower = text.toLowerCase().normalize('NFC');
  const normalized = normalize(lower
    .replace(/(?<![\p{L}])đầu(?![\p{L}])/gu, 'head')
    .replace(/(?<![\p{L}])(?:không (?:bị )?đau|no pain)(?=\s*[,.;!?]|\s*$)/gu, ''));
  if (/\b(pain|painful|hurt|hurts|injur\w*|numb\w*|tingl\w*|swollen|swelling|sprain\w*|dau|chan thuong|te bi|sung)\b/.test(normalized)) {
    return { step: 'stop' };
  }
  if (/(?<![\p{L}])(?:mỏi|căng|moi|cang|stiff\w*|sore\w*|tight\w*|discomfort)(?![\p{L}])/u.test(lower)) {
    const area = findMobilityArea(text);
    return area ? { step: 'confirm', area } : { step: 'area_needed' };
  }
}

export function readCoachReply(value: unknown): CoachReply | undefined {
  if (!value || typeof value !== 'object' || !('step' in value)) return;
  switch (value.step) {
    case 'suggest':
      if ('exerciseId' in value && typeof value.exerciseId === 'string' &&
          demoMovements.some(({ id }) => id === value.exerciseId)) {
        return { step: 'suggest', exerciseId: value.exerciseId };
      }
      return;
    case 'confirm':
    case 'posture':
      if ('area' in value && isMobilityArea(value.area)) return { step: value.step, area: value.area };
      return;
    case 'area_needed':
    case 'stop':
    case 'clarify':
    case 'no_match':
      return { step: value.step };
  }
}
