import { requireOptionalNativeModule } from 'expo';
import { lazy, Suspense } from 'react';
import { Platform } from 'react-native';

import { AppText, Button, Screen } from '@/ui';

type Props = { id: string; onProgress: () => void; onTrain: () => void };
const NativeScreen = lazy(async () => {
  const native = await import('./NativeCameraSessionScreen');
  return { default: native.CameraSessionScreen };
});

export function isCameraAiAvailable() {
  return (Platform.OS === 'ios' || Platform.OS === 'android') && !!requireOptionalNativeModule('ExpoMediaPipePose');
}

// Keep the native pose package out of the Expo Go/module initialization path.
export function CameraSessionScreen(props: Props) {
  if (isCameraAiAvailable()) {
    return <Suspense fallback={<Screen hasNavigationHeader><AppText>Loading camera…</AppText></Screen>}>
      <NativeScreen {...props} />
    </Suspense>;
  }
  return <Screen hasNavigationHeader>
    <AppText variant="title">Camera AI needs a development build</AppText>
    <AppText tone="secondary">This app does not include the native pose module. Install a development build to use Camera AI. Regular workouts and AI Coach work in Expo Go.</AppText>
    <Button label="Back to Train" onPress={props.onTrain} />
  </Screen>;
}
