import { ANNUAL_PACKAGE_ID, MONTHLY_PACKAGE_ID } from '@/features/subscription/constants';
import type { PresentedPackage } from '@/features/subscription/types';

type StoreProductLike = {
  title?: string;
  priceString?: string;
  introPrice?: unknown;
};

type NativePackageLike = {
  identifier: string;
  product?: StoreProductLike;
};

export function presentPackage(nativePackage: NativePackageLike): PresentedPackage {
  const identifier = nativePackage.identifier;
  const product = nativePackage.product;
  const title = billingTitle(identifier, product?.title);
  const priceString = product?.priceString?.trim() || 'price unavailable';

  return {
    identifier,
    title,
    priceString,
    billingPeriod: billingPeriod(identifier),
    hasIntroOffer: product?.introPrice != null,
  };
}

function billingTitle(identifier: string, storeTitle: string | undefined): string {
  if (identifier === MONTHLY_PACKAGE_ID) {
    return 'Monthly';
  }
  if (identifier === ANNUAL_PACKAGE_ID) {
    return 'Yearly';
  }
  return storeTitle?.trim() || identifier;
}

function billingPeriod(identifier: string): string {
  if (identifier === MONTHLY_PACKAGE_ID) {
    return 'month';
  }
  if (identifier === ANNUAL_PACKAGE_ID) {
    return 'year';
  }
  return 'period';
}
