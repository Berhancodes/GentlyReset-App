import {
  completeResetDay as completeResetDayOnRepository,
  processDateRollover as processDateRolloverOnRepository,
  saveReflection as saveReflectionOnRepository,
  startReset as startResetOnRepository,
  startResetDay as startResetDayOnRepository,
} from '../../application/createResetApplication';
import { saveReflection } from '../../application/journal/saveReflection';
import { completeResetDay } from '../../application/reset/completeResetDay';
import { processDateRollover } from '../../application/reset/processDateRollover';
import {
  createResetRepositoryFromAccessors,
  pickResetSnapshot,
} from '../../application/reset/ResetRepository';
import { startReset } from '../../application/reset/startReset';
import { startResetDay } from '../../application/reset/startResetDay';
import type { OnboardingAnswer } from '../../features/onboarding/types/onboarding';
import { PLAN_DAY_COUNT } from '../../features/reset/data/thirtyDayPlan';
import type { ResetPersonalization, ResetSnapshot } from '../../features/reset/types';
import { parseLocalDateKey } from '../../features/reset/utils/calendar';
import { getTaskForDay } from '../../features/reset/utils/getTaskForDay';
import { RESET_PERSIST_KEY, RESET_PERSIST_VERSION } from '../../features/reset/utils/resetPersist';
import { createLocalResetRepository } from './createLocalResetRepository';
import { createInMemoryResetRepository } from './InMemoryResetRepository';

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
    desiredFeelings: [],
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
    resetStartedOn: '2026-09-19',
    lastSeenOn: '2026-09-19',
    lastCompletedOn: null,
    streak: 0,
    missedYesterday: false,
    resetTypeId: 'soft-restarter',
    personalization: nextPersonalization,
    reflections: [],
    ...overrides,
  };
}

function dateOn(key: string): Date {
  return parseLocalDateKey(key);
}

function sameObservable(left: ResetSnapshot, right: ResetSnapshot): boolean {
  return JSON.stringify(pickResetSnapshot(left)) === JSON.stringify(pickResetSnapshot(right));
}

function single(optionId: string): OnboardingAnswer {
  return { type: 'singleChoice', optionId };
}

function multi(optionIds: readonly string[]): OnboardingAnswer {
  return { type: 'multiChoice', optionIds };
}

function text(value: string): OnboardingAnswer {
  return { type: 'textInput', value };
}

const RESTARTER_ANSWERS: Record<string, OnboardingAnswer> = {
  changePattern: single('bad-day-week'),
  consistencyStage: single('restarting'),
  dailyCommitment: single('ten'),
  supportStyle: single('be-gentle'),
  primaryObstacle: multi(['afraid-wont-stick']),
  resetReason: text('I keep starting over after a bad day'),
  desiredFeelings: multi(['calm', 'present']),
  missedDayResponse: single('be-kind'),
  profileAccuracy: single('mostly'),
};

check('persist key stays gently-reset-daily', RESET_PERSIST_KEY === 'gently-reset-daily');
check('persist version stays 1', RESET_PERSIST_VERSION === 1);

const idle = snapshot();
const memory = createInMemoryResetRepository(idle);

check(
  'A. read — in-memory repository returns the current ResetSnapshot',
  sameObservable(memory.getSnapshot(), idle),
);

const written = snapshot({
  currentDay: 4,
  completedDays: [1, 2],
  todayStarted: true,
  resetTypeId: 'fading-flame',
  streak: 2,
});
memory.saveSnapshot(written);
check(
  'B. write — saving a snapshot produces the expected local state',
  sameObservable(memory.getSnapshot(), written),
);

const roundTrip = createInMemoryResetRepository(written);
roundTrip.saveSnapshot(roundTrip.getSnapshot());
check(
  'C. round trip — snapshot → repository → read is the same observable snapshot',
  sameObservable(roundTrip.getSnapshot(), written),
);

let holder = snapshot();
const local = createLocalResetRepository({
  getState: () => holder,
  setState: (next) => {
    holder = next;
  },
});
check(
  'A. read — local adapter returns the current ResetSnapshot',
  sameObservable(local.getSnapshot(), holder),
);
local.saveSnapshot(written);
check(
  'B. write — local adapter updates the one holder (not a second cache)',
  sameObservable(holder, written) && sameObservable(local.getSnapshot(), written),
);
local.saveSnapshot(local.getSnapshot());
check(
  'C. round trip — local adapter snapshot → save → read',
  sameObservable(local.getSnapshot(), written),
);

const accessorState = snapshot({ currentDay: 7, completedDays: [1, 2, 3] });
let accessorHolder = accessorState;
const accessors = createResetRepositoryFromAccessors(
  () => accessorHolder,
  (next) => {
    accessorHolder = next;
  },
);
check(
  'accessors repository reads the current snapshot',
  sameObservable(accessors.getSnapshot(), accessorState),
);
accessors.saveSnapshot(idle);
check('accessors repository writes the same holder', sameObservable(accessorHolder, idle));

const startBase = snapshot();
const startedExpected = startResetDay(startBase);
const startedRepo = createInMemoryResetRepository(startBase);
const startedActual = startResetDayOnRepository(startedRepo);
check(
  'D. startResetDay repository matches Phase 2B',
  sameObservable(startedActual, startedExpected) &&
    sameObservable(startedRepo.getSnapshot(), startedExpected),
);

const completeBase = startedExpected;
const completedExpected = completeResetDay(completeBase, dateOn('2026-09-19'));
const completedRepo = createInMemoryResetRepository(completeBase);
const completedActual = completeResetDayOnRepository(completedRepo, dateOn('2026-09-19'));
check(
  'D. completeResetDay repository matches Phase 2B',
  sameObservable(completedActual, completedExpected) &&
    sameObservable(completedRepo.getSnapshot(), completedExpected),
);

const rolloverExpected = processDateRollover(completedExpected, dateOn('2026-09-20'));
const rolloverRepo = createInMemoryResetRepository(completedExpected);
const rolloverActual = processDateRolloverOnRepository(rolloverRepo, dateOn('2026-09-20'));
check(
  'D. processDateRollover repository matches Phase 2B',
  sameObservable(rolloverActual, rolloverExpected) &&
    sameObservable(rolloverRepo.getSnapshot(), rolloverExpected),
);

const noteInput = { mood: 3 as const, text: 'a quiet note', prompt: 'how did it feel?' };
const journalExpected = saveReflection(idle, noteInput, dateOn('2026-09-19'));
const journalRepo = createInMemoryResetRepository(idle);
const journalActual = saveReflectionOnRepository(journalRepo, noteInput, dateOn('2026-09-19'));
check(
  'D. saveReflection repository matches Phase 2B',
  sameObservable(journalActual, journalExpected) &&
    sameObservable(journalRepo.getSnapshot(), journalExpected),
);

const idleSeed = snapshot({ resetStartedOn: null, lastSeenOn: null, resetTypeId: '' });
const seedExpected = startReset(idleSeed, RESTARTER_ANSWERS, dateOn('2026-09-19'));
const seedRepo = createInMemoryResetRepository(idleSeed);
const seedActual = startResetOnRepository(seedRepo, RESTARTER_ANSWERS, dateOn('2026-09-19'));
check(
  'D. startReset repository matches Phase 2B on idle',
  sameObservable(seedActual, seedExpected) && sameObservable(seedRepo.getSnapshot(), seedExpected),
);

const existingUser = snapshot({
  currentDay: 4,
  completedDays: [1, 2],
  resetTypeId: 'fading-flame',
  resetStartedOn: '2026-09-16',
});
const protectExpected = startReset(existingUser, RESTARTER_ANSWERS, dateOn('2026-09-19'));
const protectRepo = createInMemoryResetRepository(existingUser);
const protectActual = startResetOnRepository(protectRepo, RESTARTER_ANSWERS, dateOn('2026-09-19'));
check(
  'startReset through repository does not overwrite an active reset',
  sameObservable(protectActual, protectExpected) &&
    protectActual.currentDay === 4 &&
    protectActual.resetTypeId === 'fading-flame',
);

const completeAgainExpected = completeResetDay(completedExpected, dateOn('2026-09-19'));
const completeAgainRepo = createInMemoryResetRepository(completedExpected);
const completeAgainActual = completeResetDayOnRepository(completeAgainRepo, dateOn('2026-09-19'));
check(
  'E. completeResetDay through repository remains idempotent',
  completeAgainActual.completedDays.filter((day) => day === 1).length === 1 &&
    completeAgainActual.todayCompleted === true &&
    completeAgainActual.currentDay === 1 &&
    sameObservable(completeAgainActual, completeAgainExpected),
);

const day30 = snapshot({
  currentDay: 30,
  completedDays: Array.from({ length: 29 }, (_, index) => index + 1),
  resetStartedOn: '2026-08-21',
  lastSeenOn: '2026-09-19',
});
const day30Expected = completeResetDay(day30, dateOn('2026-09-19'));
const day30Repo = createInMemoryResetRepository(day30);
const day30Actual = completeResetDayOnRepository(day30Repo, dateOn('2026-09-19'));
check(
  'F. Day 30 repository-backed completion stays on local day 30',
  day30Actual.currentDay === 30 &&
    day30Actual.currentDay <= PLAN_DAY_COUNT &&
    day30Actual.completedDays.includes(30) &&
    sameObservable(day30Actual, day30Expected),
);

const localStartHolder = { current: startBase };
const localStartRepo = createLocalResetRepository({
  getState: () => localStartHolder.current,
  setState: (next) => {
    localStartHolder.current = next;
  },
});
check(
  'D. local adapter startResetDay matches Phase 2B',
  sameObservable(startResetDayOnRepository(localStartRepo), startedExpected),
);

const localCompleteHolder = { current: completeBase };
const localCompleteRepo = createLocalResetRepository({
  getState: () => localCompleteHolder.current,
  setState: (next) => {
    localCompleteHolder.current = next;
  },
});
check(
  'D. local adapter completeResetDay matches Phase 2B',
  sameObservable(
    completeResetDayOnRepository(localCompleteRepo, dateOn('2026-09-19')),
    completedExpected,
  ),
);

check(
  'in-memory getSnapshot clones — mutating the read does not change storage',
  (() => {
    const repo = createInMemoryResetRepository(idle);
    const read = repo.getSnapshot();
    read.completedDays.push(99);
    return !repo.getSnapshot().completedDays.includes(99);
  })(),
);

if (failed > 0) {
  throw new Error(`${failed} repository check(s) failed`);
}

console.log('\nall repository checks passed');
