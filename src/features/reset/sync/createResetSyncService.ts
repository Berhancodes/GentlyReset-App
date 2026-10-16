import type { ResetRepository } from '../../../application/reset/ResetRepository';
import { decideResetSync } from './decideResetSync';
import type {
  CloudCycleRecord,
  CloudCycleWrite,
  ResetCloudGateway,
  ResetSyncConflictCode,
  ResetSyncNetworkError as ResetSyncNetworkErrorType,
  SyncOwnership,
} from './types';
import { INITIAL_SYNC_OWNERSHIP, ResetSyncNetworkError } from './types';

export type ResetSyncRun = {
  kind:
    'skipped' | 'first-backup' | 'restore' | 'merge' | 'in-sync' | 'conflict' | 'offline' | 'error';
  conflictCode?: ResetSyncConflictCode;
  message?: string;
  ownership: SyncOwnership;
};

/** Reuse the cloud row id only for the same season; a new season gets its own row. */
function sameSeasonCycleId(
  record: CloudCycleRecord | null | undefined,
  cycle: CloudCycleWrite,
): string | undefined {
  return record && record.cycle.sequence === cycle.sequence ? record.cycle.id : undefined;
}

function withStatus(
  ownership: SyncOwnership,
  status: SyncOwnership['status'],
  extras: Partial<SyncOwnership> = {},
): SyncOwnership {
  return {
    ...ownership,
    status,
    lastSyncAt: extras.lastSyncAt ?? ownership.lastSyncAt,
    lastSuccessfulBackupAt: extras.lastSuccessfulBackupAt ?? ownership.lastSuccessfulBackupAt,
    ownerUserId: extras.ownerUserId ?? ownership.ownerUserId,
    conflictCode: extras.conflictCode ?? null,
    conflictMessage: extras.conflictMessage ?? null,
  };
}

function markSuccess(ownership: SyncOwnership, userId: string, now: Date): SyncOwnership {
  const timestamp = now.toISOString();
  return withStatus(ownership, 'success', {
    ownerUserId: userId,
    lastSyncAt: timestamp,
    lastSuccessfulBackupAt: timestamp,
  });
}

function isNetworkError(error: unknown): error is ResetSyncNetworkErrorType {
  return error instanceof ResetSyncNetworkError;
}

function verifyUpload(
  expectedDays: readonly number[],
  expectedCurrentDay: number,
  uploadedDays: readonly number[],
  uploadedCurrentDay: number,
): boolean {
  const expected = [...expectedDays].sort((left, right) => left - right);
  const uploaded = [...uploadedDays].sort((left, right) => left - right);
  return (
    expectedCurrentDay === uploadedCurrentDay &&
    expected.length === uploaded.length &&
    expected.every((day, index) => day === uploaded[index])
  );
}

/**
 * Local-first cloud backup. Domain/application never import this module.
 * UI actions must not await this. Failures leave Journey/Home usable.
 */
export async function syncResetWithCloud(input: {
  userId: string | null;
  repository: ResetRepository;
  ownership: SyncOwnership;
  gateway: ResetCloudGateway;
  now?: Date;
}): Promise<ResetSyncRun> {
  const now = input.now ?? new Date();
  const localBefore = input.repository.getSnapshot();
  const firstDecision = decideResetSync({
    userId: input.userId,
    local: localBefore,
    ownership: input.ownership,
    cloudFetched: false,
    timeZone: 'UTC',
    now,
  });

  if (firstDecision.kind === 'skip') {
    return { kind: 'skipped', ownership: input.ownership };
  }

  if (firstDecision.kind === 'conflict') {
    return {
      kind: 'conflict',
      conflictCode: firstDecision.code,
      message: firstDecision.message,
      ownership: withStatus(input.ownership, 'conflict', {
        lastSyncAt: now.toISOString(),
        conflictCode: firstDecision.code,
        conflictMessage: firstDecision.message,
      }),
    };
  }

  if (!input.userId) {
    return { kind: 'skipped', ownership: input.ownership };
  }

  let context;
  try {
    context = await input.gateway.fetchContext(input.userId);
  } catch (error) {
    if (isNetworkError(error)) {
      return {
        kind: 'offline',
        ownership: withStatus(input.ownership, 'offline', { lastSyncAt: now.toISOString() }),
      };
    }
    return {
      kind: 'error',
      message: error instanceof Error ? error.message : 'Cloud backup failed.',
      ownership: withStatus(input.ownership, 'error', { lastSyncAt: now.toISOString() }),
    };
  }

  const decision = decideResetSync({
    userId: input.userId,
    local: localBefore,
    ownership: input.ownership,
    cloud: context.record,
    cloudFetched: true,
    timeZone: context.timeZone,
    now,
  });

  if (decision.kind === 'skip') {
    return { kind: 'skipped', ownership: input.ownership };
  }

  if (decision.kind === 'conflict') {
    return {
      kind: 'conflict',
      conflictCode: decision.code,
      message: decision.message,
      ownership: withStatus(input.ownership, 'conflict', {
        lastSyncAt: now.toISOString(),
        conflictCode: decision.code,
        conflictMessage: decision.message,
      }),
    };
  }

  if (decision.kind === 'in-sync') {
    return { kind: 'in-sync', ownership: markSuccess(input.ownership, input.userId, now) };
  }

  if (decision.kind === 'restore') {
    input.repository.saveSnapshot(decision.snapshot);
    return { kind: 'restore', ownership: markSuccess(input.ownership, input.userId, now) };
  }

  try {
    if (decision.kind === 'first-backup') {
      const uploaded = await input.gateway.uploadCycle1(
        input.userId,
        decision.cycle,
        decision.completions,
        sameSeasonCycleId(context.record, decision.cycle),
      );
      const verified = verifyUpload(
        decision.completions.map((row) => row.localDay),
        decision.cycle.currentDay,
        uploaded.completions.map((row) => row.localDay),
        uploaded.cycle.currentDay,
      );
      if (!verified) {
        return {
          kind: 'error',
          message: 'Cloud backup could not be verified.',
          ownership: withStatus(input.ownership, 'error', { lastSyncAt: now.toISOString() }),
        };
      }
      return { kind: 'first-backup', ownership: markSuccess(input.ownership, input.userId, now) };
    }

    if (decision.kind === 'merge') {
      const uploaded = await input.gateway.uploadCycle1(
        input.userId,
        decision.cycle,
        decision.completions,
        sameSeasonCycleId(context.record, decision.cycle),
      );
      const verified = verifyUpload(
        decision.completions.map((row) => row.localDay),
        decision.cycle.currentDay,
        uploaded.completions.map((row) => row.localDay),
        uploaded.cycle.currentDay,
      );
      if (!verified) {
        return {
          kind: 'error',
          message: 'Cloud backup could not be verified.',
          ownership: withStatus(input.ownership, 'error', { lastSyncAt: now.toISOString() }),
        };
      }
      input.repository.saveSnapshot(decision.snapshot);
      return { kind: 'merge', ownership: markSuccess(input.ownership, input.userId, now) };
    }
  } catch (error) {
    if (isNetworkError(error)) {
      return {
        kind: 'offline',
        ownership: withStatus(input.ownership, 'offline', { lastSyncAt: now.toISOString() }),
      };
    }
    return {
      kind: 'error',
      message: error instanceof Error ? error.message : 'Cloud backup failed.',
      ownership: withStatus(input.ownership, 'error', { lastSyncAt: now.toISOString() }),
    };
  }

  return { kind: 'skipped', ownership: input.ownership ?? INITIAL_SYNC_OWNERSHIP };
}
