import { StyleSheet, View } from 'react-native';

import { AppText, colors, spacing } from '@/ui';

import { sampleWorkout } from '../sampleWorkout';

export function ExerciseList() {
  return (
    <View>
      {sampleWorkout.exercises.map((exercise, index) => (
        <View key={exercise.id} style={[styles.row, index > 0 && styles.divider]}>
          <AppText variant="label" tone="secondary" style={styles.order} accessible={false}>
            {String(index + 1).padStart(2, '0')}
          </AppText>
          <View style={styles.details}>
            <AppText variant="bodyStrong">{exercise.name}</AppText>
            <AppText variant="caption" tone="secondary">{exercise.focus}</AppText>
            <AppText variant="caption" tone="secondary">{exercise.prescription}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  order: { minWidth: 24, paddingTop: spacing.xs, fontVariant: ['tabular-nums'] },
  details: { flex: 1, gap: spacing.xs },
});
