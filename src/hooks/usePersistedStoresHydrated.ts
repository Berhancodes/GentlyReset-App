import { useEffect, useState } from 'react';

import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';

function bothHydrated(): boolean {
  return (
    useOnboardingStore.persist.hasHydrated() &&
    useResetStore.persist.hasHydrated() &&
    useJourneyVisualStore.persist.hasHydrated()
  );
}

/**
 * Wait for persisted onboarding + daily reset before routing.
 *
 * Hydration guarantees (Phase 2C):
 * - `useResetStore` persist key is `gently-reset-daily` version 1.
 * - In-memory defaults must not be written to persist before rehydrate.
 *   The store and ResetRepository adapters do not `saveSnapshot` on
 *   construction; the persist middleware loads AsyncStorage first.
 * - Root layout renders no app screens until this hook is true, so
 *   store mutations / repository writes cannot overwrite a stored
 *   user with defaults.
 * - Onboarding remains `gently-reset-onboarding`. ResetRepository
 *   is not the onboarding store.
 */
export function usePersistedStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(bothHydrated);

  useEffect(() => {
    const update = () => {
      if (bothHydrated()) {
        setHydrated(true);
      }
    };

    const unsubscribeOnboarding = useOnboardingStore.persist.onFinishHydration(update);
    const unsubscribeReset = useResetStore.persist.onFinishHydration(update);
    const unsubscribeJourneyVisual = useJourneyVisualStore.persist.onFinishHydration(update);
    update();

    return () => {
      unsubscribeOnboarding();
      unsubscribeReset();
      unsubscribeJourneyVisual();
    };
  }, []);

  return hydrated;
}
