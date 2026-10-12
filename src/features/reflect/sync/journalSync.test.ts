import {
  createResetRepositoryFromAccessors,
  pickResetSnapshot,
  type ResetRepository,
} from '../../../application/reset/ResetRepository';
import { saveReflection } from '../../../application/journal/saveReflection';
import type { JournalEntry, ResetPersonalization, ResetSnapshot } from '../../reset/types';
import { getTaskForDay } from '../../reset/utils/getTaskForDay';
import { INITIAL_SYNC_OWNERSHIP, ResetSyncNetworkError } from '../../reset/sync/types';
import { syncJournalWithCloud } from './createJournalSyncService';
import { mapReflectionToCloud } from './mapJournal';
import { mergeJournalEntries } from './mergeJournal';
import type { CloudJournalRow, CloudJournalWrite, JournalCloudGateway } from './types';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function personalization(): ResetPersonalization {
  return { desiredFeelings: ['calm'], dailyCommitment: 'ten' };
}

function snapshot(overrides: Partial<ResetSnapshot> = {}): ResetSnapshot {
  const nextPersonalization = overrides.personalization ?? personalization();
  const currentDay = overrides.currentDay ?? 3;
  return {
    currentDay,
    completedDays: [1, 2],
    todayCompleted: false,
    todayStarted: true,
    todayTask: getTaskForDay(currentDay, nextPersonalization),
    resetStartedOn: '2026-09-25',
    lastSeenOn: '2026-09-27',
    lastCompletedOn: '2026-09-26',
    streak: 2,
    missedYesterday: false,
    resetTypeId: 'soft-restarter',
    personalization: nextPersonalization,
    reflections: [],
    ...overrides,
  };
}

function entry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    day: 3,
    date: '2026-09-27',
    mood: 3,
    prompt: 'how did it feel?',
    text: 'quiet morning',
    savedAt: '2026-09-27T15:00:00.000Z',
    ...overrides,
  };
}

function memoryRepository(initial: ResetSnapshot): ResetRepository {
  let current = pickResetSnapshot(initial);
  return createResetRepositoryFromAccessors(
    () => current,
    (next) => {
      current = pickResetSnapshot(next);
    },
  );
}

function cloudRow(write: CloudJournalWrite, updatedAt = write.savedAt): CloudJournalRow {
  return {
    ...write,
    id: `journal-${write.cycleId}-${write.calendarDate}`,
    userId: 'user-a',
    updatedAt,
  };
}

function createMemoryGateway(options: {
  cycleId?: string | null;
  entries?: CloudJournalRow[];
  offline?: boolean;
}): {
  gateway: JournalCloudGateway;
  fetchCount: () => number;
  upsertCount: () => number;
  getEntries: () => CloudJournalRow[];
} {
  let entries = [...(options.entries ?? [])];
  let fetchCount = 0;
  let upsertCount = 0;
  const cycleId = options.cycleId === undefined ? 'cycle-1' : options.cycleId;

  return {
    fetchCount: () => fetchCount,
    upsertCount: () => upsertCount,
    getEntries: () => entries,
    gateway: {
      async fetchCycle1Id() {
        if (options.offline) {
          throw new ResetSyncNetworkError('offline');
        }
        return cycleId;
      },
      async fetchEntries() {
        fetchCount += 1;
        if (options.offline) {
          throw new ResetSyncNetworkError('offline');
        }
        return [...entries];
      },
      async upsertEntries(_userId, incoming) {
        upsertCount += 1;
        if (options.offline) {
          throw new ResetSyncNetworkError('offline');
        }
        // Mirrors the table's unique (cycle_id, calendar_date).
        const byDate = new Map(entries.map((row) => [`${row.cycleId}|${row.calendarDate}`, row]));
        for (const row of incoming) {
          byDate.set(
            `${row.cycleId}|${row.calendarDate}`,
            cloudRow(row, '2026-09-27T16:00:00.000Z'),
          );
        }
        entries = [...byDate.values()];
        return incoming
          .map((row) => byDate.get(`${row.cycleId}|${row.calendarDate}`))
          .filter((row): row is CloudJournalRow => !!row);
      },
    },
  };
}

const cycleOneDayThree = mapReflectionToCloud(entry(), 'cycle-1');
const cycleTwoDayThree = mapReflectionToCloud(entry(), 'cycle-2');
check(
  'Cycle 1 Day 3 is keyed by cycle UUID',
  cycleOneDayThree?.cycleId === 'cycle-1' && cycleOneDayThree.localDay === 3,
);
check(
  'Day 3 is not a global identity',
  cycleOneDayThree?.cycleId !== cycleTwoDayThree?.cycleId &&
    cycleOneDayThree?.localDay === cycleTwoDayThree?.localDay,
);
check('photo_url is not uploaded', cycleOneDayThree?.photoUrl === null);

{
  const afterJournal = saveReflection(
    snapshot({ todayCompleted: false, todayStarted: false, completedDays: [], currentDay: 1 }),
    { mood: 4, text: 'still optional', prompt: 'how did it feel?' },
    new Date('2026-09-19T12:00:00.000Z'),
  );
  check('journal save does not complete reset', afterJournal.todayCompleted === false);
  check('journal save does not start reset', afterJournal.todayStarted === false);
}

async function run(): Promise<void> {
  {
    const memory = createMemoryGateway({ cycleId: 'cycle-1', entries: [] });
    const repository = memoryRepository(snapshot({ reflections: [entry()] }));
    const result = await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    check('local journal + empty cloud uploads', result.kind === 'upload');
    check('uploaded one Cycle 1 Day 3 row', memory.getEntries().length === 1);
    check('upload keeps cycle UUID', memory.getEntries()[0]?.cycleId === 'cycle-1');
    const retry = await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    check('retry does not duplicate cycle_id + local_day', memory.getEntries().length === 1);
    check(
      'retry is in-sync or merge without extra rows',
      retry.kind === 'in-sync' || retry.kind === 'merge',
    );
  }

  {
    const local = snapshot({
      currentDay: 8,
      streak: 4,
      completedDays: [1, 2, 3, 4],
      reflections: [],
    });
    const mapped = mapReflectionToCloud(entry({ day: 3, text: 'from the cloud' }), 'cycle-1');
    const memory = createMemoryGateway({
      cycleId: 'cycle-1',
      entries: mapped ? [cloudRow(mapped, '2026-09-26T12:00:00.000Z')] : [],
    });
    const repository = memoryRepository(local);
    const before = pickResetSnapshot(repository.getSnapshot());
    const result = await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    const after = repository.getSnapshot();
    check('empty local + cloud journal restores', result.kind === 'restore');
    check('restore writes journal text', after.reflections[0]?.text === 'from the cloud');
    check('journal restore does not modify currentDay', after.currentDay === before.currentDay);
    check('journal restore does not modify streak', after.streak === before.streak);
    check(
      'journal restore does not modify completedDays',
      after.completedDays.join(',') === before.completedDays.join(','),
    );
    check(
      'journal restore does not complete today',
      after.todayCompleted === before.todayCompleted,
    );
    check('journal restore does not start today', after.todayStarted === before.todayStarted);
  }

  {
    const older = entry({ text: 'older local', savedAt: '2026-09-27T10:00:00.000Z' });
    const newerCloud = mapReflectionToCloud(entry({ text: 'newer cloud' }), 'cycle-1');
    const memory = createMemoryGateway({
      cycleId: 'cycle-1',
      entries: newerCloud ? [cloudRow(newerCloud, '2026-09-27T18:00:00.000Z')] : [],
    });
    const repository = memoryRepository(snapshot({ reflections: [older] }));
    await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    check(
      'same day keeps the later cloud entry',
      repository.getSnapshot().reflections[0]?.text === 'newer cloud',
    );
  }

  {
    const newer = entry({ text: 'newer local', savedAt: '2026-09-27T19:00:00.000Z' });
    const olderCloud = mapReflectionToCloud(entry({ text: 'older cloud' }), 'cycle-1');
    const memory = createMemoryGateway({
      cycleId: 'cycle-1',
      entries: olderCloud ? [cloudRow(olderCloud, '2026-09-27T11:00:00.000Z')] : [],
    });
    const repository = memoryRepository(snapshot({ reflections: [newer] }));
    await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    check(
      'same day keeps the later local entry',
      repository.getSnapshot().reflections[0]?.text === 'newer local',
    );
    check('later local is uploaded once', memory.getEntries().length === 1);
  }

  {
    const sameTime = '2026-09-27T12:00:00.000Z';
    const local = entry({ text: 'keep local on equal time', savedAt: sameTime });
    const cloudMapped = mapReflectionToCloud(entry({ text: 'cloud same timestamp' }), 'cycle-1');
    const memory = createMemoryGateway({
      cycleId: 'cycle-1',
      entries: cloudMapped ? [cloudRow(cloudMapped, sameTime)] : [],
    });
    const repository = memoryRepository(snapshot({ reflections: [local] }));
    await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    check(
      'equal timestamps keep the local text',
      repository.getSnapshot().reflections[0]?.text === 'keep local on equal time',
    );
    check('equal timestamps do not create a second row', memory.getEntries().length === 1);
    check('equal timestamps do not re-upload', memory.upsertCount() === 0);
  }

  {
    const memory = createMemoryGateway({ offline: true });
    const repository = memoryRepository(snapshot({ reflections: [entry()] }));
    const before = pickResetSnapshot(repository.getSnapshot());
    const result = await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    check('offline journal sync is recorded', result.kind === 'offline');
    check(
      'offline save leaves local journal intact',
      repository.getSnapshot().reflections[0]?.text === before.reflections[0]?.text,
    );
  }

  {
    const offline = createMemoryGateway({ cycleId: 'cycle-1', entries: [], offline: true });
    const repository = memoryRepository(
      snapshot({ reflections: [entry({ text: 'written offline' })] }),
    );
    await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: offline.gateway,
    });
    const online = createMemoryGateway({ cycleId: 'cycle-1', entries: [] });
    const reconnect = await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: online.gateway,
    });
    check('reconnect uploads the offline entry', reconnect.kind === 'upload');
    check('reconnect stored the offline text', online.getEntries()[0]?.body === 'written offline');
  }

  {
    const memory = createMemoryGateway({ cycleId: 'cycle-1', entries: [] });
    const repository = memoryRepository(snapshot({ reflections: [entry()] }));
    const result = await syncJournalWithCloud({
      userId: 'user-b',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: memory.gateway,
    });
    check('User A journal + User B login does not upload', result.kind === 'conflict');
    check('cross-account journal does not upsert', memory.upsertCount() === 0);
  }

  {
    const memory = createMemoryGateway({ cycleId: null, entries: [] });
    const repository = memoryRepository(snapshot({ reflections: [entry()] }));
    let ensured = false;
    const result = await syncJournalWithCloud({
      userId: 'user-a',
      repository,
      ownership: { ...INITIAL_SYNC_OWNERSHIP, ownerUserId: 'user-a' },
      gateway: {
        ...memory.gateway,
        async fetchCycle1Id() {
          return ensured ? 'cycle-1' : null;
        },
      },
      ensureCycleId: async () => {
        ensured = true;
        return 'cycle-1';
      },
    });
    check(
      'journal waits for ResetSyncService to provide Cycle 1',
      ensured && result.cycleId === 'cycle-1',
    );
  }

  {
    // A missed day: the plan day stays 3, so two dates share it.
    const missed = entry({ date: '2026-09-27', text: 'missed day note' });
    const nextDay = entry({
      date: '2026-09-28',
      text: 'next day note',
      savedAt: '2026-09-28T15:00:00.000Z',
    });
    const merged = mergeJournalEntries([missed, nextDay], [], 'cycle-1');
    check(
      'a missed day and the next day both survive the merge',
      merged.reflections.length === 2 &&
        merged.reflections[0]?.text === 'missed day note' &&
        merged.reflections[1]?.text === 'next day note',
    );
    check(
      'both upload as separate rows, one per date',
      merged.uploads.length === 2 &&
        merged.uploads[0]?.calendarDate !== merged.uploads[1]?.calendarDate,
    );
    const fromCloud = mergeJournalEntries(
      [],
      merged.uploads.map((write) => cloudRow(write)),
      'cycle-1',
    );
    check(
      'restoring from the cloud brings both entries back',
      fromCloud.reflections.length === 2 && fromCloud.uploads.length === 0,
    );
    check(
      'an entry with no valid date stays on the device instead of uploading',
      mapReflectionToCloud(entry({ date: '' }), 'cycle-1') === null,
    );
  }

  if (failed > 0) {
    throw new Error(`${failed} journal sync check(s) failed`);
  }
  console.log('\nall journal sync checks passed');
}

void run();
