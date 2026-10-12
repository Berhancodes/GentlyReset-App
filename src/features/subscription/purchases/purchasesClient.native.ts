import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { CURRENT_OFFERING_ID } from '@/features/subscription/constants';
import type {
  OfferingLike,
  PresentedPackage,
  PurchasesClient,
} from '@/features/subscription/types';
import { presentPackage } from '@/features/subscription/utils/presentPackage';

type NativePackage = {
  identifier: string;
  product?: {
    title?: string;
    priceString?: string;
    price?: number;
    pricePerMonthString?: string | null;
    introPrice?: unknown;
  };
};

const nativePackages = new Map<string, NativePackage>();

export function isNativePurchasesSupported(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim());
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
  return {
    available: true,
    configure: async (apiKey) => {
      await Purchases.configure({ apiKey });
    },
    getCustomerInfo: () => Purchases.getCustomerInfo(),
    getCurrentOffering: async () => {
      const offerings = await Purchases.getOfferings();
      return mapOffering(offerings.current ?? offerings.all[CURRENT_OFFERING_ID] ?? null);
    },
    purchasePackage: async (identifier) => {
      const nativePackage = nativePackages.get(identifier);
      if (!nativePackage) {
        throw new Error('that plan isn’t available right now.');
      }
      const result = await Purchases.purchasePackage(nativePackage as PurchasesPackage);
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
