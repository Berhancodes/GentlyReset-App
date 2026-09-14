import { useEffect, useState } from 'react';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';

function bothHydrated(): boolean {
  return useOnboardingStore.persist.hasHydrated() && useResetStore.persist.hasHydrated();
}

/** Wait for persisted onboarding + daily reset before routing. */
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
    update();

    return () => {
      unsubscribeOnboarding();
      unsubscribeReset();
    };
  }, []);

  return hydrated;
}
