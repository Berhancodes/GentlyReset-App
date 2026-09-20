import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';
import { clampJourneyDay } from '../data/journeyChapters';

/** Compact phones show current + neighbor. Wider phones can show more context. */
export const JOURNEY_PATH_MIN_VISIBLE = 2;
export const JOURNEY_PATH_MAX_VISIBLE = 4;
export const JOURNEY_PATH_WIDE_WIDTH = 430;
export const JOURNEY_PATH_COMPACT_WIDTH = 390;

export function getJourneyVisibleCount(width: number): number {
  if (width >= JOURNEY_PATH_WIDE_WIDTH) {
    return JOURNEY_PATH_MAX_VISIBLE;
  }
  if (width <= JOURNEY_PATH_COMPACT_WIDTH) {
    return JOURNEY_PATH_MIN_VISIBLE;
  }
  return 3;
}

/**
 * Days shown in the focused window. Prefers the previous neighbor + current,
 * then fills forward. Never exceeds the 30-day plan. Scroll is presentation
 * only — this helper does not change currentDay.
 */
export function getJourneyPathWindow(
  currentDay: number,
  visibleCount: number,
  planDayCount: number = PLAN_DAY_COUNT,
): readonly number[] {
  const count = Math.min(
    JOURNEY_PATH_MAX_VISIBLE,
    Math.max(JOURNEY_PATH_MIN_VISIBLE, Math.floor(visibleCount)),
    planDayCount,
  );
  const focused = clampJourneyDay(currentDay);
  let start = focused - 1;
  if (start < 1) {
    start = 1;
  }
  let end = start + count - 1;
  if (end > planDayCount) {
    end = planDayCount;
    start = Math.max(1, end - count + 1);
  }
  const days: number[] = [];
  for (let day = start; day <= end; day += 1) {
    days.push(day);
  }
  return days;
}

/** 0-based index of the first visible plan day. Used to focus the path. */
export function getJourneyPathScrollIndex(
  currentDay: number,
  visibleCount: number,
  planDayCount: number = PLAN_DAY_COUNT,
): number {
  const window = getJourneyPathWindow(currentDay, visibleCount, planDayCount);
  const first = window[0];
  if (first === undefined) {
    return 0;
  }
  return first - 1;
}

export function getJourneyPlanDays(planDayCount: number = PLAN_DAY_COUNT): readonly number[] {
  const days: number[] = [];
  for (let day = 1; day <= planDayCount; day += 1) {
    days.push(day);
  }
  return days;
}

export function getJourneySlotWidth(pathWidth: number, visibleCount: number): number {
  const count = Math.max(1, visibleCount);
  return pathWidth / count;
}
