import type { ResetTypeId } from '../types';
import { resolveContentResetTypeId } from './modifiers';

/** Life areas a plan's daily actions are written for. Matches the outOfBalance answers. */
export const FOCUS_AREA_IDS = [
  'mind',
  'energy',
  'habits',
  'confidence',
  'relationships',
  'direction',
] as const;

export type FocusAreaId = (typeof FOCUS_AREA_IDS)[number];

export function isFocusAreaId(value: string): value is FocusAreaId {
  return (FOCUS_AREA_IDS as readonly string[]).includes(value);
}

/** Used when a snapshot has no focus areas (installs from before plans had them). */
const DEFAULT_FOCUS_AREA_BY_TYPE: Record<ResetTypeId, FocusAreaId> = {
  'overloaded-dreamer': 'mind',
  'soft-restarter': 'habits',
  'almost-starter': 'direction',
  'fading-flame': 'habits',
  'all-in-heart': 'energy',
  'quiet-drain': 'energy',
  'drifting-compass': 'direction',
  'quiet-stranger': 'confidence',
  'soft-scatter': 'habits',
};

/** The first valid stored area, else the reset type's natural area. */
export function resolveFocusArea(
  focusAreas: readonly string[] | undefined,
  resetTypeId?: string,
): FocusAreaId {
  const stored = focusAreas?.find(isFocusAreaId);
  if (stored) {
    return stored;
  }
  return DEFAULT_FOCUS_AREA_BY_TYPE[resolveContentResetTypeId(resetTypeId)];
}
