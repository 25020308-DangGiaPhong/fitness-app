import Constants from 'expo-constants';

import { demoCandidates, readCoachReply, textBoundary, type CoachReply, type MobilityRequest } from './mobility';

export async function requestMobility(request: MobilityRequest): Promise<{ reply: CoachReply; offline: boolean }> {
  if ('text' in request) {
    const step = textBoundary(request.text);
    if (step) return { reply: { step }, offline: false };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8500);
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
    if (!response.ok) throw new Error('Coach server unavailable');
    const reply = readCoachReply(await response.json());
    if (!reply) throw new Error('Invalid coach reply');
    return { reply, offline: false };
  } catch {
    const candidate = 'posture' in request ? demoCandidates(request.posture)[0] : undefined;
    return {
      reply: candidate ? { step: 'suggest', exerciseId: candidate.id } : { step: 'unavailable' },
      offline: true,
    };
  } finally {
    clearTimeout(timer);
  }
}
