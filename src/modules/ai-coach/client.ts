import Constants from 'expo-constants';

import { demoCandidates, readCoachReply, textBoundary, type CoachReply, type MobilityRequest } from './mobility';

export async function requestMobility(request: MobilityRequest): Promise<{ reply: CoachReply; offline: boolean }> {
  if ('text' in request) {
    const reply = textBoundary(request.text, request.history);
    if (reply) return { reply, offline: false };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 22000);
  let message = 'Couldn’t connect to AI chat. Your conversation is still here. Try again.';
  try {
    const host = Constants.expoConfig?.hostUri;
    const origin = process.env.EXPO_PUBLIC_COACH_ORIGIN || (__DEV__ && host ? `http://${host}` : '');
    if (!origin) throw new Error('Coach server unavailable');
    const response = await fetch(new URL('/api/coach', origin).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      if (data?.error === 'rate_limited') {
        message = 'AI chat has reached its usage limit. Please wait a little before trying again.';
      } else if (data?.error === 'not_configured') {
        message = 'AI chat is not configured on the server yet.';
      } else if (data?.error === 'timeout') {
        message = 'AI chat took too long to reply. Your conversation is still here. Try again.';
      } else {
        message = 'AI chat couldn’t complete this reply. Your conversation is still here. Try again.';
      }
      throw new Error('Coach server unavailable');
    }
    const reply = readCoachReply(await response.json());
    if (!reply) throw new Error('Invalid coach reply');
    return { reply, offline: false };
  } catch {
    const candidates = 'posture' in request ? demoCandidates(request.area, request.posture).slice(0, 5) : [];
    return {
      reply: candidates.length ? { step: 'suggest', exerciseIds: candidates.map(({ id }) => id) }
        : 'posture' in request ? { step: 'no_match' }
          : { step: 'unavailable', message: controller.signal.aborted ? 'AI chat took too long to reply. Try again.' : message },
      offline: true,
    };
  } finally {
    clearTimeout(timer);
  }
}
