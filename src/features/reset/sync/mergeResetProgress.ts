import { FOUNDATION_PLAN_ID, FOUNDATION_PLAN_VERSION } from '../data/thirtyDayPlan';
import type { ResetSnapshot } from '../types';
import { applyDateRollover } from '../utils/applyDateRollover';
import { calendarDaysBetween } from '../utils/calendar';
import { getTaskForDay } from '../utils/getTaskForDay';
import { earlierCalendarDate, isValidCalendarDate, laterCalendarDate } from './calendarDate';
import { clampPlanDay, uniquePlanDays } from './clampPlanDay';
import { mapCloudToSnapshot } from './mapCloudToSnapshot';
import { getSnapshotSeasonNumber, mapCompletedDaysToCloud } from './mapSnapshotToCloud';
import type { CloudCompletionWrite, CloudCycleRecord } from './types';

export type MergeSuccess = {
  kind: 'merged';
  snapshot: ResetSnapshot;
  completions: CloudCompletionWrite[];
};

export type MergeConflict = {
  kind: 'conflict';
  code: 'unsafe-merge';
  message: string;
};

export type MergeResult = MergeSuccess | MergeConflict;

function mergeCompletionDates(
  localDays: readonly number[],
  localLastCompletedOn: string | null,
  cloudCompletions: readonly CloudCompletionWrite[],
): CloudCompletionWrite[] {
  const localLatest = uniquePlanDays(localDays)[uniquePlanDays(localDays).length - 1];
  const localDateByDay = new Map<number, string | null>();
  for (const day of uniquePlanDays(localDays)) {
    localDateByDay.set(
      day,
      day === localLatest && isValidCalendarDate(localLastCompletedOn)
        ? localLastCompletedOn
        : null,
    );
  }

  const cloudDateByDay = new Map<number, string | null>();
  for (const row of cloudCompletions) {
    cloudDateByDay.set(row.localDay, isValidCalendarDate(row.completedOn) ? row.completedOn : null);
  }

  const unionDays = uniquePlanDays([...localDateByDay.keys(), ...cloudDateByDay.keys()]);

  return unionDays.map((localDay) => ({
    localDay,
    completedOn: laterCalendarDate(
      localDateByDay.get(localDay) ?? null,
      cloudDateByDay.get(localDay) ?? null,
    ),
  }));
}

function canRecomputeStreak(completions: readonly CloudCompletionWrite[]): boolean {
  return completions.length > 0 && completions.every((row) => isValidCalendarDate(row.completedOn));
}

function recomputeStreak(
  completions: readonly CloudCompletionWrite[],
  lastCompletedOn: string | null,
): number | null {
  if (!canRecomputeStreak(completions) || !isValidCalendarDate(lastCompletedOn)) {
    return null;
  }

  const dates = completions
    .map((row) => row.completedOn)
    .filter(isValidCalendarDate)
    .sort();
  const latest = dates[dates.length - 1];
  if (!latest || latest !== lastCompletedOn) {
    return null;
  }

  const uniqueDates = [...new Set(dates)].sort();
  let streak = 1;
  for (let index = uniqueDates.length - 1; index > 0; index -= 1) {
    const current = uniqueDates[index];
    const previous = uniqueDates[index - 1];
    if (!current || !previous) {
      break;
    }
    if (calendarDaysBetween(previous, current) === 1) {
      streak += 1;
      continue;
    }
    break;
  }

  return streak;
}

function personalizationFingerprint(value: ResetSnapshot['personalization']): string {
  return JSON.stringify({
    dailyCommitment: value.dailyCommitment ?? null,
    supportStyle: value.supportStyle ?? null,
    primaryObstacle: value.primaryObstacle ?? null,
    resetReason: value.resetReason ?? null,
    desiredFeelings: [...value.desiredFeelings],
    missedDayResponse: value.missedDayResponse ?? null,
    focusAreas: value.focusAreas ? [...value.focusAreas] : null,
    season: value.season ?? null,
    pastFocusAreas: value.pastFocusAreas ? [...value.pastFocusAreas] : null,
  });
}

function snapshotsCloudEqual(left: ResetSnapshot, right: ResetSnapshot): boolean {
  return (
    clampPlanDay(left.currentDay) === clampPlanDay(right.currentDay) &&
    left.todayStarted === right.todayStarted &&
    left.todayCompleted === right.todayCompleted &&
    left.resetStartedOn === right.resetStartedOn &&
    left.lastSeenOn === right.lastSeenOn &&
    left.lastCompletedOn === right.lastCompletedOn &&
    left.streak === right.streak &&
    left.missedYesterday === right.missedYesterday &&
    left.resetTypeId === right.resetTypeId &&
    (left.profileAccuracy ?? null) === (right.profileAccuracy ?? null) &&
    personalizationFingerprint(left.personalization) ===
      personalizationFingerprint(right.personalization) &&
    JSON.stringify(uniquePlanDays(left.completedDays)) ===
      JSON.stringify(uniquePlanDays(right.completedDays))
  );
}

/**
 * Deterministic merge. Not "latest updated_at wins."
 *
 * Seasons: if local and cloud are on different seasons, the newer season wins whole.
 * Within one season:
 *
 * completedDays: UNION
 * currentDay: never rewind; furthest valid 1–30
 * resetTypeId / personalization: seeded cloud identity stays frozen
 * lastCompletedOn: later valid date
 * lastSeenOn / today flags / missedYesterday: existing rollover in profile TZ
 * streak: recompute only with dated history; otherwise safest canonical value
 */
export function mergeResetProgress(
  local: ResetSnapshot,
  cloud: CloudCycleRecord,
  timeZoneToday: string,
): MergeResult {
  if (
    cloud.cycle.planId !== FOUNDATION_PLAN_ID ||
    cloud.cycle.planVersion !== FOUNDATION_PLAN_VERSION
  ) {
    return {
      kind: 'conflict',
      code: 'unsafe-merge',
      message:
        'Cloud cycle plan identity is not the Foundation plan. Backup is paused so reset semantics stay unchanged.',
    };
  }

  const cloudSnapshot = mapCloudToSnapshot(cloud, local.reflections);
  const localType = local.resetTypeId.trim();
  const cloudType = cloudSnapshot.resetTypeId.trim();
  if (localType.length > 0 && cloudType.length > 0 && localType !== cloudType) {
    return {
      kind: 'conflict',
      code: 'unsafe-merge',
      message:
        'Local and cloud reset types differ. Backup is paused so the cycle is not silently reclassified.',
    };
  }

  // Different seasons never mix days: the newer season is the truth.
  const localSeason = getSnapshotSeasonNumber(local);
  if (localSeason !== cloud.cycle.sequence) {
    const newer = localSeason > cloud.cycle.sequence ? local : cloudSnapshot;
    const rolledNewer = applyDateRollover(newer, timeZoneToday);
    return {
      kind: 'merged',
      snapshot: {
        ...rolledNewer,
        todayTask: getTaskForDay(
          rolledNewer.currentDay,
          rolledNewer.personalization,
          rolledNewer.resetTypeId,
        ),
        reflections: local.reflections.map((entry) => ({ ...entry })),
      },
      completions:
        newer === local
          ? mapCompletedDaysToCloud(
              local.completedDays,
              local.lastCompletedOn,
              local.completionDates,
            )
          : cloud.completions.map((row) => ({ ...row })),
    };
  }

  // Cloud identity stays frozen, but a backup from before focus areas learns them from this device.
  const personalization =
    cloudSnapshot.personalization.focusAreas === undefined &&
    local.personalization.focusAreas !== undefined
      ? { ...cloudSnapshot.personalization, focusAreas: [...local.personalization.focusAreas] }
      : cloudSnapshot.personalization;

  const completions = mergeCompletionDates(
    local.completedDays,
    local.lastCompletedOn,
    cloud.completions,
  );
  const completedDays = completions.map((row) => row.localDay);
  const currentDay = clampPlanDay(Math.max(local.currentDay, cloudSnapshot.currentDay));
  const lastCompletedOn = laterCalendarDate(local.lastCompletedOn, cloudSnapshot.lastCompletedOn);
  const lastSeenOn = laterCalendarDate(local.lastSeenOn, cloudSnapshot.lastSeenOn);
  const resetStartedOn = earlierCalendarDate(local.resetStartedOn, cloudSnapshot.resetStartedOn);

  const furthestIsCloud = cloudSnapshot.currentDay > local.currentDay;
  const sameDay = cloudSnapshot.currentDay === local.currentDay;
  const laterSeenIsCloud =
    sameDay &&
    isValidCalendarDate(cloudSnapshot.lastSeenOn) &&
    isValidCalendarDate(local.lastSeenOn) &&
    cloudSnapshot.lastSeenOn > local.lastSeenOn;
  const flagSource = furthestIsCloud || laterSeenIsCloud ? cloudSnapshot : local;

  const recomputed = recomputeStreak(completions, lastCompletedOn);
  const safestStreak =
    recomputed ??
    (furthestIsCloud
      ? cloudSnapshot.streak
      : sameDay
        ? Math.max(local.streak, cloudSnapshot.streak)
        : local.streak);

  const merged: ResetSnapshot = {
    currentDay,
    completedDays,
    todayCompleted: flagSource.todayCompleted,
    todayStarted: flagSource.todayStarted,
    todayTask: getTaskForDay(currentDay, personalization, cloudSnapshot.resetTypeId),
    resetStartedOn,
    lastSeenOn,
    lastCompletedOn,
    streak: safestStreak,
    missedYesterday: flagSource.missedYesterday,
    resetTypeId: cloudType.length > 0 ? cloudSnapshot.resetTypeId : local.resetTypeId,
    profileAccuracy: cloudSnapshot.profileAccuracy ?? local.profileAccuracy,
    personalization,
    reflections: local.reflections.map((entry) => ({ ...entry })),
  };

  const rolled = applyDateRollover(merged, timeZoneToday);
  const snapshot: ResetSnapshot = {
    ...rolled,
    todayTask: getTaskForDay(rolled.currentDay, rolled.personalization, rolled.resetTypeId),
    reflections: local.reflections.map((entry) => ({ ...entry })),
  };

  if (lastCompletedOn && snapshot.lastCompletedOn && snapshot.lastCompletedOn < lastCompletedOn) {
    return {
      kind: 'conflict',
      code: 'unsafe-merge',
      message: 'Rollover would move lastCompletedOn earlier than known history. Backup is paused.',
    };
  }

  return {
    kind: 'merged',
    snapshot,
    completions,
  };
}

export function cloudRecordMatchesSnapshot(
  record: CloudCycleRecord,
  snapshot: ResetSnapshot,
): boolean {
  const reconstructed = mapCloudToSnapshot(record, snapshot.reflections);
  return snapshotsCloudEqual(reconstructed, snapshot);
}
