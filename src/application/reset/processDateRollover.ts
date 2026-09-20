import type { ResetSnapshot } from '../../features/reset/types';
import { processDateRollover as applyPhase1DateRollover } from '../../features/reset/utils/applyDateRollover';

/**
 * Calendar-day sync use case.
 * One implementation: Phase 1 `processDateRollover` / `applyDateRollover`.
 * Do not copy rollover, streak, or Day-30 rules here.
 */
export function processDateRollover(state: ResetSnapshot, now: Date): ResetSnapshot {
  return applyPhase1DateRollover(state, now);
}
