import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoticeDialog, PrimaryButton } from '@/components/ui';
import { colors, spacing, textVariants } from '@/design-system';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { WelcomeStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

const WELCOME_ART = require('../../../../assets/images/onboarding/welcome-first-screen.png');

const SIGN_IN_NOTICE = {
  title: 'sign in',
  body: 'accounts are not part of this build yet. begin a new reset to continue.',
} as const;

type WelcomeScreenProps = {
  step: WelcomeStep;
};

export function WelcomeScreen({ step }: WelcomeScreenProps) {
  const { goToNext } = useOnboardingNavigation();
  const insets = useSafeAreaInsets();
  const [signInOpen, setSignInOpen] = useState(false);
  const signInPrompt = step.signInPrompt;
  const signInLabel = step.signInLabel;
  const spokenTitle = `${capitalizeHeading(step.title).replace('\n', ' ')}. ${step.subtitle ?? ''}`;

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
        style={styles.headerHit}
      />
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
        <PrimaryButton label={step.ctaLabel} onPress={goToNext} />
        {signInPrompt && signInLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${signInPrompt} ${signInLabel}`}
            onPress={() => setSignInOpen(true)}
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
      <NoticeDialog
        visible={signInOpen}
        title={capitalizeHeading(SIGN_IN_NOTICE.title)}
        body={SIGN_IN_NOTICE.body}
        onClose={() => setSignInOpen(false)}
      />
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
  headerHit: {
    ...StyleSheet.absoluteFill,
    bottom: '32%',
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
