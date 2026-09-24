import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

export function useOnboardingNavigation() {
  const router = useRouter();
  const currentStepIndex = useOnboardingStore((state) => state.currentStepIndex);
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);
  const goToStep = useOnboardingStore((state) => state.goToStep);

  const goToNext = useCallback(() => {
    next();
  }, [next]);

  const goToIndex = useCallback(
    (index: number) => {
      goToStep(index);
    },
    [goToStep],
  );

  const goBack = useCallback(() => {
    if (currentStepIndex <= 0) {
      return;
    }

    back();
  }, [back, currentStepIndex]);

  return {
    router,
    goToNext,
    goToIndex,
    goBack,
    canGoBack: currentStepIndex > 0,
  };
}
