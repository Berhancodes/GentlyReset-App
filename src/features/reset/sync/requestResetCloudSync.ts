import { localResetRepository } from '@/data/reset/localResetRepository';
import { isSupabaseConfigured } from '@/features/auth/supabase/client';

import { syncResetWithCloud } from './createResetSyncService';
import { createSupabaseResetCloudGateway } from './resetCloudApi';
import { readSyncOwnership, useResetSyncStore } from './useResetSyncStore';

let inFlight = false;
let queuedUserId: string | null = null;

/**
 * Coalesced background sync. UI actions must not await this.
 * Overlapping calls queue one retry for the latest user id.
 */
export async function requestResetCloudSync(userId: string | null): Promise<void> {
  if (!userId || !isSupabaseConfigured) {
    return;
  }

  if (inFlight) {
    queuedUserId = userId;
    return;
  }

  inFlight = true;
  useResetSyncStore.setState({ status: 'syncing' });

  try {
    const result = await syncResetWithCloud({
      userId,
      repository: localResetRepository,
      ownership: readSyncOwnership(),
      gateway: createSupabaseResetCloudGateway(),
    });
    useResetSyncStore.getState().replaceOwnership(result.ownership);
  } finally {
    inFlight = false;
    if (queuedUserId) {
      const nextUserId = queuedUserId;
      queuedUserId = null;
      void requestResetCloudSync(nextUserId);
    }
  }
}
