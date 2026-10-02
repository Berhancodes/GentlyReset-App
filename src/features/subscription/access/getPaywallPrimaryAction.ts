export type PaywallUnlockNextStep = 'create-account' | 'purchase';

/**
 * The visible CTA stays purchase-oriented.
 * An unauthenticated tap opens account creation first; Pro still unlocks the app.
 */
export function getPaywallUnlockNextStep(isAuthenticated: boolean): PaywallUnlockNextStep {
  return isAuthenticated ? 'purchase' : 'create-account';
}

export function getPaywallUnlockLabel(isPurchasing: boolean): string {
  return isPurchasing ? 'Purchasing…' : 'Unlock My Reset';
}
