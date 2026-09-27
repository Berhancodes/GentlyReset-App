import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  useReducedMotion,
} from 'react-native-reanimated';

import { AppText, Screen } from '@/components/ui';
import { MOTION_EASING_STANDARD, motion } from '@/design-system/motion';
import { DevStepJumper } from '@/features/onboarding/components/DevStepJumper';
import { OnboardingRenderer } from '@/features/onboarding/components/OnboardingRenderer';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

const slideEasing = Easing.bezier(
  MOTION_EASING_STANDARD[0],
  MOTION_EASING_STANDARD[1],
  MOTION_EASING_STANDARD[2],
  MOTION_EASING_STANDARD[3],
);

export function OnboardingFlow() {
  const { step } = useCurrentOnboardingStep();
  const stepDirection = useOnboardingStore((state) => state.stepDirection);
  const hasAnimatedStep = useOnboardingStore((state) => state.hasAnimatedStep);
  const reduceMotion = useReducedMotion();

  if (!step) {
    return (
      <Screen>
        <AppText variant="body" color="secondary">
          Onboarding is ready for another step.
        </AppText>
      </Screen>
    );
  }

  const goingForward = stepDirection === 'forward';
  const entering = reduceMotion
    ? FadeIn.duration(0)
    : !hasAnimatedStep
      ? undefined
      : goingForward
        ? SlideInLeft.duration(motion.duration.screen).easing(slideEasing)
        : SlideInRight.duration(motion.duration.screen).easing(slideEasing);
  const exiting = reduceMotion
    ? undefined
    : goingForward
      ? SlideOutRight.duration(motion.duration.screen).easing(slideEasing)
      : SlideOutLeft.duration(motion.duration.screen).easing(slideEasing);

  return (
    <View style={styles.root}>
      <Animated.View key={step.id} entering={entering} exiting={exiting} style={styles.frame}>
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
  },
  frame: {
    flex: 1,
  },
});
