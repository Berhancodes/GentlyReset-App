/** Canonical foundation plan identity. Content lives in the roadmap catalog. */
export const FOUNDATION_PLAN_ID = 'foundation-reset';
export const FOUNDATION_PLAN_VERSION = 1;

export const DEFAULT_CYCLE_LENGTH = 30;
export const PLAN_DAY_COUNT = DEFAULT_CYCLE_LENGTH;

export const thirtyDayPlan = {
  planId: FOUNDATION_PLAN_ID,
  version: FOUNDATION_PLAN_VERSION,
  length: DEFAULT_CYCLE_LENGTH,
} as const;
