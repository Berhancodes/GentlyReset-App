import { Platform } from 'react-native';

import type { CustomerInfoLike, PurchasesClient } from '@/features/subscription/types';

export type { PurchasesClient };

const emptyCustomerInfo: CustomerInfoLike = {
  entitlements: { active: {} },
};

export function isNativePurchasesSupported(): boolean {
  return Platform.OS !== 'web' && Boolean(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim());
}

/** Web / Expo preview fallback. Native builds use `purchasesClient.native.ts`. */
export function createPurchasesClient(): PurchasesClient {
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
