import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';
import { motion } from '../../../design-system/motion';
import { clampJourneyDay } from '../data/journeyChapters';
import type { JourneyWalkDirection } from './getJourneyWalkMotion';

export type JourneyTimelineTrack = {
  currentX: number;
  incomingStartX: number;
  outgoingEndX: number;
  worldTravel: number;
  mascotLead: number;
};

export type JourneyTimelinePositions = {
  outgoingX: number;
  incomingX: number;
  mascotLeadX: number;
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

export function getJourneyTimelineTrack(
  stageWidth: number,
  currentX: number,
  edgePad: number = motion.offset.journeyTimelineEdgePad,
): JourneyTimelineTrack {
  const incomingStartX = Math.max(stageWidth, currentX) + edgePad;
  const worldTravel = incomingStartX - currentX;
  return {
    currentX,
    incomingStartX,
    outgoingEndX: currentX - worldTravel,
    worldTravel,
    mascotLead: worldTravel * motion.offset.journeyMascotLeadShare,
  };
}

export function getJourneyTimelinePositions(
  progress: number,
  track: JourneyTimelineTrack,
  direction: JourneyWalkDirection = 1,
): JourneyTimelinePositions {
  const clamped = Math.min(1, Math.max(0, progress));
  const worldShift = clamped * track.worldTravel * direction;
  return {
    outgoingX: track.currentX - worldShift,
    incomingX: track.incomingStartX - worldShift,
    mascotLeadX: Math.sin(clamped * Math.PI) * track.mascotLead * direction,
  };
}

export function isJourneyTimelineNodeOffscreen(
  nodeX: number,
  stageWidth: number,
  nodeHalfWidth: number,
): boolean {
  return nodeX + nodeHalfWidth <= 0 || nodeX - nodeHalfWidth >= stageWidth;
}
