import Constants from 'expo-constants';

import { localSessionAdjustment, readSessionAdjustmentReply, type SessionAdjustmentReply, type SessionAdjustmentRequest } from './sessionAdjustment';

export async function requestSessionAdjustment(input: SessionAdjustmentRequest, signal: AbortSignal): Promise<SessionAdjustmentReply> {
  const local = localSessionAdjustment(input);
  if (local) return local;
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener('abort', abort);
  const timer = setTimeout(abort, 22000);
  try {
    if (signal.aborted) throw new Error('Request cancelled');
    const host = Constants.expoConfig?.hostUri;
    const origin = process.env.EXPO_PUBLIC_COACH_ORIGIN || (__DEV__ && host ? `http://${host}` : '');
    if (!origin) throw new Error('AI Coach is unavailable. You can still adjust your targets manually.');
    const response = await fetch(new URL('/api/session-coach', origin).toString(), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: controller.signal,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error === 'rate_limited' ? 'AI Coach has reached its usage limit. Try again later or adjust manually.'
        : data?.error === 'not_configured' ? 'AI Coach is not configured on the server. You can adjust manually.'
          : 'AI Coach couldn’t reply. Try again or adjust manually.');
    }
    const reply = readSessionAdjustmentReply(await response.json(), input);
    if (!reply) throw new Error('AI Coach returned an invalid target. Please try again or adjust manually.');
    return reply;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('AI Coach took too long. Try again or adjust manually.');
    throw error;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', abort);
  }
}
