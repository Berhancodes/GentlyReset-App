import type { OnboardingStep } from '@/features/onboarding/types/onboarding';

type StageStep = Extract<
  OnboardingStep,
  {
    type: 'singleChoice' | 'multiChoice' | 'textInput' | 'story' | 'resultDetails' | 'sharePreview';
  }
>;

/** Steps drawn on the clean stage, where the shared mascot stays on screen. */
export function isStageStep(step: OnboardingStep | undefined): step is StageStep {
  if (!step) {
    return false;
  }
  return (
    step.type === 'singleChoice' ||
    step.type === 'multiChoice' ||
    step.type === 'textInput' ||
    step.type === 'story' ||
    step.type === 'resultDetails' ||
    step.type === 'sharePreview'
  );
}
