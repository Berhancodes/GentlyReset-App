export type PaywallPrimaryAction = 'create-account' | 'purchase';

/**
 * New accounts are created at the paywall, not on Welcome or Sign in.
 * Purchase still requires an active Pro entitlement afterward.
 */
export function getPaywallPrimaryAction(isAuthenticated: boolean): PaywallPrimaryAction {
  return isAuthenticated ? 'purchase' : 'create-account';
}
