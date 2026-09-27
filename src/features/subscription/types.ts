export type AccessDestination = 'onboarding' | 'loading' | 'paywall' | 'app';

export type CustomerInfoLike = {
  entitlements: {
    active: Record<string, { isActive: boolean } | undefined>;
  };
};

export type PresentedPackage = {
  identifier: string;
  title: string;
  priceString: string;
  billingPeriod: string;
  hasIntroOffer: boolean;
};

export type OfferingLike = {
  identifier: string;
  packages: readonly PresentedPackage[];
};

export type PurchaseFailureKind = 'cancelled' | 'failed' | 'no_entitlement' | 'trial_blocked';

export type PurchaseActionResult =
  { ok: true } | { ok: false; kind: PurchaseFailureKind; message: string };

export type RestoreActionResult = { ok: true; unlocked: boolean } | { ok: false; message: string };
