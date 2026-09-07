import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { ScaleFace } from '@/features/onboarding/components/ScaleFace';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ScaleStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { hapticSelection } from '@/utils/haptics';

type ScaleScreenProps = {
  step: ScaleStep;
};

export function ScaleScreen({ step }: ScaleScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const selectedValue = answer?.type === 'scale' ? answer.value : undefined;

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      hideProgress={step.hideProgress}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton label="continue" disabled={!canProceed(step, answer)} onPress={goToNext} />
      }
    >
      <View style={styles.row}>
        {step.points.map((point) => {
          const selected = selectedValue === point.value;
          return (
            <Pressable
              key={point.value}
              accessibilityRole="button"
              accessibilityLabel={`${point.label}, ${point.value} of ${step.points.length}`}
              accessibilityState={{ selected }}
              onPress={() => {
                void hapticSelection();
                setAnswer(step.id, { type: 'scale', value: point.value });
              }}
              style={[styles.point, selected ? styles.pointSelected : styles.pointIdle]}
            >
              <ScaleFace mood={point.value} selected={selected} />
              <AppText
                variant="label"
                color={selected ? 'primary' : 'muted'}
                align="center"
                numberOfLines={2}
              >
                {point.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  point: {
    flex: 1,
    minHeight: 88,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xxs,
    borderRadius: radius.lg,
  },
  pointIdle: {
    backgroundColor: colors.background.primary,
  },
  pointSelected: {
    backgroundColor: colors.surface.selected,
  },
});
