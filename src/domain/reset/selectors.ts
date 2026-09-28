import { getTaskForDay, PLAN_DAY_COUNT } from './resetPlan';
import type { ResetPersonalization, TodayTask } from './types';

export type ResetTaskSource = {
  currentDay: number;
  personalization: ResetPersonalization;
  resetTypeId?: string;
};

export type ResetProgressSource = {
  completedDays: readonly number[];
};

export type ResetDaySource = {
  currentDay: number;
};

/**
 * Three-number Reset Cycle model:
 * - `currentDay` = LOCAL day in the active cycle (1–cycleLength)
 * - `completedDays` = LOCAL completed days in the active cycle
 * - `overallDay` = DERIVED display/analytics
 *     ((cycleSequence - 1) * cycleLength) + localDay
 *
 * `overallDay` MUST NEVER be used by rollover, completion, journal upsert,
 * or plan task lookup — those stay local.
 */

/**
 * Canonical current-day task. Always derived from the plan + personalization.
 * Persisted `todayTask` is legacy compat only and must not be read here.
 * Looks up by LOCAL `currentDay`, never overallDay.
 */
export function getCurrentResetTask(snapshot: ResetTaskSource): TodayTask {
  return getTaskForDay(snapshot.currentDay, snapshot.personalization, snapshot.resetTypeId);
}

/** LOCAL plan-day cursor in the active cycle (1–30). Not progress. Not overallDay. */
export function getCurrentPlanDay(snapshot: ResetDaySource): number {
  return Math.min(PLAN_DAY_COUNT, Math.max(1, snapshot.currentDay));
}

/** Unique valid LOCAL completed plan days in 1–30. This is progress. Not overallDay. */
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
