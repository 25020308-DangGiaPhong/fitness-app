import { useRouter } from 'expo-router';

import { ProgressScreen } from '@/modules/progress';

export default function ProgressRoute() {
  const router = useRouter();
  return <ProgressScreen onExploreTrain={() => router.navigate('/')} />;
}
