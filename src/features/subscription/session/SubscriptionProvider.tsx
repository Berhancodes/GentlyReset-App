import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/features/auth/session/useAuth';
import { isProEntitlementActive } from '@/features/subscription/access/isProEntitlementActive';
import { offeringHasUnexpectedTrial } from '@/features/subscription/access/packageHasUnexpectedTrial';
import {
  createPurchasesClient,
  isNativePurchasesSupported,
} from '@/features/subscription/purchases/purchasesClient';
import type {
  CustomerInfoLike,
  OfferingLike,
  PresentedPackage,
  PurchaseActionResult,
  PurchasesClient,
  RestoreActionResult,
} from '@/features/subscription/types';
import { mapPurchaseError } from '@/features/subscription/utils/mapPurchaseError';

export type SubscriptionContextValue = {
  initializing: boolean;
  available: boolean;
  customerInfo: CustomerInfoLike | null;
  currentOffering: OfferingLike | null;
  packages: readonly PresentedPackage[];
  isPro: boolean;
  unexpectedTrial: boolean;
  purchasePackage: (identifier: string) => Promise<PurchaseActionResult>;
  restorePurchases: () => Promise<RestoreActionResult>;
  refreshCustomerInfo: () => Promise<void>;
};

export const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

type SubscriptionProviderProps = {
  children: ReactNode;
};

/**
 * In-memory mirror of RevenueCat CustomerInfo.
 * Persistence and entitlement cache live in the SDK, not Zustand.
 * Must not read or write local reset / onboarding / journal stores.
 */
export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { initializing: authInitializing, user } = useAuth();
  const clientRef = useRef<PurchasesClient | null>(null);
  const identifiedUserIdRef = useRef<string | null>(null);
  const [initializing, setInitializing] = useState(isNativePurchasesSupported);
  const [available, setAvailable] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoLike | null>(null);
  const [currentOffering, setCurrentOffering] = useState<OfferingLike | null>(null);

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim();
    const client = createPurchasesClient();
    clientRef.current = client;

    if (!client.available) {
      return;
    }

    if (!apiKey && Platform.OS !== 'web') {
      return;
    }

    let active = true;
    let removeListener = () => {
      return;
    };

    void (async () => {
      try {
        await client.configure(apiKey || 'web-preview');
        if (!active) {
          return;
        }
        setAvailable(true);
        removeListener = client.addCustomerInfoListener((info) => {
          if (active) {
            setCustomerInfo(info);
          }
        });
        const [info, offering] = await Promise.all([
          client.getCustomerInfo(),
          client.getCurrentOffering(),
        ]);
        if (!active) {
          return;
        }
        setCustomerInfo(info);
        setCurrentOffering(offering);
      } catch {
        if (active) {
          setAvailable(false);
          setCustomerInfo({ entitlements: { active: {} } });
        }
      } finally {
        if (active) {
          setInitializing(false);
        }
      }
    })();

    return () => {
      active = false;
      removeListener();
    };
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    if (!client?.available || initializing || authInitializing) {
      return;
    }

    const userId = user?.id ?? null;
    if (userId === identifiedUserIdRef.current) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        if (userId) {
          const info = await client.logIn(userId);
          if (active) {
            identifiedUserIdRef.current = userId;
            setCustomerInfo(info);
          }
          return;
        }

        if (identifiedUserIdRef.current) {
          const info = await client.logOut();
          if (active) {
            identifiedUserIdRef.current = null;
            setCustomerInfo(info);
          }
        }
      } catch {
        // Keep the last known CustomerInfo. Identity retry happens on the next auth change.
      }
    })();

    return () => {
      active = false;
    };
  }, [authInitializing, initializing, user?.id]);

  const refreshCustomerInfo = useCallback(async () => {
    const client = clientRef.current;
    if (!client?.available) {
      return;
    }
    const info = await client.getCustomerInfo();
    setCustomerInfo(info);
    const offering = await client.getCurrentOffering();
    setCurrentOffering(offering);
  }, []);

  const purchasePackage = useCallback(
    async (identifier: string): Promise<PurchaseActionResult> => {
      const client = clientRef.current;
      if (!client?.available) {
        return {
          ok: false,
          kind: 'failed',
          message: 'purchases need an iOS development build.',
        };
      }

      const selected = currentOffering?.packages.find((item) => item.identifier === identifier);
      if (selected?.hasIntroOffer) {
        return {
          ok: false,
          kind: 'trial_blocked',
          message: 'this plan includes a trial. Gently Reset does not sell trials.',
        };
      }

      try {
        const info = await client.purchasePackage(identifier);
        setCustomerInfo(info);
        if (!isProEntitlementActive(info)) {
          return {
            ok: false,
            kind: 'no_entitlement',
            message: 'the purchase finished, but Pro is not active yet.',
          };
        }
        return { ok: true };
      } catch (error) {
        return mapPurchaseError(error);
      }
    },
    [currentOffering],
  );

  const restorePurchases = useCallback(async (): Promise<RestoreActionResult> => {
    const client = clientRef.current;
    if (!client?.available) {
      return {
        ok: false,
        message: 'restore needs an iOS development build.',
      };
    }

    try {
      const info = await client.restorePurchases();
      setCustomerInfo(info);
      return { ok: true, unlocked: isProEntitlementActive(info) };
    } catch (error) {
      const mapped = mapPurchaseError(error);
      return {
        ok: false,
        message: mapped.ok ? 'restore didn’t finish. try again.' : mapped.message,
      };
    }
  }, []);

  const packages = useMemo(() => currentOffering?.packages ?? [], [currentOffering]);
  const unexpectedTrial = offeringHasUnexpectedTrial(packages);
  const isPro = isProEntitlementActive(customerInfo);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      initializing,
      available,
      customerInfo,
      currentOffering,
      packages,
      isPro,
      unexpectedTrial,
      purchasePackage,
      restorePurchases,
      refreshCustomerInfo,
    }),
    [
      available,
      currentOffering,
      customerInfo,
      initializing,
      isPro,
      packages,
      purchasePackage,
      refreshCustomerInfo,
      restorePurchases,
      unexpectedTrial,
    ],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}
