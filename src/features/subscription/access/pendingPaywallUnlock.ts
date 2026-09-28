export type PendingPaywallUnlock = {
  packageIdentifier: string;
  resumePurchase: boolean;
};

let pendingUnlock: PendingPaywallUnlock | null = null;

/** Remember the selected plan so sign-up can return to the same paywall choice. */
export function rememberPaywallPackage(packageIdentifier: string): void {
  pendingUnlock = {
    packageIdentifier,
    resumePurchase: pendingUnlock?.resumePurchase ?? false,
  };
}

export function peekPaywallUnlock(): PendingPaywallUnlock | null {
  return pendingUnlock;
}

/** After a new account exists, return to the paywall and continue purchase. */
export function markPaywallPurchaseReady(): void {
  if (!pendingUnlock) {
    return;
  }
  pendingUnlock = {
    ...pendingUnlock,
    resumePurchase: true,
  };
}

export function takePaywallResumePurchase(): boolean {
  if (!pendingUnlock?.resumePurchase) {
    return false;
  }
  pendingUnlock = {
    ...pendingUnlock,
    resumePurchase: false,
  };
  return true;
}
