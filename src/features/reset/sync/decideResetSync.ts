import type { ResetSnapshot } from '../types';
import { toDateKeyInTimeZone } from './calendarDate';
import { hasMeaningfulReset } from './hasMeaningfulReset';
import { mapCloudToSnapshot } from './mapCloudToSnapshot';
import { mapSnapshotToCloudPayload } from './mapSnapshotToCloud';
import { cloudRecordMatchesSnapshot, mergeResetProgress } from './mergeResetProgress';
import type {
  CloudCompletionWrite,
  CloudCycleRecord,
  CloudCycleWrite,
  ResetSyncConflictCode,
  SyncOwnership,
} from './types';

export type SyncDecision =
  | { kind: 'skip'; reason: 'anonymous' | 'empty' }
  | { kind: 'needs-fetch' }
  | {
      kind: 'conflict';
      code: ResetSyncConflictCode;
      message: string;
    }
  | { kind: 'first-backup'; cycle: CloudCycleWrite; completions: CloudCompletionWrite[] }
  | { kind: 'restore'; snapshot: ResetSnapshot }
  | {
      kind: 'merge';
      snapshot: ResetSnapshot;
      cycle: CloudCycleWrite;
      completions: CloudCompletionWrite[];
    }
  | { kind: 'in-sync' };

const CROSS_ACCOUNT_MESSAGE =
  'This device has reset progress from another account. Cloud backup is paused so nothing is overwritten.';

const AMBIGUOUS_MESSAGE =
  'This device has local reset progress that is not linked to this account. Cloud backup is paused.';

export function decideResetSync(input: {
  userId: string | null;
  local: ResetSnapshot;
  ownership: SyncOwnership;
  cloud?: CloudCycleRecord | null;
  cloudFetched: boolean;
  timeZone: string;
  now: Date;
}): SyncDecision {
  if (!input.userId) {
    return { kind: 'skip', reason: 'anonymous' };
  }

  const meaningful = hasMeaningfulReset(input.local);
  const ownerUserId = input.ownership.ownerUserId;
  const ownerMismatch = ownerUserId !== null && ownerUserId !== input.userId;

  if (ownerMismatch && meaningful) {
    return { kind: 'conflict', code: 'cross-account', message: CROSS_ACCOUNT_MESSAGE };
  }

  if (!input.cloudFetched) {
    return { kind: 'needs-fetch' };
  }

  const cloud = input.cloud ?? null;
  const today = toDateKeyInTimeZone(input.now, input.timeZone);

  if (meaningful && !cloud && (ownerUserId === null || ownerUserId === input.userId)) {
    const payload = mapSnapshotToCloudPayload(input.local);
    return { kind: 'first-backup', ...payload };
  }

  if (!meaningful && cloud) {
    return { kind: 'restore', snapshot: mapCloudToSnapshot(cloud, input.local.reflections) };
  }

  if (!meaningful && !cloud) {
    return { kind: 'skip', reason: 'empty' };
  }

  if (meaningful && cloud && ownerUserId === null) {
    return { kind: 'conflict', code: 'ambiguous-ownership', message: AMBIGUOUS_MESSAGE };
  }

  if (meaningful && cloud && ownerUserId === input.userId) {
    if (cloudRecordMatchesSnapshot(cloud, input.local)) {
      return { kind: 'in-sync' };
    }

    const merged = mergeResetProgress(input.local, cloud, today);
    if (merged.kind === 'conflict') {
      return { kind: 'conflict', code: merged.code, message: merged.message };
    }

    const payload = mapSnapshotToCloudPayload(merged.snapshot);
    return {
      kind: 'merge',
      snapshot: merged.snapshot,
      cycle: payload.cycle,
      completions: merged.completions,
    };
  }

  if (ownerMismatch && !meaningful && !cloud) {
    return { kind: 'skip', reason: 'empty' };
  }

  return { kind: 'skip', reason: 'empty' };
}
