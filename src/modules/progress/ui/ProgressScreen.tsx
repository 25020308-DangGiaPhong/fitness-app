import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, colors, Screen, spacing } from '@/ui';
type Props = { onExploreTrain: () => void };
export function ProgressScreen({ onExploreTrain }: Props) {
  return <Screen><View style={styles.header}><AppText variant="screenTitle" accessibilityRole="header">Progress</AppText><AppText tone="secondary">Your training, over time.</AppText></View>
    <View style={styles.emptyState}><Ionicons name="bar-chart-outline" size={44} color={colors.textSecondary} accessible={false} importantForAccessibility="no" style={styles.icon} /><AppText variant="title" accessibilityRole="header" style={styles.centered}>Your first workout starts here</AppText><AppText tone="secondary" style={styles.centered}>Completed workouts will appear here once workout tracking is available.</AppText><AppText tone="secondary" style={styles.centered}>For now, explore the sample workout in Train.</AppText><View style={styles.action}><Button label="Explore Train" onPress={onExploreTrain} /></View></View>
  </Screen>;
}
const styles = StyleSheet.create({ header: { gap: spacing.sm }, emptyState: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg, paddingVertical: spacing.generous, alignSelf: 'center', width: '100%', maxWidth: 400 }, icon: { alignSelf: 'center', marginBottom: spacing.sm }, centered: { textAlign: 'center' }, action: { marginTop: spacing.sm } });
