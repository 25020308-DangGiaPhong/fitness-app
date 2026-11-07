import { useRouter } from 'expo-router';

import { TrainScreen } from '@/modules/exercise-catalog';

export default function TrainRoute() {
  const router = useRouter();
  return <TrainScreen onViewWorkout={() => router.push('/workout')} />;
}
