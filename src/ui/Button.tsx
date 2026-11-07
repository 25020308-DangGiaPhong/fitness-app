import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from './AppText';
import { colors, radii, spacing } from './tokens';

type ButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
};

export function Button({ label, onPress, accessibilityHint }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <AppText variant="bodyStrong" style={styles.label}>
        {label}
      </AppText>
      <Ionicons
        name="arrow-forward"
        size={20}
        color={colors.onAction}
        accessible={false}
        importantForAccessibility="no"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.lg,
    borderRadius: radii.control,
    backgroundColor: colors.action,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: { backgroundColor: colors.actionPressed },
  label: { color: colors.onAction, flexShrink: 1, textAlign: 'center' },
});
