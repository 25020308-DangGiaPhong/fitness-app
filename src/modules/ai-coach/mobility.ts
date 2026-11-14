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
export type Posture = 'seated' | 'standing' | 'floor' | 'any';
export type ConversationTurn = { role: 'user' | 'assistant'; content: string };
export type MobilityRequest = { text: string; history?: ConversationTurn[] } | { posture: Posture; area: MobilityArea };
export const MAX_HISTORY_TURNS = 8;
export type CoachReply = (
  | { step: 'confirm' | 'posture'; area: MobilityArea }
  | { step: 'stop' | 'area_needed' | 'leg_area_needed' | 'back_area_needed' | 'rest' | 'clarify' | 'no_match' | 'unavailable' }
  | { step: 'suggest'; exerciseIds: string[] }
) & { message?: string };
export type CoachStep = CoachReply['step'];

export const demoMovements = exercises.flatMap(({ id, name, minutes, mobility }) =>
  mobility ? [{ id, name, minutes, ...mobility }] : [],
);

export function demoCandidates(area: MobilityArea, posture: Posture) {
  return demoMovements.filter((movement) =>
    movement.areas.includes(area) &&
    (posture === 'any' || movement.postures.some((position) => posture === 'floor' ? position.endsWith('the floor') : position === posture)),
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

export function textBoundary(text: string, history: ConversationTurn[] = []): CoachReply | undefined {
  const lower = text.toLowerCase().normalize('NFC');
  const normalized = normalize(lower
    .replace(/(?<![\p{L}])đầu(?![\p{L}])/gu, 'head')
    .replace(/(?<![\p{L}])(?:không (?:bị )?đau|no pain)(?=\s*[,.;!?]|\s*$)/gu, ''));
  if (/\b(pain|painful|hurt|hurts|injur\w*|numb\w*|tingl\w*|swollen|swelling|sprain\w*|dau|chan thuong|te bi|sung)\b/.test(normalized)) {
    return { step: 'stop' };
  }
  if (history.some((turn) => turn.role === 'user' && textBoundary(turn.content)?.step === 'stop')) return { step: 'stop' };
  const feeling = readiness(text);
  if (feeling === 'rest') return { step: 'rest' };
  if (feeling && !findMobilityArea(text) && !/\b(lung|back|chan|leg)\b/.test(normalized)) {
    return { step: 'area_needed',
      message: feeling === 'light' ? 'We can keep this light today. Which area would you like to work on? Rest is also an option.' : feeling === 'energized' ? 'Let’s use that energy at a comfortable pace. Which area would you like to work on?' : 'Let’s find your usual comfortable pace. Which area would you like to work on?' };
  }
  if (/(?<![\p{L}])(?:mỏi|căng|moi|cang|stiff\w*|sore\w*|tight\w*|discomfort)(?![\p{L}])/u.test(lower)) {
    const area = findMobilityArea(text);
    if (area) return { step: 'confirm', area };
    if (/\b(lung|back)\b/.test(normalized)) return { step: 'back_area_needed' };
    return { step: /\b(chan|legs?)\b/.test(normalized) ? 'leg_area_needed' : 'area_needed' };
  }
}

export function readCoachReply(value: unknown): CoachReply | undefined {
  const reply = readReplyFields(value);
  if (!reply) return;
  if (value && typeof value === 'object' && 'message' in value) {
    if (typeof value.message !== 'string' || !value.message.trim() || value.message.length > 400) return;
    return { ...reply, message: value.message.trim() };
  }
  return reply;
}

function readReplyFields(value: unknown): CoachReply | undefined {
  if (!value || typeof value !== 'object' || !('step' in value)) return;
  switch (value.step) {
    case 'suggest':
      if ('exerciseIds' in value && Array.isArray(value.exerciseIds) && value.exerciseIds.length > 0 && value.exerciseIds.length <= 5 &&
          new Set(value.exerciseIds).size === value.exerciseIds.length &&
          value.exerciseIds.every((id) => typeof id === 'string' && demoMovements.some((movement) => movement.id === id))) {
        return { step: 'suggest', exerciseIds: value.exerciseIds };
      }
      return;
    case 'confirm':
    case 'posture':
      if ('area' in value && isMobilityArea(value.area)) return { step: value.step, area: value.area };
      return;
    case 'area_needed':
    case 'back_area_needed':
    case 'rest':
    case 'leg_area_needed':
    case 'stop':
    case 'clarify':
    case 'no_match':
      return { step: value.step };
  }
}

// Demo volume rules, not a fitness or medical assessment. Latest explicit check-in wins.
export function readiness(text: string): 'light' | 'usual' | 'energized' | 'rest' | undefined {
  const value = normalize(text);
  if (/don't want|do not want|khong muon tap|stop training|nghi hom nay|rest today/.test(value)) return 'rest';
  if (/not energized|not tired|khong met|as usual|nhu thuong|feel okay/.test(value)) return 'usual';
  if (/met|tired|exhaust|fatigue|stress|overwhelm|busy|cong viec|ap luc|kinh nguyet|period|low energy/.test(value)) return 'light';
  if (/energized|energetic|phan khoi|nang dong|full of energy/.test(value)) return 'energized';
}
export function suggestedVolume(exerciseId: string, conversation: string[]) {
  const exercise = exercises.find(({ id }) => id === exerciseId);
  if (!exercise) throw new Error('Exercise unavailable');
  const feeling = conversation.map(readiness).filter((value) => value !== undefined).at(-1);
  const base = Number.parseInt(exercise.reps, 10);
  const baseline = {
    sets: feeling === 'light' || feeling === 'rest' ? 1 : Math.min(5, exercise.sets + (feeling === 'energized' ? 1 : 0)),
    amount: Math.max(1, Math.min(60, feeling === 'light' || feeling === 'rest' ? Math.ceil(base / 2) : feeling === 'energized' ? Math.ceil(base * 1.2) : base)),
  };
  let target: ExerciseTarget = { exerciseId, ...baseline };
  for (const text of conversation) {
    target = editTargets(text, [target])?.targets?.[0] ?? target;
  }
  return { sets: target.sets, amount: target.amount };
}

export type ExerciseTarget = { exerciseId: string; sets: number; amount: number };

// Explicit chat edits update the same targets that cards pass to Train.
export function editTargets(text: string, targets: ExerciseTarget[]): { targets?: ExerciseTarget[]; message: string } | undefined {
  const numberWords: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, mot: 1, hai: 2, ba: 3, bon: 4, nam: 5, sau: 6, bay: 7, tam: 8, chin: 9, muoi: 10 };
  const value = normalize(text)
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|mot|hai|ba|bon|nam|sau|bay|tam|chin|muoi)(?=\s+(?:sets?|hiep|reps?|lan|seconds?|giay|vong)\b)/g, (word) => String(numberWords[word]))
    .replace(/\b(sets?|hiep|reps?|lan|seconds?|giay|vong)\s*(?:(?:to|thanh|la|len|xuong|con)|[:=])\s*(-?\d+(?:[.,]\d+)?)/g, 'to $2 $1');
  const number = '(-?\\d+(?:[.,]\\d+)?)';
  const setMatch = value.match(new RegExp(`${number}\\s*(?:sets?|hiep)\\b`));
  const amountMatch = value.match(new RegExp(`${number}\\s*(?:reps?|lan|seconds?|giay|vong)\\b`));
  if (!setMatch && !amountMatch) return;
  if (!targets.length) return { message: 'Which area would you like to work on first? I’ll help you choose exercises before adjusting their targets.' };
  const named = exercises.filter(({ name }) => value.includes(normalize(name))).map(({ id }) => id);
  if (named.some((id) => !targets.some((target) => target.exerciseId === id))) {
    return { message: 'That exercise is not in your current suggestions. Choose an exercise from the list, or ask for a new area.' };
  }
  if (amountMatch) {
    const wantsSeconds = /seconds?|giay/.test(amountMatch[0]);
    const affected = targets.filter(({ exerciseId }) => !named.length || named.includes(exerciseId));
    if (affected.some(({ exerciseId }) => /seconds/.test(exercises.find(({ id }) => id === exerciseId)?.reps ?? '') !== wantsSeconds)) {
      return { message: 'Some selected exercises use a different unit. Include an exercise name and use reps for counts or seconds for timed holds. Your targets are unchanged.' };
    }
  }
  // Identify quantities per clause so “add 1 set, 10 reps” does not add ten reps.
  const quantity = (match: RegExpMatchArray | null, current: number) => {
    if (!match) return current;
    const prefix = value.slice(0, match.index).split(/[,;.!]|\band\b|\bva\b/).at(-1) ?? '';
    const parsed = Number(match[1]?.replace(',', '.'));
    if (/\b(to|len|xuong|con|thanh)\s*$/.test(prefix)) return parsed;
    if (/\b(add|more|increase|them|tang)\b/.test(prefix)) return current + parsed;
    if (/\b(less|fewer|reduce|remove|giam|bot)\b/.test(prefix)) return current - parsed;
    return parsed;
  };
  const updated = targets.map((target) => !named.length || named.includes(target.exerciseId)
    ? { ...target, sets: quantity(setMatch, target.sets), amount: quantity(amountMatch, target.amount) } : target);
  if (updated.some(({ sets, amount }) => !Number.isInteger(sets) || sets < 1 || sets > 5 || !Number.isInteger(amount) || amount < 1 || amount > 60)) {
    return { message: 'Choose a whole number: 1–5 sets and 1–60 per set. Your current targets are unchanged.' };
  }
  return { targets: updated, message: named.length ? 'Updated the selected exercise. Your other targets are unchanged.' : 'Updated your targets for every exercise below. You can adjust an individual exercise by including its name.' };
}
