import type { ResetSnapshot } from '../../features/reset/types';
import { applyStartToday } from '../../features/reset/utils/dailyResetActions';

/**
 * Mark today's local reset day as started.
 * Delegates to Phase 1 `applyStartToday` — the one start implementation.
 * No-op when not seeded or already completed. Does not complete or advance.
 */
export function startResetDay(state: ResetSnapshot): ResetSnapshot {
  return applyStartToday(state);
}
