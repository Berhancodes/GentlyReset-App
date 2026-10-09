import { FOUNDATION_PLAN_ID, FOUNDATION_PLAN_VERSION } from '../data/thirtyDayPlan';
import type { ResetPersonalization, ResetSnapshot } from '../types';
import { isValidCalendarDate } from './calendarDate';
import { clampPlanDay, uniquePlanDays } from './clampPlanDay';
import {
  COMPLETION_DATE_RULE,
  RESET_SYNC_SEQUENCE,
  RESET_SYNC_STATUS_ACTIVE,
  type CloudCompletionWrite,
  type CloudCycleWrite,
} from './types';

export { COMPLETION_DATE_RULE };

function clonePersonalization(personalization: ResetPersonalization): ResetPersonalization {
  return {
    ...personalization,
    desiredFeelings: [...personalization.desiredFeelings],
  };
}

/**
 * Cycle 1 cloud fields from a local snapshot.
 *
 * Never include todayTask, reflections, acknowledgedDay, companion state,
 * or Journey UI. currentDay stays a local plan day 1–30.
 */
export function mapSnapshotToCycleWrite(snapshot: ResetSnapshot): CloudCycleWrite {
  return {
    sequence: RESET_SYNC_SEQUENCE,
    planId: FOUNDATION_PLAN_ID,
    planVersion: FOUNDATION_PLAN_VERSION,
    currentDay: clampPlanDay(snapshot.currentDay),
    todayStarted: snapshot.todayStarted,
    todayCompleted: snapshot.todayCompleted,
    resetStartedOn: isValidCalendarDate(snapshot.resetStartedOn) ? snapshot.resetStartedOn : null,
    lastSeenOn: isValidCalendarDate(snapshot.lastSeenOn) ? snapshot.lastSeenOn : null,
    lastCompletedOn: isValidCalendarDate(snapshot.lastCompletedOn)
      ? snapshot.lastCompletedOn
      : null,
    streak: Math.max(0, snapshot.streak),
    missedYesterday: snapshot.missedYesterday,
    resetTypeId: snapshot.resetTypeId,
    personalization: clonePersonalization(snapshot.personalization),
    profileAccuracy: snapshot.profileAccuracy ?? null,
    status: RESET_SYNC_STATUS_ACTIVE,
    completedAt: null,
  };
}

/**
 * Completion date rule (Phase 4D):
 *
 * - One row per local day in completedDays.
 * - A day with a recorded `completionDates` entry sends that real date.
 * - Historical `completed_on` is NULL when the real calendar date is unknown.
 * - If `lastCompletedOn` is a valid YYYY-MM-DD and the latest completed day
 *   (`max(completedDays)`) is known, that single latest row may receive
 *   `lastCompletedOn`. Older rows stay NULL.
 * - Do not invent dates by walking backward from lastCompletedOn.
 */
export function mapCompletedDaysToCloud(
  completedDays: readonly number[],
  lastCompletedOn: string | null,
  completionDates?: Partial<Record<number, string>>,
): CloudCompletionWrite[] {
  const days = uniquePlanDays(completedDays);
  const latestDay = days[days.length - 1];
  const latestDate = isValidCalendarDate(lastCompletedOn) ? lastCompletedOn : null;

  return days.map((localDay) => {
    const recorded = completionDates?.[localDay];
    if (isValidCalendarDate(recorded)) {
      return { localDay, completedOn: recorded };
    }
    return { localDay, completedOn: latestDay === localDay ? latestDate : null };
  });
}

export function mapSnapshotToCloudPayload(snapshot: ResetSnapshot): {
  cycle: CloudCycleWrite;
  completions: CloudCompletionWrite[];
} {
  return {
    cycle: mapSnapshotToCycleWrite(snapshot),
    completions: mapCompletedDaysToCloud(
      snapshot.completedDays,
      snapshot.lastCompletedOn,
      snapshot.completionDates,
    ),
  };
}

/** Cloud-relevant fingerprint. Ignores todayTask, reflections, and Journey UI. */
export function cloudRelevantFingerprint(snapshot: ResetSnapshot): string {
  return JSON.stringify({
    currentDay: clampPlanDay(snapshot.currentDay),
    completedDays: uniquePlanDays(snapshot.completedDays),
    todayStarted: snapshot.todayStarted,
    todayCompleted: snapshot.todayCompleted,
    resetStartedOn: snapshot.resetStartedOn,
    lastSeenOn: snapshot.lastSeenOn,
    lastCompletedOn: snapshot.lastCompletedOn,
    streak: snapshot.streak,
    missedYesterday: snapshot.missedYesterday,
    resetTypeId: snapshot.resetTypeId,
    profileAccuracy: snapshot.profileAccuracy ?? null,
    personalization: snapshot.personalization,
  });
}
