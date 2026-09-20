import type { ResetPersonalization, ResetSnapshot, TodayTask } from '../types';
import { getTaskForDay } from './getTaskForDay';
import {
  migrateResetPersistState,
  partializeResetState,
  RESET_PERSIST_KEY,
  RESET_PERSIST_VERSION,
} from './resetPersist';

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
    ...overrides,
  };
}

const persistedTask: TodayTask = getTaskForDay(4, personalization());

const v1Shape: ResetSnapshot = {
  currentDay: 4,
  completedDays: [1, 2],
  todayCompleted: false,
  todayStarted: true,
  todayTask: persistedTask,
  resetStartedOn: '2026-09-16',
  lastSeenOn: '2026-09-19',
  lastCompletedOn: '2026-09-17',
  streak: 2,
  missedYesterday: true,
  resetTypeId: 'soft-restarter',
  profileAccuracy: 'mostly',
  personalization: personalization(),
  reflections: [
    {
      day: 1,
      date: '2026-09-16',
      mood: 3,
      prompt: 'how did it feel?',
      text: 'quiet',
      savedAt: '2026-09-16T20:00:00.000Z',
    },
  ],
};

check('persist key stays gently-reset-daily', RESET_PERSIST_KEY === 'gently-reset-daily');
check('persist version stays 1', RESET_PERSIST_VERSION === 1);

const persisted = partializeResetState(v1Shape);
check('partialize keeps currentDay', persisted.currentDay === 4);
check('partialize keeps completedDays', persisted.completedDays.join(',') === '1,2');
check('partialize keeps resetTypeId', persisted.resetTypeId === 'soft-restarter');
check('partialize keeps personalization', persisted.personalization.dailyCommitment === 'ten');
check('partialize keeps reflections', persisted.reflections.length === 1);
check('partialize keeps resetStartedOn', persisted.resetStartedOn === '2026-09-16');
check('partialize keeps lastSeenOn', persisted.lastSeenOn === '2026-09-19');
check('partialize keeps lastCompletedOn', persisted.lastCompletedOn === '2026-09-17');
check('partialize keeps streak', persisted.streak === 2);
check('partialize keeps missedYesterday', persisted.missedYesterday === true);
check('partialize keeps todayTask', persisted.todayTask.title === persistedTask.title);
check('partialize keeps todayStarted', persisted.todayStarted === true);
check('partialize keeps todayCompleted', persisted.todayCompleted === false);
check('partialize keeps profileAccuracy', persisted.profileAccuracy === 'mostly');

const hydrated = migrateResetPersistState(v1Shape);
check('hydrate keeps currentDay', hydrated.currentDay === 4);
check('hydrate keeps completedDays', (hydrated.completedDays ?? []).join(',') === '1,2');
check('hydrate keeps resetTypeId', hydrated.resetTypeId === 'soft-restarter');
check(
  'hydrate keeps personalization',
  hydrated.personalization?.dailyCommitment === 'ten' &&
    hydrated.personalization?.desiredFeelings.join(',') === 'calm',
);
check('hydrate keeps reflections', (hydrated.reflections ?? []).length === 1);
check('hydrate keeps resetStartedOn', hydrated.resetStartedOn === '2026-09-16');
check('hydrate keeps lastSeenOn', hydrated.lastSeenOn === '2026-09-19');
check('hydrate keeps lastCompletedOn', hydrated.lastCompletedOn === '2026-09-17');
check('hydrate keeps streak', hydrated.streak === 2);
check('hydrate keeps missedYesterday', hydrated.missedYesterday === true);
check('hydrate does not silently reset users', hydrated.currentDay !== 1);

const withoutReflections = migrateResetPersistState({
  currentDay: 6,
  completedDays: [1, 2, 3],
  resetTypeId: 'almost-starter',
  todayTask: persistedTask,
  resetStartedOn: '2026-09-10',
  lastSeenOn: '2026-09-19',
  lastCompletedOn: '2026-09-14',
  streak: 1,
  missedYesterday: false,
  personalization: personalization(),
});
check(
  'migrate fills missing reflections with []',
  Array.isArray(withoutReflections.reflections) && withoutReflections.reflections.length === 0,
);
check(
  'migrate does not wipe progress when filling reflections',
  withoutReflections.currentDay === 6 &&
    (withoutReflections.completedDays ?? []).join(',') === '1,2,3' &&
    withoutReflections.resetTypeId === 'almost-starter',
);

const withAccuracy = migrateResetPersistState({
  ...v1Shape,
  profileAccuracy: 'scarily-accurate',
});
check(
  'migrate keeps a string profileAccuracy',
  withAccuracy.profileAccuracy === 'scarily-accurate',
);

const nonStringAccuracy = migrateResetPersistState({
  ...v1Shape,
  profileAccuracy: 12 as unknown as string,
});
check(
  'migrate drops a non-string profileAccuracy',
  nonStringAccuracy.profileAccuracy === undefined,
);

const unknownType = migrateResetPersistState({
  ...v1Shape,
  resetTypeId: 'unknown-old-type',
});
check(
  'migrate does not reclassify an unknown resetTypeId',
  unknownType.resetTypeId === 'unknown-old-type',
);
check(
  'migrate is not destructive',
  unknownType.currentDay === 4 &&
    (unknownType.completedDays ?? []).join(',') === '1,2' &&
    unknownType.todayTask?.title === persistedTask.title &&
    unknownType.streak === 2,
);

if (failed > 0) {
  throw new Error(`${failed} reset-persist check(s) failed`);
}

console.log('\nall reset-persist checks passed');
