import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { getExercise } from '@/modules/exercise-catalog';
import { AppText, Button, colors, radii, spacing, typography } from '@/ui';

import { MAX_CONCERN_LENGTH } from '../model';
import { textBoundary } from '../mobility';
import { type SessionAdjustmentReply } from '../sessionAdjustment';
import { requestSessionAdjustment } from '../sessionAdjustmentClient';

type Props = {
  exerciseId: string; sets: number; amount: number; setsDone: number; busy: boolean;
  onApply: (sets: number, amount: number) => Promise<void>;
};

// Parent mounts this only while paused, and remounts when the saved target changes.
export function PausedSessionCoach({ exerciseId, sets, amount, setsDone, busy, onApply }: Props) {
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const [reply, setReply] = useState<SessionAdjustmentReply>();
  const [error, setError] = useState<string>();
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const stopped = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; request.current?.abort(); };
  }, []);
  const exercise = getExercise(exerciseId);

  async function ask() {
    if (request.current || busy || !text.trim()) return;
    if (stopped.current) {
      setReply({ message: 'Keep the session paused. I won’t suggest targets for the pain or injury you mentioned. You can end the session here.' });
      return;
    }
    if (textBoundary(text)?.step === 'stop') stopped.current = true;
    const controller = new AbortController();
    request.current = controller;
    setPending(true); setReply(undefined); setError(undefined);
    try {
      const next = await requestSessionAdjustment({ text, exerciseId, sets, amount, setsDone }, controller.signal);
      if (mounted.current) setReply(next);
    } catch (error) {
      if (mounted.current) setError(error instanceof Error ? error.message : 'Couldn’t get a suggestion. Please try again.');
    } finally {
      request.current = null;
      if (mounted.current) setPending(false);
    }
  }

  return <View style={styles.panel}>
    <AppText tone="secondary">Tell your coach what you’d like to change. Your session stays paused until you resume.</AppText>
    <TextInput accessibilityLabel="Ask about this session" multiline maxLength={MAX_CONCERN_LENGTH}
      placeholder="I’m tired. Can we make the remaining sets lighter?" placeholderTextColor={colors.textSecondary}
      value={text} onChangeText={(value) => { setText(value); setReply(undefined); setError(undefined); }} editable={!pending && !busy} style={styles.input} />
    <Button label={pending ? 'Asking coach…' : 'Ask coach'} disabled={pending || busy || !text.trim()} onPress={() => void ask()} />
    {error && <AppText accessibilityRole="alert">{error}</AppText>}
    {reply && <View style={styles.reply} accessibilityLiveRegion="polite">
      <AppText>{reply.message}</AppText>
      {reply.target && <>
        <AppText variant="bodyStrong">{reply.target.sets} total sets · {exercise?.reps.replace(/^\d+/, String(reply.target.amount))} per remaining set</AppText>
        <Button label="Apply suggested targets" disabled={busy} onPress={() => {
          if (reply.target) void onApply(reply.target.sets, reply.target.amount);
        }} />
      </>}
    </View>}
  </View>;
}

const styles = StyleSheet.create({
  panel: { gap: spacing.md },
  input: { ...typography.body, color: colors.textPrimary, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.control, minHeight: 88, padding: spacing.md, textAlignVertical: 'top' },
  reply: { gap: spacing.md, paddingVertical: spacing.sm },
});
