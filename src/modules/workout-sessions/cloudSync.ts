
import type { Session } from './model';

import { getExercise } from '@/modules/exercise-catalog';
import { elapsed } from './model';
import { supabase } from '@/lib/supabase';

export async function syncCompletedSession(
  session: Session,
  userId: string,
): Promise<void> {
  if (session.status !== 'completed') return;

  if (!session.completedAt) {
    throw new Error('Completed workout is missing its completion time.');
  }

  const exercise = getExercise(session.exerciseId);

  if (!exercise) {
    throw new Error(`Exercise not found: ${session.exerciseId}`);
  }

  const { error } = await supabase
    .from('workout_sessions')
    .upsert(
      {
        user_id: userId,
        local_session_id: session.id,
        workout_name: exercise.name,
        started_at: new Date(session.startedAt).toISOString(),
        completed_at: new Date(session.completedAt).toISOString(),
        duration_seconds: Math.floor(elapsed(session) / 1000),
        details: {
          exercise_id: session.exerciseId,
          sets_completed: session.setsDone,
          target_amount: session.targetAmount,
          ended_early: session.endedEarly ?? false,
          total_sets: session.totalSets,
          rest_seconds: session.restMs / 1000,
        },
      },
      {
        onConflict: 'user_id,local_session_id',
      },
    );

  if (error) {
    throw error;
  }
}

export type CloudWorkout = {
  id: string;
  local_session_id: string | null;
  workout_name: string;
  started_at: string | null;
  completed_at: string | null;
  duration_seconds: number | null;
  details: {
    exercise_id?: string;
    sets_completed?: number;
    total_sets?: number;
    rest_seconds?: number;
  } | null;
};

export async function fetchWorkoutHistory(
  userId: string,
): Promise<CloudWorkout[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(
      'id, local_session_id, workout_name, started_at, completed_at, duration_seconds, details',
    )
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as CloudWorkout[];
}
