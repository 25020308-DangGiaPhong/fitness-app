import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getExercise } from '@/modules/exercise-catalog';
import { colors, radii, spacing, typography, useReducedMotion } from '@/ui';

import { requestMobility } from '../client';
import { MAX_CONCERN_LENGTH } from '../model';
import type { CoachReply, CoachStep, MobilityRequest, Posture } from '../mobility';

export interface CoachScreenProps {
  onOpenExerciseDetail: (exerciseId: string) => void;
}

type Message =
  | { id: string; role: 'user'; content: string }
  | { id: string; role: 'coach'; content: string; reply?: CoachReply };

type Chat = { id: number; messages: Message[] };

const welcome: Message = {
  id: 'welcome',
  role: 'coach',
  content: 'What kind of movement would you like today? Try asking for a short stretch at your desk.',
};

const replyText: Record<CoachStep, string> = {
  confirm: 'Are you looking for gentle movement, or is this about pain or a recent injury?',
  posture: 'Would you like gentle upper-body movement while seated or standing?',
  stop: 'I’ll pause exercise suggestions here. If you need help with pain or an injury, a healthcare professional can guide you.',
  clarify: 'I couldn’t match that request to a demo exercise. Tell me what area you want to move and whether you prefer to sit or stand.',
  unavailable: 'AI chat is unavailable. You can still try the guided upper-body options below.',
  suggest: 'Here’s a mobility exercise from Train.',
};

type QuickOption = 'gentle' | 'pain' | 'unsure' | Posture;
const quickOptions: Record<QuickOption, string> = {
  gentle: 'Gentle movement',
  pain: 'Pain or recent injury',
  unsure: 'Not sure',
  seated: 'Seated',
  standing: 'Standing',
};

export function CoachScreen({ onOpenExerciseDetail }: CoachScreenProps) {
  const reduceMotion = useReducedMotion();
  const list = useRef<FlatList<Message>>(null);
  const nextChatId = useRef(1);
  const sending = useRef(false);
  const scrollOnChange = useRef(false);
  const [chats, setChats] = useState<Chat[]>([{ id: 0, messages: [] }]);
  const [activeId, setActiveId] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const chat = chats.find(({ id }) => id === activeId);
  const messages = chat?.messages ?? [];
  const savedChats = chats.filter((entry) => entry.messages.length > 0);
  const sendDisabled = pending || !draft.trim();

  function openChat(id: number) {
    Keyboard.dismiss();
    if (id !== activeId) scrollOnChange.current = true;
    setActiveId(id);
    setHistoryOpen(false);
    if (id !== activeId) setDraft('');
  }

  function newChat() {
    const existing = chats.find((entry) => entry.messages.length === 0);
    if (existing) {
      openChat(existing.id);
      return;
    }
    const id = nextChatId.current++;
    setChats((previous) => [{ id, messages: [] }, ...previous]);
    openChat(id);
  }

  function append(message: Message) {
    setChats((previous) => previous.map((entry) =>
      entry.id === activeId ? { ...entry, messages: [...entry.messages, message] } : entry,
    ));
  }

  async function send(option?: QuickOption) {
    const content = option ? quickOptions[option] : draft.trim();
    if (!content || sending.current) return;
    sending.current = true;
    scrollOnChange.current = true;
    setPending(true);
    setDraft('');
    Keyboard.dismiss();

    const revision = messages.length + 1;
    const requestId = `chat-${activeId}-turn-${revision}`;
    append({ id: requestId, role: 'user', content });
    try {
      let reply: CoachReply;
      let offline = false;
      if (option === 'gentle') {
        reply = { step: 'posture' };
      } else if (option === 'pain' || option === 'unsure') {
        reply = { step: 'stop' };
      } else {
        const request: MobilityRequest = option ? { posture: option } : { text: content };
        ({ reply, offline } = await requestMobility(request));
      }
      const message = offline && reply.step === 'suggest'
        ? 'AI chat is unavailable. Here’s a mobility option selected on this device.'
        : replyText[reply.step];
      append({ id: `${requestId}-reply`, role: 'coach', content: message, reply });
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  function renderMessage({ item }: { item: Message }) {
    const isUser = item.role === 'user';
    const reply = item.role === 'coach' && item.id === messages.at(-1)?.id ? item.reply : undefined;
    const exercise = reply?.step === 'suggest' ? getExercise(reply.exerciseId) : undefined;
    const options: QuickOption[] = reply?.step === 'confirm' || reply?.step === 'unavailable'
      ? ['gentle', 'pain', 'unsure']
      : reply?.step === 'posture' ? ['seated', 'standing'] : [];
    return (
      <View style={[styles.message, isUser && styles.userMessage]}>
        {!isUser && <Text style={styles.sender}>AI Coach</Text>}
        <View style={[styles.bubble, isUser && styles.userBubble]}>
          <Text selectable style={styles.body}>{item.content}</Text>
          {options.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={quickOptions[option]}
              disabled={pending}
              onPress={() => void send(option)}
              style={({ pressed }) => [styles.quickOption, pressed && styles.pressed, pending && styles.disabled]}
            >
              <Text style={styles.accentLabel}>{quickOptions[option]}</Text>
            </Pressable>
          ))}
          {exercise && (
              <Pressable
                key={exercise.id}
                accessibilityRole="button"
                accessibilityLabel={`View ${exercise.name}`}
                onPress={() => onOpenExerciseDetail(exercise.id)}
                style={({ pressed }) => [styles.exercise, pressed && styles.pressed]}
              >
                <View style={styles.duration}>
                  <Text style={styles.accentLabel}>{exercise.minutes} min</Text>
                </View>
                <View style={styles.grow}>
                  <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                  <Text style={styles.caption}>{exercise.focus}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.grow} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.mark}>
            <Ionicons name="sparkles-outline" size={24} color={colors.action} />
          </View>
          <View style={styles.grow}>
            <Text accessibilityRole="header" style={styles.title}>AI Coach</Text>
            <Text style={styles.caption}>Movement &amp; wellbeing</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Start a new chat" onPress={newChat}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <Ionicons name="create-outline" size={23} color={colors.textPrimary} />
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: historyOpen }}
          onPress={() => { Keyboard.dismiss(); setHistoryOpen(!historyOpen); }}
          style={({ pressed }) => [styles.historyToggle, pressed && styles.pressed]}
        >
          <Ionicons name="time-outline" size={19} color={colors.textSecondary} />
          <Text style={[styles.sender, styles.grow]}>Chat history</Text>
          <Ionicons name={historyOpen ? 'chevron-up' : 'chevron-down'} size={17} color={colors.textSecondary} />
        </Pressable>
        {historyOpen && (
          <ScrollView style={styles.history} keyboardShouldPersistTaps="handled">
            <Text style={styles.historyNote}>Available until you close or reload the app.</Text>
            {savedChats.length === 0 && <Text style={styles.historyNote}>No chats yet.</Text>}
            {savedChats.map((entry) => (
              <Pressable
                key={entry.id}
                accessibilityRole="button"
                accessibilityState={{ selected: entry.id === activeId }}
                onPress={() => openChat(entry.id)}
                style={({ pressed }) => [styles.historyItem, entry.id === activeId && styles.selected, pressed && styles.pressed]}
              >
                <Text numberOfLines={2} style={[styles.body, styles.grow]}>{entry.messages[0]?.content}</Text>
                <Ionicons name={entry.id === activeId ? 'checkmark' : 'chevron-forward'} size={17} color={colors.action} />
              </Pressable>
            ))}
          </ScrollView>
        )}
        <FlatList
          key={activeId}
          ref={list}
          data={[welcome, ...messages]}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.grow}
          contentContainerStyle={styles.transcript}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            if (scrollOnChange.current) list.current?.scrollToEnd({ animated: !reduceMotion });
          }}
          onScrollBeginDrag={() => { scrollOnChange.current = false; }}
        />
        <View style={styles.composer}>
          <View style={styles.inputRow}>
            <TextInput
              accessibilityLabel="Your message"
              value={draft}
              onChangeText={setDraft}
              onFocus={() => setHistoryOpen(false)}
              placeholder="Your message…"
              placeholderTextColor={colors.textSecondary}
              maxLength={MAX_CONCERN_LENGTH}
              multiline
              style={styles.input}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send message"
              accessibilityState={{ disabled: sendDisabled, busy: pending }}
              disabled={sendDisabled}
              onPress={() => void send()}
              style={({ pressed }) => [styles.send, sendDisabled && styles.disabled, pressed && styles.pressed]}
            >
              <Ionicons name="arrow-up" size={24} color={colors.onAction} />
            </Pressable>
          </View>
          <Text style={styles.footnote}>Mobility demo · Use sample messages only</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  grow: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.gutter, paddingBottom: spacing.md },
  mark: { width: 48, height: 48, borderRadius: radii.card, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.title, color: colors.textPrimary },
  caption: { ...typography.caption, color: colors.textSecondary },
  iconButton: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.control, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  historyToggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48, paddingHorizontal: spacing.gutter, borderBottomWidth: 1, borderColor: colors.border },
  history: { flexGrow: 0, maxHeight: 150, backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border },
  historyNote: { ...typography.caption, color: colors.textSecondary, paddingHorizontal: spacing.gutter, paddingVertical: spacing.sm },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48, paddingHorizontal: spacing.gutter, paddingVertical: spacing.sm },
  selected: { backgroundColor: colors.accentSurface },
  transcript: { padding: spacing.gutter, gap: spacing.lg },
  message: { alignSelf: 'flex-start', maxWidth: '95%', gap: spacing.xs },
  userMessage: { alignSelf: 'flex-end', maxWidth: '86%' },
  sender: { ...typography.label, color: colors.textSecondary },
  bubble: { backgroundColor: colors.surface, borderRadius: radii.card, borderTopLeftRadius: spacing.xs, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  userBubble: { backgroundColor: colors.accentSurface, borderWidth: 0, borderTopLeftRadius: radii.card, borderTopRightRadius: spacing.xs },
  body: { ...typography.body, color: colors.textPrimary },
  exercise: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48, marginTop: spacing.sm, paddingVertical: spacing.xs },
  duration: { backgroundColor: colors.accentSurface, borderRadius: radii.control, padding: spacing.sm, maxWidth: '35%' },
  accentLabel: { ...typography.label, color: colors.action },
  exerciseTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  quickOption: { minHeight: 48, justifyContent: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radii.control, backgroundColor: colors.accentSurface },
  composer: { backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: spacing.xs, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card },
  input: { ...typography.body, color: colors.textPrimary, flex: 1, minHeight: 48, maxHeight: 104, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  send: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.control, backgroundColor: colors.action },
  footnote: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.42 },
});
