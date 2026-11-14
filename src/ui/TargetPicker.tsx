import { useRef, useState, type ComponentRef } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from './AppText';
import { colors, radii, spacing } from './tokens';
import { useReducedMotion } from './useReducedMotion';

type Props = {
  title: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onCancel: () => void;
  onConfirm: (value: number) => void;
};

export function TargetPicker({ title, value, min, max, step = 1, unit, onCancel, onConfirm }: Props) {
  const { fontScale, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const rowHeight = Math.max(48, Math.ceil(36 * fontScale));
  const visibleRows = height < 600 ? 3 : 5;
  const padding = rowHeight * Math.floor(visibleRows / 2);
  const values = Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, index) => min + index * step);
  const [selected, setSelected] = useState(value);
  const latest = useRef(value);
  const wheel = useRef<ComponentRef<typeof ScrollView>>(null);
  const offset = (number: number) => (number - min) / step * rowHeight;

  function select(number: number, animated = !reduceMotion) {
    const next = Math.max(min, Math.min(max, number));
    latest.current = next;
    setSelected(next);
    wheel.current?.scrollTo({ y: offset(next), animated });
  }

  return (
    <Modal transparent animationType={reduceMotion ? 'none' : 'slide'} visible onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessible={false} />
        <View accessibilityViewIsModal style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <View style={styles.toolbar}>
            <Pressable accessibilityRole="button" onPress={onCancel} style={styles.action}>
              <AppText style={styles.actionText}>Cancel</AppText>
            </Pressable>
            <AppText variant="bodyStrong" accessibilityRole="header" style={styles.title}>{title}</AppText>
            <Pressable accessibilityRole="button" onPress={() => {
              select(latest.current, false);
              onConfirm(latest.current);
            }} style={styles.action}>
              <AppText variant="bodyStrong" style={styles.actionText}>Done</AppText>
            </Pressable>
          </View>
          <View
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={title}
            accessibilityValue={{ min, max, now: selected, text: `${selected} ${unit}` }}
            accessibilityHint="Swipe up or down to change the value. Choose Done to apply."
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={({ nativeEvent }) => {
              if (nativeEvent.actionName === 'increment') select(selected + step);
              if (nativeEvent.actionName === 'decrement') select(selected - step);
            }}
            style={{ height: rowHeight * visibleRows }}
          >
            <View pointerEvents="none" style={[styles.selection, { top: padding, height: rowHeight }]} />
            <ScrollView
              ref={wheel}
              contentOffset={{ x: 0, y: offset(value) }}
              contentContainerStyle={{ paddingVertical: padding }}
              onLayout={() => wheel.current?.scrollTo({ y: offset(latest.current), animated: false })}
              showsVerticalScrollIndicator={false}
              snapToInterval={rowHeight}
              decelerationRate="fast"
              bounces={false}
              scrollEventThrottle={16}
              onScroll={({ nativeEvent }) => {
                const index = Math.max(0, Math.min(values.length - 1, Math.round(nativeEvent.contentOffset.y / rowHeight)));
                const next = values[index] ?? min;
                latest.current = next;
                setSelected(next);
              }}
              onMomentumScrollEnd={() => select(latest.current, false)}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              {values.map((number) => (
                <Pressable key={number} onPress={() => select(number)} style={[styles.row, { height: rowHeight }]}>
                  <AppText style={[styles.number, { opacity: number === selected ? 1 : Math.abs(number - selected) <= step ? 0.6 : 0.3 }]}>
                    {number}
                  </AppText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <AppText variant="caption" tone="secondary" style={styles.unit}>{unit}</AppText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.32)' },
  sheet: { alignSelf: 'center', width: '100%', maxWidth: 640, backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, paddingHorizontal: spacing.lg },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  title: { flex: 1, textAlign: 'center' },
  action: { minWidth: 64, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: colors.action },
  selection: { position: 'absolute', left: spacing.lg, right: spacing.lg, borderRadius: radii.control, backgroundColor: colors.surfaceMuted },
  row: { alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 30, lineHeight: 36, fontWeight: '500', fontVariant: ['tabular-nums'] },
  unit: { textAlign: 'center', marginTop: spacing.sm },
});
