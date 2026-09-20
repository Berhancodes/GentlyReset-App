import { DEFAULT_CYCLE_LENGTH, FOUNDATION_PLAN_ID, FOUNDATION_PLAN_VERSION } from './resetPlan';
import type { ResetCycle, ResetSnapshotSource } from './types';

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 1;
}

export function getResetCycleId(sequence: number): string {
  const safeSequence = isPositiveInteger(sequence) ? sequence : 1;
  return `${FOUNDATION_PLAN_ID}:${safeSequence}`;
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
export function getActiveCycleSequence(_snapshot: ResetSnapshotSource): number {
  return 1;
}

/**
 * Pure adapter: current ResetSnapshot → ResetCycle.
 * Does not mutate the snapshot. Does not persist sequence or completedAt.
 * Status stays `active` for every current snapshot, including Day 30 —
 * completeResetCycle does not exist yet.
 */
export function mapSnapshotToResetCycle(snapshot: ResetSnapshotSource): ResetCycle {
  const sequence = getActiveCycleSequence(snapshot);

  return {
    id: getResetCycleId(sequence),
    sequence,
    planId: FOUNDATION_PLAN_ID,
    planVersion: FOUNDATION_PLAN_VERSION,
    currentDay: snapshot.currentDay,
    completedDays: [...snapshot.completedDays],
    resetTypeId: snapshot.resetTypeId,
    startedAt: snapshot.resetStartedOn,
    completedAt: null,
    status: 'active',
    personalization: {
      ...snapshot.personalization,
      desiredFeelings: [...snapshot.personalization.desiredFeelings],
    },
    todayStarted: snapshot.todayStarted,
  };
}

export function getResetCycleFromSnapshot(snapshot: ResetSnapshotSource): ResetCycle {
  return mapSnapshotToResetCycle(snapshot);
}
