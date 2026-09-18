import { getPlanDayTitle, PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import type { ResetPersonalization, TodayTask } from '@/features/reset/types';

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
