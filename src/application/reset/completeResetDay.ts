import type { ResetSnapshot } from '../../features/reset/types';
import { applyCompleteToday } from '../../features/reset/utils/dailyResetActions';

/**
 * Complete today's local reset day.
 * Delegates to Phase 1 `applyCompleteToday` — the one complete implementation.
 *
 * Day 30 stays Day 30 until the user starts the next season (`startNextSeason`). No Day 31.
 *
 * Snapshot-in/out (Phase 2B). Repo-backed: `createResetApplication(repo).completeResetDay()`.
 */
export function completeResetDay(state: ResetSnapshot, now: Date = new Date()): ResetSnapshot {
  return applyCompleteToday(state, now);
}
