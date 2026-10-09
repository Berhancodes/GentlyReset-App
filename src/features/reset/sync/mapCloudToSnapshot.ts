import type { JournalEntry, ResetPersonalization, ResetSnapshot } from '../types';
import { getTaskForDay } from '../utils/getTaskForDay';
import { isValidCalendarDate } from './calendarDate';
import { clampPlanDay, uniquePlanDays } from './clampPlanDay';
import type { CloudCompletionWrite, CloudCycleRecord, CloudCycleWrite } from './types';

function readPersonalization(value: ResetPersonalization): ResetPersonalization {
  return {
    dailyCommitment: value.dailyCommitment,
    supportStyle: value.supportStyle,
    primaryObstacle: value.primaryObstacle,
    resetReason: value.resetReason,
    desiredFeelings: [...(value.desiredFeelings ?? [])],
    missedDayResponse: value.missedDayResponse,
  };
}

/**
 * Reconstruct a local ResetSnapshot from Cycle 1 cloud rows.
 * Re-derives todayTask. Reflections stay local and are passed in.
 */
export function mapCloudToSnapshot(
  record: CloudCycleRecord,
  localReflections: readonly JournalEntry[],
): ResetSnapshot {
  return mapCycleWriteToSnapshot(record.cycle, record.completions, localReflections);
}

export function mapCycleWriteToSnapshot(
  cycle: CloudCycleWrite,
  completions: readonly CloudCompletionWrite[],
  localReflections: readonly JournalEntry[],
): ResetSnapshot {
  const personalization = readPersonalization(cycle.personalization);
  const currentDay = clampPlanDay(cycle.currentDay);
  const completedDays = uniquePlanDays(completions.map((row) => row.localDay));
  const completionDates: Partial<Record<number, string>> = {};
  for (const row of completions) {
    if (isValidCalendarDate(row.completedOn)) {
      completionDates[clampPlanDay(row.localDay)] = row.completedOn;
    }
  }

  return {
    currentDay,
    completedDays,
    completionDates,
    todayCompleted: cycle.todayCompleted,
    todayStarted: cycle.todayStarted,
    todayTask: getTaskForDay(currentDay, personalization, cycle.resetTypeId),
    resetStartedOn: isValidCalendarDate(cycle.resetStartedOn) ? cycle.resetStartedOn : null,
    lastSeenOn: isValidCalendarDate(cycle.lastSeenOn) ? cycle.lastSeenOn : null,
    lastCompletedOn: isValidCalendarDate(cycle.lastCompletedOn) ? cycle.lastCompletedOn : null,
    streak: Math.max(0, cycle.streak),
    missedYesterday: cycle.missedYesterday,
    resetTypeId: cycle.resetTypeId,
    profileAccuracy: cycle.profileAccuracy ?? undefined,
    personalization,
    reflections: localReflections.map((entry) => ({ ...entry })),
  };
}
