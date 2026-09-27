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
import { motion } from '@/design-system';
import { DevStepJumper } from '@/features/onboarding/components/DevStepJumper';
import { OnboardingRenderer } from '@/features/onboarding/components/OnboardingRenderer';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

const [EASE_X1, EASE_Y1, EASE_X2, EASE_Y2] = motion.easing.standard;
const slideEasing = Easing.bezier(EASE_X1, EASE_Y1, EASE_X2, EASE_Y2);

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
        ? SlideInRight.duration(motion.duration.screen).easing(slideEasing)
        : SlideInLeft.duration(motion.duration.screen).easing(slideEasing);
  const exiting = reduceMotion
    ? undefined
    : goingForward
      ? SlideOutLeft.duration(motion.duration.screen).easing(slideEasing)
      : SlideOutRight.duration(motion.duration.screen).easing(slideEasing);

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
