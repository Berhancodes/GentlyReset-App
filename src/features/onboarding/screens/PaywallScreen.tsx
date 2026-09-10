import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { PAYWALL_NIGHT_ART } from '@/features/onboarding/data/onboardingAssets';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { PaywallStep } from '@/features/onboarding/types/onboarding';
import { finishOnboarding } from '@/features/onboarding/utils/finishOnboarding';
import { hapticImpact } from '@/utils/haptics';

const CTA_SAFE_AREA_GAP = 12;

type PaywallScreenProps = {
  step: PaywallStep;
};

export function PaywallScreen({ step }: PaywallScreenProps) {
  const insets = useSafeAreaInsets();
  const { router, goBack, canGoBack } = useOnboardingNavigation();

  const complete = () => {
    finishOnboarding(router);
  };

  return (
    <View style={styles.root} testID="onboarding-paywall">
      <StatusBar style="light" />
      <Image
        source={PAYWALL_NIGHT_ART}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        importantForAccessibility="no"
        style={styles.background}
      />
      <SafeAreaView edges={['top', 'right', 'left']} style={styles.safe}>
        <View style={styles.nav}>
          {canGoBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={goBack}
              hitSlop={spacing.sm}
              style={styles.backButton}
            >
              <BackChevron tone="inverse" />
            </Pressable>
          ) : (
            <View style={styles.backButton} />
          )}
        </View>

        <View style={styles.copy}>
          <Text
            accessibilityRole="header"
            allowFontScaling
            maxFontSizeMultiplier={1.25}
            style={styles.title}
          >
            {step.title}
          </Text>
          {step.subtitle ? (
            <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.subtitle}>
              {step.subtitle}
            </Text>
          ) : null}

          <View style={styles.benefits}>
            {step.benefits.map((benefit) => (
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

        <View style={styles.stage} />

        <View style={{ paddingBottom: Math.max(insets.bottom, spacing.sm) + CTA_SAFE_AREA_GAP }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={step.ctaLabel}
            onPress={() => {
              void hapticImpact();
              complete();
            }}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.ctaLabel}>
              {step.ctaLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={step.secondaryCtaLabel}
            onPress={complete}
            hitSlop={spacing.sm}
            style={({ pressed }) => [styles.skip, pressed && styles.skipPressed]}
          >
            <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.skipLabel}>
              {step.secondaryCtaLabel}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.night,
  },
  background: {
    position: 'absolute',
    left: -36,
    right: -36,
    top: -88,
    bottom: 0,
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  nav: {
    minHeight: 44,
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  copy: {
    alignItems: 'center',
    paddingTop: spacing.xs,
    gap: spacing.xs,
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
  stage: {
    flex: 1,
  },
  cta: {
    minHeight: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.action.primaryBackground,
    borderWidth: 3,
    borderColor: colors.text.inverse,
  },
  ctaPressed: {
    backgroundColor: colors.action.primaryBackgroundPressed,
    transform: [{ scale: 0.98 }],
  },
  ctaLabel: {
    ...textVariants.button,
    color: colors.action.primaryText,
  },
  skip: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxs,
  },
  skipPressed: {
    opacity: 0.7,
  },
  skipLabel: {
    ...textVariants.button,
    color: colors.text.primary,
  },
});
