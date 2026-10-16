export const RESET_TYPE_IDS = [
  'overloaded-dreamer',
  'soft-restarter',
  'almost-starter',
  'fading-flame',
  'all-in-heart',
  'quiet-drain',
  'drifting-compass',
  'quiet-stranger',
  'soft-scatter',
] as const;

export type ResetTypeId = (typeof RESET_TYPE_IDS)[number];

export const RESET_TYPE_NAMES: Record<ResetTypeId, string> = {
  'overloaded-dreamer': 'The Overloaded Dreamer',
  'soft-restarter': 'The Soft Restarter',
  'almost-starter': 'The Almost Starter',
  'fading-flame': 'The Fading Flame',
  'all-in-heart': 'The All-In Heart',
  'quiet-drain': 'The Quiet Drain',
  'drifting-compass': 'The Drifting Compass',
  'quiet-stranger': 'The Quiet Stranger',
  'soft-scatter': 'The Soft Scatter',
};

/**
 * When top scores are equal (including all-zero sparse answers), prefer this
 * order. Specific mechanics before leftover ambition. Dreamer is last so it
 * is no longer a generic bucket.
 */
export const RESET_TYPE_TIE_PRIORITY: readonly ResetTypeId[] = [
  'soft-restarter',
  'almost-starter',
  'quiet-drain',
  'all-in-heart',
  'fading-flame',
  'quiet-stranger',
  'soft-scatter',
  'drifting-compass',
  'overloaded-dreamer',
];

export type ResetTypeScores = Record<ResetTypeId, number>;

/** Legacy fallback for old snapshots with an unknown/missing id and no answers. */
export const LEGACY_FALLBACK_RESET_TYPE_ID: ResetTypeId = 'overloaded-dreamer';

export function isResetTypeId(value: string): value is ResetTypeId {
  return (RESET_TYPE_IDS as readonly string[]).includes(value);
}

export type ResetPersonalization = {
  dailyCommitment?: string;
  supportStyle?: string;
  primaryObstacle?: string;
  resetReason?: string;
  desiredFeelings: readonly string[];
  missedDayResponse?: string;
  /** Life areas from onboarding, most important first. Picks the plan's daily actions. */
  focusAreas?: readonly string[];
  /** The season in progress. Missing means season 1 in the first focus area. */
  season?: SeasonFocus;
  /** Focus area of each finished season, oldest first. */
  pastFocusAreas?: readonly string[];
};

/** Which season this is, what it is about, and how deep it goes (1 = first time in the area). */
export type SeasonFocus = {
  number: number;
  focusAreaId: string;
  level: number;
};

export type TodayTask = {
  id: string;
  day: number;
  title: string;
  description: string;
  minutes: number;
  /** Today's checklist: prepare, do the action, check in. */
  steps: readonly string[];
};

/**
 * Snapshot fields the domain adapter reads. Structurally compatible with the
 * persisted ResetSnapshot. Domain does not own persist.
 */
export type ResetSnapshotSource = {
  currentDay: number;
  completedDays: readonly number[];
  todayStarted: boolean;
  resetStartedOn: string | null;
  resetTypeId: string;
  personalization: ResetPersonalization;
};

export type ResetCycleStatus = 'active' | 'completed';

/**
 * Explicit in-progress (or later completed) 30-day cycle.
 * Phase 2A maps today's single snapshot to sequence 1 and always 'active'.
 * `completedAt` is never fabricated. `currentDay` is LOCAL 1–30.
 */
export type ResetCycle = {
  id: string;
  sequence: number;
  planId: string;
  planVersion: number;
  currentDay: number;
  completedDays: readonly number[];
  resetTypeId: string;
  startedAt: string | null;
  completedAt: string | null;
  status: ResetCycleStatus;
  personalization: ResetPersonalization;
  todayStarted: boolean;
};

export type ResetPlan = {
  id: string;
  version: number;
  length: number;
};

export type ResetDayStatus = 'completed' | 'current' | 'future';

/**
 * Derived day view. Not persisted. `dayNumber` is LOCAL to the cycle.
 * `overallDayNumber` is display/analytics only.
 */
export type ResetDay = {
  cycleId: string;
  dayNumber: number;
  overallDayNumber: number;
  task: TodayTask;
  status: ResetDayStatus;
  started?: boolean;
};

export type ResetProfile = {
  id: ResetTypeId;
  name: string;
  summary: string;
  shortSummary: string;
  description: string;
  advice: string;
  emphasized: string;
  biggestPattern: string;
  whatUsuallyHelps: string;
  strength: string;
  pattern: string;
  resetApproach: string;
  homeSupportLine: string;
  missedDayLine: string;
  startedLine: string;
  completedLine: string;
  milestoneDay7Line: string;
  milestoneDay14Line: string;
  milestoneDay21Line: string;
  cycleCompleteLine: string;
  strengths: readonly string[];
  challenges: readonly string[];
  shareQuote: string;
  illustrationKey: ResetIllustrationKey;
};

export type ResetIllustrationKey =
  | 'overloadedDreamer'
  | 'softRestarter'
  | 'almostStarter'
  | 'fadingFlame'
  | 'allInHeart'
  | 'quietDrain'
  | 'driftingCompass'
  | 'quietStranger'
  | 'softScatter';
