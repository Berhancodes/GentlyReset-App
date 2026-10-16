import type { ResetPersonalization } from '../types';
import { FOCUS_AREA_IDS, isFocusAreaId, resolveFocusArea, type FocusAreaId } from './focusAreas';

export type ResolvedSeason = {
  number: number;
  focusAreaId: FocusAreaId;
  level: number;
};

export type NextSeasonOption = {
  focusAreaId: FocusAreaId;
  level: number;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1;
}

/** The season in progress. Snapshots without one are season 1 in their first focus area. */
export function resolveSeason(
  personalization: ResetPersonalization,
  resetTypeId?: string,
): ResolvedSeason {
  const stored = personalization.season;
  if (
    stored &&
    isPositiveInteger(stored.number) &&
    isPositiveInteger(stored.level) &&
    isFocusAreaId(stored.focusAreaId)
  ) {
    return { number: stored.number, focusAreaId: stored.focusAreaId, level: stored.level };
  }
  return {
    number: 1,
    focusAreaId: resolveFocusArea(personalization.focusAreas, resetTypeId),
    level: 1,
  };
}

function finishedAreas(personalization: ResetPersonalization, current: ResolvedSeason): string[] {
  return [...(personalization.pastFocusAreas ?? []), current.focusAreaId];
}

function timesDone(areas: readonly string[], focusAreaId: FocusAreaId): number {
  return areas.filter((areaId) => areaId === focusAreaId).length;
}

/**
 * The two ways forward after a season: go deeper in the same area, or move to
 * the area done least so far (the user's own order breaks ties, then the rest).
 */
export function getNextSeasonOptions(
  personalization: ResetPersonalization,
  resetTypeId?: string,
): { deeper: NextSeasonOption; next: NextSeasonOption } {
  const current = resolveSeason(personalization, resetTypeId);
  const finished = finishedAreas(personalization, current);
  const preferred = (personalization.focusAreas ?? []).filter(isFocusAreaId);
  const candidates = [...new Set([...preferred, ...FOCUS_AREA_IDS])].filter(
    (areaId) => areaId !== current.focusAreaId,
  );

  let nextArea = candidates[0] ?? current.focusAreaId;
  for (const areaId of candidates) {
    if (timesDone(finished, areaId) < timesDone(finished, nextArea)) {
      nextArea = areaId;
    }
  }

  return {
    deeper: {
      focusAreaId: current.focusAreaId,
      level: timesDone(finished, current.focusAreaId) + 1,
    },
    next: { focusAreaId: nextArea, level: timesDone(finished, nextArea) + 1 },
  };
}

/** Personalization for the season after this one, in the chosen area. */
export function personalizationForNextSeason(
  personalization: ResetPersonalization,
  focusAreaId: FocusAreaId,
  resetTypeId?: string,
): ResetPersonalization {
  const current = resolveSeason(personalization, resetTypeId);
  const pastFocusAreas = finishedAreas(personalization, current);
  return {
    ...personalization,
    desiredFeelings: [...personalization.desiredFeelings],
    pastFocusAreas,
    season: {
      number: current.number + 1,
      focusAreaId,
      level: timesDone(pastFocusAreas, focusAreaId) + 1,
    },
  };
}
