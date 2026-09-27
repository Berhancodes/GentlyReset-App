import { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText, Screen } from '@/components/ui';
import { colors } from '@/design-system';
import { MOTION_EASING_STANDARD, motion } from '@/design-system/motion';
import { DevStepJumper } from '@/features/onboarding/components/DevStepJumper';
import { OnboardingRenderer } from '@/features/onboarding/components/OnboardingRenderer';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import {
  registerOnboardingPageShift,
  releaseOnboardingPageShift,
} from '@/features/onboarding/utils/onboardingPageShift';

const SCREEN_SHIFT_MS = motion.duration.screen;

const slideEasing = Easing.bezier(
  MOTION_EASING_STANDARD[0],
  MOTION_EASING_STANDARD[1],
  MOTION_EASING_STANDARD[2],
  MOTION_EASING_STANDARD[3],
);

export function OnboardingFlow() {
  const { step } = useCurrentOnboardingStep();
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const shiftX = useSharedValue(0);

  useLayoutEffect(() => {
    cancelAnimation(shiftX);
    shiftX.value = 0;
  }, [shiftX, step?.id]);

  useEffect(() => {
    registerOnboardingPageShift((direction, commit) => {
      if (reduceMotion || width <= 0) {
        commit();
        return;
      }

      const destination = direction === 'forward' ? width : -width;
      shiftX.value = withTiming(
        destination,
        {
          duration: SCREEN_SHIFT_MS,
          easing: slideEasing,
        },
        (finished) => {
          if (finished) {
            runOnJS(commit)();
            return;
          }

          runOnJS(releaseOnboardingPageShift)();
        },
      );
    });

    return () => {
      registerOnboardingPageShift(null);
    };
  }, [reduceMotion, shiftX, width]);

  const shiftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shiftX.value }],
  }));

  if (!step) {
    return (
      <Screen>
        <AppText variant="body" color="secondary">
          Onboarding is ready for another step.
        </AppText>
      </Screen>
    );
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.frame, shiftStyle]}>
        <OnboardingRenderer step={step} />
      </Animated.View>
      <DevStepJumper />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
  },
  frame: {
    flex: 1,
  },
});
