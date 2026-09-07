import type { Href } from 'expo-router';

/**
 * Single place for the launch destination.
 * Later this can grow to: incomplete onboarding -> paywall -> subscribed app.
 */
export type RootNavigationState = {
  hasCompletedOnboarding: boolean;
};

export function getRootHref(state: RootNavigationState): Href {
  if (!state.hasCompletedOnboarding) {
    return '/(onboarding)/flow';
  }

  return '/(app)/(tabs)/home';
}
