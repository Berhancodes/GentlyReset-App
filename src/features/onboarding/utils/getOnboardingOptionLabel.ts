import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { PARKED_QUESTION_OPTIONS } from '@/features/onboarding/data/parkedOnboardingQuestions';

export function getOnboardingOptionLabel(stepId: string, optionId: string): string | undefined {
  const active = ONBOARDING_STEPS.find((item) => item.id === stepId);
  if (active && 'options' in active) {
    return active.options.find((option) => option.id === optionId)?.label;
  }

  return PARKED_QUESTION_OPTIONS[stepId]?.find((option) => option.id === optionId)?.label;
}
