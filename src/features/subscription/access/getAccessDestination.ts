import type { AccessDestination } from '../types';

export type AccessDecisionInput = {
  hasCompletedOnboarding: boolean;
  subscriptionInitializing: boolean;
  isPro: boolean;
};

/**
 * Single access boundary for Gently Reset.
 * Auth is not part of this decision. Subscription does not own reset data.
 */
export function getAccessDestination(input: AccessDecisionInput): AccessDestination {
  if (!input.hasCompletedOnboarding) {
    return 'onboarding';
  }

  if (input.subscriptionInitializing) {
    return 'loading';
  }

  if (!input.isPro) {
    return 'paywall';
  }

  return 'app';
}
