import { Platform } from 'react-native';

import { CURRENT_OFFERING_ID } from '@/features/subscription/constants';
import type {
  CustomerInfoLike,
  OfferingLike,
  PresentedPackage,
} from '@/features/subscription/types';
import { presentPackage } from '@/features/subscription/utils/presentPackage';

type NativePackage = {
  identifier: string;
  product?: {
    title?: string;
    priceString?: string;
    introPrice?: unknown;
  };
};

type PurchasesModule = {
  default: {
    configure: (config: { apiKey: string }) => Promise<void> | void;
    getCustomerInfo: () => Promise<CustomerInfoLike>;
    getOfferings: () => Promise<{
      current?: { identifier?: string; availablePackages?: NativePackage[] } | null;
      all?: Record<
        string,
        { identifier?: string; availablePackages?: NativePackage[] } | undefined
      >;
    }>;
    purchasePackage: (
      subscriptionPackage: NativePackage,
    ) => Promise<{ customerInfo: CustomerInfoLike }>;
    restorePurchases: () => Promise<CustomerInfoLike>;
    logIn: (appUserId: string) => Promise<{ customerInfo: CustomerInfoLike }>;
    logOut: () => Promise<CustomerInfoLike>;
    addCustomerInfoUpdateListener: (listener: (info: CustomerInfoLike) => void) => void;
    removeCustomerInfoUpdateListener: (listener: (info: CustomerInfoLike) => void) => boolean;
  };
};

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

const emptyCustomerInfo: CustomerInfoLike = {
  entitlements: { active: {} },
};

const nativePackages = new Map<string, NativePackage>();

function createUnavailableClient(): PurchasesClient {
  return {
    available: false,
    configure: async () => undefined,
    getCustomerInfo: async () => emptyCustomerInfo,
    getCurrentOffering: async () => null,
    purchasePackage: async () => {
      throw new Error('purchases need an iOS development build.');
    },
    restorePurchases: async () => emptyCustomerInfo,
    logIn: async () => emptyCustomerInfo,
    logOut: async () => emptyCustomerInfo,
    addCustomerInfoListener: () => () => undefined,
  };
}

export function isNativePurchasesSupported(): boolean {
  return Platform.OS !== 'web' && Boolean(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim());
}

function loadNativeModule(): PurchasesModule | null {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    // Native-only. Metro drops this branch on web.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-purchases') as PurchasesModule;
  } catch {
    return null;
  }
}

function mapOffering(
  offering: { identifier?: string; availablePackages?: NativePackage[] } | null | undefined,
): OfferingLike | null {
  if (!offering) {
    return null;
  }

  nativePackages.clear();
  const packages: PresentedPackage[] = [];
  for (const nativePackage of offering.availablePackages ?? []) {
    nativePackages.set(nativePackage.identifier, nativePackage);
    packages.push(presentPackage(nativePackage));
  }

  return {
    identifier: offering.identifier ?? CURRENT_OFFERING_ID,
    packages,
  };
}

export function createPurchasesClient(): PurchasesClient {
  const nativeModule = loadNativeModule();
  if (!nativeModule) {
    return createUnavailableClient();
  }

  const Purchases = nativeModule.default;

  return {
    available: true,
    configure: async (apiKey) => {
      await Purchases.configure({ apiKey });
    },
    getCustomerInfo: () => Purchases.getCustomerInfo(),
    getCurrentOffering: async () => {
      const offerings = await Purchases.getOfferings();
      return mapOffering(offerings.current ?? offerings.all?.[CURRENT_OFFERING_ID]);
    },
    purchasePackage: async (identifier) => {
      const nativePackage = nativePackages.get(identifier);
      if (!nativePackage) {
        throw new Error('that plan isn’t available right now.');
      }
      const result = await Purchases.purchasePackage(nativePackage);
      return result.customerInfo;
    },
    restorePurchases: () => Purchases.restorePurchases(),
    logIn: async (appUserId) => {
      const result = await Purchases.logIn(appUserId);
      return result.customerInfo;
    },
    logOut: () => Purchases.logOut(),
    addCustomerInfoListener: (listener) => {
      Purchases.addCustomerInfoUpdateListener(listener);
      return () => {
        Purchases.removeCustomerInfoUpdateListener(listener);
      };
    },
  };
}
