import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { LoadingStep } from '@/features/onboarding/types/onboarding';

type LoadingScreenProps = {
  step: LoadingStep;
};

export function LoadingScreen({ step }: LoadingScreenProps) {
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext } = useOnboardingNavigation();
  const pulse = useSharedValue(0.7);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pulse]);

  useEffect(() => {
    setAnswer(step.id, { type: 'loading' });
    const timeout = setTimeout(() => {
      goToNext();
    }, step.durationMs);

    return () => clearTimeout(timeout);
  }, [goToNext, setAnswer, step.durationMs, step.id]);

  const orbStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.9 + pulse.value * 0.1 }],
  }));

  return (
    <OnboardingScreenLayout title={step.title} subtitle={step.subtitle} showMascot={false}>
      <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={step.title}>
        <Animated.View style={[styles.orb, orbStyle]} />
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  orb: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.gold,
  },
});
