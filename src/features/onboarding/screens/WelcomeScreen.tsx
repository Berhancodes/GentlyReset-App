import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { WelcomeStep } from '@/features/onboarding/types/onboarding';
import { hapticImpact } from '@/utils/haptics';

const WELCOME_ART = require('../../../../assets/images/onboarding/welcome-sunset.png');

type WelcomeScreenProps = {
  step: WelcomeStep;
};

export function WelcomeScreen({ step }: WelcomeScreenProps) {
  const { goToNext } = useOnboardingNavigation();
  const reduceMotion = useReducedMotion();
  const copyEntering = reduceMotion ? undefined : FadeIn.duration(520);
  const ctaEntering = reduceMotion ? undefined : FadeInDown.duration(480).delay(160);

  return (
    <View style={styles.root}>
      <Image
        source={WELCOME_ART}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        importantForAccessibility="no"
        style={styles.background}
      />
      <View pointerEvents="none" style={styles.bottomWash} />
      <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safe}>
        <Animated.View entering={copyEntering} style={styles.copy}>
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
        </Animated.View>
        <View style={styles.stage} />
        <Animated.View entering={ctaEntering} style={styles.ctaWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={step.ctaLabel}
            onPress={() => {
              void hapticImpact();
              goToNext();
            }}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.ctaLabel}>
              {step.ctaLabel}
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.accent.blue,
  },
  background: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  bottomWash: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '22%',
    backgroundColor: colors.background.inverse,
    opacity: 0.12,
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  copy: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.display + 14,
    lineHeight: fontSizes.display + 18,
    fontWeight: fontWeights.bold,
    color: colors.text.inverse,
    textAlign: 'center',
    letterSpacing: -0.8,
    textShadowColor: colors.overlay.scrim,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  subtitle: {
    ...textVariants.subtitle,
    fontFamily: fontFamilies.rounded,
    fontWeight: fontWeights.semibold,
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: colors.overlay.scrim,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  stage: {
    flex: 1,
  },
  ctaWrap: {
    paddingBottom: spacing.sm,
  },
  cta: {
    minHeight: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.action.primaryBackground,
    borderWidth: 1,
    borderColor: colors.accent.gold,
  },
  ctaPressed: {
    backgroundColor: colors.action.primaryBackgroundPressed,
    transform: [{ scale: 0.98 }],
  },
  ctaLabel: {
    ...textVariants.button,
    color: colors.action.primaryText,
  },
});
