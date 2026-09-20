import { DEFAULT_CYCLE_LENGTH } from '../data/thirtyDayPlan';
import type { ResetSnapshot } from '../types';

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 1;
}

/**
 * Derived overall day for display/analytics only.
 * overallDay = ((cycleSequence - 1) * cycleLength) + localDay
 *
 * Clamps `localDay` to 1–cycleLength, matching `getCurrentPlanDay`.
 * Invalid sequence/length fall back the same way selectors reject bad days:
 * sequence < 1 or non-integer → 1; length < 1 or non-integer → DEFAULT_CYCLE_LENGTH.
 *
 * Must never be used by rollover, completion, journal upsert, or plan task lookup.
 */
export function getOverallDayNumber(
  cycleSequence: number,
  localDay: number,
  cycleLength: number = DEFAULT_CYCLE_LENGTH,
): number {
  const safeCycleLength = isPositiveInteger(cycleLength) ? cycleLength : DEFAULT_CYCLE_LENGTH;
  const safeCycleSequence = isPositiveInteger(cycleSequence) ? cycleSequence : 1;
  const safeLocalDay = Math.min(safeCycleLength, Math.max(1, localDay));
  return (safeCycleSequence - 1) * safeCycleLength + safeLocalDay;
}

/**
 * Temporary bridge: always 1 for the current persisted architecture
 * (single in-progress reset, no ResetCycle history).
 *
 * Backwards-compatible until ResetCycle history exists. Does not persist
 * sequence and does not read or write `cycles[]`.
 */
export function getActiveCycleSequence(_snapshot: ResetSnapshot): number {
  return 1;
}
