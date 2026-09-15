import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';

/**
 * Keeps plan-day state current when Home has not been opened yet this session.
 * Home already syncs on its own — do not attach this hook there.
 */
export function useSyncResetDay() {
  const answers = useOnboardingStore((state) => state.answers);
  const ensureSeeded = useResetStore((state) => state.ensureSeeded);
  const applyCalendarDay = useResetStore((state) => state.applyCalendarDay);

  const syncDay = useCallback(() => {
    ensureSeeded(answers);
    applyCalendarDay();
  }, [answers, applyCalendarDay, ensureSeeded]);

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
