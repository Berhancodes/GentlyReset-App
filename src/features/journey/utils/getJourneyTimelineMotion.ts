import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';
import { clampJourneyDay } from '../data/journeyChapters';
import type { JourneyWalkDirection } from './getJourneyWalkMotion';

export type JourneyTimelineTrack = {
  currentX: number;
  nextX: number;
  travelDistance: number;
};

export type JourneyTimelinePositions = {
  outgoingX: number;
  incomingX: number;
  mascotX: number;
};

export function getJourneyRestingDays(
  currentDay: number,
  planDayCount: number = PLAN_DAY_COUNT,
): readonly number[] {
  const current = Math.min(planDayCount, Math.max(1, clampJourneyDay(currentDay)));
  return [current];
}

export function getJourneyIncomingDay(
  fromDay: number,
  toDay: number,
  planDayCount: number = PLAN_DAY_COUNT,
): number | undefined {
  if (toDay <= fromDay || toDay > planDayCount) {
    return undefined;
  }
  return toDay;
}

/** Static current → next marks. The mascot walks; the nodes stay put. */
export function getJourneyTimelineTrack(currentX: number, nextX: number): JourneyTimelineTrack {
  return {
    currentX,
    nextX,
    travelDistance: nextX - currentX,
  };
}

export function getJourneyTimelinePositions(
  progress: number,
  track: JourneyTimelineTrack,
  direction: JourneyWalkDirection = 1,
): JourneyTimelinePositions {
  const clamped = Math.min(1, Math.max(0, progress));
  return {
    outgoingX: track.currentX,
    incomingX: track.nextX,
    mascotX: clamped * track.travelDistance * direction,
  };
}
