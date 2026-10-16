import type { FocusAreaId } from '../../domain/reset/roadmap';
import type { ResetSnapshot } from '../../features/reset/types';
import { applyStartNextSeason } from '../../features/reset/utils/dailyResetActions';

/**
 * Start the season after a finished one, in the chosen focus area.
 * Snapshot-in/out. Repo-backed: `createResetApplication(repo).startNextSeason()`.
 */
export function startNextSeason(
  state: ResetSnapshot,
  focusAreaId: FocusAreaId,
  now: Date = new Date(),
): ResetSnapshot {
  return applyStartNextSeason(state, focusAreaId, now);
}
