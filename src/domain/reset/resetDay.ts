import { getOverallDayNumber } from './resetCycle';
import { getTaskForDay } from './resetPlan';
import type { ResetCycle, ResetDay, ResetDayStatus, ResetPlan } from './types';

function localDayNumber(dayNumber: number, planLength: number): number {
  const safeLength = planLength >= 1 ? planLength : 1;
  return Math.min(safeLength, Math.max(1, dayNumber));
}

function dayStatus(cycle: ResetCycle, dayNumber: number): ResetDayStatus {
  if (cycle.completedDays.includes(dayNumber)) {
    return 'completed';
  }
  if (dayNumber === cycle.currentDay) {
    return 'current';
  }
  return 'future';
}

/**
 * Derived ResetDay. Not persisted.
 * `dayNumber` is LOCAL. `overallDayNumber` uses getOverallDayNumber.
 * Task uses the canonical resolver. Optional `started` maps to todayStarted
 * only on the cycle's current local day.
 */
export function getResetDay(cycle: ResetCycle, plan: ResetPlan, dayNumber: number): ResetDay {
  const localDay = localDayNumber(dayNumber, plan.length);
  const status = dayStatus(cycle, localDay);
  const isCurrentLocalDay = localDay === cycle.currentDay;

  return {
    cycleId: cycle.id,
    dayNumber: localDay,
    overallDayNumber: getOverallDayNumber(cycle.sequence, localDay, plan.length),
    task: getTaskForDay(localDay, cycle.personalization),
    status,
    ...(isCurrentLocalDay ? { started: cycle.todayStarted } : {}),
  };
}
