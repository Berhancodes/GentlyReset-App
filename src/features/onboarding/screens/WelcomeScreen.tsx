import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui';
import { colors, spacing, textVariants } from '@/design-system';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { WelcomeStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

const WELCOME_ART = require('../../../../assets/images/onboarding/welcome-sunset.png');

type WelcomeScreenProps = {
  step: WelcomeStep;
};

export function WelcomeScreen({ step }: WelcomeScreenProps) {
  const { router, goToNext } = useOnboardingNavigation();
  const insets = useSafeAreaInsets();
  const signInPrompt = step.signInPrompt;
  const signInLabel = step.signInLabel;
  const spokenTitle = `${capitalizeHeading(step.title).replace(/\n/g, ' ')}. ${
    step.subtitle?.replace(/\n/g, ' ') ?? ''
  }`;

  return (
    <View style={styles.root} accessible={false}>
      <StatusBar style="dark" />
      <Image
        source={WELCOME_ART}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        importantForAccessibility="no"
        style={styles.background}
      />
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel={spokenTitle}
        style={[styles.header, { paddingTop: insets.top + spacing.xxl }]}
      >
        <View style={styles.sprout} accessibilityElementsHidden>
          <Ionicons name="leaf" size={18} color={colors.text.inverse} />
          <Ionicons name="leaf" size={18} color={colors.text.inverse} style={styles.sproutLeaf} />
        </View>
        <Text allowFontScaling maxFontSizeMultiplier={1.25} style={styles.title}>
          {step.title}
        </Text>
        {step.subtitle ? (
          <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.subtitle}>
            {step.subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
        <PrimaryButton label={step.ctaLabel} onPress={goToNext} />
        {signInPrompt && signInLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${signInPrompt} ${signInLabel}`}
            onPress={() => router.push('/(auth)/sign-in')}
            style={styles.signInRow}
          >
            <Text allowFontScaling maxFontSizeMultiplier={1.4} style={styles.signInPrompt}>
              {signInPrompt}
            </Text>
            <Text allowFontScaling maxFontSizeMultiplier={1.4} style={styles.signInLabel}>
              {signInLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.background.sky,
  },
  background: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  sprout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sproutLeaf: {
    marginLeft: -spacing.xxs,
    transform: [{ scaleX: -1 }, { rotate: '-18deg' }],
  },
  title: {
    ...textVariants.questionTitle,
    color: colors.text.inverse,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.subtitle,
    color: colors.text.inverse,
    textAlign: 'center',
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  signInRow: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  signInPrompt: {
    ...textVariants.onboardingHelper,
    color: colors.text.inverse,
  },
  signInLabel: {
    ...textVariants.onboardingHelper,
    color: colors.accent.gold,
    textDecorationLine: 'underline',
  },
});
