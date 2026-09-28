import type { OnboardingAnswer } from '../../onboarding/types/onboarding';
import {
  getMultiChoiceIds,
  getSingleChoiceId,
  getTextInputValue,
} from '../../onboarding/utils/answerReaders';
import { deriveResetApproach } from '../../onboarding/utils/deriveResetApproach';
import { deriveRetentionProfile } from '../../onboarding/utils/deriveRetentionProfile';
import type { ResetPersonalization, ResetSnapshot } from '../types';
import { processDateRollover } from './applyDateRollover';
import { toLocalDateKey } from './calendar';
import { deriveResetType, resolveStoredResetTypeId } from './deriveResetType';
import { getCurrentResetTask } from './resetSelectors';

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
    todayTask: getCurrentResetTask({
      currentDay: 1,
      personalization,
      resetTypeId: classification.id,
    }),
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

/**
 * Seed once. If a reset already exists, keep progress and only resolve a
 * missing/invalid resetTypeId. Never reclassify a valid stored type.
 */
export function applyEnsureSeeded(
  state: ResetSnapshot,
  answers: Record<string, OnboardingAnswer>,
  now: Date = new Date(),
): ResetSnapshot {
  if (state.resetStartedOn) {
    const rolled = processDateRollover(state, now);
    const resetTypeId = resolveStoredResetTypeId(rolled.resetTypeId, answers);
    const profileAccuracy = rolled.profileAccuracy ?? getSingleChoiceId(answers, 'profileAccuracy');
    if (resetTypeId !== rolled.resetTypeId || profileAccuracy !== rolled.profileAccuracy) {
      return { ...rolled, resetTypeId, profileAccuracy };
    }
    return rolled;
  }

  return createSeededResetState(answers, now);
}
