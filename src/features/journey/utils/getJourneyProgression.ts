import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';

export type JourneyProgressionDecision =
  | { kind: 'idle' }
  | { kind: 'bootstrap'; day: number }
  | { kind: 'advance'; fromDay: number; toDay: number }
  | { kind: 'snap'; toDay: number };

export type JourneyProgressionInput = {
  currentDay: number;
  acknowledgedDay: number | null;
  todayCompleted?: boolean;
  planDayCount?: number;
};

/**
 * Visual rest target. Completing today walks the mascot to the next node.
 * `currentDay` still only increments on the next calendar rollover.
 */
export function getJourneyVisualTargetDay(input: {
  currentDay: number;
  todayCompleted: boolean;
  planDayCount?: number;
}): number {
  const planDayCount = input.planDayCount ?? PLAN_DAY_COUNT;
  const currentDay = Math.min(planDayCount, Math.max(1, input.currentDay));
  if (input.todayCompleted && currentDay < planDayCount) {
    return currentDay + 1;
  }
  return currentDay;
}

/**
 * Visual Journey progress vs the real `currentDay`.
 *
 * Completing a reset does not advance `currentDay`. The plan day only
 * increments on the next calendar rollover, and only by one day.
 * Completing today does move the mascot to the next node.
 *
 * - First Journey visit (`acknowledgedDay` is null): bootstrap, unless today
 *   is already complete — then play that one walk.
 * - Exactly one unacknowledged visual day: play that single transition.
 * - Larger gaps: snap. Do not chain walks.
 */
export function getJourneyProgression(input: JourneyProgressionInput): JourneyProgressionDecision {
  const planDayCount = input.planDayCount ?? PLAN_DAY_COUNT;
  const currentDay = Math.min(planDayCount, Math.max(1, input.currentDay));
  const visualTarget = getJourneyVisualTargetDay({
    currentDay,
    todayCompleted: input.todayCompleted === true,
    planDayCount,
  });

  if (input.acknowledgedDay == null) {
    if (visualTarget > currentDay) {
      return {
        kind: 'advance',
        fromDay: currentDay,
        toDay: visualTarget,
      };
    }
    return { kind: 'bootstrap', day: currentDay };
  }

  const acknowledgedDay = Math.min(planDayCount, Math.max(1, input.acknowledgedDay));
  if (visualTarget <= acknowledgedDay) {
    return { kind: 'idle' };
  }

  if (visualTarget === acknowledgedDay + 1) {
    return {
      kind: 'advance',
      fromDay: acknowledgedDay,
      toDay: visualTarget,
    };
  }

  return { kind: 'snap', toDay: visualTarget };
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
