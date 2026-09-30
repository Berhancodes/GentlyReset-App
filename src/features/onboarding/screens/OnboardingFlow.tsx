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
import { OnboardingQuestionNav } from '@/features/onboarding/components/OnboardingQuestionNav';
import { OnboardingQuestionnaireShellProvider } from '@/features/onboarding/components/OnboardingQuestionnaireShell';
import { OnboardingRenderer } from '@/features/onboarding/components/OnboardingRenderer';
import { QuestionTransition } from '@/features/onboarding/components/QuestionTransition';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { OnboardingStep } from '@/features/onboarding/types/onboarding';
import { isQuestionnaireStep } from '@/features/onboarding/utils/isQuestionnaireStep';
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
      const useQuestionTransition = isQuestionnaireStep(fromStep) && isQuestionnaireStep(toStep);

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

      if (reduceMotion || width <= 0) {
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

  const questionnaire = isQuestionnaireStep(step);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.frame, shiftStyle]}>
        {questionnaire ? (
          <OnboardingQuestionnaireShellProvider>
            <Screen>
              <OnboardingQuestionNav
                onBack={canGoBack ? goBack : undefined}
                hideProgress={step.hideProgress}
              />
              <QuestionTransition
                contentKey={step.id}
                outgoingKey={exitingStep?.id}
                outgoing={exitingStep ? <OnboardingRenderer step={exitingStep} /> : null}
                onSettled={settleQuestionTransition}
              >
                <OnboardingRenderer step={step} />
              </QuestionTransition>
            </Screen>
          </OnboardingQuestionnaireShellProvider>
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
});
