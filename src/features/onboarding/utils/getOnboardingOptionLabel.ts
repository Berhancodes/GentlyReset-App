import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';

export function getOnboardingOptionLabel(stepId: string, optionId: string): string | undefined {
  const step = ONBOARDING_STEPS.find((item) => item.id === stepId);
  if (!step || !('options' in step)) {
    return undefined;
  }

  return step.options.find((option) => option.id === optionId)?.label;
}
