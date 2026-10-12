import { ANNUAL_PACKAGE_ID, MONTHLY_PACKAGE_ID } from '../constants';
import type { PresentedPackage } from '../types';

export type PaywallPlan = {
  identifier: string;
  title: string;
  priceString: string;
  billingPeriod: string;
  /** Localized "per month" price, when the store can give one. */
  monthlyEquivalent: string | null;
  savingsLabel?: string;
  bestValue: boolean;
  purchasable: boolean;
};

/** Development-only stand-ins for when no store is connected (Expo Go, web). */
const PREVIEW_PACKAGES: readonly PresentedPackage[] = [
  {
    identifier: ANNUAL_PACKAGE_ID,
    title: 'Yearly',
    priceString: '$79.99',
    price: 79.99,
    pricePerMonthString: '$6.67',
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
];

/** "save 33%" when twelve months of monthly cost more than the yearly plan. */
export function getYearlySavingsLabel(
  yearlyPrice: number | null,
  monthlyPrice: number | null,
): string | undefined {
  if (yearlyPrice == null || monthlyPrice == null || monthlyPrice <= 0) {
    return undefined;
  }
  const yearAtMonthly = monthlyPrice * 12;
  if (yearAtMonthly <= yearlyPrice) {
    return undefined;
  }
  return `save ${Math.round((1 - yearlyPrice / yearAtMonthly) * 100)}%`;
}

function toPlan(item: PresentedPackage, purchasable: boolean): PaywallPlan {
  return {
    identifier: item.identifier,
    title: item.title,
    priceString: item.priceString,
    billingPeriod: item.billingPeriod,
    monthlyEquivalent:
      item.pricePerMonthString ?? (item.billingPeriod === 'month' ? item.priceString : null),
    bestValue: item.identifier === ANNUAL_PACKAGE_ID,
    purchasable,
  };
}

/**
 * The paywall's plans, yearly first, using only the store's own localized prices.
 * Placeholder prices fill in during development (`allowPreviewPrices`) alone; a release
 * build with no store packages gets no plans, and the paywall says prices are unavailable.
 */
export function buildPaywallPlans(
  packages: readonly PresentedPackage[],
  { allowPreviewPrices }: { allowPreviewPrices: boolean },
): readonly PaywallPlan[] {
  const fromStore = packages.length > 0;
  if (!fromStore && !allowPreviewPrices) {
    return [];
  }
  const source = fromStore ? packages : PREVIEW_PACKAGES;
  const annual = source.find((item) => item.identifier === ANNUAL_PACKAGE_ID);
  const monthly = source.find((item) => item.identifier === MONTHLY_PACKAGE_ID);
  const others = source.filter(
    (item) => item.identifier !== ANNUAL_PACKAGE_ID && item.identifier !== MONTHLY_PACKAGE_ID,
  );

  const plans: PaywallPlan[] = [];
  if (annual) {
    plans.push({
      ...toPlan(annual, fromStore),
      savingsLabel: getYearlySavingsLabel(annual.price, monthly?.price ?? null),
    });
  }
  if (monthly) {
    plans.push(toPlan(monthly, fromStore));
  }
  return [...plans, ...others.map((item) => toPlan(item, fromStore))];
}
