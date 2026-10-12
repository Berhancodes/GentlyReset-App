export type AccessDestination = 'onboarding' | 'loading' | 'paywall' | 'app';

export type CustomerInfoLike = {
  entitlements: {
    active: Record<string, { isActive: boolean } | undefined>;
  };
};

export type PresentedPackage = {
  identifier: string;
  title: string;
  /** Localized by the store, e.g. "$79.99" or "79,99 €". */
  priceString: string;
  /** The same price as a number in the store's currency, for comparing plans. */
  price: number | null;
  /** The price spread over a month, localized by the store; null when it can't say. */
  pricePerMonthString: string | null;
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

export type PurchasesClient = {
  available: boolean;
  configure: (apiKey: string) => Promise<void>;
  getCustomerInfo: () => Promise<CustomerInfoLike>;
  getCurrentOffering: () => Promise<OfferingLike | null>;
  purchasePackage: (identifier: string) => Promise<CustomerInfoLike>;
  restorePurchases: () => Promise<CustomerInfoLike>;
  logIn: (appUserId: string) => Promise<CustomerInfoLike>;
  logOut: () => Promise<CustomerInfoLike>;
  addCustomerInfoListener: (listener: (info: CustomerInfoLike) => void) => () => void;
};
