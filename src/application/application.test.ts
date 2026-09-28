import { saveReflection } from './journal/saveReflection';
import { completeResetDay } from './reset/completeResetDay';
import { processDateRollover } from './reset/processDateRollover';
import { ensureSeeded, startReset } from './reset/startReset';
import { startResetDay } from './reset/startResetDay';
import type { OnboardingAnswer } from '../features/onboarding/types/onboarding';
import type { ResetPersonalization, ResetSnapshot } from '../features/reset/types';
import {
  applyDateRollover,
  processDateRollover as applyPhase1DateRollover,
} from '../features/reset/utils/applyDateRollover';
import { parseLocalDateKey } from '../features/reset/utils/calendar';
import {
  applyCompleteToday,
  applySaveReflection,
  applyStartToday,
} from '../features/reset/utils/dailyResetActions';
import { PLAN_DAY_COUNT } from '../features/reset/data/thirtyDayPlan';
import { LEGACY_FALLBACK_RESET_TYPE_ID } from '../features/reset/utils/deriveResetType';
import { getTaskForDay } from '../features/reset/utils/getTaskForDay';
import { applyEnsureSeeded, createSeededResetState } from '../features/reset/utils/seedResetState';

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
    todayTask: getTaskForDay(
      currentDay,
      nextPersonalization,
      overrides.resetTypeId ?? 'soft-restarter',
    ),
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

function single(optionId: string): OnboardingAnswer {
  return { type: 'singleChoice', optionId };
}

function multi(optionIds: readonly string[]): OnboardingAnswer {
  return { type: 'multiChoice', optionIds };
}

function text(value: string): OnboardingAnswer {
  return { type: 'textInput', value };
}

function sameObservable(left: ResetSnapshot, right: ResetSnapshot): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
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

const OVERLOADED_ANSWERS: Record<string, OnboardingAnswer> = {
  changePattern: single('keep-changing'),
  primaryObstacle: multi(['too-much']),
  recurringThought: single('further-ahead'),
  outOfBalance: multi(['everything', 'direction']),
  recentFeeling: single('overwhelmed'),
};

const idle = snapshot();
const started = startResetDay(idle);
check('startResetDay marks todayStarted', started.todayStarted === true);
check('startResetDay does not complete', started.todayCompleted === false);
check('startResetDay does not add a completed day', started.completedDays.length === 0);
check('startResetDay does not change currentDay', started.currentDay === idle.currentDay);
check(
  'startResetDay is equivalent to applyStartToday',
  sameObservable(started, applyStartToday(idle)),
);

const startedAgain = startResetDay(started);
check(
  'startResetDay twice stays started and incomplete',
  startedAgain.todayStarted && !startedAgain.todayCompleted,
);

const completedAlready = snapshot({ todayCompleted: true, todayStarted: true, completedDays: [1] });
check(
  'startResetDay is a no-op after complete',
  sameObservable(startResetDay(completedAlready), applyStartToday(completedAlready)) &&
    startResetDay(completedAlready).todayStarted === true &&
    startResetDay(completedAlready).todayCompleted === true &&
    startResetDay(completedAlready).completedDays.join(',') === '1',
);

const completed = completeResetDay(started, dateOn('2026-09-19'));
check('completeResetDay marks todayCompleted', completed.todayCompleted === true);
check('completeResetDay records the current day once', completed.completedDays.join(',') === '1');
check('completeResetDay does not advance currentDay', completed.currentDay === 1);
check(
  'completeResetDay is equivalent to applyCompleteToday',
  sameObservable(completed, applyCompleteToday(started, dateOn('2026-09-19'))),
);

const completedAgain = completeResetDay(completed, dateOn('2026-09-19'));
check(
  'completeResetDay is idempotent for the same day',
  completedAgain.completedDays.filter((day) => day === 1).length === 1 &&
    completedAgain.todayCompleted === true &&
    completedAgain.currentDay === 1,
);
check(
  'completeResetDay idempotent snapshot matches applyCompleteToday',
  sameObservable(completedAgain, applyCompleteToday(completed, dateOn('2026-09-19'))),
);

const alreadyListed = snapshot({
  completedDays: [1],
  todayCompleted: false,
  todayStarted: false,
});
const completeWhenListed = completeResetDay(alreadyListed, dateOn('2026-09-19'));
check(
  'completeResetDay is idempotent if completedDays already contains currentDay',
  completeWhenListed.completedDays.filter((day) => day === 1).length === 1 &&
    completeWhenListed.todayCompleted === true &&
    completeWhenListed.currentDay === 1,
);

const day30 = snapshot({
  currentDay: 30,
  completedDays: Array.from({ length: 29 }, (_, index) => index + 1),
  resetStartedOn: '2026-08-21',
  lastSeenOn: '2026-09-19',
});
const day30Completed = completeResetDay(day30, dateOn('2026-09-19'));
check('completeResetDay on Day 30 stays on Day 30', day30Completed.currentDay === 30);
check(
  'completeResetDay on Day 30 records day 30 once',
  day30Completed.completedDays.filter((day) => day === 30).length === 1 &&
    day30Completed.completedDays.includes(30),
);
check(
  'completeResetDay Day 30 matches applyCompleteToday',
  sameObservable(day30Completed, applyCompleteToday(day30, dateOn('2026-09-19'))),
);
check(
  'completeResetDay is not completeResetCycle — no Day 31',
  day30Completed.currentDay === 30 && day30Completed.currentDay <= PLAN_DAY_COUNT,
);

const nextMorning = processDateRollover(completed, dateOn('2026-09-20'));
check('rollover after complete advances one plan day', nextMorning.currentDay === 2);
check('rollover after complete is not already complete', nextMorning.todayCompleted === false);
check(
  'rollover after complete matches Phase 1 processDateRollover',
  sameObservable(nextMorning, applyPhase1DateRollover(completed, dateOn('2026-09-20'))),
);
check(
  'rollover after complete matches applyDateRollover',
  sameObservable(nextMorning, applyDateRollover(completed, '2026-09-20')),
);

const missed = processDateRollover(started, dateOn('2026-09-20'));
check('rollover after a miss keeps the same plan day', missed.currentDay === 1);
check('rollover after a miss flags missedYesterday', missed.missedYesterday === true);
check(
  'rollover after a miss matches Phase 1',
  sameObservable(missed, applyPhase1DateRollover(started, dateOn('2026-09-20'))),
);

const multiDayGap = processDateRollover(completed, dateOn('2026-09-23'));
check(
  'multi-day gap after complete advances at most one plan day',
  multiDayGap.currentDay === 2 &&
    multiDayGap.todayStarted === false &&
    multiDayGap.todayCompleted === false,
);
check('multi-day gap after complete flags missedYesterday', multiDayGap.missedYesterday === true);
check(
  'multi-day gap matches Phase 1 processDateRollover',
  sameObservable(multiDayGap, applyPhase1DateRollover(completed, dateOn('2026-09-23'))),
);

const unfinishedGap = processDateRollover(started, dateOn('2026-09-23'));
check(
  'multi-day gap without completion keeps the same plan day',
  unfinishedGap.currentDay === 1 && unfinishedGap.missedYesterday === true,
);

const day30Next = processDateRollover(day30Completed, dateOn('2026-09-20'));
check('Day 30 rollover stays on Day 30', day30Next.currentDay === 30);
check('Day 30 rollover stays completed', day30Next.todayCompleted === true);
check(
  'Day 30 rollover does not create Day 31',
  day30Next.currentDay === 30 && day30Next.currentDay <= PLAN_DAY_COUNT,
);
check(
  'Day 30 rollover matches Phase 1',
  sameObservable(day30Next, applyPhase1DateRollover(day30Completed, dateOn('2026-09-20'))),
);

const noteInput = { mood: 3 as const, text: 'a quiet note', prompt: 'how did it feel?' };
const afterJournal = saveReflection(idle, noteInput, dateOn('2026-09-19'));
check('saveReflection does not complete the reset', afterJournal.todayCompleted === false);
check('saveReflection does not start the reset', afterJournal.todayStarted === false);
check('saveReflection does not add a completed day', afterJournal.completedDays.length === 0);
check('saveReflection does not advance currentDay', afterJournal.currentDay === 1);
check('saveReflection stores a reflection', afterJournal.reflections.length === 1);
check(
  'saveReflection does not persist cycleId',
  afterJournal.reflections[0] != null &&
    !Object.prototype.hasOwnProperty.call(afterJournal.reflections[0], 'cycleId') &&
    !Object.prototype.hasOwnProperty.call(afterJournal.reflections[0], 'cycleSequence'),
);
check(
  'saveReflection is equivalent to applySaveReflection',
  sameObservable(afterJournal, applySaveReflection(idle, noteInput, dateOn('2026-09-19'))),
);

const sameDayNote = saveReflection(
  afterJournal,
  { mood: 4, text: 'updated same day', prompt: 'how did it feel?' },
  dateOn('2026-09-19'),
);
check('saveReflection upserts by plan day', sameDayNote.reflections.length === 1);
check(
  'saveReflection overwrite still does not complete or advance',
  sameDayNote.todayCompleted === false && sameDayNote.currentDay === 1,
);

const idleSeed = snapshot({ resetStartedOn: null, lastSeenOn: null, resetTypeId: '' });
const seeded = startReset(idleSeed, RESTARTER_ANSWERS, dateOn('2026-09-19'));
check('startReset seeds an idle snapshot on day 1', seeded.currentDay === 1);
check('startReset completedDays is empty', seeded.completedDays.length === 0);
check('startReset todayStarted is false', seeded.todayStarted === false);
check('startReset todayCompleted is false', seeded.todayCompleted === false);
check('startReset resetStartedOn is set', seeded.resetStartedOn === '2026-09-19');
check('startReset resetTypeId is derived', seeded.resetTypeId === 'soft-restarter');
check(
  'startReset on idle matches createSeededResetState',
  sameObservable(seeded, createSeededResetState(RESTARTER_ANSWERS, dateOn('2026-09-19'))),
);

const existingUser = snapshot({
  currentDay: 4,
  completedDays: [1, 2],
  resetTypeId: 'fading-flame',
  resetStartedOn: '2026-09-16',
  lastSeenOn: '2026-09-19',
  personalization: personalization({ dailyCommitment: 'twenty' }),
});
const startOnExisting = startReset(existingUser, OVERLOADED_ANSWERS, dateOn('2026-09-19'));
check(
  'startReset does not overwrite an already-active reset',
  startOnExisting === existingUser &&
    startOnExisting.currentDay === 4 &&
    startOnExisting.completedDays.join(',') === '1,2' &&
    startOnExisting.resetTypeId === 'fading-flame',
);
check(
  'startReset is not createSeededResetState when already active',
  startOnExisting.resetTypeId !==
    createSeededResetState(OVERLOADED_ANSWERS, dateOn('2026-09-19')).resetTypeId,
);

const keepStoredType = ensureSeeded(existingUser, OVERLOADED_ANSWERS, dateOn('2026-09-19'));
check(
  'ensureSeeded keeps a valid stored resetTypeId',
  keepStoredType.resetTypeId === 'fading-flame',
);
check(
  'ensureSeeded does not silently reset an existing user',
  keepStoredType.currentDay === 4 && keepStoredType.completedDays.join(',') === '1,2',
);
check(
  'ensureSeeded is equivalent to applyEnsureSeeded',
  sameObservable(
    keepStoredType,
    applyEnsureSeeded(existingUser, OVERLOADED_ANSWERS, dateOn('2026-09-19')),
  ),
);
check(
  'startReset ≠ ensureSeeded on an active reset (no type repair / rollover in startReset)',
  startOnExisting.resetTypeId === 'fading-flame' &&
    startOnExisting === existingUser &&
    keepStoredType !== existingUser,
);

const deriveOnce = ensureSeeded(
  { ...existingUser, resetTypeId: 'unknown-old-type' },
  OVERLOADED_ANSWERS,
  dateOn('2026-09-19'),
);
check(
  'ensureSeeded derives once when stored type is invalid and answers exist',
  deriveOnce.resetTypeId === 'overloaded-dreamer' && deriveOnce.currentDay === 4,
);

const legacyFallback = ensureSeeded({ ...existingUser, resetTypeId: '' }, {}, dateOn('2026-09-19'));
check(
  'ensureSeeded uses legacy overloaded-dreamer when type is missing and there are no answers',
  legacyFallback.resetTypeId === LEGACY_FALLBACK_RESET_TYPE_ID && legacyFallback.currentDay === 4,
);

const freshEnsure = ensureSeeded(idleSeed, RESTARTER_ANSWERS, dateOn('2026-09-19'));
check(
  'ensureSeeded seeds a new user from onboarding',
  freshEnsure.resetStartedOn === '2026-09-19' &&
    freshEnsure.currentDay === 1 &&
    freshEnsure.resetTypeId === 'soft-restarter',
);
check(
  'ensureSeeded on idle matches startReset and createSeededResetState',
  sameObservable(freshEnsure, seeded) &&
    sameObservable(freshEnsure, createSeededResetState(RESTARTER_ANSWERS, dateOn('2026-09-19'))),
);

if (failed > 0) {
  throw new Error(`${failed} application check(s) failed`);
}

console.log('\nall application checks passed');
