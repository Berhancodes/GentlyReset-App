import { useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { MOTION_EASING_STANDARD, motion } from '@/design-system/motion';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { LoadingScreen } from '@/features/onboarding/screens/LoadingScreen';
import { ResultScreen } from '@/features/onboarding/screens/ResultScreen';
import type { LoadingStep, ResultStep } from '@/features/onboarding/types/onboarding';

type ResetRevealHandoffProps = {
  step: LoadingStep | ResultStep;
};

const revealEasing = Easing.bezier(
  MOTION_EASING_STANDARD[0],
  MOTION_EASING_STANDARD[1],
  MOTION_EASING_STANDARD[2],
  MOTION_EASING_STANDARD[3],
);

const BUILDING_LOADING_STEP = ONBOARDING_STEPS.find((step) => step.id === 'buildingResetLoading');

/**
 * Keeps dest 19 mounted through the dest 20 swap so "I think I've got you"
 * dissolves into the type name instead of sliding off to empty cream.
 */
export function ResetRevealHandoff({ step }: ResetRevealHandoffProps) {
  const reduceMotion = useReducedMotion();
  const [keepLoading, setKeepLoading] = useState(step.type === 'loading');
  const reveal = useSharedValue(step.type === 'result' ? 1 : 0);

  useLayoutEffect(() => {
    if (step.type === 'loading') {
      reveal.value = 0;
      return;
    }

    if (!keepLoading || reduceMotion) {
      reveal.value = 1;
      return;
    }

    reveal.value = withTiming(
      1,
      { duration: motion.duration.reveal, easing: revealEasing },
      (finished) => {
        if (finished) {
          runOnJS(setKeepLoading)(false);
        }
      },
    );
  }, [keepLoading, reduceMotion, reveal, step.id, step.type]);

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: 1 - reveal.value,
  }));
  const revealStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
  }));

  const loadingStep =
    step.type === 'loading'
      ? step
      : BUILDING_LOADING_STEP?.type === 'loading'
        ? BUILDING_LOADING_STEP
        : undefined;
  const overlayLoading = keepLoading && step.type === 'result';
  const showLoading = Boolean(loadingStep) && (step.type === 'loading' || overlayLoading);

  return (
    <View style={styles.root}>
      {step.type === 'result' ? (
        <Animated.View style={[styles.layer, revealStyle]}>
          <ResultScreen step={step} />
        </Animated.View>
      ) : null}
      {showLoading && loadingStep ? (
        <Animated.View
          pointerEvents={overlayLoading ? 'none' : 'auto'}
          accessibilityElementsHidden={overlayLoading}
          importantForAccessibility={overlayLoading ? 'no-hide-descendants' : 'auto'}
          style={[overlayLoading ? styles.outgoing : styles.layer, loadingStyle]}
        >
          <LoadingScreen step={loadingStep} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  layer: {
    flex: 1,
  },
  outgoing: {
    ...StyleSheet.absoluteFill,
  },
});
