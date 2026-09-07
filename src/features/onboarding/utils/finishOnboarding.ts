import type { Href } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

/**
 * Completes onboarding and enters the main app.
 * Later this can route to a paywall first without rewriting the onboarding flow:
 * Reset result → plan preview → paywall → home.
 */
export function finishOnboarding(router: { replace: (href: Href) => void }) {
  useOnboardingStore.getState().completeOnboarding();
  router.replace('/(app)/(tabs)/home');
}
