import { localResetRepository } from '@/data/reset/localResetRepository';
import { isSupabaseConfigured, supabase } from '@/features/auth/supabase/client';

import { requestJournalCloudSync } from '@/features/reflect/sync/requestJournalCloudSync';

import { syncResetWithCloud } from './createResetSyncService';
import { createSupabaseResetCloudGateway } from './resetCloudApi';
import { readSyncOwnership, useResetSyncStore } from './useResetSyncStore';

let running: Promise<void> | null = null;
let queuedUserId: string | null = null;

/**
 * Coalesced background sync. UI actions must not await this.
 * Overlapping calls queue one retry for the latest user id.
 */
export async function requestResetCloudSync(userId: string | null): Promise<void> {
  if (!userId || !isSupabaseConfigured) {
    return;
  }

  if (running) {
    queuedUserId = userId;
    return;
  }

  running = runResetCloudSync(userId);
  await running;
}

/**
 * Resolves once no sync is running or queued. Only for flows that must wait for
 * the cloud, like restoring a returning user's progress right after sign-in.
 */
export async function waitForResetCloudSyncIdle(): Promise<void> {
  while (running) {
    await running;
  }
}

async function runResetCloudSync(userId: string): Promise<void> {
  useResetSyncStore.setState({ status: 'syncing' });

  try {
    const result = await syncResetWithCloud({
      userId,
      repository: localResetRepository,
      ownership: readSyncOwnership(),
      gateway: createSupabaseResetCloudGateway(),
    });
    useResetSyncStore.getState().replaceOwnership(result.ownership);
    if (result.kind !== 'conflict' && result.kind !== 'skipped') {
      void requestJournalCloudSync(userId);
    }
  } catch {
    // Callers never await a rejection; record it and let the next sync retry.
    useResetSyncStore.setState({ status: 'error' });
  } finally {
    running = null;
    if (queuedUserId) {
      const nextUserId = queuedUserId;
      queuedUserId = null;
      void requestResetCloudSync(nextUserId);
    }
  }
}

/**
 * After first account creation or returning sign-in.
 * Does not await from the paywall CTA. Associates pre-account local
 * progress with the new user when ownership is still unclaimed.
 */
export function requestResetCloudSyncForCurrentUser(): void {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  void supabase.auth.getSession().then(({ data }) => {
    void requestResetCloudSync(data.session?.user.id ?? null);
  });
}
