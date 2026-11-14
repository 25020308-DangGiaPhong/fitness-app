
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { CameraSessionScreen } from '@/modules/workout-sessions';

export default function CameraSessionRoute() {
  const { id, from } = useLocalSearchParams<{
    id?: string;
    from?: string;
  }>();

  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Camera AI Workout',
          headerBackTitle: from === 'coach' ? 'AI Coach' : 'Workout',
        }}
      />

      <CameraSessionScreen
        id={id ?? ''}
        onProgress={() => router.replace('/progress')}
        onTrain={() => router.replace('/')}
      />
    </>
  );
}
