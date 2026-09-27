import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';

/**
 * Completes onboarding and seeds the daily reset.
 * Does not enter the main app — the access gate sends unpaid users to the paywall.
 */
export function finishOnboarding() {
  const answers = useOnboardingStore.getState().answers;
  useResetStore.getState().seedFromOnboarding(answers);
  useOnboardingStore.getState().completeOnboarding();
}
