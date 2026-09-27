import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useAuth } from '@/features/auth/session/useAuth';
import { isSupabaseConfigured } from '@/features/auth/supabase/client';
import { useResetStore } from '@/features/reset/store/useResetStore';

import { cloudRelevantFingerprint } from './mapSnapshotToCloud';
import { requestResetCloudSync } from './requestResetCloudSync';

const SNAPSHOT_SYNC_DEBOUNCE_MS = 2000;

/**
 * Background cloud backup. Mount after persist + auth are ready.
 * Does not block Journey, Home, or journal. Does not await from UI actions.
 */
export function ResetSyncController() {
  const userId = useAuth().user?.id ?? null;
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) {
      return;
    }
    void requestResetCloudSync(userId);
  }, [userId]);

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) {
      return;
    }

    const unsubscribe = useResetStore.subscribe((state, previous) => {
      if (cloudRelevantFingerprint(state) === cloudRelevantFingerprint(previous)) {
        return;
      }
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        void requestResetCloudSync(userId);
      }, SNAPSHOT_SYNC_DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [userId]);

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) {
      return;
    }

    const onChange = (status: AppStateStatus) => {
      if (status === 'active') {
        void requestResetCloudSync(userId);
      }
    };

    const subscription = AppState.addEventListener('change', onChange);
    return () => {
      subscription.remove();
    };
  }, [userId]);

  return null;
}
