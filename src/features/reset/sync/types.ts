import type { ResetPersonalization } from '../types';

export const RESET_SYNC_SEQUENCE = 1;
export const RESET_SYNC_STATUS_ACTIVE = 'active';

export type ResetSyncStatus = 'idle' | 'syncing' | 'success' | 'offline' | 'conflict' | 'error';

export type ResetSyncConflictCode = 'cross-account' | 'ambiguous-ownership' | 'unsafe-merge';

export type SyncOwnership = {
  ownerUserId: string | null;
  lastSuccessfulBackupAt: string | null;
  lastSyncAt: string | null;
  status: ResetSyncStatus;
  conflictCode: ResetSyncConflictCode | null;
  conflictMessage: string | null;
};

export const INITIAL_SYNC_OWNERSHIP: SyncOwnership = {
  ownerUserId: null,
  lastSuccessfulBackupAt: null,
  lastSyncAt: null,
  status: 'idle',
  conflictCode: null,
  conflictMessage: null,
};

export type CloudCycleWrite = {
  sequence: number;
  planId: string;
  planVersion: number;
  currentDay: number;
  todayStarted: boolean;
  todayCompleted: boolean;
  resetStartedOn: string | null;
  lastSeenOn: string | null;
  lastCompletedOn: string | null;
  streak: number;
  missedYesterday: boolean;
  resetTypeId: string;
  personalization: ResetPersonalization;
  profileAccuracy: string | null;
  status: 'active';
  completedAt: null;
};

export type CloudCompletionWrite = {
  localDay: number;
  completedOn: string | null;
};

export type CloudCycleRow = CloudCycleWrite & {
  id: string;
  userId: string;
};

export type CloudCompletionRow = CloudCompletionWrite & {
  id: string;
  userId: string;
  cycleId: string;
};

export type CloudCycleRecord = {
  cycle: CloudCycleRow;
  completions: CloudCompletionRow[];
};

export type ResetCloudContext = {
  timeZone: string;
  record: CloudCycleRecord | null;
};

export type ResetCloudGateway = {
  fetchContext(userId: string): Promise<ResetCloudContext>;
  uploadCycle1(
    userId: string,
    cycle: CloudCycleWrite,
    completions: CloudCompletionWrite[],
    existingCycleId?: string,
  ): Promise<CloudCycleRecord>;
};

export class ResetSyncNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResetSyncNetworkError';
  }
}

export const COMPLETION_DATE_RULE =
  'Each completed local day becomes one reset_day_completions row. Historical dates stay NULL unless lastCompletedOn can safely identify the latest completed day (max(completedDays)); only that latest row may receive lastCompletedOn. Never fabricate dates for older days.';
