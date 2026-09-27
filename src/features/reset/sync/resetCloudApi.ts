import type { ResetPersonalization } from '../types';
import { supabase } from '@/features/auth/supabase/client';
import { laterCalendarDate } from './calendarDate';
import type {
  CloudCompletionRow,
  CloudCompletionWrite,
  CloudCycleRecord,
  CloudCycleRow,
  CloudCycleWrite,
  ResetCloudContext,
  ResetCloudGateway,
} from './types';
import { ResetSyncNetworkError } from './types';

type CycleInsert = {
  id?: string;
  user_id: string;
  sequence: number;
  plan_id: string;
  plan_version: number;
  current_day: number;
  today_started: boolean;
  today_completed: boolean;
  reset_started_on: string | null;
  last_seen_on: string | null;
  last_completed_on: string | null;
  streak: number;
  missed_yesterday: boolean;
  reset_type_id: string;
  personalization: ResetPersonalization;
  profile_accuracy: string | null;
  status: 'active';
  completed_at: null;
};

type CycleRow = CycleInsert & {
  id: string;
};

type CompletionRow = {
  id: string;
  user_id: string;
  cycle_id: string;
  local_day: number;
  completed_on: string | null;
};

function isOfflineError(error: { message?: string } | null): boolean {
  const message = error?.message?.toLowerCase() ?? '';
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('offline') ||
    message.includes('failed to fetch')
  );
}

function throwIfError(error: { message?: string } | null, fallback: string): void {
  if (!error) {
    return;
  }
  if (isOfflineError(error)) {
    throw new ResetSyncNetworkError(error.message ?? fallback);
  }
  throw new Error(error.message ?? fallback);
}

function readPersonalization(value: unknown): ResetPersonalization {
  if (!value || typeof value !== 'object') {
    return { desiredFeelings: [] };
  }
  const record = value as Record<string, unknown>;
  const desired = record.desiredFeelings;
  return {
    dailyCommitment:
      typeof record.dailyCommitment === 'string' ? record.dailyCommitment : undefined,
    supportStyle: typeof record.supportStyle === 'string' ? record.supportStyle : undefined,
    primaryObstacle:
      typeof record.primaryObstacle === 'string' ? record.primaryObstacle : undefined,
    resetReason: typeof record.resetReason === 'string' ? record.resetReason : undefined,
    desiredFeelings: Array.isArray(desired)
      ? desired.filter((item): item is string => typeof item === 'string')
      : [],
    missedDayResponse:
      typeof record.missedDayResponse === 'string' ? record.missedDayResponse : undefined,
  };
}

function mapCycleRow(row: CycleRow): CloudCycleRow {
  return {
    id: row.id,
    userId: row.user_id,
    sequence: row.sequence,
    planId: row.plan_id,
    planVersion: row.plan_version,
    currentDay: row.current_day,
    todayStarted: row.today_started,
    todayCompleted: row.today_completed,
    resetStartedOn: row.reset_started_on,
    lastSeenOn: row.last_seen_on,
    lastCompletedOn: row.last_completed_on,
    streak: row.streak,
    missedYesterday: row.missed_yesterday,
    resetTypeId: row.reset_type_id,
    personalization: readPersonalization(row.personalization),
    profileAccuracy: row.profile_accuracy,
    status: 'active',
    completedAt: null,
  };
}

function mapCompletionRow(row: CompletionRow): CloudCompletionRow {
  return {
    id: row.id,
    userId: row.user_id,
    cycleId: row.cycle_id,
    localDay: row.local_day,
    completedOn: row.completed_on,
  };
}

function toCycleInsert(
  userId: string,
  cycle: CloudCycleWrite,
  existingCycleId?: string,
): CycleInsert {
  return {
    ...(existingCycleId ? { id: existingCycleId } : {}),
    user_id: userId,
    sequence: cycle.sequence,
    plan_id: cycle.planId,
    plan_version: cycle.planVersion,
    current_day: cycle.currentDay,
    today_started: cycle.todayStarted,
    today_completed: cycle.todayCompleted,
    reset_started_on: cycle.resetStartedOn,
    last_seen_on: cycle.lastSeenOn,
    last_completed_on: cycle.lastCompletedOn,
    streak: cycle.streak,
    missed_yesterday: cycle.missedYesterday,
    reset_type_id: cycle.resetTypeId,
    personalization: cycle.personalization,
    profile_accuracy: cycle.profileAccuracy,
    status: 'active',
    completed_at: null,
  };
}

export function createSupabaseResetCloudGateway(): ResetCloudGateway {
  return {
    async fetchContext(userId: string): Promise<ResetCloudContext> {
      const client = supabase;
      if (!client) {
        throw new ResetSyncNetworkError('Supabase is not configured.');
      }

      const [profileResult, cycleResult] = await Promise.all([
        client.from('profiles').select('timezone').eq('id', userId).maybeSingle(),
        client
          .from('reset_cycles')
          .select(
            'id, user_id, sequence, plan_id, plan_version, current_day, today_started, today_completed, reset_started_on, last_seen_on, last_completed_on, streak, missed_yesterday, reset_type_id, personalization, profile_accuracy, status, completed_at',
          )
          .eq('user_id', userId)
          .eq('sequence', 1)
          .maybeSingle(),
      ]);

      throwIfError(profileResult.error, 'Could not read profile timezone.');
      throwIfError(cycleResult.error, 'Could not read reset cycle.');

      const timeZone =
        typeof profileResult.data?.timezone === 'string' && profileResult.data.timezone.length > 0
          ? profileResult.data.timezone
          : 'UTC';

      if (!cycleResult.data) {
        return { timeZone, record: null };
      }

      const cycle = mapCycleRow(cycleResult.data as CycleRow);
      const completionsResult = await client
        .from('reset_day_completions')
        .select('id, user_id, cycle_id, local_day, completed_on')
        .eq('cycle_id', cycle.id)
        .eq('user_id', userId);

      throwIfError(completionsResult.error, 'Could not read reset completions.');

      return {
        timeZone,
        record: {
          cycle,
          completions: (completionsResult.data ?? []).map((row) =>
            mapCompletionRow(row as CompletionRow),
          ),
        },
      };
    },

    async uploadCycle1(
      userId: string,
      cycle: CloudCycleWrite,
      completions: CloudCompletionWrite[],
      existingCycleId?: string,
    ): Promise<CloudCycleRecord> {
      const client = supabase;
      if (!client) {
        throw new ResetSyncNetworkError('Supabase is not configured.');
      }

      const { data: cycleData, error: cycleError } = await client
        .from('reset_cycles')
        .upsert(toCycleInsert(userId, cycle, existingCycleId), {
          onConflict: 'user_id,sequence',
        })
        .select(
          'id, user_id, sequence, plan_id, plan_version, current_day, today_started, today_completed, reset_started_on, last_seen_on, last_completed_on, streak, missed_yesterday, reset_type_id, personalization, profile_accuracy, status, completed_at',
        )
        .single();

      throwIfError(cycleError, 'Could not save reset cycle.');
      if (!cycleData) {
        throw new Error('Could not save reset cycle.');
      }

      const savedCycle = mapCycleRow(cycleData as CycleRow);

      const existingResult = await client
        .from('reset_day_completions')
        .select('id, user_id, cycle_id, local_day, completed_on')
        .eq('cycle_id', savedCycle.id)
        .eq('user_id', userId);

      throwIfError(existingResult.error, 'Could not read reset completions.');

      const existingByDay = new Map<number, string | null>();
      for (const row of existingResult.data ?? []) {
        const completion = row as CompletionRow;
        existingByDay.set(completion.local_day, completion.completed_on);
      }

      if (completions.length > 0) {
        const rows = completions.map((completion) => ({
          user_id: userId,
          cycle_id: savedCycle.id,
          local_day: completion.localDay,
          completed_on: laterCalendarDate(
            completion.completedOn,
            existingByDay.get(completion.localDay) ?? null,
          ),
        }));

        const { error: completionError } = await client
          .from('reset_day_completions')
          .upsert(rows, { onConflict: 'cycle_id,local_day' });

        throwIfError(completionError, 'Could not save reset completions.');
      }

      const verifyResult = await client
        .from('reset_day_completions')
        .select('id, user_id, cycle_id, local_day, completed_on')
        .eq('cycle_id', savedCycle.id)
        .eq('user_id', userId);

      throwIfError(verifyResult.error, 'Could not verify reset completions.');

      return {
        cycle: savedCycle,
        completions: (verifyResult.data ?? []).map((row) => mapCompletionRow(row as CompletionRow)),
      };
    },
  };
}
