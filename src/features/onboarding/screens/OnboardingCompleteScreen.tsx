import { Redirect } from 'expo-router';

/**
 * Kept as a routing hook for a future paywall between plan preview and home.
 * The complete onboarding path now finishes on the final step.
 */
export function OnboardingCompleteScreen() {
  return <Redirect href="/(onboarding)/flow" />;
}
