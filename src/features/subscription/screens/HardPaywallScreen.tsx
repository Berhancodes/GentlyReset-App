import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
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
import { openLegalDocument } from '@/features/legal/utils/openLegalDocument';
import { UnlockStepsBar } from '@/features/onboarding/components/UnlockStepsBar';
import { STAGE_POSE_ART, STAGE_POSE_SCALE } from '@/features/onboarding/stage/stagePoses';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';
import { getPaywallUnlockLabel } from '@/features/subscription/access/getPaywallPrimaryAction';
import {
  peekPaywallUnlock,
  rememberPaywallPackage,
} from '@/features/subscription/access/pendingPaywallUnlock';
import { ANNUAL_PACKAGE_ID } from '@/features/subscription/constants';
import { PAYWALL_BENEFITS, PAYWALL_SUBTITLE } from '@/features/subscription/data/paywallCopy';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import {
  buildPaywallPlans,
  type PaywallPlan,
} from '@/features/subscription/utils/buildPaywallPlans';

const HERO_ART = STAGE_POSE_ART['react-hopeful'];
/** At most this big; he shrinks to whatever room is left so the page never scrolls. */
const HERO_SCALE = STAGE_POSE_SCALE * 0.78;
/**
 * Below this much usable height (screen minus the notch and home bar), the
 * benefits drop their small detail line so everything fits without scrolling.
 */
const COMPACT_HEIGHT = 800;
/** Below this (iPhone SE and similar), the mascot steps aside and the small links share one line. */
const TIGHT_HEIGHT = 700;

/** Clean stage paywall: the mascot, what Pro includes, the plans, one button. */
export function HardPaywallScreen() {
  const router = useRouter();
  const grantLocalAppAccess = useOnboardingStore((state) => state.grantLocalAppAccess);
  const answers = useOnboardingStore((state) => state.answers);
  const {
    available,
    packages,
    unexpectedTrial,
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
  } = useSubscription();
  // Made-up prices only ever show in development; a release build shows the store's or none.
  const plans = useMemo(
    () => buildPaywallPlans(packages, { allowPreviewPrices: __DEV__ }),
    [packages],
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    () => peekPaywallUnlock()?.packageIdentifier ?? ANNUAL_PACKAGE_ID,
  );
  const [busy, setBusy] = useState<'purchase' | 'restore' | 'reload' | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableHeight = windowHeight - insets.top - insets.bottom;
  const compact = usableHeight < COMPACT_HEIGHT;
  const tight = usableHeight < TIGHT_HEIGHT;
  // Fits on one screen; scrolling only switches on if very large text can't fit.
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const overflows = viewportHeight > 0 && contentHeight > viewportHeight + 1;
  const profile = getResetProfileForAnswers(answers);
  const introAnswer = answers.mascotRunIntro;
  const typedName = introAnswer?.type === 'mascotIntro' ? introAnswer.name.trim() : '';
  const firstName = typedName ? typedName.charAt(0).toUpperCase() + typedName.slice(1) : '';

  const selected = plans.find((plan) => plan.identifier === selectedId) ?? plans[0];

  const choosePackage = (packageIdentifier: string) => {
    rememberPaywallPackage(packageIdentifier);
    setSelectedId(packageIdentifier);
  };

  const openApp = () => {
    // Development builds also keep a local pass, so a reload of the preview stays unlocked.
    if (__DEV__) {
      grantLocalAppAccess();
    }
    router.replace('/(app)/(tabs)/home');
  };

  /** Buys the selected plan through the App Store. The app opens only once Pro is active. */
  const beginUnlock = async () => {
    if (busy || !selected) {
      return;
    }
    setStatus(null);
    if (!available) {
      if (__DEV__) {
        openApp();
        return;
      }
      setStatus('the App Store isn’t reachable right now. check your connection and try again.');
      return;
    }
    setBusy('purchase');
    const result = await purchasePackage(selected.identifier);
    setBusy(null);
    if (result.ok) {
      openApp();
      return;
    }
    // Closing Apple's sheet is a choice, not an error.
    if (result.kind !== 'cancelled') {
      setStatus(result.message);
    }
  };

  const restore = async () => {
    if (busy) {
      return;
    }
    setBusy('restore');
    setStatus(null);
    const result = await restorePurchases();
    setBusy(null);
    if (!result.ok) {
      setStatus(result.message);
    } else if (result.unlocked) {
      openApp();
    } else {
      setStatus('no Pro purchase found for this Apple ID.');
    }
  };

  const reloadPrices = async () => {
    if (busy) {
      return;
    }
    setBusy('reload');
    setStatus(null);
    try {
      await refreshCustomerInfo();
    } catch {
      setStatus('prices still couldn’t load. try again in a moment.');
    } finally {
      setBusy(null);
    }
  };

  const pricesUnavailable = plans.length === 0;
  const canUnlock = busy === null && selected !== undefined && (selected.purchasable || __DEV__);

  return (
    <View style={styles.root} testID="hard-paywall">
      <StatusBar style="dark" />
      <SafeAreaView edges={['top', 'right', 'left', 'bottom']} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, compact ? styles.contentCompact : null]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={overflows}
          bounces={overflows}
          onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
          onContentSizeChange={(_, height) => setContentHeight(height)}
        >
          {/* The last of the three unlock screens after onboarding. */}
          <View style={styles.steps}>
            <UnlockStepsBar stepId="paywall" />
          </View>
          <View
            style={[styles.hero, tight ? styles.heroHidden : null]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Image
              source={HERO_ART.source}
              resizeMode="contain"
              style={[
                styles.heroImage,
                {
                  maxWidth: HERO_ART.width * HERO_SCALE,
                  maxHeight: HERO_ART.height * HERO_SCALE,
                },
              ]}
            />
          </View>

          <View style={styles.header} accessibilityRole="header">
            <Text allowFontScaling maxFontSizeMultiplier={1.25} style={styles.title}>
              Gently Reset <Text style={styles.titlePro}>Pro</Text>
            </Text>
            <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.subtitle}>
              {PAYWALL_SUBTITLE.replace('\n', ' ')}
            </Text>
            <View style={styles.tag}>
              <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.tagText}>
                {`Built for ${profile.name}${firstName ? ` · ${firstName}` : ''}`}
              </Text>
            </View>
          </View>

          <View style={[styles.benefits, compact ? styles.benefitsCompact : null]}>
            {PAYWALL_BENEFITS.map((benefit) => (
              <View key={benefit.title} style={styles.benefitRow}>
                <View style={styles.check} accessibilityElementsHidden>
                  <View style={styles.checkMark} />
                </View>
                <View style={styles.benefitCopy}>
                  <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.benefitTitle}>
                    {benefit.title}
                  </Text>
                  {compact ? null : (
                    <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.benefitDetail}>
                      {benefit.detail}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {unexpectedTrial ? (
            <Text style={styles.status} accessibilityLiveRegion="polite">
              a trial offer appeared in the store. Gently Reset does not sell trials.
            </Text>
          ) : pricesUnavailable ? (
            <View style={styles.unavailable}>
              <Text style={styles.status} accessibilityLiveRegion="polite">
                prices couldn’t load. check your connection, then try again.
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Try loading prices again"
                onPress={() => void reloadPrices()}
                hitSlop={spacing.xs}
                style={styles.legalLink}
              >
                <Text style={[styles.legalLabel, styles.legalStrong]}>
                  {busy === 'reload' ? 'Loading…' : 'Try again'}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.plans} accessibilityRole="radiogroup">
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

          <View style={styles.footer}>
            <PrimaryButton
              label={getPaywallUnlockLabel(busy === 'purchase')}
              tone="cocoa"
              disabled={!canUnlock}
              onPress={() => void beginUnlock()}
            />
            {selected ? (
              <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.fine}>
                {`Auto-renews at ${selected.priceString}/${selected.billingPeriod} until cancelled. Cancel anytime in Settings.`}
              </Text>
            ) : null}
            {tight ? null : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                onPress={() => router.push('/(auth)/sign-in')}
                hitSlop={spacing.sm}
                style={({ pressed }) => [styles.signIn, pressed && styles.pressed]}
              >
                <Text style={styles.signInLabel}>
                  Already have an account? <Text style={styles.signInEmphasis}>Sign In</Text>
                </Text>
              </Pressable>
            )}
            {status ? (
              <Text style={styles.status} accessibilityLiveRegion="polite">
                {status}
              </Text>
            ) : null}
            <View style={styles.legal}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Restore purchases"
                accessibilityState={{ disabled: busy !== null }}
                onPress={() => void restore()}
                hitSlop={spacing.xs}
                style={styles.legalLink}
              >
                <Text style={[styles.legalLabel, styles.legalStrong]}>
                  {busy === 'restore' ? 'Restoring…' : 'Restore'}
                </Text>
              </Pressable>
              <Text style={styles.legalDot} accessibilityElementsHidden>
                ·
              </Text>
              {tight ? (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Sign in"
                    onPress={() => router.push('/(auth)/sign-in')}
                    hitSlop={spacing.xs}
                    style={styles.legalLink}
                  >
                    <Text style={[styles.legalLabel, styles.legalStrong]}>Sign in</Text>
                  </Pressable>
                  <Text style={styles.legalDot} accessibilityElementsHidden>
                    ·
                  </Text>
                </>
              ) : null}
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Terms of Service"
                onPress={() => openLegalDocument('terms')}
                hitSlop={spacing.xs}
                style={styles.legalLink}
              >
                <Text style={styles.legalLabel}>Terms of Service</Text>
              </Pressable>
              <Text style={styles.legalDot} accessibilityElementsHidden>
                ·
              </Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Privacy Policy"
                onPress={() => openLegalDocument('privacy')}
                hitSlop={spacing.xs}
                style={styles.legalLink}
              >
                <Text style={styles.legalLabel}>Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${plan.title}, ${plan.priceString} per ${plan.billingPeriod}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.plan,
        selected ? styles.planSelected : null,
        pressed ? styles.pressed : null,
      ]}
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
        {plan.monthlyEquivalent ? (
          <Text style={styles.planDetail}>{plan.monthlyEquivalent}/month</Text>
        ) : null}
      </View>
      <View style={styles.planPrices}>
        <Text style={styles.planPrice}>{plan.priceString}</Text>
        <Text style={styles.planDetail}>per {plan.billingPeriod}</Text>
        {plan.savingsLabel ? <Text style={styles.planSave}>{plan.savingsLabel}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.stage.sky,
  },
  safe: {
    flex: 1,
  },
  unavailable: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
  },
  steps: {
    flexDirection: 'row',
    minHeight: spacing.lg,
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  contentCompact: {
    gap: spacing.xs,
  },
  /** Takes whatever height is left, so the mascot shrinks before anything else would. */
  hero: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minHeight: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heroHidden: {
    display: 'none',
  },
  heroImage: {
    flex: 1,
    width: '100%',
    aspectRatio: HERO_ART.width / HERO_ART.height,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  titlePro: {
    color: colors.accent.gold,
  },
  subtitle: {
    ...textVariants.subtitle,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.chipSelected,
  },
  tagText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  benefits: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xxs,
  },
  benefitsCompact: {
    gap: spacing.xs,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  check: {
    width: spacing.lg,
    height: spacing.lg,
    marginTop: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.chipSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    width: 9,
    height: 5,
    marginTop: -2,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.text.primary,
    transform: [{ rotate: '-45deg' }],
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
    gap: spacing.sm,
    paddingTop: spacing.xxs,
  },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    ...shadows.soft,
  },
  planSelected: {
    borderColor: colors.border.selected,
    backgroundColor: colors.surface.choiceSelected,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: spacing.lg,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.gold,
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
    borderColor: colors.border.selected,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
  planCopy: {
    flex: 1,
    gap: 1,
  },
  planTitle: {
    ...textVariants.optionTitle,
    color: colors.text.primary,
  },
  planDetail: {
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
  planSave: {
    ...textVariants.caption,
    color: colors.accent.gold,
    fontWeight: fontWeights.semibold,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  fine: {
    ...textVariants.caption,
    color: colors.text.helper,
    textAlign: 'center',
  },
  status: {
    ...textVariants.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  signIn: {
    minHeight: spacing.hitTarget,
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
  legal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  legalLink: {
    minHeight: spacing.hitTarget - spacing.sm,
    justifyContent: 'center',
  },
  legalLabel: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: colors.text.helper,
    textDecorationLine: 'underline',
  },
  legalStrong: {
    color: colors.text.primary,
    fontWeight: fontWeights.semibold,
  },
  legalDot: {
    fontSize: fontSizes.xs,
    color: colors.text.helper,
  },
});
