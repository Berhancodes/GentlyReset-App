import { useMemo, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  shadows,
  spacing,
  textVariants,
} from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { PAYWALL_SKY_ART } from '@/features/onboarding/data/onboardingAssets';
import {
  getPaywallUnlockLabel,
  getPaywallUnlockNextStep,
} from '@/features/subscription/access/getPaywallPrimaryAction';
import {
  peekPaywallUnlock,
  rememberPaywallPackage,
} from '@/features/subscription/access/pendingPaywallUnlock';
import { PaywallRestMascot } from '@/features/subscription/components/PaywallRestMascot';
import { ANNUAL_PACKAGE_ID } from '@/features/subscription/constants';
import { PAYWALL_BENEFITS, PAYWALL_SUBTITLE } from '@/features/subscription/data/paywallCopy';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import type { PresentedPackage } from '@/features/subscription/types';
import {
  buildPaywallPlans,
  type PaywallPlan,
} from '@/features/subscription/utils/buildPaywallPlans';
import { getLegalUrls } from '@/features/subscription/utils/legalUrls';

const CTA_SAFE_AREA_GAP = 12;

export function HardPaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const unlockNextStep = getPaywallUnlockNextStep(isAuthenticated);
  const { packages, unexpectedTrial, purchasePackage, restorePurchases } = useSubscription();
  const plans = useMemo(() => buildPaywallPlans(packages), [packages]);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => peekPaywallUnlock()?.packageIdentifier ?? ANNUAL_PACKAGE_ID,
  );
  const [busy, setBusy] = useState<'purchase' | 'restore' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const legal = getLegalUrls();

  const selected = plans.find((plan) => plan.identifier === selectedId) ?? plans[0];

  const startPurchase = (subscriptionPackage: PresentedPackage) => {
    if (busy || unexpectedTrial) {
      return;
    }
    setBusy('purchase');
    setMessage(null);
    void purchasePackage(subscriptionPackage.identifier)
      .then((result) => {
        if (!result.ok && result.kind !== 'cancelled') {
          setMessage(result.message);
        }
      })
      .finally(() => {
        setBusy(null);
      });
  };

  const choosePackage = (packageIdentifier: string) => {
    rememberPaywallPackage(packageIdentifier);
    setSelectedId(packageIdentifier);
  };

  const beginUnlock = () => {
    if (!selected?.purchasable || busy || unexpectedTrial) {
      return;
    }

    rememberPaywallPackage(selected.identifier);

    if (unlockNextStep === 'create-account') {
      router.push('/(auth)/sign-up');
      return;
    }

    const storePackage = packages.find((item) => item.identifier === selected.identifier);
    if (!storePackage) {
      return;
    }

    startPurchase(storePackage);
  };

  const restore = () => {
    if (busy) {
      return;
    }
    setBusy('restore');
    setMessage(null);
    void restorePurchases()
      .then((result) => {
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        if (!result.unlocked) {
          setMessage('no eligible purchase was found for this account.');
        }
      })
      .finally(() => {
        setBusy(null);
      });
  };

  const canUnlock = Boolean(selected?.purchasable) && busy === null && !unexpectedTrial;

  return (
    <View style={styles.root} testID="hard-paywall">
      <StatusBar style="dark" />
      <Image
        source={PAYWALL_SKY_ART}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        importantForAccessibility="no"
        style={styles.sky}
      />
      <SafeAreaView edges={['top', 'right', 'left']} style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sprout} accessibilityElementsHidden>
            <Ionicons name="leaf" size={18} color={colors.accent.gold} />
            <Ionicons name="leaf" size={18} color={colors.accent.gold} style={styles.sproutLeaf} />
          </View>
          <View style={styles.titleRow} accessibilityRole="header">
            <Text allowFontScaling maxFontSizeMultiplier={1.25} style={styles.title}>
              Gently Reset{' '}
            </Text>
            <Text allowFontScaling maxFontSizeMultiplier={1.25} style={styles.titlePro}>
              Pro
            </Text>
            <Text style={styles.titleSpark}>✦</Text>
          </View>
          <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.subtitle}>
            {PAYWALL_SUBTITLE}
          </Text>

          <View style={styles.benefits}>
            {PAYWALL_BENEFITS.map((benefit) => (
              <View key={benefit.title} style={styles.benefitRow}>
                <View style={styles.check}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <View style={styles.benefitCopy}>
                  <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.benefitTitle}>
                    {benefit.title}
                  </Text>
                  <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.benefitDetail}>
                    {benefit.detail}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {unexpectedTrial ? (
            <Text style={styles.status} accessibilityLiveRegion="polite">
              a trial offer appeared in the store. Gently Reset does not sell trials.
            </Text>
          ) : (
            <View style={styles.plans}>
              {plans.map((plan) => (
                <PlanCard
                  key={plan.identifier}
                  plan={plan}
                  selected={selected?.identifier === plan.identifier}
                  onPress={() => choosePackage(plan.identifier)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <PaywallRestMascot />

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, spacing.sm) + CTA_SAFE_AREA_GAP },
          ]}
        >
          {message ? (
            <Text style={styles.status} accessibilityLiveRegion="polite">
              {message}
            </Text>
          ) : null}
          <PrimaryButton
            label={getPaywallUnlockLabel(busy === 'purchase')}
            tone="gold"
            showArrow
            disabled={!canUnlock}
            onPress={beginUnlock}
          />
          <View style={styles.legalRow}>
            <LegalLabel label="Terms of Use" url={legal.termsOfUse} />
            <Text style={styles.legalDot}>·</Text>
            <LegalLabel label="Privacy Policy" url={legal.privacyPolicy} />
            <Text style={styles.legalDot}>·</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restore Purchases"
              disabled={busy !== null}
              onPress={restore}
              hitSlop={spacing.xs}
            >
              <Text style={styles.legalLink}>Restore Purchases</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={() => router.push('/(auth)/sign-in')}
            style={({ pressed }) => [styles.signIn, pressed && styles.pressed]}
          >
            <Text style={styles.signInLabel}>
              Already have an account? <Text style={styles.signInEmphasis}>Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function PlanCard({
  plan,
  selected,
  onPress,
}: {
  plan: PaywallPlan;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${plan.title}, ${plan.priceString} per ${plan.billingPeriod}`}
      onPress={onPress}
      style={[styles.plan, selected ? styles.planSelected : null]}
    >
      {plan.bestValue ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>BEST VALUE</Text>
        </View>
      ) : null}
      <View style={[styles.radio, selected ? styles.radioSelected : null]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.planCopy}>
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planMonthly}>{plan.monthlyEquivalent}/month</Text>
      </View>
      <View style={styles.planPrices}>
        <Text style={styles.planPrice}>
          {plan.priceString} <Text style={styles.planPeriod}>/{plan.billingPeriod}</Text>
        </Text>
        {plan.compareAtPriceString ? (
          <View style={styles.planSaveRow}>
            <Text style={styles.planCompare}>{plan.compareAtPriceString}</Text>
            {plan.savingsLabel ? <Text style={styles.planSave}>{plan.savingsLabel}</Text> : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function LegalLabel({ label, url }: { label: string; url: string | null }) {
  if (!url) {
    return (
      <Text style={styles.legalMuted} accessibilityLabel={`${label} coming before production`}>
        {label}
      </Text>
    );
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={() => {
        void Linking.openURL(url);
      }}
      hitSlop={spacing.xs}
    >
      <Text style={styles.legalLink}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    overflow: 'hidden',
  },
  sky: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 280,
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  sprout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  sproutLeaf: {
    marginLeft: -spacing.xxs,
    transform: [{ scaleX: -1 }, { rotate: '-18deg' }],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  titlePro: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    fontWeight: fontWeights.bold,
    color: colors.accent.gold,
    letterSpacing: -0.6,
  },
  titleSpark: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    color: colors.accent.gold,
    marginLeft: spacing.xxs,
    marginTop: spacing.xxs,
  },
  subtitle: {
    ...textVariants.subtitle,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  benefits: {
    width: '100%',
    maxWidth: 340,
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  check: {
    width: 22,
    height: 22,
    marginTop: 2,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.accent.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs + 1,
    fontWeight: fontWeights.bold,
    color: colors.accent.gold,
  },
  benefitCopy: {
    flex: 1,
    gap: 1,
  },
  benefitTitle: {
    ...textVariants.optionTitle,
    color: colors.text.primary,
  },
  benefitDetail: {
    ...textVariants.caption,
    color: colors.text.secondary,
  },
  plans: {
    width: '100%',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  plan: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 2,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.whisper,
  },
  planSelected: {
    borderColor: colors.border.gold,
    backgroundColor: colors.surface.choiceSelected,
  },
  badge: {
    position: 'absolute',
    top: -11,
    right: spacing.lg,
    backgroundColor: colors.accent.gold,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    lineHeight: fontSizes.tab + 2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    letterSpacing: 0.4,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.accent.gold,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.gold,
  },
  planCopy: {
    flex: 1,
    gap: 1,
  },
  planTitle: {
    ...textVariants.optionTitle,
    color: colors.text.primary,
  },
  planMonthly: {
    ...textVariants.caption,
    color: colors.text.secondary,
  },
  planPrices: {
    alignItems: 'flex-end',
    gap: 1,
  },
  planPrice: {
    ...textVariants.optionTitle,
    color: colors.text.primary,
  },
  planPeriod: {
    ...textVariants.caption,
    color: colors.text.secondary,
  },
  planSaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  planCompare: {
    ...textVariants.caption,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
  },
  planSave: {
    ...textVariants.caption,
    color: colors.accent.gold,
    fontWeight: fontWeights.semibold,
  },
  footer: {
    zIndex: 1,
  },
  status: {
    ...textVariants.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  legalRow: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  legalLink: {
    ...textVariants.caption,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  legalMuted: {
    ...textVariants.caption,
    color: colors.text.helper,
  },
  legalDot: {
    ...textVariants.caption,
    color: colors.text.helper,
  },
  signIn: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLabel: {
    ...textVariants.caption,
    color: colors.text.secondary,
  },
  signInEmphasis: {
    ...textVariants.caption,
    color: colors.text.primary,
    fontWeight: fontWeights.semibold,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.7,
  },
});
