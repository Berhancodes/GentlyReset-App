import { getAccessDestination } from './getAccessDestination';
import { getPaywallUnlockLabel, getPaywallUnlockNextStep } from './getPaywallPrimaryAction';
import {
  markPaywallPurchaseReady,
  peekPaywallUnlock,
  rememberPaywallPackage,
  takePaywallResumePurchase,
} from './pendingPaywallUnlock';
import { isProEntitlementActive } from './isProEntitlementActive';
import { offeringHasUnexpectedTrial } from './packageHasUnexpectedTrial';
import { PRO_ENTITLEMENT_ID } from '../constants';
import type { CustomerInfoLike } from '../types';
import { mapPurchaseError } from '../utils/mapPurchaseError';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

check(
  'onboarding incomplete + no Pro → onboarding',
  getAccessDestination({
    hasCompletedOnboarding: false,
    subscriptionInitializing: false,
    isPro: false,
  }) === 'onboarding',
);

check(
  'onboarding incomplete ignores Pro',
  getAccessDestination({
    hasCompletedOnboarding: false,
    subscriptionInitializing: true,
    isPro: true,
  }) === 'onboarding',
);

check(
  'onboarding complete + subscription initializing → loading',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: true,
    isPro: false,
  }) === 'loading',
);

check(
  'onboarding complete + no Pro → paywall',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: false,
    isPro: false,
  }) === 'paywall',
);

check(
  'onboarding complete + Pro → app',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: false,
    isPro: true,
  }) === 'app',
);

check(
  'expired/inactive Pro → paywall',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: false,
    isPro: isProEntitlementActive({
      entitlements: { active: { [PRO_ENTITLEMENT_ID]: { isActive: false } } },
    }),
  }) === 'paywall',
);

const purchaseWithoutEntitlement: CustomerInfoLike = { entitlements: { active: {} } };
check(
  'purchase success but entitlement missing → remain paywall',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: false,
    isPro: isProEntitlementActive(purchaseWithoutEntitlement),
  }) === 'paywall',
);

check(
  'restore + active entitlement → app',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: false,
    isPro: isProEntitlementActive({
      entitlements: { active: { [PRO_ENTITLEMENT_ID]: { isActive: true } } },
    }),
  }) === 'app',
);

check(
  'restore + no entitlement → paywall',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: false,
    isPro: isProEntitlementActive({ entitlements: { active: {} } }),
  }) === 'paywall',
);

check(
  'unauthenticated unlock still creates an account first',
  getPaywallUnlockNextStep(false) === 'create-account',
);

check('authenticated unlock purchases next', getPaywallUnlockNextStep(true) === 'purchase');

check('paywall CTA stays unlock my reset', getPaywallUnlockLabel(false) === 'unlock my reset');
check('paywall CTA shows purchasing while busy', getPaywallUnlockLabel(true) === 'purchasing…');

rememberPaywallPackage('$rc_annual');
check(
  'selected package is remembered across account creation',
  peekPaywallUnlock()?.packageIdentifier === '$rc_annual',
);
check(
  'remembering a package does not resume purchase',
  peekPaywallUnlock()?.resumePurchase === false,
);
markPaywallPurchaseReady();
check('successful account creation can resume purchase', takePaywallResumePurchase() === true);
check('resume purchase is consumed once', takePaywallResumePurchase() === false);
check(
  'package remains after resume is consumed',
  peekPaywallUnlock()?.packageIdentifier === '$rc_annual',
);

check('null customer info is not Pro', isProEntitlementActive(null) === false);

const cancelled = mapPurchaseError({ userCancelled: true });
check(
  'userCancelled is not a scary error',
  cancelled.ok === false && cancelled.kind === 'cancelled',
);

check(
  'unexpected trial is detected',
  offeringHasUnexpectedTrial([
    {
      identifier: '$rc_monthly',
      title: 'Monthly',
      priceString: '$9.99',
      billingPeriod: 'month',
      hasIntroOffer: true,
    },
  ]) === true,
);

check(
  'no-trial packages are allowed',
  offeringHasUnexpectedTrial([
    {
      identifier: '$rc_monthly',
      title: 'Monthly',
      priceString: '$9.99',
      billingPeriod: 'month',
      hasIntroOffer: false,
    },
  ]) === false,
);

if (failed > 0) {
  throw new Error(`${failed} access-decision check(s) failed`);
}

console.log('\nall access-decision checks passed');
