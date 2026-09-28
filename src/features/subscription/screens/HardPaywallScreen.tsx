import { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { PAYWALL_NIGHT_ART } from '@/features/onboarding/data/onboardingAssets';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import {
  getPaywallUnlockLabel,
  getPaywallUnlockNextStep,
} from '@/features/subscription/access/getPaywallPrimaryAction';
import {
  peekPaywallUnlock,
  rememberPaywallPackage,
} from '@/features/subscription/access/pendingPaywallUnlock';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import type { PresentedPackage } from '@/features/subscription/types';
import { getLegalUrls } from '@/features/subscription/utils/legalUrls';

const CTA_SAFE_AREA_GAP = 12;

const BENEFITS = [
  'your personalized 30-day reset',
  'daily steps built around your pattern',
  'journal & track your progress',
  'reset with friends',
  'keep your journey synced',
  'support our small team',
] as const;

export function HardPaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const unlockNextStep = getPaywallUnlockNextStep(isAuthenticated);
  const { available, packages, unexpectedTrial, purchasePackage, restorePurchases } =
    useSubscription();
  const [selectedId, setSelectedId] = useState<string | null>(
    () => peekPaywallUnlock()?.packageIdentifier ?? null,
  );
  const [busy, setBusy] = useState<'purchase' | 'restore' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const legal = getLegalUrls();

  const selected = selectPackage(packages, selectedId);

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
    if (!selected || busy || unexpectedTrial) {
      return;
    }

    rememberPaywallPackage(selected.identifier);

    if (unlockNextStep === 'create-account') {
      router.push('/(auth)/sign-up');
      return;
    }

    startPurchase(selected);
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

  return (
    <View style={styles.root} testID="hard-paywall">
      <StatusBar style="light" />
      <Image
        source={PAYWALL_NIGHT_ART}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        importantForAccessibility="no"
        style={styles.background}
      />
      <SafeAreaView edges={['top', 'right', 'left']} style={styles.safe}>
        <View style={styles.copy}>
          <Text
            accessibilityRole="header"
            allowFontScaling
            maxFontSizeMultiplier={1.25}
            style={styles.title}
          >
            {capitalizeHeading('Gently Reset\nPro')}
          </Text>
          <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.subtitle}>
            unlock your full journey.
          </Text>
          <View style={styles.benefits}>
            {BENEFITS.map((benefit) => (
              <View key={benefit} style={styles.benefitRow}>
                <View style={styles.check}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.benefit}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.plans}>
          {unexpectedTrial ? (
            <Text style={styles.status} accessibilityLiveRegion="polite">
              a trial offer appeared in the store. Gently Reset does not sell trials.
            </Text>
          ) : packages.length === 0 ? (
            <Text style={styles.status} accessibilityLiveRegion="polite">
              {available
                ? 'subscription options aren’t ready yet. try again in a moment.'
                : 'Test Store purchases need an iOS development build. this preview cannot take payment.'}
            </Text>
          ) : (
            packages.map((subscriptionPackage) => {
              const selectedPlan = selected?.identifier === subscriptionPackage.identifier;
              return (
                <Pressable
                  key={subscriptionPackage.identifier}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedPlan }}
                  accessibilityLabel={`${subscriptionPackage.title}, ${subscriptionPackage.priceString} per ${subscriptionPackage.billingPeriod}`}
                  onPress={() => choosePackage(subscriptionPackage.identifier)}
                  style={[styles.plan, selectedPlan ? styles.planSelected : null]}
                >
                  <Text style={styles.planTitle}>{subscriptionPackage.title}</Text>
                  <Text style={styles.planPrice}>
                    {subscriptionPackage.priceString} / {subscriptionPackage.billingPeriod}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>

        <View style={{ paddingBottom: Math.max(insets.bottom, spacing.sm) + CTA_SAFE_AREA_GAP }}>
          {message ? (
            <Text style={styles.status} accessibilityLiveRegion="polite">
              {message}
            </Text>
          ) : null}
          <PrimaryButton
            label={getPaywallUnlockLabel(busy === 'purchase')}
            disabled={!selected || busy !== null || unexpectedTrial}
            onPress={beginUnlock}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restore Purchases"
            disabled={busy !== null}
            onPress={restore}
            hitSlop={spacing.sm}
            style={({ pressed }) => [styles.restore, pressed && styles.pressed]}
          >
            <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.restoreLabel}>
              {busy === 'restore' ? 'restoring…' : 'Restore Purchases'}
            </Text>
          </Pressable>
          <View style={styles.legalRow}>
            <LegalLabel label="Terms of Use" url={legal.termsOfUse} />
            <Text style={styles.legalDot}>·</Text>
            <LegalLabel label="Privacy Policy" url={legal.privacyPolicy} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={() => router.push('/(auth)/sign-in')}
            style={({ pressed }) => [styles.signIn, pressed && styles.pressed]}
          >
            <Text style={styles.signInLabel}>already have an account? sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function selectPackage(
  packages: readonly PresentedPackage[],
  selectedId: string | null,
): PresentedPackage | undefined {
  return packages.find((item) => item.identifier === selectedId) ?? packages[0];
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
    backgroundColor: colors.background.night,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  copy: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display + 6,
    fontWeight: fontWeights.bold,
    color: colors.text.inverse,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subtitle: {
    ...textVariants.subtitle,
    fontFamily: fontFamilies.rounded,
    fontWeight: fontWeights.semibold,
    color: colors.text.inverse,
    textAlign: 'center',
  },
  benefits: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    width: '100%',
    maxWidth: 300,
    paddingLeft: spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.text.inverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs + 2,
    fontWeight: fontWeights.bold,
    color: colors.action.primaryBackground,
  },
  benefit: {
    ...textVariants.body,
    color: colors.text.inverse,
    flex: 1,
  },
  plans: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  plan: {
    minHeight: spacing.hitTarget,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.overlay.scrim,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  planSelected: {
    borderColor: colors.text.inverse,
  },
  planTitle: {
    ...textVariants.optionTitle,
    color: colors.text.inverse,
  },
  planPrice: {
    ...textVariants.body,
    color: colors.text.inverse,
  },
  status: {
    ...textVariants.caption,
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  restore: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxs,
  },
  restoreLabel: {
    ...textVariants.button,
    color: colors.text.inverse,
  },
  legalRow: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  legalLink: {
    ...textVariants.caption,
    color: colors.text.inverse,
    textDecorationLine: 'underline',
  },
  legalMuted: {
    ...textVariants.caption,
    color: colors.text.inverse,
    opacity: 0.7,
  },
  legalDot: {
    ...textVariants.caption,
    color: colors.text.inverse,
  },
  signIn: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLabel: {
    ...textVariants.caption,
    color: colors.accent.gold,
  },
  pressed: {
    opacity: 0.7,
  },
});
