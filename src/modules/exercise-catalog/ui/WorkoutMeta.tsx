import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText, colors, spacing } from '@/ui';

import { sampleWorkout } from '../sampleWorkout';

export function WorkoutMeta() {
  return (
    <View style={styles.meta}>
      <View style={styles.item}>
        <Ionicons name="time-outline" size={18} color={colors.textSecondary} accessible={false} importantForAccessibility="no" />
        <AppText variant="caption" tone="secondary" style={styles.label}>{sampleWorkout.duration}</AppText>
      </View>
      <View style={styles.item}>
        <Ionicons name="body-outline" size={18} color={colors.textSecondary} accessible={false} importantForAccessibility="no" />
        <AppText variant="caption" tone="secondary" style={styles.label}>{sampleWorkout.equipment}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { gap: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flexShrink: 1 },
});
