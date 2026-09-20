import type { ResetPersonalization, ResetPlan, TodayTask } from './types';

/** Canonical foundation plan identity. Titles and task copy stay in this module. */
export const FOUNDATION_PLAN_ID = 'foundation-reset';
export const FOUNDATION_PLAN_VERSION = 1;

/**
 * One canonical cycle/plan length. `PLAN_DAY_COUNT` aliases this so we do not
 * keep a second magic 30.
 */
export const DEFAULT_CYCLE_LENGTH = 30;
export const PLAN_DAY_COUNT = DEFAULT_CYCLE_LENGTH;

export const thirtyDayPlan = {
  planId: FOUNDATION_PLAN_ID,
  version: FOUNDATION_PLAN_VERSION,
  length: DEFAULT_CYCLE_LENGTH,
} as const;

/**
 * Canonical local-day titles. Days 1–3 match the onboarding `planReady`
 * preview copy; later days stay in this module. Domain does not import
 * onboarding data.
 */
export const PLAN_DAY_TITLES: readonly string[] = [
  'Start smaller than usual',
  'Make your environment easier',
  'Build one repeatable win',
  'Keep the win tiny',
  'Prepare one thing tonight',
  'Protect a five-minute window',
  'Leave evidence you showed up',
  'Choose the easier version',
  'Repeat yesterday’s smallest win',
  'Clear one tiny obstacle',
  'Start before you feel ready',
  'Do it at the same loose time',
  'Make restarting ordinary',
  'Notice the urge to overdo it',
  'Stop at enough',
  'Let a messy day still count',
  'Return without a speech',
  'Keep one promise, not ten',
  'Make the next step obvious',
  'Choose kindness after a slip',
  'Stay with the same small thing',
  'Leave tomorrow a little easier',
  'Trust a short session',
  'Skip the all-or-nothing story',
  'Show up once, then stop',
  'Remember the lighter version of you',
  'Keep the path clear',
  'End the day on a gentle close',
  'Honor the 30 days you asked for',
  'One last small, honest reset',
];

export const PLAN_WEEKS = [
  { id: 'week-1', label: 'start smaller', startDay: 1, endDay: 7 },
  { id: 'week-2', label: 'make it easier', startDay: 8, endDay: 14 },
  { id: 'week-3', label: 'stay with it', startDay: 15, endDay: 21 },
  { id: 'week-4', label: 'keep the promise', startDay: 22, endDay: 30 },
] as const;

export type PlanWeek = (typeof PLAN_WEEKS)[number];

export function getPlanDayTitle(day: number): string {
  const clamped = Math.min(PLAN_DAY_COUNT, Math.max(1, day));
  return PLAN_DAY_TITLES[clamped - 1] ?? 'One small reset';
}

export function getResetPlan(planId: string, version: number): ResetPlan {
  if (planId === thirtyDayPlan.planId && version === thirtyDayPlan.version) {
    return {
      id: thirtyDayPlan.planId,
      version: thirtyDayPlan.version,
      length: thirtyDayPlan.length,
    };
  }

  throw new Error(`Unknown reset plan: ${planId}@${version}`);
}

const MINUTES_BY_COMMITMENT: Record<string, number> = {
  five: 5,
  ten: 10,
  twenty: 20,
  'thirty-plus': 30,
};

export function minutesFromCommitment(dailyCommitment?: string): number {
  if (!dailyCommitment) {
    return 5;
  }

  return MINUTES_BY_COMMITMENT[dailyCommitment] ?? 5;
}

export function formatMinutesLabel(minutes: number): string {
  return `${minutes} min`;
}

function supportingDescription(day: number, obstacle?: string): string {
  if (day === 1) {
    if (obstacle === 'too-much' || obstacle === 'overthink') {
      return "You don't need to fix everything. Just begin.";
    }
    return "You don't need momentum. Just begin.";
  }

  if (obstacle === 'too-much') {
    return 'Smaller than you think. Then stop.';
  }
  if (obstacle === 'afraid-wont-stick') {
    return 'Showing up once still counts.';
  }

  return 'One honest reset. That is enough.';
}

/** Canonical local-day task. One implementation for Home, Journey, and Journal. */
export function getTaskForDay(day: number, personalization: ResetPersonalization): TodayTask {
  const clamped = Math.min(PLAN_DAY_COUNT, Math.max(1, day));
  const minutes = minutesFromCommitment(personalization.dailyCommitment);

  return {
    id: `day-${clamped}`,
    day: clamped,
    title: getPlanDayTitle(clamped),
    description: supportingDescription(clamped, personalization.primaryObstacle),
    minutes,
  };
}
