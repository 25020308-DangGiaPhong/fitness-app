import { StyleSheet, View } from 'react-native';
import { AppText, colors, Screen, spacing } from '@/ui';
import { sampleWorkout } from '../sampleWorkout';
import { ExerciseList } from './ExerciseList';
import { WorkoutMeta } from './WorkoutMeta';
export function WorkoutPreviewScreen() {
  return <Screen hasNavigationHeader>
    <View style={styles.intro}><AppText variant="screenTitle" accessibilityRole="header">{sampleWorkout.name}</AppText><AppText tone="secondary">{sampleWorkout.description}</AppText><WorkoutMeta /></View>
    <View style={styles.section}><AppText variant="heading" accessibilityRole="header">The sample lineup</AppText><AppText variant="caption" tone="secondary" style={styles.description}>Example sets and reps for this preview.</AppText><ExerciseList /></View>
    <View style={styles.note}><AppText variant="bodyStrong">Preview at your own pace</AppText><AppText tone="secondary">Workout tracking is coming next. This preview does not start or save a session.</AppText><AppText variant="caption" tone="secondary">This is sample content, not a personalized training plan.</AppText></View>
  </Screen>;
}
const styles = StyleSheet.create({ intro: { gap: spacing.lg }, section: { marginTop: spacing.xxl }, description: { marginTop: spacing.sm, marginBottom: spacing.sm }, note: { marginTop: spacing.xl, paddingTop: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, gap: spacing.sm } });
