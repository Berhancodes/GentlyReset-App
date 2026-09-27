import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { OnboardingStep } from '@/features/onboarding/types/onboarding';

export function useCurrentOnboardingStep() {
  const persistedIndex = useOnboardingStore((state) => state.currentStepIndex);
  const answers = useOnboardingStore((state) => state.answers);
  const lastIndex = ONBOARDING_STEPS.length - 1;
  const currentStepIndex = Math.min(lastIndex, Math.max(0, persistedIndex));
  const step: OnboardingStep | undefined = ONBOARDING_STEPS[currentStepIndex];
  const totalSteps = ONBOARDING_STEPS.length;

  return {
    step,
    answer: step ? answers[step.id] : undefined,
    currentStepIndex,
    totalSteps,
    progress: (currentStepIndex + 1) / totalSteps,
  };
}
