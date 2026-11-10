
// Data-only public entry point for consumers that run outside the native UI.
export type Exercise = {
  id: string;
  name: string;
  group: 'Strength' | 'Mobility' | 'Cardio';
  focus: string;
  mobility?: {
    areas: string[];
    postures: string[];
    equipment: 'none' | 'chair' | 'wall' | 'doorway';
  };
  reps: string;
  sets: number;
  rest: number;
  minutes: number;
  icon: 'barbell-outline' | 'body-outline' | 'walk-outline';
  instructions: string[];
};

export const exercises: Exercise[] = [
  // ==========================================
  // STRENGTH - 4 EXERCISES
  // ==========================================

  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    group: 'Strength',
    focus: 'Legs · Glutes',
    reps: '10 reps',
    sets: 2,
    rest: 30,
    minutes: 5,
    icon: 'barbell-outline',
    instructions: [
      'Stand with feet about shoulder-width apart.',
      'Bend your knees and hips into a comfortable squat.',
      'Press through your feet to stand. Keep the movement controlled.',
    ],
  },

  {
    id: 'wall-push-up',
    name: 'Wall Push-up',
    group: 'Strength',
    focus: 'Chest · Arms',
    reps: '8 reps',
    sets: 2,
    rest: 30,
    minutes: 4,
    icon: 'barbell-outline',
    instructions: [
      'Face a wall, hands at shoulder height.',
      'Bend your elbows and bring your chest toward the wall.',
      'Push back slowly, keeping your body in a straight line.',
    ],
  },

  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    group: 'Strength',
    focus: 'Glutes · Core',
    reps: '10 reps',
    sets: 2,
    rest: 30,
    minutes: 5,
    icon: 'barbell-outline',
    instructions: [
      'Lie on your back, knees bent and feet flat.',
      'Lift your hips gently while keeping your ribs relaxed.',
      'Lower slowly. Avoid arching your lower back.',
    ],
  },

  {
    id: 'calf-raise',
    name: 'Calf Raise',
    group: 'Strength',
    focus: 'Calves · Balance',
    reps: '12 reps',
    sets: 2,
    rest: 20,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Stand beside a wall or stable chair.',
      'Rise onto the balls of your feet.',
      'Lower your heels slowly and keep a light hold for balance.',
    ],
  },

  // ==========================================
  // MOBILITY
  // ==========================================

  {
    id: 'shoulder-roll',
    name: 'Shoulder Rolls',
    group: 'Mobility',
    focus: 'Shoulders · Upper Back',
    mobility: { areas: ['shoulders', 'upper back'], postures: ['seated', 'standing'], equipment: 'none' },
    reps: '8 gentle circles',
    sets: 2,
    rest: 20,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit or stand comfortably with arms relaxed.',
      'Make small, comfortable circles with your shoulders.',
      'Stay in a pain-free range.',
    ],
  },

  {
    id: 'ankle-circle',
    name: 'Ankle Circles',
    group: 'Mobility',
    focus: 'Ankles',
    mobility: { areas: ['ankles'], postures: ['seated'], equipment: 'chair' },
    reps: '8 each direction',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit on a stable chair.',
      'Lift one foot slightly and make small ankle circles.',
      'Change direction, then switch feet.',
    ],
  },

  {
    id: 'wall-slide',
    name: 'Wall Slides',
    group: 'Mobility',
    focus: 'Shoulders · Upper Back',
    mobility: { areas: ['shoulders', 'upper back'], postures: ['standing'], equipment: 'wall' },
    reps: '8 reps',
    sets: 2,
    rest: 20,
    minutes: 4,
    icon: 'body-outline',
    instructions: [
      'Stand comfortably with your back near a wall.',
      'Slide your arms upward only as far as comfortable.',
      'Lower slowly. Do not force your shoulders or neck.',
    ],
  },

  {
    id: 'bird-dog',
    name: 'Bird Dog',
    group: 'Mobility',
    focus: 'Core · Balance & Stability',
    mobility: { areas: ['core'], postures: ['hands and knees on the floor'], equipment: 'none' },
    reps: '6 each side',
    sets: 2,
    rest: 30,
    minutes: 5,
    icon: 'body-outline',
    instructions: [
      'Start on hands and knees on a comfortable surface.',
      'Reach one arm and the opposite leg out slowly.',
      'Return, switch sides and keep your torso still.',
    ],
  },

  {
    id: 'cat-cow',
    name: 'Cat–Cow',
    group: 'Mobility',
    focus: 'Lower Back · Spine',
    mobility: { areas: ['lower back', 'spine'], postures: ['hands and knees on the floor'], equipment: 'none' },
    reps: '6 gentle cycles',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Start on hands and knees on a comfortable surface.',
      'Slowly round your back, then gently let it arch.',
      'Use a comfortable range and stop if the movement hurts.',
    ],
  },

  {
    id: 'seated-knee-extension',
    name: 'Seated Knee Extensions',
    group: 'Mobility',
    focus: 'Knees · Thighs',
    mobility: { areas: ['knees', 'thighs'], postures: ['seated'], equipment: 'chair' },
    reps: '6 each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit on a stable chair with your feet resting on the floor.',
      'Slowly straighten one knee as far as comfortable, then lower the foot.',
      'Switch sides and stop if the movement hurts.',
    ],
  },

  {
    id: 'chin-tuck',
    name: 'Chin Tucks',
    group: 'Mobility',
    focus: 'Neck',
    mobility: { areas: ['neck'], postures: ['seated','standing'], equipment: 'none' },
    reps: '6 gentle reps',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit or stand tall and look straight ahead.',
      'Glide your chin straight back slightly, then relax.',
    ],
  },

  {
    id: 'neck-turn',
    name: 'Gentle Neck Turns',
    group: 'Mobility',
    focus: 'Neck',
    mobility: { areas: ['neck'], postures: ['seated','standing'], equipment: 'none' },
    reps: '5 each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Keep your shoulders relaxed and look forward.',
      'Slowly turn your head to one side within a comfortable range, return to center, and switch sides.',
    ],
  },

  {
    id: 'seated-thoracic-rotation',
    name: 'Seated Upper-Back Rotations',
    group: 'Mobility',
    focus: 'Upper Back',
    mobility: { areas: ['upper back'], postures: ['seated'], equipment: 'chair' },
    reps: '5 each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit tall on a stable chair with both feet flat.',
      'Cross your arms loosely and rotate your upper body gently, keeping your hips facing forward. Return and switch sides.',
    ],
  },

  {
    id: 'pelvic-tilt',
    name: 'Supine Pelvic Tilts',
    group: 'Mobility',
    focus: 'Lower Back · Core',
    mobility: { areas: ['lower back','core'], postures: ['lying on the floor'], equipment: 'none' },
    reps: '8 gentle reps',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Lie on your back with knees bent and feet flat.',
      'Gently tilt your pelvis to bring your lower back toward the floor, then relax to neutral.',
    ],
  },

  {
    id: 'wrist-circle',
    name: 'Wrist Circles',
    group: 'Mobility',
    focus: 'Wrists',
    mobility: { areas: ['wrists'], postures: ['seated','standing'], equipment: 'none' },
    reps: '6 each direction',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Keep your elbows near your sides with hands relaxed.',
      'Make small circles with both wrists, then reverse direction.',
    ],
  },

  {
    id: 'wrist-flexion-extension',
    name: 'Wrist Bends',
    group: 'Mobility',
    focus: 'Wrists · Forearms',
    mobility: { areas: ['wrists','forearms'], postures: ['seated','standing'], equipment: 'none' },
    reps: '8 gentle reps',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Hold your forearms in front of you with fingers relaxed.',
      'Slowly bend your wrists up and down within a comfortable range.',
    ],
  },

  {
    id: 'doorway-chest-stretch',
    name: 'Doorway Chest Stretch',
    group: 'Mobility',
    focus: 'Chest',
    mobility: { areas: ['chest'], postures: ['standing'], equipment: 'doorway' },
    reps: '15 seconds each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Stand in a doorway and rest one forearm against the frame below shoulder height.',
      'Take a small step forward until you feel a gentle stretch across your chest, then switch sides.',
    ],
  },

  {
    id: 'standing-chest-opener',
    name: 'Standing Chest Opener',
    group: 'Mobility',
    focus: 'Chest',
    mobility: { areas: ['chest'], postures: ['standing'], equipment: 'none' },
    reps: '6 gentle reps',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Stand with your arms bent and elbows comfortably by your sides.',
      'Gently open your arms out to the sides, then bring them back in.',
    ],
  },

  {
    id: 'dead-bug',
    name: 'Dead Bug',
    group: 'Mobility',
    focus: 'Core',
    mobility: { areas: ['core'], postures: ['lying on the floor'], equipment: 'none' },
    reps: '6 each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Lie on your back with arms pointing up and knees bent above your hips.',
      'Lower one arm and the opposite heel as far as comfortable while keeping your trunk steady. Return and switch sides.',
    ],
  },

  {
    id: 'standing-hip-circle',
    name: 'Standing Hip Circles',
    group: 'Mobility',
    focus: 'Hips',
    mobility: { areas: ['hips'], postures: ['standing'], equipment: 'none' },
    reps: '6 each direction',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Stand with feet apart, knees soft and hands on your hips.',
      'Make small, slow circles with your hips, then reverse direction.',
    ],
  },

  {
    id: 'seated-hip-march',
    name: 'Seated Hip March',
    group: 'Mobility',
    focus: 'Hips',
    mobility: { areas: ['hips'], postures: ['seated'], equipment: 'chair' },
    reps: '6 each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit tall in a stable chair with both feet flat.',
      'Lift one knee slightly without leaning back, lower it slowly and switch legs.',
    ],
  },

  {
    id: 'seated-heel-slide',
    name: 'Seated Heel Slides',
    group: 'Mobility',
    focus: 'Knees',
    mobility: { areas: ['knees'], postures: ['seated'], equipment: 'chair' },
    reps: '6 each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit on a stable chair with both feet flat.',
      'Slide one heel gently forward and back along the floor, then switch legs.',
    ],
  },

  {
    id: 'seated-hamstring-stretch',
    name: 'Seated Hamstring Stretch',
    group: 'Mobility',
    focus: 'Hamstrings',
    mobility: { areas: ['hamstrings','back of thighs'], postures: ['seated'], equipment: 'chair' },
    reps: '15 seconds each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit near the front of a stable chair and place one heel on the floor in front of you.',
      'Keep your back long and hinge slightly from your hips until you feel a gentle stretch behind the thigh. Switch sides.',
    ],
  },

  {
    id: 'standing-hamstring-stretch',
    name: 'Standing Hamstring Stretch',
    group: 'Mobility',
    focus: 'Hamstrings',
    mobility: { areas: ['hamstrings','back of thighs'], postures: ['standing'], equipment: 'none' },
    reps: '15 seconds each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Place one heel a small step in front of you with toes lifted and bend the other knee slightly.',
      'Hinge gently at your hips with your back long, then switch sides.',
    ],
  },

  {
    id: 'wall-calf-stretch',
    name: 'Wall Calf Stretch',
    group: 'Mobility',
    focus: 'Calves',
    mobility: { areas: ['calves'], postures: ['standing'], equipment: 'wall' },
    reps: '15 seconds each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Face a wall and step one foot back, keeping that heel on the floor.',
      'Bend the front knee gently while keeping the back leg straight, then switch sides.',
    ],
  },

  {
    id: 'seated-heel-raise',
    name: 'Seated Heel Raises',
    group: 'Mobility',
    focus: 'Calves',
    mobility: { areas: ['calves'], postures: ['seated'], equipment: 'chair' },
    reps: '8 gentle reps',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Sit on a stable chair with both feet flat.',
      'Lift both heels slowly while keeping your toes on the floor, then lower.',
    ],
  },

  {
    id: 'ankle-rock',
    name: 'Standing Ankle Rocks',
    group: 'Mobility',
    focus: 'Ankles',
    mobility: { areas: ['ankles'], postures: ['standing'], equipment: 'wall' },
    reps: '6 each side',
    sets: 2,
    rest: 15,
    minutes: 3,
    icon: 'body-outline',
    instructions: [
      'Face a wall with one foot slightly forward and your hands resting on the wall.',
      'Gently move the front knee toward the wall while keeping the heel down, then return and switch sides.',
    ],
  },

  // ==========================================
  // CARDIO - 4 EXERCISES
  // ==========================================

  {
    id: 'standing-march',
    name: 'Standing March',
    group: 'Cardio',
    focus: 'Full Body',
    reps: '30 seconds',
    sets: 2,
    rest: 20,
    minutes: 3,
    icon: 'walk-outline',
    instructions: [
      'Stand tall near a stable support if needed.',
      'Alternate lifting each knee to a comfortable height.',
      'Move at an easy pace and breathe normally.',
    ],
  },

  {
    id: 'side-step',
    name: 'Side Steps',
    group: 'Cardio',
    focus: 'Legs · Coordination',
    reps: '30 seconds',
    sets: 2,
    rest: 20,
    minutes: 3,
    icon: 'walk-outline',
    instructions: [
      'Clear some space and stand comfortably.',
      'Step to one side and bring the other foot toward it.',
      'Alternate directions at an easy pace.',
    ],
  },

  {
    id: 'step-touch',
    name: 'Step Touch',
    group: 'Cardio',
    focus: 'Full Body · Coordination',
    reps: '30 seconds',
    sets: 2,
    rest: 20,
    minutes: 3,
    icon: 'walk-outline',
    instructions: [
      'Stand comfortably with feet about hip-width apart.',
      'Step to the right and bring your left foot toward it.',
      'Repeat to the left at a comfortable rhythm.',
    ],
  },

  {
    id: 'alternating-toe-taps',
    name: 'Alternating Toe Taps',
    group: 'Cardio',
    focus: 'Legs · Coordination',
    reps: '30 seconds',
    sets: 2,
    rest: 20,
    minutes: 3,
    icon: 'walk-outline',
    instructions: [
      'Stand comfortably with your feet hip-width apart.',
      'Tap your right toe forward, then return to the starting position.',
      'Repeat with your left foot and alternate at a comfortable pace.',
    ],
  },
];

// ==========================================
// HELPER FUNCTION
// ==========================================

export function getExercise(id: string) {
  return exercises.find((exercise) => exercise.id === id);
}

