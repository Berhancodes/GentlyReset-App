import type { JournalMood } from '../../domain/journal/types';
import type { ResetSnapshot } from '../../features/reset/types';
import { applySaveReflection } from '../../features/reset/utils/dailyResetActions';

/**
 * Upsert today's journal reflection.
 * Delegates to Phase 1 `applySaveReflection` — the one journal write.
 * Does not start, complete, or advance the plan day. Does not persist `cycleId`.
 */
export function saveReflection(
  state: ResetSnapshot,
  input: { mood: JournalMood; text: string; prompt: string },
  now: Date = new Date(),
): ResetSnapshot {
  return applySaveReflection(state, input, now);
}
