import { useEffect, useState } from 'react';

import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { useNotificationStore } from '@/features/notifications/store/useNotificationStore';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useJournalDraftStore } from '@/features/reflect/store/useJournalDraftStore';
import { useRoomStore } from '@/features/room/store/useRoomStore';
import { useWidgetStore } from '@/features/widgets/store/useWidgetStore';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { useResetSyncStore } from '@/features/reset/sync/useResetSyncStore';

function bothHydrated(): boolean {
  return (
    useOnboardingStore.persist.hasHydrated() &&
    useResetStore.persist.hasHydrated() &&
    useJourneyVisualStore.persist.hasHydrated() &&
    useResetSyncStore.persist.hasHydrated() &&
    useJournalDraftStore.persist.hasHydrated() &&
    useRoomStore.persist.hasHydrated() &&
    useWidgetStore.persist.hasHydrated() &&
    useNotificationStore.persist.hasHydrated()
  );
}

/**
 * Wait for persisted onboarding, daily reset, and sync ownership before routing.
 *
 * Hydration guarantees (Phase 2C / 4D):
 * - `useResetStore` persist key is `gently-reset-daily` version 1.
 * - `useResetSyncStore` persist key is `gently-reset-sync` version 1.
 * - In-memory defaults must not be written to persist before rehydrate.
 *   The store and ResetRepository adapters do not `saveSnapshot` on
 *   construction; the persist middleware loads AsyncStorage first.
 * - Root layout renders no app screens until this hook is true, so
 *   store mutations / repository writes cannot overwrite a stored
 *   user with defaults.
 * - Onboarding remains `gently-reset-onboarding`. ResetRepository
 *   is not the onboarding store.
 * - The journal draft (`gently-reset-journal-draft`) loads first so an
 *   unsaved entry is there when the journal opens.
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
    const unsubscribeResetSync = useResetSyncStore.persist.onFinishHydration(update);
    const unsubscribeJournalDraft = useJournalDraftStore.persist.onFinishHydration(update);
    const unsubscribeNotifications = useNotificationStore.persist.onFinishHydration(update);
    update();

    return () => {
      unsubscribeOnboarding();
      unsubscribeReset();
      unsubscribeJourneyVisual();
      unsubscribeResetSync();
      unsubscribeJournalDraft();
      unsubscribeNotifications();
    };
  }, []);

  return hydrated;
}
