import { useCallback, useEffect, useLayoutEffect } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';

/**
 * One rollover path for every tab. Calculation stays in applyDateRollover.
 */
export function useSyncResetDay() {
  const answers = useOnboardingStore((state) => state.answers);
  const syncResetDay = useResetStore((state) => state.syncResetDay);

  const syncDay = useCallback(() => {
    syncResetDay(answers);
  }, [answers, syncResetDay]);

  useLayoutEffect(() => {
    syncDay();
  }, [syncDay]);

  useFocusEffect(
    useCallback(() => {
      syncDay();
    }, [syncDay]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        syncDay();
      }
    });
    return () => subscription.remove();
  }, [syncDay]);
}
