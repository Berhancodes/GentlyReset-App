import type { Href } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';

/**
 * Completes onboarding, seeds the daily reset, and enters the main app.
 */
export function finishOnboarding(router: { replace: (href: Href) => void }) {
  const answers = useOnboardingStore.getState().answers;
  useResetStore.getState().seedFromOnboarding(answers);
  useOnboardingStore.getState().completeOnboarding();
  router.replace('/(app)/(tabs)/home');
}
