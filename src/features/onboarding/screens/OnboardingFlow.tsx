import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
import { OnboardingAssetWarmup } from '@/features/onboarding/components/OnboardingAssetWarmup';
import { OnboardingRenderer } from '@/features/onboarding/components/OnboardingRenderer';
import { ResetRevealHandoff } from '@/features/onboarding/components/ResetRevealHandoff';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { OnboardingStep } from '@/features/onboarding/types/onboarding';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';
import { StageMascot } from '@/features/onboarding/stage/StageMascot';
import { StageTopBar } from '@/features/onboarding/stage/StageTopBar';
import { StageTransition } from '@/features/onboarding/stage/StageTransition';
import { isStageStep } from '@/features/onboarding/utils/isStageStep';
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
  const { step, currentStepIndex } = useCurrentOnboardingStep();
  const { goBack, canGoBack } = useOnboardingNavigation();
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const shiftX = useSharedValue(0);
  const [exitingStep, setExitingStep] = useState<OnboardingStep | null>(null);

  const settleQuestionTransition = useCallback(() => {
    setExitingStep(null);
    releaseOnboardingPageShift();
  }, []);

  useLayoutEffect(() => {
    cancelAnimation(shiftX);
    shiftX.value = 0;
  }, [shiftX, step?.id]);

  useEffect(() => {
    registerOnboardingPageShift((direction, commit, toIndex) => {
      const targetIndex =
        toIndex ?? (direction === 'forward' ? currentStepIndex + 1 : currentStepIndex - 1);
      const fromStep = ONBOARDING_STEPS[currentStepIndex];
      const toStep = ONBOARDING_STEPS[targetIndex];
      const useQuestionTransition = isStageStep(fromStep) && isStageStep(toStep);
      const useRevealHandoff =
        (fromStep?.id === 'buildingResetLoading' && toStep?.id === 'resetReveal') ||
        (fromStep?.id === 'resetReveal' && toStep?.id === 'buildingResetLoading');

      if (useQuestionTransition) {
        if (!reduceMotion && fromStep) {
          setExitingStep(fromStep);
        }
        commit();
        if (reduceMotion) {
          releaseOnboardingPageShift();
        }
        return;
      }

      if (useRevealHandoff || reduceMotion || width <= 0) {
        commit();
        releaseOnboardingPageShift();
        return;
      }

      const destination = direction === 'forward' ? -width : width;
      shiftX.value = withTiming(
        destination,
        {
          duration: SCREEN_SHIFT_MS,
          easing: slideEasing,
        },
        (finished) => {
          if (finished) {
            runOnJS(commit)();
            runOnJS(releaseOnboardingPageShift)();
            return;
          }

          runOnJS(releaseOnboardingPageShift)();
        },
      );
    });

    return () => {
      registerOnboardingPageShift(null);
    };
  }, [currentStepIndex, reduceMotion, shiftX, width]);

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

  const onStage = isStageStep(step);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.frame, shiftStyle]}>
        {onStage ? (
          <Screen backgroundColor={colors.stage.floor}>
            <StageBackdrop />
            <StageTopBar stepId={step.id} onBack={canGoBack ? goBack : undefined} />
            <View style={styles.stage}>
              <StageTransition
                contentKey={step.id}
                outgoingKey={exitingStep?.id}
                outgoing={
                  exitingStep ? (
                    <OnboardingRenderer key={exitingStep.id} step={exitingStep} />
                  ) : null
                }
                onSettled={settleQuestionTransition}
              >
                {/* Keyed so back-to-back steps of the same type start fresh. */}
                <OnboardingRenderer key={step.id} step={step} />
              </StageTransition>
              <StageMascot />
            </View>
          </Screen>
        ) : step.type === 'loading' || step.type === 'result' ? (
          <ResetRevealHandoff step={step} />
        ) : (
          <OnboardingRenderer step={step} />
        )}
      </Animated.View>
      <OnboardingAssetWarmup currentStepIndex={currentStepIndex} />
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
  stage: {
    flex: 1,
    minHeight: 0,
  },
});
