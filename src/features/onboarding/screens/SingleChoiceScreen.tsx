import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { SingleChoiceStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';

type SingleChoiceScreenProps = {
  step: SingleChoiceStep;
};

export function SingleChoiceScreen({ step }: SingleChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const selectedId = answer?.type === 'singleChoice' ? answer.optionId : undefined;

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton label="continue" disabled={!canProceed(step, answer)} onPress={goToNext} />
      }
    >
      <View style={styles.list}>
        {step.options.map((option) => (
          <ChoiceCard
            key={option.id}
            label={option.label}
            description={option.description}
            selected={selectedId === option.id}
            onPress={() => {
              setAnswer(step.id, { type: 'singleChoice', optionId: option.id });
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
