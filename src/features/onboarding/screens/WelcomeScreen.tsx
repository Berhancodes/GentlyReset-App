import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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

function readableTextShadow(blur: number) {
  if (Platform.OS === 'web') {
    return { textShadow: `0 1px ${blur}px ${colors.overlay.scrim}` };
  }

  return {
    textShadowColor: colors.overlay.scrim,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: blur,
  };
}

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
      <View style={styles.bottomWash} />
      <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safe}>
        <Animated.View entering={copyEntering} style={styles.copy}>
          <Text
            accessibilityRole="header"
            allowFontScaling
            maxFontSizeMultiplier={1.25}
            style={[styles.title, readableTextShadow(8)]}
          >
            {step.title}
          </Text>
          {step.subtitle ? (
            <Text
              allowFontScaling
              maxFontSizeMultiplier={1.3}
              style={[styles.subtitle, readableTextShadow(6)]}
            >
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
    pointerEvents: 'none',
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
  },
  subtitle: {
    ...textVariants.subtitle,
    fontFamily: fontFamilies.rounded,
    fontWeight: fontWeights.semibold,
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: 24,
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
