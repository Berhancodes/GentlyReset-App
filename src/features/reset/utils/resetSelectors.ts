import { PLAN_DAY_COUNT } from '../data/thirtyDayPlan';
import type { ResetSnapshot, TodayTask } from '../types';
import { getTaskForDay } from './getTaskForDay';

export type ResetTaskSource = Pick<ResetSnapshot, 'currentDay' | 'personalization'>;
export type ResetProgressSource = Pick<ResetSnapshot, 'completedDays'>;
export type ResetDaySource = Pick<ResetSnapshot, 'currentDay'>;

/**
 * Canonical current-day task. Always derived from the plan + personalization.
 * Persisted `todayTask` is legacy compat only and must not be read here.
 */
export function getCurrentResetTask(snapshot: ResetTaskSource): TodayTask {
  return getTaskForDay(snapshot.currentDay, snapshot.personalization);
}

/** Plan-day cursor (1–30). Not progress. */
export function getCurrentPlanDay(snapshot: ResetDaySource): number {
  return Math.min(PLAN_DAY_COUNT, Math.max(1, snapshot.currentDay));
}

/** Unique valid completed plan days in 1–30. This is progress. */
export function getCompletedDayCount(snapshot: ResetProgressSource): number {
  const unique = new Set<number>();
  for (const day of snapshot.completedDays) {
    if (Number.isInteger(day) && day >= 1 && day <= PLAN_DAY_COUNT) {
      unique.add(day);
    }
  }
  return unique.size;
}

/** completedCount / 30. Does not mix in currentDay. */
export function getResetProgress(snapshot: ResetProgressSource): number {
  return getCompletedDayCount(snapshot) / PLAN_DAY_COUNT;
}

export function isResetDayCompleted(snapshot: ResetProgressSource, day: number): boolean {
  if (!Number.isInteger(day) || day < 1 || day > PLAN_DAY_COUNT) {
    return false;
  }
  return snapshot.completedDays.includes(day);
}
