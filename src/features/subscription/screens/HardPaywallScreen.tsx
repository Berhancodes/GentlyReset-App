import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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

const COMPACT_HEIGHT = 720;
const ROOMY_HEIGHT = 900;

function layoutForHeight(windowHeight: number) {
  const compact = windowHeight < COMPACT_HEIGHT;
  const roomy = windowHeight >= ROOMY_HEIGHT;
  return {
    compact,
    headerTop: compact ? spacing.sm : roomy ? spacing.xl : spacing.lg,
    headerGap: compact ? spacing.xxs : spacing.xs,
    sectionGap: compact ? spacing.xs : spacing.sm,
    planSectionGap: compact ? spacing.sm : spacing.md,
    benefitGap: compact ? spacing.xs : roomy ? spacing.sm : spacing.xs,
    planGap: compact ? spacing.xs : spacing.sm,
    planPaddingVertical: compact ? spacing.xs : roomy ? spacing.sm : spacing.xs,
    footerLinkMinHeight: spacing.xl,
    bottomPad: compact ? spacing.xs : spacing.sm,
  };
}

export function HardPaywallScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const layout = layoutForHeight(windowHeight);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const unlockNextStep = getPaywallUnlockNextStep(isAuthenticated);
  const { packages, unexpectedTrial, purchasePackage } = useSubscription();
  const plans = useMemo(() => buildPaywallPlans(packages), [packages]);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => peekPaywallUnlock()?.packageIdentifier ?? ANNUAL_PACKAGE_ID,
  );
  const [busy, setBusy] = useState<'purchase' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
        <View style={[styles.header, { marginTop: layout.headerTop, gap: layout.headerGap }]}>
          <View style={styles.sprout} accessibilityElementsHidden>
            <Ionicons name="leaf" size={18} color={colors.accent.gold} />
            <Ionicons name="leaf" size={18} color={colors.accent.gold} style={styles.sproutLeaf} />
          </View>
          <View style={styles.titleRow} accessibilityRole="header">
            <Text
              allowFontScaling
              maxFontSizeMultiplier={1.25}
              style={[styles.title, layout.compact ? styles.titleCompact : null]}
            >
              Gently Reset{' '}
            </Text>
            <Text
              allowFontScaling
              maxFontSizeMultiplier={1.25}
              style={[styles.titlePro, layout.compact ? styles.titleCompact : null]}
            >
              Pro
            </Text>
            <Text style={styles.titleSpark}>✦</Text>
          </View>
          <Text
            allowFontScaling
            maxFontSizeMultiplier={1.3}
            style={[styles.subtitle, layout.compact ? styles.subtitleCompact : null]}
          >
            {PAYWALL_SUBTITLE}
          </Text>
        </View>

        <View style={[styles.benefits, { marginTop: layout.sectionGap, gap: layout.benefitGap }]}>
          {PAYWALL_BENEFITS.map((benefit) => (
            <View key={benefit.title} style={styles.benefitRow}>
              <View style={styles.check}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <View style={styles.benefitCopy}>
                <Text
                  allowFontScaling
                  maxFontSizeMultiplier={1.3}
                  style={[styles.benefitTitle, layout.compact ? styles.benefitTitleCompact : null]}
                >
                  {benefit.title}
                </Text>
                <Text
                  allowFontScaling
                  maxFontSizeMultiplier={1.3}
                  style={[
                    styles.benefitDetail,
                    layout.compact ? styles.benefitDetailCompact : null,
                  ]}
                >
                  {benefit.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {unexpectedTrial ? (
          <Text
            style={[styles.status, { marginTop: layout.sectionGap }]}
            accessibilityLiveRegion="polite"
          >
            a trial offer appeared in the store. Gently Reset does not sell trials.
          </Text>
        ) : (
          <View style={[styles.plans, { marginTop: layout.planSectionGap, gap: layout.planGap }]}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.identifier}
                plan={plan}
                selected={selected?.identifier === plan.identifier}
                paddingVertical={layout.planPaddingVertical}
                onPress={() => choosePackage(plan.identifier)}
              />
            ))}
          </View>
        )}

        <PaywallRestMascot />

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, layout.bottomPad) }]}>
          {message ? (
            <Text style={styles.status} accessibilityLiveRegion="polite">
              {message}
            </Text>
          ) : null}
          <View style={styles.cta}>
            <PrimaryButton
              label={getPaywallUnlockLabel(busy === 'purchase')}
              tone="gold"
              showArrow
              disabled={!canUnlock}
              onPress={beginUnlock}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={() => router.push('/(auth)/sign-in')}
            hitSlop={spacing.sm}
            style={({ pressed }) => [
              styles.signIn,
              { minHeight: layout.footerLinkMinHeight },
              pressed && styles.pressed,
            ]}
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
  paddingVertical,
  onPress,
}: {
  plan: PaywallPlan;
  selected: boolean;
  paddingVertical: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${plan.title}, ${plan.priceString} per ${plan.billingPeriod}`}
      onPress={onPress}
      style={[styles.plan, selected ? styles.planSelected : null, { paddingVertical }]}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    overflow: 'hidden',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    overflow: 'visible',
  },
  header: {
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
  },
  sprout: {
    flexDirection: 'row',
    alignItems: 'center',
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
  titleCompact: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
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
  subtitleCompact: {
    lineHeight: lineHeights.sm,
  },
  benefits: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
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
  benefitTitleCompact: {
    lineHeight: lineHeights.sm,
  },
  benefitDetail: {
    ...textVariants.caption,
    color: colors.text.secondary,
  },
  benefitDetailCompact: {
    lineHeight: lineHeights.xs,
  },
  plans: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
    paddingTop: spacing.sm,
  },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 2,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.md,
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
    flexGrow: 0,
    flexShrink: 0,
    zIndex: 1,
  },
  cta: {
    marginTop: -spacing.xxxl,
  },
  status: {
    ...textVariants.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  signIn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLabel: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: colors.text.secondary,
  },
  signInEmphasis: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: colors.text.primary,
    fontWeight: fontWeights.semibold,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.7,
  },
});
