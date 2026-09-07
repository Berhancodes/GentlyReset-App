import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

export function useOnboardingNavigation() {
  const router = useRouter();
  const currentStepIndex = useOnboardingStore((state) => state.currentStepIndex);
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);

  const goToNext = useCallback(() => {
    next();
  }, [next]);

  const goBack = useCallback(() => {
    if (currentStepIndex <= 0) {
      return;
    }

    back();
  }, [back, currentStepIndex]);

  return {
    router,
    goToNext,
    goBack,
    canGoBack: currentStepIndex > 0,
  };
}
