import { PLAN_DAY_COUNT } from '../data/thirtyDayPlan';
import type { ResetSnapshot } from '../types';
import { calendarDaysBetween, shiftDateKey } from './calendar';
import { getTaskForDay } from './getTaskForDay';

/**
 * Advances calendar-aware Home state without skipping unfinished plan days.
 * Completing a day unlocks the next plan day on a later calendar date (once).
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
      todayTask: getTaskForDay(PLAN_DAY_COUNT, snapshot.personalization),
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
      todayTask: getTaskForDay(nextDay, snapshot.personalization),
    };
  }

  return {
    ...snapshot,
    lastSeenOn: today,
    todayCompleted: false,
    todayStarted: false,
    missedYesterday: true,
    streak,
    todayTask: getTaskForDay(snapshot.currentDay, snapshot.personalization),
  };
}
