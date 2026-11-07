import { StyleSheet, View } from 'react-native';
import { AppText, Button, colors, radii, Screen, spacing } from '@/ui';
import { sampleWorkout } from '../sampleWorkout';
import { ExerciseList } from './ExerciseList';
import { WorkoutMeta } from './WorkoutMeta';
type Props = { onViewWorkout: () => void };
export function TrainScreen({ onViewWorkout }: Props) {
  return <Screen>
    <View style={styles.header}><AppText variant="screenTitle" accessibilityRole="header">Train</AppText><AppText tone="secondary">Ready for a short session?</AppText></View>
    <View style={styles.workout}><AppText variant="title" accessibilityRole="header">{sampleWorkout.name}</AppText><View style={styles.sampleLabel}><AppText variant="label" style={styles.sampleText}>Sample workout</AppText></View><AppText tone="secondary">{sampleWorkout.description}</AppText><WorkoutMeta /><Button label="View workout" onPress={onViewWorkout} accessibilityHint="Opens the sample workout preview" /></View>
    <View style={styles.exercises}><View style={styles.sectionHeading}><AppText variant="heading" accessibilityRole="header">In this workout</AppText><AppText variant="caption" tone="secondary">{sampleWorkout.exercises.length} sample exercises</AppText></View><ExerciseList /></View>
  </Screen>;
}
const styles = StyleSheet.create({ header: { gap: spacing.sm, marginBottom: spacing.xxl }, workout: { padding: spacing.gutter, borderRadius: radii.card, backgroundColor: colors.surface, gap: spacing.lg }, sampleLabel: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 6, backgroundColor: colors.accentSurface }, sampleText: { color: colors.action }, exercises: { marginTop: spacing.xxl }, sectionHeading: { gap: spacing.xs, marginBottom: spacing.sm } });
