import type { OnboardingStep } from '@/features/onboarding/types/onboarding';

export function isQuestionnaireStep(
  step: OnboardingStep | undefined,
): step is Extract<
  OnboardingStep,
  { type: 'singleChoice' | 'multiChoice' | 'scale' | 'textInput' }
> {
  if (!step) {
    return false;
  }

  return (
    step.type === 'singleChoice' ||
    step.type === 'multiChoice' ||
    step.type === 'scale' ||
    step.type === 'textInput'
  );
}
