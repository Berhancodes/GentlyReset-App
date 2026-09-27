import { useEffect } from 'react';

import { HardPaywallScreen } from '@/features/subscription/screens/HardPaywallScreen';
import { finishOnboarding } from '@/features/onboarding/utils/finishOnboarding';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { PaywallStep } from '@/features/onboarding/types/onboarding';

type PaywallScreenProps = {
  step: PaywallStep;
};

/**
 * Last onboarding dest. Completing onboarding does not unlock the app.
 * The hard paywall is the boundary.
 */
export function PaywallScreen({ step: _step }: PaywallScreenProps) {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      finishOnboarding();
    }
  }, [hasCompletedOnboarding]);

  return <HardPaywallScreen />;
}
