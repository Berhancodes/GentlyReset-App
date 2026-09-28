import { localResetRepository } from '@/data/reset/localResetRepository';
import { isSupabaseConfigured } from '@/features/auth/supabase/client';
import { syncResetWithCloud } from '@/features/reset/sync/createResetSyncService';
import { createSupabaseResetCloudGateway } from '@/features/reset/sync/resetCloudApi';
import { readSyncOwnership, useResetSyncStore } from '@/features/reset/sync/useResetSyncStore';

import { syncJournalWithCloud } from './createJournalSyncService';
import { createSupabaseJournalCloudGateway } from './journalCloudApi';

let inFlight = false;
let queuedUserId: string | null = null;

/**
 * Background journal backup. UI save must not await this.
 * Uses the existing Cycle 1 row; never creates a second cycle.
 */
export async function requestJournalCloudSync(userId: string | null): Promise<void> {
  if (!userId || !isSupabaseConfigured) {
    return;
  }

  if (inFlight) {
    queuedUserId = userId;
    return;
  }

  inFlight = true;

  try {
    const gateway = createSupabaseJournalCloudGateway();
    await syncJournalWithCloud({
      userId,
      repository: localResetRepository,
      ownership: readSyncOwnership(),
      gateway,
      ensureCycleId: async () => {
        const resetResult = await syncResetWithCloud({
          userId,
          repository: localResetRepository,
          ownership: readSyncOwnership(),
          gateway: createSupabaseResetCloudGateway(),
        });
        useResetSyncStore.getState().replaceOwnership(resetResult.ownership);
        if (resetResult.kind === 'conflict') {
          return null;
        }
        return gateway.fetchCycle1Id(userId);
      },
    });
  } finally {
    inFlight = false;
    if (queuedUserId) {
      const nextUserId = queuedUserId;
      queuedUserId = null;
      void requestJournalCloudSync(nextUserId);
    }
  }
}
