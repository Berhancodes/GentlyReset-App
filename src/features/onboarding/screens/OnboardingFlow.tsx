import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText, Screen } from '@/components/ui';
import { DevStepJumper } from '@/features/onboarding/components/DevStepJumper';
import { OnboardingRenderer } from '@/features/onboarding/components/OnboardingRenderer';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';

export function OnboardingFlow() {
  const { step } = useCurrentOnboardingStep();

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
      <Animated.View key={step.id} entering={FadeIn.duration(280)} style={styles.frame}>
        <OnboardingRenderer step={step} />
      </Animated.View>
      <DevStepJumper />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  frame: {
    flex: 1,
  },
});
