import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { runOnboardingPageShift } from '@/features/onboarding/utils/onboardingPageShift';

export function useOnboardingNavigation() {
  const router = useRouter();
  const currentStepIndex = useOnboardingStore((state) => state.currentStepIndex);
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);
  const goToStep = useOnboardingStore((state) => state.goToStep);

  const goToNext = useCallback(() => {
    runOnboardingPageShift('forward', next, currentStepIndex + 1);
  }, [currentStepIndex, next]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index === currentStepIndex) {
        return;
      }

      runOnboardingPageShift(
        index > currentStepIndex ? 'forward' : 'back',
        () => {
          goToStep(index);
        },
        index,
      );
    },
    [currentStepIndex, goToStep],
  );

  const goBack = useCallback(() => {
    if (currentStepIndex <= 0) {
      return;
    }

    runOnboardingPageShift('back', back, currentStepIndex - 1);
  }, [back, currentStepIndex]);

  return {
    router,
    goToNext,
    goToIndex,
    goBack,
    canGoBack: currentStepIndex > 0,
  };
}
