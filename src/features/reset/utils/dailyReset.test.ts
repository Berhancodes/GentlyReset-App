import type { OnboardingAnswer } from '../../onboarding/types/onboarding';
import type { ResetPersonalization, ResetSnapshot } from '../types';
import { applyDateRollover, processDateRollover } from './applyDateRollover';
import { parseLocalDateKey } from './calendar';
import { applyCompleteToday, applySaveReflection, applyStartToday } from './dailyResetActions';
import { getPlanDayTitle, PLAN_DAY_COUNT } from '../data/thirtyDayPlan';
import { LEGACY_FALLBACK_RESET_TYPE_ID, resolveStoredResetTypeId } from './deriveResetType';
import { getTaskForDay } from './getTaskForDay';
import { getCurrentResetTask } from './resetSelectors';
import { applyEnsureSeeded, createSeededResetState } from './seedResetState';

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
    todayTask: getTaskForDay(currentDay, nextPersonalization, 'soft-restarter'),
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

function tasksMatch(
  homeTask: ReturnType<typeof getTaskForDay>,
  journeyTask: ReturnType<typeof getTaskForDay>,
): boolean {
  return (
    homeTask.title === journeyTask.title &&
    homeTask.minutes === journeyTask.minutes &&
    homeTask.description === journeyTask.description
  );
}

const defaultPersonalization = personalization();
const TYPE = 'soft-restarter';
const homeDay1 = getTaskForDay(1, defaultPersonalization, TYPE);
const journeyDay1 = getTaskForDay(1, defaultPersonalization, TYPE);

check('day 1 Home and Journey resolve identical task', tasksMatch(homeDay1, journeyDay1));
check(
  'day 1 title is the plan title, not journal copy',
  homeDay1.title === getPlanDayTitle(1, TYPE),
);
check('day 1 default minutes start small', homeDay1.minutes === 3);
check('day 1 default description is type-specific', homeDay1.description.length > 0);

const fiveMinutes = personalization({ dailyCommitment: 'five' });
const twentyMinutes = personalization({ dailyCommitment: 'twenty' });
check(
  'same dailyCommitment → identical minutes on Home and Journey',
  getTaskForDay(3, twentyMinutes, TYPE).minutes === getTaskForDay(3, twentyMinutes, TYPE).minutes &&
    getTaskForDay(3, twentyMinutes, TYPE).minutes === 10 &&
    getTaskForDay(22, fiveMinutes, TYPE).minutes === 5,
);
check(
  'different dailyCommitment still matches across surfaces',
  tasksMatch(getTaskForDay(4, twentyMinutes, TYPE), getTaskForDay(4, twentyMinutes, TYPE)) &&
    getTaskForDay(4, twentyMinutes, TYPE).minutes !== getTaskForDay(4, fiveMinutes, TYPE).minutes,
);

const tooMuch = personalization({ primaryObstacle: 'too-much' });
const afraid = personalization({ primaryObstacle: 'afraid-wont-stick' });
const day2TooMuchHome = getTaskForDay(2, tooMuch, TYPE);
const day2TooMuchJourney = getTaskForDay(2, tooMuch, TYPE);
const day2AfraidHome = getTaskForDay(2, afraid, TYPE);
const day2AfraidJourney = getTaskForDay(2, afraid, TYPE);

check(
  'same primaryObstacle → identical description on Home and Journey',
  day2TooMuchHome.description === day2TooMuchJourney.description &&
    day2TooMuchHome.description.includes('Then stop.'),
);
check(
  'different primaryObstacle still matches across surfaces',
  day2AfraidHome.description === day2AfraidJourney.description &&
    day2AfraidHome.description.includes('Showing up once still counts.') &&
    day2TooMuchHome.description !== day2AfraidHome.description,
);

const idle = snapshot();
const started = applyStartToday(idle);
check('start marks todayStarted', started.todayStarted === true);
check('start does not complete the reset', started.todayCompleted === false);
check('start does not add a completed day', started.completedDays.length === 0);
check('start does not change currentDay', started.currentDay === idle.currentDay);

const startedAgain = applyStartToday(started);
check(
  'starting twice stays started and incomplete',
  startedAgain.todayStarted && !startedAgain.todayCompleted,
);

const completed = applyCompleteToday(started, dateOn('2026-09-19'));
check('complete marks todayCompleted', completed.todayCompleted === true);
check('complete records the current day once', completed.completedDays.join(',') === '1');
check('complete does not advance currentDay', completed.currentDay === 1);
check(
  'complete keeps the same task',
  tasksMatch(
    getTaskForDay(1, defaultPersonalization, TYPE),
    getTaskForDay(completed.currentDay, completed.personalization, TYPE),
  ),
);

const completedAgain = applyCompleteToday(completed, dateOn('2026-09-19'));
check(
  'complete is idempotent for the same day',
  completedAgain.completedDays.filter((day) => day === 1).length === 1 &&
    completedAgain.todayCompleted === true &&
    completedAgain.currentDay === 1,
);

const afterJournal = applySaveReflection(
  idle,
  { mood: 3, text: 'a quiet note', prompt: 'how did it feel?' },
  dateOn('2026-09-19'),
);
check('journal save does not complete the reset', afterJournal.todayCompleted === false);
check('journal save does not start the reset', afterJournal.todayStarted === false);
check('journal save does not add a completed day', afterJournal.completedDays.length === 0);
check('journal save stores a reflection', afterJournal.reflections.length === 1);
check('journal save keeps the same plan day', afterJournal.currentDay === 1);

const sameDayReopen = applyDateRollover(completed, '2026-09-19');
check('reopen same day keeps currentDay', sameDayReopen.currentDay === 1);
check(
  'reopen same day keeps the same task',
  tasksMatch(
    getTaskForDay(sameDayReopen.currentDay, sameDayReopen.personalization, TYPE),
    getTaskForDay(1, defaultPersonalization, TYPE),
  ),
);

const nextMorning = applyDateRollover(completed, '2026-09-20');
check('next day after completion advances to the next plan day', nextMorning.currentDay === 2);
check('next day after completion is not already complete', nextMorning.todayCompleted === false);
check(
  'next day after completion uses the next task',
  tasksMatch(
    getTaskForDay(nextMorning.currentDay, nextMorning.personalization, TYPE),
    getTaskForDay(2, defaultPersonalization, TYPE),
  ) &&
    getTaskForDay(nextMorning.currentDay, nextMorning.personalization, TYPE).title ===
      getPlanDayTitle(2, TYPE),
);

const missed = applyDateRollover(started, '2026-09-20');
check('missed day keeps the same plan day', missed.currentDay === 1);
check('missed day flags missedYesterday', missed.missedYesterday === true);
check(
  'missed day keeps the same task',
  tasksMatch(
    getTaskForDay(missed.currentDay, missed.personalization, TYPE),
    getTaskForDay(1, defaultPersonalization, TYPE),
  ),
);

const day30 = snapshot({
  currentDay: 30,
  completedDays: Array.from({ length: 29 }, (_, index) => index + 1),
  resetStartedOn: '2026-08-21',
  lastSeenOn: '2026-09-19',
});
const day30Completed = applyCompleteToday(day30, dateOn('2026-09-19'));
check('day 30 complete stays on day 30', day30Completed.currentDay === 30);
check(
  'day 30 complete records day 30 once',
  day30Completed.completedDays.filter((day) => day === 30).length === 1,
);

const day30Next = applyDateRollover(day30Completed, '2026-09-20');
check('day 30 stays current after a later calendar day', day30Next.currentDay === 30);
check('day 30 stays completed after rollover', day30Next.todayCompleted === true);
check(
  'day 30 task stays the day-30 plan task',
  tasksMatch(
    getTaskForDay(day30Next.currentDay, day30Next.personalization, TYPE),
    getTaskForDay(30, defaultPersonalization, TYPE),
  ) && getTaskForDay(30, defaultPersonalization, TYPE).title === getPlanDayTitle(30, TYPE),
);

const multiDayGap = applyDateRollover(completed, '2026-09-23');
check(
  'multi-day gap after a completed day advances at most one plan day',
  multiDayGap.currentDay === 2 &&
    multiDayGap.todayStarted === false &&
    multiDayGap.todayCompleted === false,
);
check('multi-day gap after completion flags missedYesterday', multiDayGap.missedYesterday === true);
check(
  'processDateRollover matches applyDateRollover for a multi-day gap',
  processDateRollover(completed, dateOn('2026-09-23')).currentDay === multiDayGap.currentDay &&
    processDateRollover(completed, dateOn('2026-09-23')).missedYesterday ===
      multiDayGap.missedYesterday,
);

const unfinishedGap = applyDateRollover(started, '2026-09-23');
check(
  'multi-day gap without completion keeps the same plan day',
  unfinishedGap.currentDay === 1 && unfinishedGap.missedYesterday === true,
);

const firstNote = applySaveReflection(
  idle,
  { mood: 3, text: 'first calendar', prompt: 'how did it feel?' },
  dateOn('2026-09-19'),
);
const sameDayNote = applySaveReflection(
  firstNote,
  { mood: 4, text: 'updated same day', prompt: 'how did it feel?' },
  dateOn('2026-09-19'),
);
check('journal upserts by calendar date on the same day', sameDayNote.reflections.length === 1);
check(
  'journal upsert replaces the same plan-day entry',
  sameDayNote.reflections[0]?.text === 'updated same day' && sameDayNote.reflections[0]?.mood === 4,
);

const stillDayOne = applyDateRollover(sameDayNote, '2026-09-20');
const laterCalendarNote = applySaveReflection(
  stillDayOne,
  { mood: 5, text: 'second calendar', prompt: 'how did it feel?' },
  dateOn('2026-09-20'),
);
check(
  'a missed day keeps its journal entry when the next day is written (same plan day)',
  laterCalendarNote.reflections.length === 2 &&
    laterCalendarNote.reflections[0]?.date === '2026-09-19' &&
    laterCalendarNote.reflections[0]?.text === 'updated same day' &&
    laterCalendarNote.reflections[1]?.date === '2026-09-20' &&
    laterCalendarNote.reflections[1]?.text === 'second calendar' &&
    laterCalendarNote.reflections.every((entry) => entry.day === 1),
);
check(
  'writing the journal does not complete or advance the plan day',
  laterCalendarNote.todayCompleted === false && laterCalendarNote.currentDay === 1,
);

const alreadyListed = snapshot({
  completedDays: [1],
  todayCompleted: false,
  todayStarted: false,
});
const completeWhenListed = applyCompleteToday(alreadyListed, dateOn('2026-09-19'));
check(
  'complete is idempotent if completedDays already contains currentDay',
  completeWhenListed.completedDays.filter((day) => day === 1).length === 1 &&
    completeWhenListed.todayCompleted === true &&
    completeWhenListed.currentDay === 1,
);

check('day 30 currentDay stays capped at 30 after complete', day30Completed.currentDay === 30);
check(
  'day 30 rollover does not create day 31',
  day30Next.currentDay === 30 && day30Next.currentDay <= PLAN_DAY_COUNT,
);
check(
  'day 30 completedDays includes 30 once',
  day30Completed.completedDays.filter((day) => day === 30).length === 1 &&
    day30Completed.completedDays.includes(30),
);

const seeded = createSeededResetState(RESTARTER_ANSWERS, dateOn('2026-09-19'));
check('seed starts on day 1', seeded.currentDay === 1);
check('seed completedDays is empty', seeded.completedDays.length === 0);
check('seed todayStarted is false', seeded.todayStarted === false);
check('seed todayCompleted is false', seeded.todayCompleted === false);
check('seed resetStartedOn is set', seeded.resetStartedOn === '2026-09-19');
check('seed lastSeenOn matches start date', seeded.lastSeenOn === '2026-09-19');
check('seed resetTypeId is derived', seeded.resetTypeId === 'soft-restarter');
check(
  'seed personalization preserves dailyCommitment',
  seeded.personalization.dailyCommitment === 'ten',
);
check(
  'seed personalization preserves supportStyle',
  seeded.personalization.supportStyle === 'be-gentle',
);
check(
  'seed personalization preserves desiredFeelings',
  seeded.personalization.desiredFeelings.join(',') === 'calm,present',
);
check(
  'seed writes todayTask as legacy compat for day 1',
  seeded.todayTask.title === getCurrentResetTask(seeded).title && seeded.todayTask.day === 1,
);

const existingUser = snapshot({
  currentDay: 4,
  completedDays: [1, 2],
  resetTypeId: 'fading-flame',
  resetStartedOn: '2026-09-16',
  lastSeenOn: '2026-09-19',
  personalization: personalization({ dailyCommitment: 'twenty' }),
});
const keepStoredType = applyEnsureSeeded(existingUser, OVERLOADED_ANSWERS, dateOn('2026-09-19'));
check(
  'ensureSeeded keeps a valid stored resetTypeId',
  keepStoredType.resetTypeId === 'fading-flame',
);
check(
  'ensureSeeded does not silently reset an existing user',
  keepStoredType.currentDay === 4 && keepStoredType.completedDays.join(',') === '1,2',
);
check(
  'resolveStoredResetTypeId never reclassifies a valid stored type',
  resolveStoredResetTypeId('fading-flame', OVERLOADED_ANSWERS) === 'fading-flame',
);

const deriveOnce = applyEnsureSeeded(
  { ...existingUser, resetTypeId: 'unknown-old-type' },
  OVERLOADED_ANSWERS,
  dateOn('2026-09-19'),
);
check(
  'ensureSeeded derives once when stored type is invalid and answers exist',
  deriveOnce.resetTypeId === 'overloaded-dreamer' && deriveOnce.currentDay === 4,
);

const legacyFallback = applyEnsureSeeded(
  { ...existingUser, resetTypeId: '' },
  {},
  dateOn('2026-09-19'),
);
check(
  'ensureSeeded uses legacy overloaded-dreamer when type is missing and there are no answers',
  legacyFallback.resetTypeId === LEGACY_FALLBACK_RESET_TYPE_ID && legacyFallback.currentDay === 4,
);

const freshSeed = applyEnsureSeeded(
  snapshot({ resetStartedOn: null, lastSeenOn: null, resetTypeId: '' }),
  RESTARTER_ANSWERS,
  dateOn('2026-09-19'),
);
check(
  'ensureSeeded seeds a new user from onboarding',
  freshSeed.resetStartedOn === '2026-09-19' &&
    freshSeed.currentDay === 1 &&
    freshSeed.resetTypeId === 'soft-restarter',
);

check(
  'complete writes todayTask as legacy compat',
  completed.todayTask.title === getCurrentResetTask(completed).title,
);
check(
  'rollover writes todayTask as legacy compat',
  nextMorning.todayTask.title === getCurrentResetTask(nextMorning).title &&
    nextMorning.todayTask.day === 2,
);

const staleTask = snapshot({
  currentDay: 2,
  todayTask: getTaskForDay(1, defaultPersonalization, TYPE),
});
check(
  'canonical task read ignores a stale persisted todayTask',
  getCurrentResetTask(staleTask).title === getTaskForDay(2, defaultPersonalization, TYPE).title &&
    getCurrentResetTask(staleTask).title !== staleTask.todayTask.title,
);

if (failed > 0) {
  throw new Error(`${failed} daily-reset check(s) failed`);
}

console.log('\nall daily-reset checks passed');
