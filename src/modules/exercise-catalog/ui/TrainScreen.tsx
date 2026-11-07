import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSessions } from '@/modules/workout-sessions';
import { AppText, Button, colors, Screen, spacing } from '@/ui';

import { exercises } from '../catalog';

type TrainScreenProps = { onViewWorkout: (id?: string) => void; onResume: (id: string) => void };
export function TrainScreen({ onViewWorkout, onResume }: TrainScreenProps) {
  const { snapshot } = useSessions();
  const [filter, setFilter] = useState('All');
  const completed = snapshot.sessions.filter((session) => session.status === 'completed');
  const today = completed.filter((session) => session.completedAt && new Date(session.completedAt).toDateString() === new Date().toDateString()).length;
  const weekStart = new Date(); weekStart.setHours(0, 0, 0, 0); weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 6) % 7);
  const weekCount = completed.filter((session) => (session.completedAt ?? 0) >= weekStart.getTime()).length;
  return <Screen>
    <View style={styles.topline}><AppText variant="label" style={styles.eyebrow}>A LITTLE STRONGER, EVERY DAY</AppText><View style={styles.avatar}><Ionicons name="person-outline" size={22} color={colors.action} accessible={false} /></View></View>
    <AppText variant="screenTitle">Make time for you.</AppText>
    <AppText tone="secondary" style={styles.subtitle}>Small sessions. Real momentum.</AppText>
    <View style={styles.hero}>
      <View style={styles.heroTop}><AppText variant="label" style={styles.heroMuted}>TODAY’S PLAN</AppText><AppText variant="label" style={styles.heroMuted}>NO EQUIPMENT</AppText></View>
      <AppText variant="title" style={styles.heroTitle}>{'Start small.\nFinish stronger.'}</AppText>
      <AppText style={styles.heroMuted}>A simple bodyweight session to find your rhythm.</AppText>
      <View style={styles.heroMeta}><Ionicons name="time-outline" size={20} color={colors.onAction} accessible={false} /><AppText style={styles.heroMuted}>5 min · 2 sets · Beginner</AppText></View>
      <Button label={snapshot.activeId ? 'Resume your session' : 'Let’s get moving'} onPress={() => snapshot.activeId ? onResume(snapshot.activeId) : onViewWorkout('bodyweight-squat')} />
    </View>
    <View style={styles.goal}><View style={styles.headingRow}><AppText variant="bodyStrong">Your daily win</AppText><AppText variant="label" style={styles.eyebrow}>{Math.min(today, 1)} / 1 session</AppText></View><View style={styles.track}><View style={[styles.fill, { width: today ? '100%' : '0%' }]} /></View><AppText variant="caption" tone="secondary">{today ? 'Goal complete. Enjoy the rest of your day.' : 'One short session is a great place to start.'}</AppText></View>
    <View style={styles.section}><View style={styles.headingRow}><AppText variant="heading">This week</AppText><AppText variant="caption" tone="secondary">{weekCount} completed</AppText></View><View style={styles.week}>{['M','T','W','T','F','S','S'].map((day, index) => { const date = new Date(weekStart); date.setDate(date.getDate() + index); const done = completed.some((session) => session.completedAt && new Date(session.completedAt).toDateString() === date.toDateString()); return <View key={index} style={styles.day}><AppText variant="caption" tone="secondary">{day}</AppText><View style={[styles.dayDot, done && styles.dayDone]}>{done ? <Ionicons name="checkmark" size={20} color={colors.onAction} accessible={false} /> : <AppText variant="label">{date.getDate()}</AppText>}</View></View>; })}</View></View>
    <View style={styles.section}><AppText variant="heading">Find your next move</AppText><AppText tone="secondary">10 beginner-friendly exercises. Pick your pace.</AppText><View style={styles.filters}>{['All', 'Strength', 'Mobility', 'Cardio'].map((item) => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: filter === item }} onPress={() => setFilter(item)} style={({ pressed }) => [styles.chip, filter === item && styles.chipSelected, pressed && { opacity: 0.7 }]}><AppText variant="label" style={filter === item ? { color: colors.onAction } : undefined}>{item}</AppText></Pressable>)}</View>
      {exercises.filter((exercise) => filter === 'All' || exercise.group === filter).map((exercise, index) => <Pressable key={exercise.id} accessibilityRole="button" accessibilityLabel={`View ${exercise.name}`} onPress={() => onViewWorkout(exercise.id)} style={({ pressed }) => [styles.exercise, pressed && { opacity: 0.65 }]}><View style={styles.exerciseIcon}><Ionicons name={exercise.icon} size={26} color={colors.action} accessible={false} /></View><View style={styles.exerciseCopy}><AppText variant="bodyStrong">{exercise.name}</AppText><AppText variant="caption" tone="secondary">{exercise.focus} · {exercise.minutes} min</AppText></View><AppText variant="caption" tone="secondary">{String(index + 1).padStart(2, '0')}</AppText><Ionicons name="chevron-forward" size={18} color={colors.textSecondary} accessible={false} /></Pressable>)}
    </View>
    <AppText variant="caption" tone="secondary" style={styles.footer}>Sample exercise library · Workouts are self-reported and saved only on this device.</AppText>
  </Screen>;
}
const styles = StyleSheet.create({
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 16 }, eyebrow: { color: colors.action, flexShrink: 1 }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center' }, subtitle: { marginTop: 8, marginBottom: 24 },
  hero: { backgroundColor: colors.textPrimary, borderRadius: 24, padding: 24, gap: 16 }, heroTop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }, heroMuted: { color: colors.onAction }, heroTitle: { color: colors.onAction, fontSize: 34, lineHeight: 40 }, heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  goal: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, gap: 12, marginTop: 16 }, headingRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, track: { height: 8, backgroundColor: colors.surfaceMuted, borderRadius: 4, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.action }, section: { marginTop: spacing.xxl, gap: 12 }, week: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 }, day: { alignItems: 'center', gap: 8, flex: 1 }, dayDot: { minWidth: 34, minHeight: 34, padding: 4, borderRadius: 17, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }, dayDone: { backgroundColor: colors.action }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 }, chip: { minHeight: 48, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 24, backgroundColor: colors.surface }, chipSelected: { backgroundColor: colors.textPrimary }, exercise: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 16, minHeight: 88 }, exerciseIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center' }, exerciseCopy: { flex: 1, gap: 4 }, footer: { marginTop: 24 },
});
