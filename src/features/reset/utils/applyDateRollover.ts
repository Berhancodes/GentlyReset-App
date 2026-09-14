import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import type { ResetSnapshot } from '@/features/reset/types';
import { calendarDaysBetween, shiftDateKey } from '@/features/reset/utils/calendar';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';

/**
 * Advances calendar-aware Home state without skipping unfinished plan days.
 * Completing a day unlocks the next plan day on a later calendar date (once).
 */
export function applyDateRollover(state: ResetSnapshot, today: string): ResetSnapshot {
  if (!state.resetStartedOn) {
    return state;
  }

  const lastSeenOn = state.lastSeenOn ?? state.resetStartedOn;
  if (lastSeenOn === today) {
    return state;
  }

  const elapsed = calendarDaysBetween(lastSeenOn, today);
  if (elapsed <= 0) {
    return { ...state, lastSeenOn: today };
  }

  const completedOnLastSeenDay = state.todayCompleted && state.lastCompletedOn === lastSeenOn;
  const yesterday = shiftDateKey(today, -1);
  const completedYesterday = state.lastCompletedOn === yesterday;
  const streak = completedYesterday ? state.streak : 0;

  if (completedOnLastSeenDay && state.currentDay >= PLAN_DAY_COUNT) {
    return {
      ...state,
      lastSeenOn: today,
      todayCompleted: true,
      todayStarted: true,
      missedYesterday: !completedYesterday && elapsed > 1,
      streak,
      todayTask: getTaskForDay(PLAN_DAY_COUNT, state.personalization),
    };
  }

  if (completedOnLastSeenDay) {
    const nextDay = Math.min(PLAN_DAY_COUNT, state.currentDay + 1);
    return {
      ...state,
      lastSeenOn: today,
      currentDay: nextDay,
      todayCompleted: false,
      todayStarted: false,
      missedYesterday: !completedYesterday && elapsed > 1,
      streak,
      todayTask: getTaskForDay(nextDay, state.personalization),
    };
  }

  return {
    ...state,
    lastSeenOn: today,
    todayCompleted: false,
    todayStarted: false,
    missedYesterday: true,
    streak,
    todayTask: getTaskForDay(state.currentDay, state.personalization),
  };
}
