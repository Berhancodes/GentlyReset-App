import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { requestResetCloudSyncForCurrentUser } from '@/features/reset/sync/requestResetCloudSync';
import { restoreProgressAfterSignIn } from '@/features/reset/sync/restoreProgressAfterSignIn';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { getRootHref } from '@/navigation/getRootHref';

/**
 * Where to go once someone is signed in (by password or by a reset code).
 * A returning user on a phone that hasn't been set up gets their reset back and
 * skips onboarding; everyone else carries on where the gate sends them.
 */
export function useFinishSignIn(): { restoring: boolean; finishSignIn: () => Promise<void> } {
  const router = useRouter();
  const { isPro } = useSubscription();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const hasLocalAppAccess = useOnboardingStore((state) => state.hasLocalAppAccess);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const [restoring, setRestoring] = useState(false);

  const finishSignIn = async () => {
    if (!hasCompletedOnboarding) {
      setRestoring(true);
      const restored = await restoreProgressAfterSignIn();
      setRestoring(false);
      if (restored) {
        completeOnboarding();
        // The index route reads the fresh state and picks Home or the paywall.
        router.replace('/');
        return;
      }
    }
    requestResetCloudSyncForCurrentUser();
    router.replace(getRootHref({ hasCompletedOnboarding, isPro, hasLocalAppAccess }));
  };

  return { restoring, finishSignIn };
}
