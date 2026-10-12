import { supabase } from '@/features/auth/supabase/client';
import { ResetSyncNetworkError } from '../../reset/sync/types';
import type { CloudJournalRow, CloudJournalWrite, JournalCloudGateway } from './types';

type EntryRow = {
  id: string;
  user_id: string;
  cycle_id: string;
  local_day: number;
  calendar_date: string | null;
  mood: string | null;
  prompt: string | null;
  body: string;
  photo_url: string | null;
  updated_at: string;
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

function mapRow(row: EntryRow): CloudJournalRow {
  return {
    id: row.id,
    userId: row.user_id,
    cycleId: row.cycle_id,
    localDay: row.local_day,
    calendarDate: row.calendar_date,
    mood: row.mood,
    prompt: row.prompt,
    body: row.body,
    photoUrl: null,
    savedAt: row.updated_at,
    updatedAt: row.updated_at,
  };
}

export function createSupabaseJournalCloudGateway(): JournalCloudGateway {
  return {
    async fetchCycle1Id(userId: string): Promise<string | null> {
      const client = supabase;
      if (!client) {
        throw new ResetSyncNetworkError('Supabase is not configured.');
      }

      const { data, error } = await client
        .from('reset_cycles')
        .select('id')
        .eq('user_id', userId)
        .eq('sequence', 1)
        .maybeSingle();

      throwIfError(error, 'Could not read reset cycle for journal.');
      return typeof data?.id === 'string' ? data.id : null;
    },

    async fetchEntries(userId: string, cycleId: string): Promise<CloudJournalRow[]> {
      const client = supabase;
      if (!client) {
        throw new ResetSyncNetworkError('Supabase is not configured.');
      }

      const { data, error } = await client
        .from('journal_entries')
        .select(
          'id, user_id, cycle_id, local_day, calendar_date, mood, prompt, body, photo_url, updated_at',
        )
        .eq('user_id', userId)
        .eq('cycle_id', cycleId);

      throwIfError(error, 'Could not read journal entries.');
      return (data ?? []).map((row) => mapRow(row as EntryRow));
    },

    async upsertEntries(userId: string, entries: CloudJournalWrite[]): Promise<CloudJournalRow[]> {
      const client = supabase;
      if (!client) {
        throw new ResetSyncNetworkError('Supabase is not configured.');
      }
      if (entries.length === 0) {
        return [];
      }

      const { data, error } = await client
        .from('journal_entries')
        .upsert(
          entries.map((entry) => ({
            user_id: userId,
            cycle_id: entry.cycleId,
            local_day: entry.localDay,
            calendar_date: entry.calendarDate,
            mood: entry.mood,
            prompt: entry.prompt,
            body: entry.body,
            photo_url: null,
          })),
          { onConflict: 'cycle_id,calendar_date' },
        )
        .select(
          'id, user_id, cycle_id, local_day, calendar_date, mood, prompt, body, photo_url, updated_at',
        );

      throwIfError(error, 'Could not save journal entries.');
      return (data ?? []).map((row) => mapRow(row as EntryRow));
    },
  };
}
