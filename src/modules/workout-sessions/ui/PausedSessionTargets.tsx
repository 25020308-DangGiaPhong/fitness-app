import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { PausedSessionCoach } from '@/modules/ai-coach';
import { getExercise } from '@/modules/exercise-catalog';
import { AppText, colors, TargetPicker } from '@/ui';

import type { Session } from '../model';

type Props = {
  session: Session;
  busy: boolean;
  editing: 'sets' | 'amount' | null;
  onEditingChange: (field: 'sets' | 'amount' | null) => void;
  coachOpen: boolean;
  onCoachToggle: () => void;
  onAdjust: (sets: number, amount: number) => Promise<void>;
};

export function PausedSessionTargets({ session, busy, editing, onEditingChange, coachOpen, onCoachToggle, onAdjust }: Props) {
  const exercise = getExercise(session.exerciseId);
  if (session.status !== 'paused' || !exercise) return null;
  return <View style={styles.controls}>
        <AppText variant="heading">Adjust your targets</AppText>
        <AppText variant="caption" tone="secondary">{session.setsDone} sets completed. Changes apply to the remaining sets.</AppText>
        <View style={styles.row}>
          <Pressable accessibilityRole="button" accessibilityLabel="Adjust total sets" disabled={busy}
            onPress={() => onEditingChange('sets')} style={({ pressed }) => [styles.target, pressed && styles.pressed]}>
            <AppText variant="heading" style={styles.accent}>{session.totalSets}</AppText>
            <AppText variant="caption" tone="secondary">total sets</AppText>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Adjust amount per remaining set" disabled={busy}
            onPress={() => onEditingChange('amount')} style={({ pressed }) => [styles.target, pressed && styles.pressed]}>
            <AppText variant="heading" style={styles.accent}>{exercise.reps.replace(/^\d+/, String(session.targetAmount ?? Number.parseInt(exercise.reps, 10)))}</AppText>
            <AppText variant="caption" tone="secondary">per remaining set</AppText>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: coachOpen, disabled: busy }} disabled={busy}
          onPress={() => onCoachToggle()} style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}>
          <AppText variant="bodyStrong" style={styles.accent}>{coachOpen ? 'Close AI Coach' : 'Ask AI Coach'}</AppText>
          <Ionicons name={coachOpen ? 'chevron-up' : 'chatbubble-ellipses-outline'} size={20} color={colors.action} />
        </Pressable>
        {coachOpen && <PausedSessionCoach key={JSON.stringify([session.id, session.totalSets, session.targetAmount, session.setsDone])}
          exerciseId={session.exerciseId} sets={session.totalSets} amount={session.targetAmount ?? Number.parseInt(exercise.reps, 10)}
          setsDone={session.setsDone} busy={busy} onApply={onAdjust} />}
        {editing && <TargetPicker key={editing} title={editing === 'sets' ? 'Total sets' : 'Amount per remaining set'}
          min={editing === 'sets' ? Math.max(1, session.setsDone) : 1} max={editing === 'sets' ? 5 : 60}
          value={editing === 'sets' ? session.totalSets : session.targetAmount ?? Number.parseInt(exercise.reps, 10)}
          unit={editing === 'sets' ? 'total sets' : exercise.reps.replace(/^\d+\s*/, '') + ' per remaining set'}
          onCancel={() => onEditingChange(null)} onConfirm={(value) => {
            onEditingChange(null);
            void onAdjust(editing === 'sets' ? value : session.totalSets,
              editing === 'amount' ? value : session.targetAmount ?? Number.parseInt(exercise.reps, 10));
          }} />}

  </View>;
}

const styles = StyleSheet.create({
  controls: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  target: { flex: 1, minHeight: 80, justifyContent: 'center', padding: 16, gap: 4, backgroundColor: colors.surface, borderRadius: 16 },
  accent: { color: colors.action },
  textAction: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  pressed: { opacity: 0.72 },
});
