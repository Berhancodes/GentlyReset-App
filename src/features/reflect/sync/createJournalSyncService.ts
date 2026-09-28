import {
  pickResetSnapshot,
  type ResetRepository,
} from '../../../application/reset/ResetRepository';
import type { JournalEntry } from '../../reset/types';
import type { SyncOwnership } from '../../reset/sync/types';
import { ResetSyncNetworkError } from '../../reset/sync/types';
import { mapCloudToReflection, mapReflectionToCloud } from './mapJournal';
import { mergeJournalEntries } from './mergeJournal';
import type { CloudJournalRow, JournalCloudGateway, JournalSyncRun } from './types';

function writeReflectionsOnly(
  repository: ResetRepository,
  reflections: readonly JournalEntry[],
): void {
  const current = repository.getSnapshot();
  repository.saveSnapshot({
    ...pickResetSnapshot(current),
    reflections: reflections.map((entry) => ({ ...entry })),
  });
}

function isNetworkError(error: unknown): boolean {
  return error instanceof ResetSyncNetworkError;
}

function hasLocalJournal(reflections: readonly JournalEntry[]): boolean {
  return reflections.some((entry) => entry.text.trim().length > 0);
}

/**
 * Local-first journal backup. Does not create reset cycles.
 * Does not change currentDay, streak, completions, or today flags.
 */
export async function syncJournalWithCloud(input: {
  userId: string | null;
  repository: ResetRepository;
  ownership: SyncOwnership;
  gateway: JournalCloudGateway;
  ensureCycleId?: () => Promise<string | null>;
}): Promise<JournalSyncRun> {
  if (!input.userId) {
    return { kind: 'skipped' };
  }

  const ownerUserId = input.ownership.ownerUserId;
  const snapshot = input.repository.getSnapshot();
  const localReflections = snapshot.reflections ?? [];

  if (ownerUserId !== null && ownerUserId !== input.userId && hasLocalJournal(localReflections)) {
    return {
      kind: 'conflict',
      message:
        'This device has journal entries from another account. Cloud journal backup is paused.',
    };
  }

  if (ownerUserId !== null && ownerUserId !== input.userId) {
    return { kind: 'skipped' };
  }

  let cycleId: string | null;
  try {
    cycleId = await input.gateway.fetchCycle1Id(input.userId);
    if (!cycleId && input.ensureCycleId) {
      cycleId = await input.ensureCycleId();
    }
  } catch (error) {
    if (isNetworkError(error)) {
      return { kind: 'offline' };
    }
    return {
      kind: 'error',
      message: error instanceof Error ? error.message : 'Journal backup failed.',
    };
  }

  if (!cycleId) {
    return { kind: 'skipped' };
  }

  let cloud: CloudJournalRow[];
  try {
    cloud = await input.gateway.fetchEntries(input.userId, cycleId);
  } catch (error) {
    if (isNetworkError(error)) {
      return { kind: 'offline' };
    }
    return {
      kind: 'error',
      message: error instanceof Error ? error.message : 'Journal backup failed.',
    };
  }

  const localHas = hasLocalJournal(localReflections);
  const cloudHas = cloud.length > 0;

  if (!localHas && !cloudHas) {
    return { kind: 'skipped', cycleId };
  }

  if (localHas && !cloudHas) {
    const uploads = localReflections
      .map((entry) => mapReflectionToCloud(entry, cycleId))
      .filter((row): row is NonNullable<typeof row> => row !== null);
    try {
      const uploaded = await input.gateway.upsertEntries(input.userId, uploads);
      const days = new Set(uploaded.map((row) => row.localDay));
      if (days.size !== uploads.length) {
        return { kind: 'error', message: 'Journal backup could not be verified.', cycleId };
      }
      return { kind: 'upload', cycleId };
    } catch (error) {
      if (isNetworkError(error)) {
        return { kind: 'offline' };
      }
      return {
        kind: 'error',
        message: error instanceof Error ? error.message : 'Journal backup failed.',
      };
    }
  }

  if (!localHas && cloudHas) {
    writeReflectionsOnly(input.repository, cloud.map(mapCloudToReflection));
    return { kind: 'restore', cycleId };
  }

  const merged = mergeJournalEntries(localReflections, cloud, cycleId);
  writeReflectionsOnly(input.repository, merged.reflections);

  if (merged.uploads.length > 0) {
    try {
      await input.gateway.upsertEntries(input.userId, merged.uploads);
    } catch (error) {
      if (isNetworkError(error)) {
        return { kind: 'offline', cycleId };
      }
      return {
        kind: 'error',
        message: error instanceof Error ? error.message : 'Journal backup failed.',
      };
    }
  }

  if (merged.kind === 'ambiguous') {
    return { kind: 'conflict', message: merged.message, cycleId };
  }

  return { kind: merged.uploads.length > 0 ? 'merge' : 'in-sync', cycleId };
}
