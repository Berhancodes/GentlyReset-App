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

function minutesPhrase(minutes: number): string {
  if (minutes <= 5) {
    return 'five minutes';
  }
  if (minutes <= 10) {
    return 'ten minutes';
  }
  if (minutes <= 20) {
    return 'twenty minutes';
  }
  return 'thirty minutes';
}

function supportingDescription(day: number, minutes: number, obstacle?: string): string {
  if (day === 1) {
    if (obstacle === 'too-much' || obstacle === 'overthink') {
      return `You don't need to fix everything. Just give yourself ${minutesPhrase(minutes)}.`;
    }
    if (obstacle === 'no-energy' || obstacle === 'put-off') {
      return `You don't need momentum. Just give yourself ${minutesPhrase(minutes)}.`;
    }
    return `You don't need momentum. Just give yourself ${minutesPhrase(minutes)}.`;
  }

  if (obstacle === 'too-much') {
    return 'Smaller than you think. Then stop.';
  }
  if (obstacle === 'afraid-wont-stick') {
    return 'Showing up once still counts.';
  }

  return 'One honest reset. That is enough for today.';
}

export function getTaskForDay(day: number, personalization: ResetPersonalization): TodayTask {
  const clamped = Math.min(PLAN_DAY_COUNT, Math.max(1, day));
  const minutes = minutesFromCommitment(personalization.dailyCommitment);

  return {
    id: `day-${clamped}`,
    day: clamped,
    title: getPlanDayTitle(clamped),
    description: supportingDescription(clamped, minutes, personalization.primaryObstacle),
    minutes,
  };
}
