import {
  createResetRepositoryFromAccessors,
  pickResetSnapshot,
  type ResetRepository,
} from '../../../application/reset/ResetRepository';
import type { ResetPersonalization, ResetSnapshot } from '../types';
import { getTaskForDay } from '../utils/getTaskForDay';
import { laterCalendarDate } from './calendarDate';
import { syncResetWithCloud } from './createResetSyncService';
import {
  COMPLETION_DATE_RULE,
  mapCompletedDaysToCloud,
  mapSnapshotToCloudPayload,
} from './mapSnapshotToCloud';
import { hasMeaningfulReset } from './hasMeaningfulReset';
import type {
  CloudCompletionRow,
  CloudCompletionWrite,
  CloudCycleRecord,
  CloudCycleWrite,
  ResetCloudGateway,
  SyncOwnership,
} from './types';
import { INITIAL_SYNC_OWNERSHIP, ResetSyncNetworkError } from './types';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function personalization(overrides: Partial<ResetPersonalization> = {}): ResetPersonalization {
  return {
    desiredFeelings: ['calm'],
    dailyCommitment: 'ten',
    supportStyle: 'be-gentle',
    primaryObstacle: 'too-much',
    ...overrides,
  };
}

function snapshot(overrides: Partial<ResetSnapshot> = {}): ResetSnapshot {
  const nextPersonalization = overrides.personalization ?? personalization();
  const currentDay = overrides.currentDay ?? 1;
  return {
    currentDay,
    completedDays: [],
    todayCompleted: false,
    todayStarted: false,
    todayTask: getTaskForDay(currentDay, nextPersonalization),
    resetStartedOn: null,
    lastSeenOn: null,
    lastCompletedOn: null,
    streak: 0,
    missedYesterday: false,
    resetTypeId: '',
    personalization: nextPersonalization,
    reflections: [],
    ...overrides,
  };
}

function ownership(overrides: Partial<SyncOwnership> = {}): SyncOwnership {
  return { ...INITIAL_SYNC_OWNERSHIP, ...overrides };
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

function cloudRecord(
  cycle: Partial<CloudCycleWrite> & { userId?: string; id?: string },
  completions: CloudCompletionWrite[],
): CloudCycleRecord {
  const personalizationValue = cycle.personalization ?? personalization();
  const currentDay = cycle.currentDay ?? 1;
  return {
    cycle: {
      id: cycle.id ?? 'cycle-1',
      userId: cycle.userId ?? 'user-a',
      sequence: 1,
      planId: cycle.planId ?? 'foundation-reset',
      planVersion: cycle.planVersion ?? 1,
      currentDay,
      todayStarted: cycle.todayStarted ?? false,
      todayCompleted: cycle.todayCompleted ?? false,
      resetStartedOn: cycle.resetStartedOn ?? '2026-09-10',
      lastSeenOn: cycle.lastSeenOn ?? '2026-09-27',
      lastCompletedOn: cycle.lastCompletedOn ?? null,
      streak: cycle.streak ?? 0,
      missedYesterday: cycle.missedYesterday ?? false,
      resetTypeId: cycle.resetTypeId ?? 'soft-restarter',
      personalization: personalizationValue,
      profileAccuracy: cycle.profileAccuracy ?? 'mostly',
      status: 'active',
      completedAt: null,
    },
    completions: completions.map((row) => ({
      id: `completion-${row.localDay}`,
      userId: cycle.userId ?? 'user-a',
      cycleId: cycle.id ?? 'cycle-1',
      localDay: row.localDay,
      completedOn: row.completedOn,
    })),
  };
}

function createMemoryGateway(options: {
  record?: CloudCycleRecord | null;
  timeZone?: string;
  offlineOnFetch?: boolean;
  offlineOnUpload?: boolean;
}): {
  gateway: ResetCloudGateway;
  fetchCount: () => number;
  uploadCount: () => number;
  getRecord: () => CloudCycleRecord | null;
} {
  let record = options.record ?? null;
  let fetchCount = 0;
  let uploadCount = 0;

  return {
    fetchCount: () => fetchCount,
    uploadCount: () => uploadCount,
    getRecord: () => record,
    gateway: {
      async fetchContext() {
        fetchCount += 1;
        if (options.offlineOnFetch) {
          throw new ResetSyncNetworkError('offline');
        }
        return { timeZone: options.timeZone ?? 'UTC', record };
      },
      async uploadCycle1(userId, cycle, completions, existingCycleId) {
        uploadCount += 1;
        if (options.offlineOnUpload) {
          throw new ResetSyncNetworkError('offline');
        }
        const cycleId = existingCycleId ?? record?.cycle.id ?? 'cycle-1';
        const existingByDay = new Map<number, CloudCompletionRow>();
        for (const row of record?.completions ?? []) {
          existingByDay.set(row.localDay, row);
        }
        for (const row of completions) {
          const previous = existingByDay.get(row.localDay);
          existingByDay.set(row.localDay, {
            id: previous?.id ?? `completion-${row.localDay}`,
            userId,
            cycleId,
            localDay: row.localDay,
            completedOn: laterCalendarDate(row.completedOn, previous?.completedOn ?? null),
          });
        }
        record = {
          cycle: {
            ...cycle,
            id: cycleId,
            userId,
          },
          completions: [...existingByDay.values()].sort(
            (left, right) => left.localDay - right.localDay,
          ),
        };
        return record;
      },
    },
  };
}

const day17Local = snapshot({
  currentDay: 17,
  completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  todayStarted: true,
  todayCompleted: false,
  resetStartedOn: '2026-09-10',
  lastSeenOn: '2026-09-27',
  lastCompletedOn: '2026-09-24',
  streak: 3,
  missedYesterday: true,
  resetTypeId: 'soft-restarter',
  profileAccuracy: 'mostly',
  reflections: [
    {
      day: 3,
      date: '2026-09-12',
      mood: 3,
      prompt: 'how did it feel?',
      text: 'quiet local journal',
      savedAt: '2026-09-12T20:00:00.000Z',
    },
  ],
});

check('empty Day 1 defaults are not meaningful', !hasMeaningfulReset(snapshot()));
check('Day 17 progress is meaningful', hasMeaningfulReset(day17Local));

const mapped = mapSnapshotToCloudPayload(day17Local);
check('Cycle 1 sequence is 1', mapped.cycle.sequence === 1);
check(
  'plan stays foundation-reset v1',
  mapped.cycle.planId === 'foundation-reset' && mapped.cycle.planVersion === 1,
);
check('currentDay stays 17, not an overall day', mapped.cycle.currentDay === 17);
check('todayTask is not uploaded', !('todayTask' in mapped.cycle));
check('reflections are not uploaded', !('reflections' in mapped.cycle));
check('acknowledgedDay is not uploaded', !('acknowledgedDay' in mapped.cycle));
check('payload JSON omits todayTask', !JSON.stringify(mapped).includes('todayTask'));
check('payload JSON omits reflections', !JSON.stringify(mapped).includes('reflections'));
check('payload JSON omits acknowledgedDay', !JSON.stringify(mapped).includes('acknowledgedDay'));
check(
  'historical completion dates stay null',
  mapped.completions.filter((row) => row.localDay < 14).every((row) => row.completedOn === null),
);
check(
  'latest completed day may keep lastCompletedOn',
  mapped.completions.find((row) => row.localDay === 14)?.completedOn === '2026-09-24',
);
check('completion date rule is documented', COMPLETION_DATE_RULE.includes('NULL'));
check(
  'currentDay 99 clamps to 30',
  mapSnapshotToCloudPayload(snapshot({ currentDay: 99, resetTypeId: 'soft-restarter' })).cycle
    .currentDay === 30,
);

const unknownDates = mapCompletedDaysToCloud([1, 2, 3], null);
check(
  'unknown historical completion date remains null',
  unknownDates.length === 3 && unknownDates.every((row) => row.completedOn === null),
);

async function run(): Promise<void> {
  {
    const memory = createMemoryGateway({ record: null });
    const repository = memoryRepository(day17Local);
    const first = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership(),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    const retry = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: first.ownership,
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:01:00.000Z'),
    });
    const saved = memory.getRecord();
    check('local data / empty cloud uploads Cycle 1', first.kind === 'first-backup');
    check('first backup does not clear local data', repository.getSnapshot().currentDay === 17);
    check(
      'first backup keeps local journal',
      repository.getSnapshot().reflections[0]?.text === 'quiet local journal',
    );
    check('uploaded cycle sequence is 1', saved?.cycle.sequence === 1);
    check('uploaded currentDay is 17', saved?.cycle.currentDay === 17);
    check('uploaded completions cover 14 days', saved?.completions.length === 14);
    check('retry upload does not create a duplicate cycle', saved?.cycle.id === 'cycle-1');
    check('retry completion does not duplicate rows', saved?.completions.length === 14);
    check('retry after first backup is in-sync', retry.kind === 'in-sync');
  }

  {
    const cloud = cloudRecord(
      {
        currentDay: 17,
        resetTypeId: 'soft-restarter',
        personalization: personalization({ dailyCommitment: 'twenty' }),
        lastCompletedOn: '2026-09-24',
      },
      [
        ...Array.from({ length: 14 }, (_, index) => ({
          localDay: index + 1,
          completedOn: index === 13 ? '2026-09-24' : null,
        })),
      ],
    );
    const memory = createMemoryGateway({ record: cloud });
    const repository = memoryRepository(snapshot());
    const result = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership(),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    const restored = repository.getSnapshot();
    check('empty local / cloud data restores cloud', result.kind === 'restore');
    check('restored currentDay is 17', restored.currentDay === 17);
    check(
      'restored completedDays are 1-14',
      restored.completedDays.join(',') === '1,2,3,4,5,6,7,8,9,10,11,12,13,14',
    );
    check('restored reset type is preserved', restored.resetTypeId === 'soft-restarter');
    check(
      'restored personalization is preserved',
      restored.personalization.dailyCommitment === 'twenty',
    );
    check('restored todayTask is re-derived', restored.todayTask.day === 17);
    check('restore does not invent journal rows', restored.reflections.length === 0);
  }

  {
    const cloud = cloudRecord(
      {
        currentDay: 17,
        lastSeenOn: '2026-09-27',
        lastCompletedOn: '2026-09-24',
        resetTypeId: 'soft-restarter',
      },
      [
        { localDay: 1, completedOn: null },
        { localDay: 16, completedOn: null },
      ],
    );
    const memory = createMemoryGateway({ record: cloud });
    const repository = memoryRepository(
      snapshot({
        currentDay: 14,
        completedDays: [1, 2, 14],
        lastSeenOn: '2026-09-27',
        lastCompletedOn: '2026-09-23',
        resetStartedOn: '2026-09-10',
        resetTypeId: 'soft-restarter',
      }),
    );
    const result = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership({ ownerUserId: 'user-a' }),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    const mergedDays = repository.getSnapshot().completedDays;
    check('local + cloud completions union without rewind kind', result.kind === 'merge');
    check(
      'local + cloud completions union without duplicates',
      mergedDays.join(',') === '1,2,14,16',
    );
  }

  {
    const cloud = cloudRecord(
      { currentDay: 20, lastSeenOn: '2026-09-27', resetTypeId: 'soft-restarter' },
      [{ localDay: 1, completedOn: null }],
    );
    const memory = createMemoryGateway({ record: cloud });
    const repository = memoryRepository(
      snapshot({
        currentDay: 12,
        completedDays: [1],
        lastSeenOn: '2026-09-27',
        resetStartedOn: '2026-09-10',
        resetTypeId: 'soft-restarter',
      }),
    );
    await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership({ ownerUserId: 'user-a' }),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check(
      'cloud currentDay greater does not rewind cloud',
      repository.getSnapshot().currentDay === 20,
    );
  }

  {
    const cloud = cloudRecord(
      { currentDay: 12, lastSeenOn: '2026-09-27', resetTypeId: 'soft-restarter' },
      [{ localDay: 1, completedOn: null }],
    );
    const memory = createMemoryGateway({ record: cloud });
    const repository = memoryRepository(
      snapshot({
        currentDay: 19,
        completedDays: [1, 18],
        lastSeenOn: '2026-09-27',
        resetStartedOn: '2026-09-10',
        resetTypeId: 'soft-restarter',
      }),
    );
    await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership({ ownerUserId: 'user-a' }),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check(
      'local currentDay greater can advance cloud',
      memory.getRecord()?.cycle.currentDay === 19,
    );
    check('local currentDay greater stays 19 locally', repository.getSnapshot().currentDay === 19);
  }

  {
    const memory = createMemoryGateway({ record: null, offlineOnFetch: true });
    const repository = memoryRepository(day17Local);
    const before = pickResetSnapshot(repository.getSnapshot());
    const result = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership(),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check('offline sync failure is recorded', result.kind === 'offline');
    check(
      'offline sync failure leaves local state unchanged',
      JSON.stringify(repository.getSnapshot()) === JSON.stringify(before),
    );
  }

  {
    const memory = createMemoryGateway({ record: null });
    const repository = memoryRepository(day17Local);
    const result = await syncResetWithCloud({
      userId: null,
      repository,
      ownership: ownership(),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check('anonymous user does not sync', result.kind === 'skipped');
    check('anonymous user does not fetch cloud', memory.fetchCount() === 0);
    check('anonymous user does not upload', memory.uploadCount() === 0);
  }

  {
    const seededPersonalization = personalization({
      dailyCommitment: 'ten',
      supportStyle: 'be-gentle',
      primaryObstacle: 'too-much',
    });
    const preAccount = snapshot({
      currentDay: 1,
      completedDays: [],
      resetStartedOn: '2026-09-27',
      lastSeenOn: '2026-09-27',
      resetTypeId: 'soft-restarter',
      profileAccuracy: 'mostly',
      personalization: seededPersonalization,
      todayTask: getTaskForDay(1, seededPersonalization),
    });
    const before = pickResetSnapshot(preAccount);
    const memory = createMemoryGateway({ record: null });
    const repository = memoryRepository(preAccount);
    const result = await syncResetWithCloud({
      userId: 'user-new',
      repository,
      ownership: ownership(),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    const after = repository.getSnapshot();
    check(
      'pre-account local personalization + new account uploads Cycle 1',
      result.kind === 'first-backup',
    );
    check(
      'pre-account reset type is preserved',
      after.resetTypeId === 'soft-restarter' && after.resetTypeId === before.resetTypeId,
    );
    check(
      'pre-account personalization is preserved',
      after.personalization.dailyCommitment === 'ten' &&
        after.personalization.primaryObstacle === 'too-much',
    );
    check('pre-account currentDay stays 1', after.currentDay === 1);
    check(
      'new account is associated with local progress',
      result.ownership.ownerUserId === 'user-new',
    );
    check(
      'uploaded Cycle 1 keeps onboarding identity',
      memory.getRecord()?.cycle.resetTypeId === 'soft-restarter' &&
        memory.getRecord()?.cycle.personalization.dailyCommitment === 'ten',
    );
  }

  {
    const local = snapshot({
      currentDay: 6,
      completedDays: [1, 2, 3],
      lastSeenOn: '2026-09-27',
      lastCompletedOn: '2026-09-26',
      resetStartedOn: '2026-09-21',
      resetTypeId: 'soft-restarter',
    });
    const cloud = cloudRecord(
      {
        currentDay: 6,
        lastSeenOn: '2026-09-27',
        lastCompletedOn: '2026-09-26',
        resetStartedOn: '2026-09-21',
        resetTypeId: 'soft-restarter',
        todayStarted: false,
        todayCompleted: false,
      },
      [
        { localDay: 1, completedOn: null },
        { localDay: 2, completedOn: null },
        { localDay: 3, completedOn: '2026-09-26' },
      ],
    );
    const memory = createMemoryGateway({ record: cloud });
    const repository = memoryRepository(local);
    const result = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership({ ownerUserId: 'user-a' }),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check(
      'User A local ownership + User A login is normal sync',
      result.kind === 'in-sync' || result.kind === 'merge',
    );
    check('User A login does not conflict', result.kind !== 'conflict');
    check('User A login keeps ownership', result.ownership.ownerUserId === 'user-a');
    check(
      'User A login leaves local type intact',
      repository.getSnapshot().resetTypeId === 'soft-restarter',
    );
  }

  {
    const memory = createMemoryGateway({ record: null });
    const repository = memoryRepository(day17Local);
    const result = await syncResetWithCloud({
      userId: 'user-b',
      repository,
      ownership: ownership({ ownerUserId: 'user-a' }),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check('User A local ownership + User B login does not upload', result.kind === 'conflict');
    check('cross-account conflict code is set', result.conflictCode === 'cross-account');
    check('cross-account path does not fetch', memory.fetchCount() === 0);
    check('cross-account path does not upload', memory.uploadCount() === 0);
    check('cross-account leaves local Day 17 intact', repository.getSnapshot().currentDay === 17);
  }

  {
    const cloud = cloudRecord({ currentDay: 8, resetTypeId: 'almost-starter' }, [
      { localDay: 1, completedOn: null },
    ]);
    const memory = createMemoryGateway({ record: cloud });
    const repository = memoryRepository(
      snapshot({
        currentDay: 8,
        completedDays: [1],
        lastSeenOn: '2026-09-27',
        resetStartedOn: '2026-09-10',
        resetTypeId: 'soft-restarter',
      }),
    );
    const result = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership({ ownerUserId: 'user-a' }),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check('conflicting reset types stop instead of reclassifying', result.kind === 'conflict');
    check('unsafe merge does not upload', memory.uploadCount() === 0);
    check(
      'unsafe merge leaves local type intact',
      repository.getSnapshot().resetTypeId === 'soft-restarter',
    );
  }

  {
    const cloud = cloudRecord(
      {
        currentDay: 5,
        resetStartedOn: '2026-09-20',
        lastSeenOn: '2026-09-24',
        resetTypeId: 'quiet-drain',
      },
      [{ localDay: 1, completedOn: '2026-09-20' }],
    );
    const mapped = mapSnapshotToCloudPayload(
      snapshot({
        currentDay: 5,
        resetStartedOn: '2026-09-20',
        lastSeenOn: '2026-09-24',
        resetTypeId: 'all-in-heart',
        completedDays: [1],
      }),
    );
    check(
      'new reset type ids round-trip as text',
      mapped.cycle.resetTypeId === 'all-in-heart' && mapped.cycle.planVersion === 1,
    );
    check(
      'task catalog is not uploaded',
      !JSON.stringify(mapped).includes('primitiveId') &&
        !JSON.stringify(mapped).includes('TYPE_PLAYLISTS'),
    );
    const memory = createMemoryGateway({ record: cloud });
    const repository = memoryRepository(snapshot());
    const result = await syncResetWithCloud({
      userId: 'user-a',
      repository,
      ownership: ownership(),
      gateway: memory.gateway,
      now: new Date('2026-09-27T15:00:00.000Z'),
    });
    check('new type ids restore from cloud', result.kind === 'restore');
    check(
      'quiet-drain is preserved through restore',
      repository.getSnapshot().resetTypeId === 'quiet-drain',
    );
  }

  if (failed > 0) {
    throw new Error(`${failed} reset sync check(s) failed`);
  }

  console.log('\nall reset sync checks passed');
}

void run();
