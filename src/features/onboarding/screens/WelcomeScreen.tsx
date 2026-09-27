import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoticeDialog, PrimaryButton } from '@/components/ui';
import { colors, spacing } from '@/design-system';
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
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <PrimaryButton label={step.ctaLabel} onPress={goToNext} />
        {signInPrompt && signInLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${signInPrompt} ${signInLabel}`}
            onPress={() => setSignInOpen(true)}
            style={styles.signInHit}
          />
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
    backgroundColor: colors.accent.blue,
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
  },
  signInHit: {
    minHeight: spacing.hitTarget,
  },
});
