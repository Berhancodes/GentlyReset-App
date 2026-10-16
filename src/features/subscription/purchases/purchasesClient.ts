import { Platform } from 'react-native';

import {
  ANNUAL_PACKAGE_ID,
  CURRENT_OFFERING_ID,
  MONTHLY_PACKAGE_ID,
  PRO_ENTITLEMENT_ID,
} from '@/features/subscription/constants';
import type {
  CustomerInfoLike,
  OfferingLike,
  PurchasesClient,
} from '@/features/subscription/types';

export type { PurchasesClient };

const emptyCustomerInfo: CustomerInfoLike = {
  entitlements: { active: {} },
};

const unlockedCustomerInfo: CustomerInfoLike = {
  entitlements: {
    active: {
      [PRO_ENTITLEMENT_ID]: { isActive: true },
    },
  },
};

const PREVIEW_OFFERING: OfferingLike = {
  identifier: CURRENT_OFFERING_ID,
  packages: [
    {
      identifier: ANNUAL_PACKAGE_ID,
      title: 'Yearly',
      priceString: '$59.99',
      price: 59.99,
      pricePerMonthString: '$5.00',
      billingPeriod: 'year',
      hasIntroOffer: false,
    },
    {
      identifier: MONTHLY_PACKAGE_ID,
      title: 'Monthly',
      priceString: '$9.99',
      price: 9.99,
      pricePerMonthString: '$9.99',
      billingPeriod: 'month',
      hasIntroOffer: false,
    },
  ],
};

export function isNativePurchasesSupported(): boolean {
  return Platform.OS !== 'web' && Boolean(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim());
}

function isPreviewPackage(identifier: string): boolean {
  return identifier === ANNUAL_PACKAGE_ID || identifier === MONTHLY_PACKAGE_ID;
}

/**
 * Web / Expo preview store. Native builds use `purchasesClient.native.ts`.
 * Unlocking here only grants an in-memory Pro entitlement so the app gate
 * can be tested without App Store products. iOS still uses RevenueCat.
 */
export function createPurchasesClient(): PurchasesClient {
  let customerInfo: CustomerInfoLike = emptyCustomerInfo;
  const listeners = new Set<(info: CustomerInfoLike) => void>();

  const publish = (info: CustomerInfoLike) => {
    customerInfo = info;
    for (const listener of listeners) {
      listener(info);
    }
  };

  return {
    available: true,
    configure: async () => undefined,
    getCustomerInfo: async () => customerInfo,
    getCurrentOffering: async () => PREVIEW_OFFERING,
    purchasePackage: async (identifier) => {
      if (!isPreviewPackage(identifier)) {
        throw new Error('that plan isn’t available right now.');
      }
      publish(unlockedCustomerInfo);
      return unlockedCustomerInfo;
    },
    restorePurchases: async () => customerInfo,
    logIn: async () => customerInfo,
    logOut: async () => {
      publish(emptyCustomerInfo);
      return emptyCustomerInfo;
    },
    addCustomerInfoListener: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
