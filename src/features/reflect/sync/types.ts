import type { JournalEntry } from '../../reset/types';

export type CloudJournalWrite = {
  cycleId: string;
  localDay: number;
  calendarDate: string | null;
  mood: string | null;
  prompt: string | null;
  body: string;
  photoUrl: null;
  savedAt: string;
};

export type CloudJournalRow = CloudJournalWrite & {
  id: string;
  userId: string;
  updatedAt: string;
};

export type JournalCloudGateway = {
  fetchCycle1Id(userId: string): Promise<string | null>;
  fetchEntries(userId: string, cycleId: string): Promise<CloudJournalRow[]>;
  upsertEntries(userId: string, entries: CloudJournalWrite[]): Promise<CloudJournalRow[]>;
};

export type JournalSyncRun = {
  kind: 'skipped' | 'upload' | 'restore' | 'merge' | 'in-sync' | 'conflict' | 'offline' | 'error';
  message?: string;
  cycleId?: string;
};

export { ResetSyncNetworkError } from '../../reset/sync/types';
export type { SyncOwnership } from '../../reset/sync/types';

export type { JournalEntry };
