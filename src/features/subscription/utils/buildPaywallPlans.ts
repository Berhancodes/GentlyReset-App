import { ANNUAL_PACKAGE_ID, MONTHLY_PACKAGE_ID } from '@/features/subscription/constants';
import type { PresentedPackage } from '@/features/subscription/types';

export type PaywallPlan = {
  identifier: string;
  title: string;
  priceString: string;
  billingPeriod: string;
  monthlyEquivalent: string;
  compareAtPriceString?: string;
  savingsLabel?: string;
  bestValue: boolean;
  purchasable: boolean;
};

const PREVIEW_ANNUAL_PRICE = '$79.99';
const PREVIEW_MONTHLY_PRICE = '$9.99';
const PREVIEW_ANNUAL_COMPARE_AT = '$119.99';
const PREVIEW_ANNUAL_MONTHLY = '$6.67';

function parseDollarAmount(priceString: string): number | undefined {
  const match = priceString.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  const raw = match?.[1];
  if (!raw) {
    return undefined;
  }

  const amount = Number(raw);
  return Number.isFinite(amount) ? amount : undefined;
}

function formatDollars(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function monthlyEquivalent(priceString: string, billingPeriod: string): string {
  if (billingPeriod === 'month') {
    return priceString;
  }

  const amount = parseDollarAmount(priceString);
  if (amount == null) {
    return priceString;
  }

  return formatDollars(amount / 12);
}

function savingsFromPrices(
  annualPrice: string,
  monthlyPrice: string,
): { compareAtPriceString: string; savingsLabel: string } | undefined {
  const annual = parseDollarAmount(annualPrice);
  const monthly = parseDollarAmount(monthlyPrice);
  if (annual == null || monthly == null || monthly <= 0) {
    return undefined;
  }

  const yearlyAtMonthly = monthly * 12;
  if (yearlyAtMonthly <= annual) {
    return undefined;
  }

  const percent = Math.round((1 - annual / yearlyAtMonthly) * 100);
  return {
    compareAtPriceString: formatDollars(yearlyAtMonthly),
    savingsLabel: `save ${percent}%`,
  };
}

export function buildPaywallPlans(packages: readonly PresentedPackage[]): readonly PaywallPlan[] {
  const annual = packages.find((item) => item.identifier === ANNUAL_PACKAGE_ID);
  const monthly = packages.find((item) => item.identifier === MONTHLY_PACKAGE_ID);
  const hasStorePlans = Boolean(annual || monthly);
  const savings =
    annual && monthly
      ? savingsFromPrices(annual.priceString, monthly.priceString)
      : {
          compareAtPriceString: PREVIEW_ANNUAL_COMPARE_AT,
          savingsLabel: 'save 33%',
        };

  const yearlyPlan: PaywallPlan = {
    identifier: annual?.identifier ?? ANNUAL_PACKAGE_ID,
    title: 'Yearly',
    priceString: annual?.priceString ?? PREVIEW_ANNUAL_PRICE,
    billingPeriod: annual?.billingPeriod ?? 'year',
    monthlyEquivalent: annual
      ? monthlyEquivalent(annual.priceString, annual.billingPeriod)
      : PREVIEW_ANNUAL_MONTHLY,
    compareAtPriceString: savings?.compareAtPriceString,
    savingsLabel: savings?.savingsLabel,
    bestValue: true,
    purchasable: Boolean(annual),
  };

  const monthlyPlan: PaywallPlan = {
    identifier: monthly?.identifier ?? MONTHLY_PACKAGE_ID,
    title: 'Monthly',
    priceString: monthly?.priceString ?? PREVIEW_MONTHLY_PRICE,
    billingPeriod: monthly?.billingPeriod ?? 'month',
    monthlyEquivalent: monthly?.priceString ?? PREVIEW_MONTHLY_PRICE,
    bestValue: false,
    purchasable: Boolean(monthly),
  };

  if (!hasStorePlans) {
    return [yearlyPlan, monthlyPlan];
  }

  const extras = packages.filter(
    (item) => item.identifier !== ANNUAL_PACKAGE_ID && item.identifier !== MONTHLY_PACKAGE_ID,
  );

  return [
    yearlyPlan,
    monthlyPlan,
    ...extras.map((item) => ({
      identifier: item.identifier,
      title: item.title,
      priceString: item.priceString,
      billingPeriod: item.billingPeriod,
      monthlyEquivalent: monthlyEquivalent(item.priceString, item.billingPeriod),
      bestValue: false,
      purchasable: true,
    })),
  ];
}
