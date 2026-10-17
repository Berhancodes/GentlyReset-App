import type { ResetPersonalization, ResetSnapshot } from '../types';
import { PLAN_DAY_COUNT } from '../data/thirtyDayPlan';
import { getTaskForDay } from './getTaskForDay';
import {
  getCompletedDayCount,
  getCurrentPlanDay,
  getCurrentResetTask,
  getResetProgress,
  isResetDayCompleted,
} from './resetSelectors';

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

const defaultPersonalization = personalization();
const twentyMinutes = personalization({ dailyCommitment: 'twenty' });

const day1 = snapshot({ currentDay: 1 });
const homeTask = getCurrentResetTask(day1);
const journeyTask = getCurrentResetTask(day1);
const journalTask = getCurrentResetTask(day1);

check(
  'Home, Journey, and Journal resolve the same current task',
  homeTask.title === journeyTask.title &&
    journeyTask.title === journalTask.title &&
    homeTask.minutes === journalTask.minutes &&
    homeTask.description === journalTask.description,
);
check(
  'current task comes from currentDay + personalization + the plan',
  homeTask.title === getTaskForDay(1, defaultPersonalization, 'soft-restarter').title &&
    homeTask.day === 1,
);

const stale = snapshot({
  currentDay: 3,
  personalization: twentyMinutes,
  todayTask: getTaskForDay(1, defaultPersonalization, 'soft-restarter'),
});
check(
  'getCurrentResetTask does not read persisted todayTask',
  getCurrentResetTask(stale).title === getTaskForDay(3, twentyMinutes, 'soft-restarter').title &&
    getCurrentResetTask(stale).minutes ===
      getTaskForDay(3, twentyMinutes, 'soft-restarter').minutes &&
    getCurrentResetTask(stale).title !== stale.todayTask.title,
);

check('getCurrentPlanDay returns the cursor', getCurrentPlanDay(snapshot({ currentDay: 8 })) === 8);
check('getCurrentPlanDay clamps below 1', getCurrentPlanDay(snapshot({ currentDay: 0 })) === 1);
check(
  'getCurrentPlanDay clamps above 30',
  getCurrentPlanDay(snapshot({ currentDay: 31 })) === PLAN_DAY_COUNT,
);

const withDuplicates = snapshot({
  currentDay: 5,
  completedDays: [1, 1, 2, 0, 31, 2],
});
check('completedCount is unique valid days in 1–30', getCompletedDayCount(withDuplicates) === 2);
check(
  'progress is completedCount / 30, not currentDay',
  getResetProgress(withDuplicates) === 2 / PLAN_DAY_COUNT &&
    getResetProgress(withDuplicates) !== 5 / PLAN_DAY_COUNT,
);

const emptyProgress = snapshot({ currentDay: 1, completedDays: [] });
check('new user progress is 0', getResetProgress(emptyProgress) === 0);
check('new user completedCount is 0', getCompletedDayCount(emptyProgress) === 0);

const midReset = snapshot({ currentDay: 5, completedDays: [1, 2] });
check(
  'missed days do not inflate progress via currentDay',
  getResetProgress(midReset) === 2 / PLAN_DAY_COUNT && getCurrentPlanDay(midReset) === 5,
);

const day30 = snapshot({
  currentDay: 30,
  completedDays: Array.from({ length: 30 }, (_, index) => index + 1),
});
check('day 30 progress is 1', getResetProgress(day30) === 1);
check('day 30 completedCount is 30', getCompletedDayCount(day30) === 30);

check('isResetDayCompleted is true for a listed valid day', isResetDayCompleted(midReset, 1));
check(
  'isResetDayCompleted is false for an unfinished day',
  isResetDayCompleted(midReset, 5) === false,
);
check('isResetDayCompleted rejects 0', isResetDayCompleted(withDuplicates, 0) === false);
check('isResetDayCompleted rejects 31', isResetDayCompleted(withDuplicates, 31) === false);

if (failed > 0) {
  throw new Error(`${failed} reset-selector check(s) failed`);
}

console.log('\nall reset-selector checks passed');
