import { PRO_ENTITLEMENT_ID } from '../constants';
import type { CustomerInfoLike } from '../types';

/**
 * RevenueCat CustomerInfo is the only entitlement source of truth.
 * A missing or inactive entitlement is not Pro.
 */
export function isProEntitlementActive(customerInfo: CustomerInfoLike | null): boolean {
  return customerInfo?.entitlements.active[PRO_ENTITLEMENT_ID]?.isActive === true;
}
