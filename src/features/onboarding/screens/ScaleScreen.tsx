import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
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
  const values = Array.from({ length: step.max - step.min + 1 }, (_, index) => step.min + index);

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton label="continue" disabled={!canProceed(step, answer)} onPress={goToNext} />
      }
    >
      <View style={styles.scaleBlock}>
        <View style={styles.row}>
          {values.map((value) => {
            const selected = selectedValue === value;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`${value} of ${step.max}`}
                accessibilityState={{ selected }}
                onPress={() => {
                  void hapticSelection();
                  setAnswer(step.id, { type: 'scale', value });
                }}
                style={[styles.value, selected ? styles.valueSelected : styles.valueIdle]}
              >
                <AppText variant="body" color={selected ? 'inverse' : 'primary'}>
                  {value}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.labels}>
          {step.minLabel ? (
            <AppText variant="caption" color="muted">
              {step.minLabel}
            </AppText>
          ) : (
            <View />
          )}
          {step.maxLabel ? (
            <AppText variant="caption" color="muted" align="right">
              {step.maxLabel}
            </AppText>
          ) : null}
        </View>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  scaleBlock: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  value: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  valueIdle: {
    backgroundColor: colors.surface.raised,
    borderColor: colors.border.default,
  },
  valueSelected: {
    backgroundColor: colors.action.primaryBackground,
    borderColor: colors.border.selected,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
