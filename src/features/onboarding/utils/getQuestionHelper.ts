import type { OnboardingStep } from '@/features/onboarding/types/onboarding';

export function getQuestionHelper(step: OnboardingStep): string | undefined {
  if (step.subtitle) {
    return step.subtitle;
  }

  if (step.type === 'multiChoice') {
    return 'you can choose more than one.';
  }

  if (step.type === 'singleChoice' || step.type === 'scale') {
    return 'pick what feels most accurate.';
  }

  return undefined;
}
