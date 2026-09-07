import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { ScaleFace } from '@/features/onboarding/components/ScaleFace';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ScaleStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';

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
      tone="question"
      title={step.title}
      subtitle={getQuestionHelper(step)}
      hideProgress={step.hideProgress}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton label="next" disabled={!canProceed(step, answer)} onPress={goToNext} />
      }
    >
      <View style={styles.list}>
        {step.points.map((point) => (
          <ChoiceCard
            key={point.value}
            label={point.label}
            selected={selectedValue === point.value}
            leading={<ScaleFace mood={point.value} selected={selectedValue === point.value} />}
            onPress={() => {
              setAnswer(step.id, { type: 'scale', value: point.value });
            }}
          />
        ))}
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
});
