
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSessions } from '@/modules/workout-sessions';
import { AppText, Button, colors, Screen } from '@/ui';

import { getExercise } from '../catalog';

type Props = {
  exerciseId: string;
  onStart: (id: string) => void;
};

export function WorkoutPreviewScreen({ exerciseId, onStart }: Props) {
  const exercise = getExercise(exerciseId);
  const { start, command, snapshot } = useSessions();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!exercise) {
    return (
      <Screen hasNavigationHeader>
        <AppText variant="title">Exercise unavailable</AppText>
        <AppText>Return to Train to choose another exercise.</AppText>
      </Screen>
    );
  }

  const activeSession = snapshot.activeId
    ? snapshot.sessions.find((session) => session.id === snapshot.activeId)
    : undefined;

  const activeExercise = activeSession
    ? getExercise(activeSession.exerciseId)
    : undefined;

  const hasDifferentActiveSession =
    !!activeSession && activeSession.exerciseId !== exercise.id;

  // Bắt đầu hoặc tiếp tục buổi tập hiện tại.
  const begin = async () => {
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      onStart(await start(exercise.id));
    } catch {
      setError('Could not save your session. Check available device storage and try again.');
    } finally {
      setBusy(false);
    }
  };

  // Kết thúc buổi tập cũ rồi bắt đầu bài tập mới.
  const replaceSession = async () => {
    if (busy || !activeSession) return;

    setBusy(true);
    setError(null);

    try {
      await command(activeSession.id, 'cancel');

      const newSessionId = await start(exercise.id);

      onStart(newSessionId);
    } catch {
      setError('Could not start this session. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen hasNavigationHeader>
      <View style={styles.art}>
        <Ionicons
          name={exercise.icon}
          size={80}
          color={colors.action}
          accessible={false}
        />

        <AppText variant="label" style={styles.tag}>
          {exercise.group.toUpperCase()} · BEGINNER
        </AppText>
      </View>

      <AppText variant="screenTitle" style={styles.title}>
        {exercise.name}
      </AppText>

      <AppText tone="secondary">{exercise.focus}</AppText>

      <View style={styles.stats}>
        {[
          [`${exercise.sets}`, 'sets'],
          [exercise.reps, 'per set'],
          [`${exercise.rest}s`, 'rest'],
        ].map(([value, label]) => (
          <View key={label} style={styles.stat}>
            <AppText variant="heading">{value}</AppText>
            <AppText variant="caption" tone="secondary">
              {label}
            </AppText>
          </View>
        ))}
      </View>

      <AppText variant="heading">Make every rep count</AppText>

      {exercise.instructions.map((step, index) => (
        <View key={step} style={styles.step}>
          <View style={styles.number}>
            <AppText variant="label" style={styles.tag}>
              {index + 1}
            </AppText>
          </View>

          <AppText style={styles.stepText}>{step}</AppText>
        </View>
      ))}

      <View style={styles.note}>
        <AppText variant="bodyStrong">Find a comfortable range</AppText>

        <AppText tone="secondary">
          Move at your own pace. Stop if you feel pain, dizziness or unusual
          discomfort. This sample is not a personalized training plan.
        </AppText>
      </View>

      {hasDifferentActiveSession && (
        <View style={styles.warning}>
          <AppText variant="bodyStrong">
            You have an unfinished session
          </AppText>

          <AppText tone="secondary">
            Current session: {activeExercise?.name ?? 'Previous exercise'}.
            Starting {exercise.name} will cancel the unfinished session and
            preserve it in your history.
          </AppText>
        </View>
      )}

      {error && (
        <AppText accessibilityRole="alert" style={styles.error}>
          {error}
        </AppText>
      )}

      <Button
        label={
          busy
            ? 'Saving…'
            : hasDifferentActiveSession
              ? `End current session and start ${exercise.name}`
              : activeSession
                ? 'Resume existing session'
                : 'Start session'
        }
        disabled={busy}
        onPress={() => {
          void (
            hasDifferentActiveSession
              ? replaceSession()
              : begin()
          );
        }}
      />

      <AppText variant="caption" tone="secondary" style={styles.foot}>
        No camera required · Self-reported activity · Saved on device
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  art: {
    borderRadius: 24,
    backgroundColor: colors.accentSurface,
    alignItems: 'center',
    padding: 32,
    gap: 20,
  },
  tag: {
    color: colors.action,
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 24,
  },
  stat: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    gap: 4,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  number: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.accentSurface,
  },
  stepText: {
    flex: 1,
  },
  note: {
    marginVertical: 24,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  warning: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.accentSurface,
    gap: 8,
  },
  error: {
    marginBottom: 16,
  },
  foot: {
    marginTop: 16,
    textAlign: 'center',
  },
});
