import {
  getSingleChoiceId,
  getMultiChoiceIds,
  getTextInputValue,
} from '@/features/onboarding/utils/answerReaders';
import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';
import { deriveResetApproach } from '@/features/onboarding/utils/deriveResetApproach';
import { deriveRetentionProfile } from '@/features/onboarding/utils/deriveRetentionProfile';
import { toLocalDateKey } from '@/features/reset/utils/calendar';
import { deriveResetType } from '@/features/reset/utils/deriveResetType';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';
import type { ResetPersonalization, ResetSnapshot } from '@/features/reset/types';

function commitmentIdFromApproachTime(time?: string): string | undefined {
  if (time === '5 minutes/day') {
    return 'five';
  }
  if (time === '10 minutes/day') {
    return 'ten';
  }
  if (time === '20 minutes/day') {
    return 'twenty';
  }
  if (time === '30+ minutes/day') {
    return 'thirty-plus';
  }
  return undefined;
}

export function personalizationFromAnswers(
  answers: Record<string, OnboardingAnswer>,
): ResetPersonalization {
  const retention = deriveRetentionProfile(answers);
  const approach = deriveResetApproach(answers);
  const primaryObstacle = getMultiChoiceIds(answers, 'primaryObstacle')[0];

  return {
    dailyCommitment: retention.dailyCommitment ?? commitmentIdFromApproachTime(approach.time),
    supportStyle: retention.supportStyle,
    primaryObstacle,
    resetReason: getTextInputValue(answers, 'resetReason'),
    desiredFeelings: getMultiChoiceIds(answers, 'desiredFeelings'),
    missedDayResponse: retention.missedDayResponse,
  };
}

export function createSeededResetState(
  answers: Record<string, OnboardingAnswer>,
  now: Date = new Date(),
): ResetSnapshot {
  const today = toLocalDateKey(now);
  const personalization = personalizationFromAnswers(answers);
  const classification = deriveResetType(answers);

  return {
    currentDay: 1,
    completedDays: [],
    todayCompleted: false,
    todayStarted: false,
    todayTask: getTaskForDay(1, personalization),
    resetStartedOn: today,
    lastSeenOn: today,
    lastCompletedOn: null,
    streak: 0,
    missedYesterday: false,
    resetTypeId: classification.id,
    profileAccuracy: getSingleChoiceId(answers, 'profileAccuracy'),
    personalization,
    reflections: [],
  };
}
