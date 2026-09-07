import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { MultiChoiceStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';

type MultiChoiceScreenProps = {
  step: MultiChoiceStep;
};

export function MultiChoiceScreen({ step }: MultiChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const toggleMultiAnswer = useOnboardingStore((state) => state.toggleMultiAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const selectedIds = answer?.type === 'multiChoice' ? answer.optionIds : [];

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
      <View style={styles.list}>
        {step.options.map((option) => (
          <ChoiceCard
            key={option.id}
            label={option.label}
            description={option.description}
            selected={selectedIds.includes(option.id)}
            onPress={() => {
              toggleMultiAnswer(step.id, option.id, step.maxSelections);
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
