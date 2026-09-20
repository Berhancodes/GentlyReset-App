import type { JournalEntry } from '../../domain/journal/types';
import type { ResetPersonalization, TodayTask } from '../../domain/reset/types';

export {
  LEGACY_FALLBACK_RESET_TYPE_ID,
  RESET_TYPE_IDS,
  RESET_TYPE_NAMES,
  RESET_TYPE_TIE_PRIORITY,
  isResetTypeId,
} from '../../domain/reset/types';
export type {
  ResetPersonalization,
  ResetTypeId,
  ResetTypeScores,
  TodayTask,
} from '../../domain/reset/types';

export type { JournalEntry, JournalMood } from '../../domain/journal/types';

export type ResetSnapshot = {
  currentDay: number;
  completedDays: number[];
  todayCompleted: boolean;
  todayStarted: boolean;
  todayTask: TodayTask;
  resetStartedOn: string | null;
  lastSeenOn: string | null;
  lastCompletedOn: string | null;
  streak: number;
  missedYesterday: boolean;
  resetTypeId: string;
  /**
   * Onboarding `profileAccuracy` option id (`scarily-accurate` | `mostly` |
   * `not-really`). Feedback only — never used to reclassify. Optional for
   * snapshots saved before this field existed.
   */
  profileAccuracy?: string;
  personalization: ResetPersonalization;
  reflections: JournalEntry[];
};
