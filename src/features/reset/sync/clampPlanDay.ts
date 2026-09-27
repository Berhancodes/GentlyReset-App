import { PLAN_DAY_COUNT } from '../data/thirtyDayPlan';

export function clampPlanDay(day: number): number {
  if (!Number.isInteger(day)) {
    return 1;
  }
  return Math.min(PLAN_DAY_COUNT, Math.max(1, day));
}

export function uniquePlanDays(days: readonly number[]): number[] {
  const unique = new Set<number>();
  for (const day of days) {
    if (Number.isInteger(day) && day >= 1 && day <= PLAN_DAY_COUNT) {
      unique.add(day);
    }
  }
  return [...unique].sort((left, right) => left - right);
}
