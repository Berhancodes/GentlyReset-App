import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

export function useOnboardingNavigation() {
  const router = useRouter();
  const currentStepIndex = useOnboardingStore((state) => state.currentStepIndex);
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);

  const goToNext = useCallback(() => {
    if (currentStepIndex >= ONBOARDING_STEPS.length - 1) {
      router.push('/(onboarding)/complete');
      return;
    }

    next();
  }, [currentStepIndex, next, router]);

  const goBack = useCallback(() => {
    if (currentStepIndex <= 0) {
      return;
    }

    back();
  }, [back, currentStepIndex]);

  return {
    goToNext,
    goBack,
    canGoBack: currentStepIndex > 0,
  };
}
