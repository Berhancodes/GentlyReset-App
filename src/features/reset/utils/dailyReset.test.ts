import type { ResetPersonalization, ResetSnapshot } from '../types';
import { applyDateRollover } from './applyDateRollover';
import { parseLocalDateKey } from './calendar';
import { applyCompleteToday, applySaveReflection, applyStartToday } from './dailyResetActions';
import { getPlanDayTitle } from '../data/thirtyDayPlan';
import { getTaskForDay } from './getTaskForDay';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function personalization(
  overrides: Partial<ResetPersonalization> = {},
): ResetPersonalization {
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
const homeDay1 = getTaskForDay(1, defaultPersonalization);
const journeyDay1 = getTaskForDay(1, defaultPersonalization);

check('day 1 Home and Journey resolve identical task', tasksMatch(homeDay1, journeyDay1));
check('day 1 title is the plan title, not journal copy', homeDay1.title === getPlanDayTitle(1));
check('day 1 default minutes are 5', homeDay1.minutes === 5);
check(
  'day 1 default description',
  homeDay1.description === "You don't need momentum. Just begin.",
);

const fiveMinutes = personalization({ dailyCommitment: 'five' });
const twentyMinutes = personalization({ dailyCommitment: 'twenty' });
check(
  'same dailyCommitment → identical minutes on Home and Journey',
  getTaskForDay(3, twentyMinutes).minutes === getTaskForDay(3, twentyMinutes).minutes &&
    getTaskForDay(3, twentyMinutes).minutes === 20 &&
    getTaskForDay(8, fiveMinutes).minutes === 5,
);
check(
  'different dailyCommitment still matches across surfaces',
  tasksMatch(getTaskForDay(4, twentyMinutes), getTaskForDay(4, twentyMinutes)) &&
    getTaskForDay(4, twentyMinutes).minutes !== getTaskForDay(4, fiveMinutes).minutes,
);

const tooMuch = personalization({ primaryObstacle: 'too-much' });
const afraid = personalization({ primaryObstacle: 'afraid-wont-stick' });
const day2TooMuchHome = getTaskForDay(2, tooMuch);
const day2TooMuchJourney = getTaskForDay(2, tooMuch);
const day2AfraidHome = getTaskForDay(2, afraid);
const day2AfraidJourney = getTaskForDay(2, afraid);

check(
  'same primaryObstacle → identical description on Home and Journey',
  day2TooMuchHome.description === day2TooMuchJourney.description &&
    day2TooMuchHome.description === 'Smaller than you think. Then stop.',
);
check(
  'different primaryObstacle still matches across surfaces',
  day2AfraidHome.description === day2AfraidJourney.description &&
    day2AfraidHome.description === 'Showing up once still counts.' &&
    day2TooMuchHome.description !== day2AfraidHome.description,
);

const idle = snapshot();
const started = applyStartToday(idle);
check('start marks todayStarted', started.todayStarted === true);
check('start does not complete the reset', started.todayCompleted === false);
check('start does not add a completed day', started.completedDays.length === 0);
check('start does not change currentDay', started.currentDay === idle.currentDay);

const startedAgain = applyStartToday(started);
check('starting twice stays started and incomplete', startedAgain.todayStarted && !startedAgain.todayCompleted);

const completed = applyCompleteToday(started, dateOn('2026-09-19'));
check('complete marks todayCompleted', completed.todayCompleted === true);
check('complete records the current day once', completed.completedDays.join(',') === '1');
check('complete does not advance currentDay', completed.currentDay === 1);
check('complete keeps the same task', tasksMatch(getTaskForDay(1, defaultPersonalization), getTaskForDay(completed.currentDay, completed.personalization)));

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
    getTaskForDay(sameDayReopen.currentDay, sameDayReopen.personalization),
    getTaskForDay(1, defaultPersonalization),
  ),
);

const nextMorning = applyDateRollover(completed, '2026-09-20');
check('next day after completion advances to the next plan day', nextMorning.currentDay === 2);
check('next day after completion is not already complete', nextMorning.todayCompleted === false);
check(
  'next day after completion uses the next task',
  tasksMatch(
    getTaskForDay(nextMorning.currentDay, nextMorning.personalization),
    getTaskForDay(2, defaultPersonalization),
  ) && getTaskForDay(nextMorning.currentDay, nextMorning.personalization).title === getPlanDayTitle(2),
);

const missed = applyDateRollover(started, '2026-09-20');
check('missed day keeps the same plan day', missed.currentDay === 1);
check('missed day flags missedYesterday', missed.missedYesterday === true);
check(
  'missed day keeps the same task',
  tasksMatch(
    getTaskForDay(missed.currentDay, missed.personalization),
    getTaskForDay(1, defaultPersonalization),
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
check('day 30 complete records day 30 once', day30Completed.completedDays.filter((day) => day === 30).length === 1);

const day30Next = applyDateRollover(day30Completed, '2026-09-20');
check('day 30 stays current after a later calendar day', day30Next.currentDay === 30);
check('day 30 stays completed after rollover', day30Next.todayCompleted === true);
check(
  'day 30 task stays the day-30 plan task',
  tasksMatch(
    getTaskForDay(day30Next.currentDay, day30Next.personalization),
    getTaskForDay(30, defaultPersonalization),
  ) && getTaskForDay(30, defaultPersonalization).title === getPlanDayTitle(30),
);

if (failed > 0) {
  throw new Error(`${failed} daily-reset check(s) failed`);
}

console.log('\nall daily-reset checks passed');
