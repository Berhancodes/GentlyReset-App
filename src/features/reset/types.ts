export const RESET_TYPE_IDS = [
  'overloaded-dreamer',
  'soft-restarter',
  'almost-starter',
  'fading-flame',
] as const;

export type ResetTypeId = (typeof RESET_TYPE_IDS)[number];

export const RESET_TYPE_NAMES: Record<ResetTypeId, string> = {
  'overloaded-dreamer': 'The Overloaded Dreamer',
  'soft-restarter': 'The Soft Restarter',
  'almost-starter': 'The Almost Starter',
  'fading-flame': 'The Fading Flame',
};

/**
 * When top scores are equal (including all-zero sparse answers), prefer this
 * order. Restarter and Almost Starter have the cleanest single-question
 * diagnostics; Dreamer is the broad leftover cluster — not first just because
 * it was the old mock.
 */
export const RESET_TYPE_TIE_PRIORITY: readonly ResetTypeId[] = [
  'soft-restarter',
  'almost-starter',
  'fading-flame',
  'overloaded-dreamer',
];

export type ResetTypeScores = Record<ResetTypeId, number>;

export type ResetPersonalization = {
  dailyCommitment?: string;
  supportStyle?: string;
  primaryObstacle?: string;
  resetReason?: string;
  desiredFeelings: readonly string[];
  missedDayResponse?: string;
};

export type TodayTask = {
  id: string;
  day: number;
  title: string;
  description: string;
  minutes: number;
};

export type JournalMood = 1 | 2 | 3 | 4 | 5;

export type JournalEntry = {
  day: number;
  date: string;
  mood: JournalMood;
  prompt: string;
  text: string;
  savedAt: string;
};

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
