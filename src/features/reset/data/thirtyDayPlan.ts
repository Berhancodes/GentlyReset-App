import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';

const TOTAL_DAYS = 30;

const FALLBACK_EARLY_TITLES = [
  'Start smaller than usual',
  'Make your environment easier',
  'Build one repeatable win',
] as const;

const LATER_TITLES = [
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
] as const;

function planReadyTitles(): readonly string[] {
  const step = ONBOARDING_STEPS.find((item) => item.id === 'planReady');
  if (step?.type !== 'final') {
    return FALLBACK_EARLY_TITLES;
  }

  return step.preview.map((item) => item.title);
}

function buildTitles(): readonly string[] {
  const early = planReadyTitles();
  const titles = [...early];

  for (const title of LATER_TITLES) {
    if (titles.length >= TOTAL_DAYS) {
      break;
    }
    titles.push(title);
  }

  while (titles.length < TOTAL_DAYS) {
    titles.push('One small reset');
  }

  return titles.slice(0, TOTAL_DAYS);
}

export const PLAN_DAY_COUNT = TOTAL_DAYS;

export const PLAN_DAY_TITLES: readonly string[] = buildTitles();

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
