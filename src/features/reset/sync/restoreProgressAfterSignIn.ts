import { localResetRepository } from '@/data/reset/localResetRepository';
import { isSupabaseConfigured, supabase } from '@/features/auth/supabase/client';

import { requestResetCloudSync, waitForResetCloudSyncIdle } from './requestResetCloudSync';

/**
 * After a returning user signs in on a phone with no reset yet (a reinstall or a
 * new phone), pulls their backed-up reset down and reports whether one came back.
 * The journal follows on its own once the reset is in place.
 */
export async function restoreProgressAfterSignIn(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id ?? null;
  if (!userId) {
    return false;
  }
  await requestResetCloudSync(userId);
  await waitForResetCloudSyncIdle();
  return localResetRepository.getSnapshot().resetStartedOn !== null;
}
