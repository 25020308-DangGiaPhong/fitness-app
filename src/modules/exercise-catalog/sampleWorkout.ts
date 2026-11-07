type SampleExercise = {
  readonly id: string;
  readonly name: string;
  readonly focus: string;
  readonly prescription: string;
};

type SampleWorkout = {
  readonly name: string;
  readonly description: string;
  readonly duration: string;
  readonly equipment: string;
  readonly exercises: readonly SampleExercise[];
};

// Bundled illustrative catalog data, not a personalized plan or workout record.
export const sampleWorkout: SampleWorkout = {
  name: 'Full-body basics',
  description: 'Three familiar movements. A simple place to explore the app.',
  duration: 'About 12 min',
  equipment: 'No equipment',
  exercises: [
    { id: 'bodyweight-squat', name: 'Bodyweight squat', focus: 'Lower body', prescription: '2 sets · 10 reps' },
    { id: 'wall-push-up', name: 'Wall push-up', focus: 'Upper body', prescription: '2 sets · 8 reps' },
    { id: 'standing-march', name: 'Standing march', focus: 'Full body', prescription: '2 sets · 30 sec' },
  ],
};
