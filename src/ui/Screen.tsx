import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from './tokens';

type ScreenProps = PropsWithChildren<{ hasNavigationHeader?: boolean }>;

export function Screen({ children, hasNavigationHeader = false }: ScreenProps) {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={hasNavigationHeader ? ['left', 'right', 'bottom'] : ['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1 },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});
