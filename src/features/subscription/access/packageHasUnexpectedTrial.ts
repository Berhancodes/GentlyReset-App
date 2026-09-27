import type { PresentedPackage } from '../types';

export function packageHasUnexpectedTrial(subscriptionPackage: PresentedPackage): boolean {
  return subscriptionPackage.hasIntroOffer;
}

export function offeringHasUnexpectedTrial(packages: readonly PresentedPackage[]): boolean {
  return packages.some(packageHasUnexpectedTrial);
}
