import { PLAN_DAY_COUNT } from '../data/thirtyDayPlan';
import type { ResetSnapshot } from '../types';
import { calendarDaysBetween, shiftDateKey, toLocalDateKey } from './calendar';
import { getCurrentResetTask } from './resetSelectors';

/**
 * The one date-rollover calculation. Tabs and actions go through
 * processDateRollover; do not copy this logic into screens.
 */
export function applyDateRollover(state: ResetSnapshot, today: string): ResetSnapshot {
  const snapshot: ResetSnapshot = {
    ...state,
    reflections: state.reflections ?? [],
  };

  if (!snapshot.resetStartedOn) {
    return snapshot;
  }

  const lastSeenOn = snapshot.lastSeenOn ?? snapshot.resetStartedOn;
  if (lastSeenOn === today) {
    return snapshot;
  }

  const elapsed = calendarDaysBetween(lastSeenOn, today);
  if (elapsed <= 0) {
    return { ...snapshot, lastSeenOn: today };
  }

  const completedOnLastSeenDay = snapshot.todayCompleted && snapshot.lastCompletedOn === lastSeenOn;
  const yesterday = shiftDateKey(today, -1);
  const completedYesterday = snapshot.lastCompletedOn === yesterday;
  const streak = completedYesterday ? snapshot.streak : 0;

  if (completedOnLastSeenDay && snapshot.currentDay >= PLAN_DAY_COUNT) {
    return {
      ...snapshot,
      lastSeenOn: today,
      todayCompleted: true,
      todayStarted: true,
      missedYesterday: !completedYesterday && elapsed > 1,
      streak,
      todayTask: getCurrentResetTask({
        currentDay: PLAN_DAY_COUNT,
        personalization: snapshot.personalization,
      }),
    };
  }

  if (completedOnLastSeenDay) {
    const nextDay = Math.min(PLAN_DAY_COUNT, snapshot.currentDay + 1);
    return {
      ...snapshot,
      lastSeenOn: today,
      currentDay: nextDay,
      todayCompleted: false,
      todayStarted: false,
      missedYesterday: !completedYesterday && elapsed > 1,
      streak,
      todayTask: getCurrentResetTask({
        currentDay: nextDay,
        personalization: snapshot.personalization,
      }),
    };
  }

  return {
    ...snapshot,
    lastSeenOn: today,
    todayCompleted: false,
    todayStarted: false,
    missedYesterday: true,
    streak,
    todayTask: getCurrentResetTask(snapshot),
  };
}

/** Application entry for calendar sync. Calculation stays in applyDateRollover. */
export function processDateRollover(state: ResetSnapshot, now: Date): ResetSnapshot {
  return applyDateRollover(state, toLocalDateKey(now));
}
