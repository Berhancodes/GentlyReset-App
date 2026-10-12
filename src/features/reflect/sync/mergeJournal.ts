import type { JournalEntry } from '../../reset/types';
import { compareJournalEntries, journalEntryKey } from '../../reset/utils/journalEntryKey';
import { cloudJournalKey, mapCloudToReflection, mapReflectionToCloud } from './mapJournal';
import type { CloudJournalRow, CloudJournalWrite } from './types';

export type JournalMergeSuccess = {
  kind: 'merged';
  reflections: JournalEntry[];
  uploads: CloudJournalWrite[];
};

export type JournalMergeAmbiguous = {
  kind: 'ambiguous';
  reflections: JournalEntry[];
  uploads: CloudJournalWrite[];
  message: string;
};

export type JournalMergeResult = JournalMergeSuccess | JournalMergeAmbiguous;

function timestampMs(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function laterEntry(
  local: JournalEntry | undefined,
  cloud: CloudJournalRow | undefined,
): { entry: JournalEntry; source: 'local' | 'cloud' | 'same' | 'ambiguous' } | null {
  if (local && !cloud) {
    return { entry: local, source: 'local' };
  }
  if (cloud && !local) {
    return { entry: mapCloudToReflection(cloud), source: 'cloud' };
  }
  if (!local || !cloud) {
    return null;
  }

  const localMs = timestampMs(local.savedAt);
  const cloudMs = timestampMs(cloud.updatedAt);
  if (localMs === null && cloudMs === null) {
    return { entry: local, source: 'ambiguous' };
  }
  if (localMs === null) {
    return { entry: mapCloudToReflection(cloud), source: 'cloud' };
  }
  if (cloudMs === null) {
    return { entry: local, source: 'local' };
  }
  if (cloudMs > localMs) {
    return { entry: mapCloudToReflection(cloud), source: 'cloud' };
  }
  if (localMs > cloudMs) {
    return { entry: local, source: 'local' };
  }
  return { entry: local, source: 'same' };
}

/**
 * One reflection per calendar date (so a missed day's entry survives next to
 * the one after it). Later savedAt / updated_at wins. Does not concatenate text.
 */
export function mergeJournalEntries(
  local: readonly JournalEntry[],
  cloud: readonly CloudJournalRow[],
  cycleId: string,
): JournalMergeResult {
  const localByKey = new Map<string, JournalEntry>();
  for (const entry of local) {
    localByKey.set(journalEntryKey(entry), entry);
  }
  const cloudByKey = new Map<string, CloudJournalRow>();
  for (const row of cloud) {
    cloudByKey.set(cloudJournalKey(row), row);
  }

  const keys = [...new Set([...localByKey.keys(), ...cloudByKey.keys()])];
  const reflections: JournalEntry[] = [];
  const uploads: CloudJournalWrite[] = [];
  let ambiguous = false;

  for (const key of keys) {
    const chosen = laterEntry(localByKey.get(key), cloudByKey.get(key));
    if (!chosen) {
      continue;
    }
    reflections.push(chosen.entry);
    if (chosen.source === 'ambiguous') {
      ambiguous = true;
      continue;
    }
    if (chosen.source === 'local') {
      const mapped = mapReflectionToCloud(chosen.entry, cycleId);
      if (mapped) {
        uploads.push(mapped);
      }
    }
  }

  reflections.sort(compareJournalEntries);

  if (ambiguous) {
    return {
      kind: 'ambiguous',
      reflections,
      uploads,
      message: 'A journal day could not compare save times safely, so the local text was kept.',
    };
  }

  return { kind: 'merged', reflections, uploads };
}
