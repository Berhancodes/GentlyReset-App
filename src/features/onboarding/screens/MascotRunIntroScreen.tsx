import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/design-system';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { MascotIntroStep } from '@/features/onboarding/types/onboarding';
import { hapticImpact } from '@/utils/haptics';

const MASCOT_RUN = require('../../../../assets/images/onboarding/mascot-run-intro.gif');
const MASCOT_RUN_FINAL = require('../../../../assets/images/onboarding/mascot-run-intro-final.png');

const LAST_FRAME_MS = 100;

type MascotRunIntroScreenProps = {
  step: MascotIntroStep;
};

export function MascotRunIntroScreen({ step }: MascotRunIntroScreenProps) {
  const { goToNext } = useOnboardingNavigation();
  const goToNextRef = useRef(goToNext);
  const [showFinalFrame, setShowFinalFrame] = useState(false);

  useEffect(() => {
    goToNextRef.current = goToNext;
  }, [goToNext]);

  useEffect(() => {
    const freezeAtMs = Math.max(0, step.durationMs - LAST_FRAME_MS);
    let holdTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let hapticTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const freezeTimeoutId = setTimeout(() => {
      setShowFinalFrame(true);
    }, freezeAtMs);

    hapticTimeoutId = setTimeout(() => {
      void hapticImpact();
      holdTimeoutId = setTimeout(() => {
        goToNextRef.current();
      }, step.holdMs);
    }, step.durationMs);

    return () => {
      clearTimeout(freezeTimeoutId);
      clearTimeout(hapticTimeoutId);
      if (holdTimeoutId) {
        clearTimeout(holdTimeoutId);
      }
    };
  }, [step.durationMs, step.holdMs]);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Your companion is arriving"
      style={styles.root}
    >
      <StatusBar style="dark" />
      <Image
        source={showFinalFrame ? MASCOT_RUN_FINAL : MASCOT_RUN}
        resizeMode="contain"
        fadeDuration={0}
        accessibilityIgnoresInvertColors
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.art}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
  },
  art: {
    width: '100%',
    height: '100%',
  },
});
