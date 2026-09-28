import type { RoadmapPhase } from './types';
import { PLAN_DAY_COUNT } from '../resetPlanConstants';

export function clampPlanDay(day: number): number {
  return Math.min(PLAN_DAY_COUNT, Math.max(1, day));
}

export function getRoadmapPhaseForDay(day: number): RoadmapPhase {
  const clamped = clampPlanDay(day);
  if (clamped <= 7) {
    return 'stabilize';
  }
  if (clamped <= 14) {
    return 'change';
  }
  if (clamped <= 21) {
    return 'pattern';
  }
  if (clamped <= 28) {
    return 'independence';
  }
  return 'close';
}
