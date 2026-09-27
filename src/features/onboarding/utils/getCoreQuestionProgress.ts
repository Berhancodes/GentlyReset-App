import {
  CORE_QUESTION_COUNT,
  CORE_QUESTION_IDS,
  ONBOARDING_STEPS,
} from '@/features/onboarding/data/onboardingSteps';

function coreQuestionIndex(stepId: string | undefined): number {
  if (!stepId) {
    return -1;
  }

  return CORE_QUESTION_IDS.findIndex((id) => id === stepId);
}

/**
 * Progress through the 13 primary questions only.
 * Non-question screens keep the most recent primary-question value.
 */
export function getCoreQuestionProgress(stepId: string | undefined, stepIndex: number): number {
  const directIndex = coreQuestionIndex(stepId);
  if (directIndex >= 0) {
    return (directIndex + 1) / CORE_QUESTION_COUNT;
  }

  for (let cursor = stepIndex; cursor >= 0; cursor -= 1) {
    const candidate = ONBOARDING_STEPS[cursor];
    const previousIndex = coreQuestionIndex(candidate?.id);
    if (previousIndex >= 0) {
      return (previousIndex + 1) / CORE_QUESTION_COUNT;
    }
  }

  return 0;
}
