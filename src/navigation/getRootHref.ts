import type { Href } from 'expo-router';

import { canEnterApp } from '@/features/subscription/access/canEnterApp';
import { getAccessDestination } from '@/features/subscription/access/getAccessDestination';

/**
 * Single place for the launch destination.
 * Auth is not the launch gate. Pro entitlement is the app gate.
 */
export type RootNavigationState = {
  hasCompletedOnboarding: boolean;
  isPro: boolean;
  hasLocalAppAccess?: boolean;
};

export function getRootHref(state: RootNavigationState): Href {
  const destination = getAccessDestination({
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    subscriptionInitializing: false,
    isPro: canEnterApp({
      isPro: state.isPro,
      hasPreviewAccess: Boolean(state.hasLocalAppAccess),
      isDevelopmentBuild: __DEV__,
    }),
  });

  switch (destination) {
    case 'onboarding':
      return '/(onboarding)/flow';
    case 'loading':
      return '/';
    case 'paywall':
      return '/(paywall)';
    case 'app':
      return '/(app)/(tabs)/home';
  }
}
