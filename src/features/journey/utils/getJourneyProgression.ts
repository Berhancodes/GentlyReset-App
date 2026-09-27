import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';

export type JourneyProgressionDecision =
  | { kind: 'idle' }
  | { kind: 'bootstrap'; day: number }
  | { kind: 'advance'; fromDay: number; toDay: number }
  | { kind: 'snap'; toDay: number };

export type JourneyProgressionInput = {
  currentDay: number;
  acknowledgedDay: number | null;
  planDayCount?: number;
};

/**
 * Visual Journey progress vs the real `currentDay`.
 *
 * Completing a reset does not advance `currentDay`. The plan day only
 * increments on the next calendar rollover, and only by one day.
 *
 * - First Journey visit (`acknowledgedDay` is null): bootstrap, no walk.
 * - Exactly one unacknowledged day: play that single transition.
 * - Larger gaps: snap to the real current day. Do not chain walks.
 */
export function getJourneyProgression(input: JourneyProgressionInput): JourneyProgressionDecision {
  const planDayCount = input.planDayCount ?? PLAN_DAY_COUNT;
  const currentDay = Math.min(planDayCount, Math.max(1, input.currentDay));

  if (input.acknowledgedDay == null) {
    return { kind: 'bootstrap', day: currentDay };
  }

  const acknowledgedDay = Math.min(planDayCount, Math.max(1, input.acknowledgedDay));
  if (currentDay <= acknowledgedDay) {
    return { kind: 'idle' };
  }

  if (currentDay === acknowledgedDay + 1) {
    return {
      kind: 'advance',
      fromDay: acknowledgedDay,
      toDay: currentDay,
    };
  }

  return { kind: 'snap', toDay: currentDay };
}

export function getJourneyProgressionVisibleDays(
  fromDay: number,
  toDay: number,
): readonly number[] {
  if (fromDay === toDay) {
    return [toDay];
  }
  return [fromDay, toDay];
}
