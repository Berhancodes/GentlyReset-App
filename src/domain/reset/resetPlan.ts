import type { ResetPersonalization, ResetPlan, TodayTask } from './types';
import { thirtyDayPlan } from './resetPlanConstants';
import {
  getPlanDayTitle as getTypePlanDayTitle,
  getTaskForDay as resolveCatalogTask,
} from './roadmap';
import { TYPE_PLAYLISTS } from './roadmap/playlists';

export {
  DEFAULT_CYCLE_LENGTH,
  FOUNDATION_PLAN_ID,
  FOUNDATION_PLAN_VERSION,
  PLAN_DAY_COUNT,
  thirtyDayPlan,
} from './resetPlanConstants';

export { formatMinutesLabel, minutesFromCommitment } from './roadmap';
export { getRoadmapPhaseForDay } from './roadmap/phase';

/**
 * Sample titles from the Overloaded Dreamer playlist so existing length checks
 * and generic previews still have a 30-day list. Type-specific titles come
 * from getPlanDayTitle(day, resetTypeId).
 */
export const PLAN_DAY_TITLES: readonly string[] = TYPE_PLAYLISTS['overloaded-dreamer'].map(
  (item) => item.title,
);

export const PLAN_WEEKS = [
  { id: 'week-1', label: 'stabilize', startDay: 1, endDay: 7, phase: 'stabilize' },
  { id: 'week-2', label: 'change', startDay: 8, endDay: 14, phase: 'change' },
  { id: 'week-3', label: 'pattern', startDay: 15, endDay: 21, phase: 'pattern' },
  { id: 'week-4', label: 'independence', startDay: 22, endDay: 28, phase: 'independence' },
  { id: 'finish', label: 'close', startDay: 29, endDay: 30, phase: 'close' },
] as const;

export type PlanWeek = (typeof PLAN_WEEKS)[number];

export function getPlanDayTitle(day: number, resetTypeId?: string): string {
  return getTypePlanDayTitle(day, resetTypeId);
}

export function getResetPlan(planId: string, version: number): ResetPlan {
  if (planId === thirtyDayPlan.planId && version === thirtyDayPlan.version) {
    return {
      id: thirtyDayPlan.planId,
      version: thirtyDayPlan.version,
      length: thirtyDayPlan.length,
    };
  }

  throw new Error(`Unknown reset plan: ${planId}@${version}`);
}

/** Canonical local-day task. One implementation for Home, Journey, and Journal. */
export function getTaskForDay(
  day: number,
  personalization: ResetPersonalization,
  resetTypeId?: string,
): TodayTask {
  return resolveCatalogTask(day, personalization, resetTypeId);
}
