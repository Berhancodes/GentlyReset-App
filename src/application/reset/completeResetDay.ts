import type { ResetSnapshot } from '../../features/reset/types';
import { applyCompleteToday } from '../../features/reset/utils/dailyResetActions';

/**
 * Complete today's local reset day.
 * Delegates to Phase 1 `applyCompleteToday` — the one complete implementation.
 *
 * This is not `completeResetCycle`. Day 30 stays Day 30. No Cycle 2, no Day 31.
 */
export function completeResetDay(state: ResetSnapshot, now: Date = new Date()): ResetSnapshot {
  return applyCompleteToday(state, now);
}
