import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { ChoiceGlyph } from '@/features/onboarding/components/ChoiceGlyph';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OptionGrid } from '@/features/onboarding/components/OptionGrid';
import { OptionIcon } from '@/features/onboarding/components/OptionIcon';
import { ThinkingLogMascot } from '@/features/onboarding/components/ThinkingLogMascot';
import { getReasonOptionIconSource } from '@/features/onboarding/data/onboardingAssets';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { MultiChoiceStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';

type MultiChoiceScreenProps = {
  step: MultiChoiceStep;
};

export function MultiChoiceScreen({ step }: MultiChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const toggleMultiAnswer = useOnboardingStore((state) => state.toggleMultiAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const selectedIds = answer?.type === 'multiChoice' ? answer.optionIds : [];
  const layout = step.layout ?? 'stacked';
  const isTile = layout === 'grid2' || layout === 'grid3';
  const isReasonStep = step.id === 'reason';

  const cards = step.options.map((option) => {
    const reasonIcon = isReasonStep ? getReasonOptionIconSource(option.id) : undefined;

    return (
      <ChoiceCard
        key={option.id}
        label={option.label}
        description={option.description}
        variant={isTile ? 'tile' : 'row'}
        leading={
          reasonIcon ? (
            <OptionIcon source={reasonIcon} />
          ) : isTile ? (
            <ChoiceGlyph optionId={option.id} />
          ) : undefined
        }
        showIndicator={!isTile}
        selected={selectedIds.includes(option.id)}
        onPress={() => {
          toggleMultiAnswer(step.id, option.id, step.maxSelections);
        }}
      />
    );
  });

  return (
    <OnboardingScreenLayout
      tone="question"
      title={step.title}
      subtitle={getQuestionHelper(step)}
      hideProgress={step.hideProgress}
      onBack={canGoBack ? goBack : undefined}
      footer={
        isReasonStep ? (
          <View>
            <ThinkingLogMascot />
            <PrimaryButton label="next" disabled={!canProceed(step, answer)} onPress={goToNext} />
          </View>
        ) : (
          <PrimaryButton label="next" disabled={!canProceed(step, answer)} onPress={goToNext} />
        )
      }
    >
      {layout === 'grid3' ? (
        <OptionGrid columns={3}>{cards}</OptionGrid>
      ) : layout === 'grid2' ? (
        <OptionGrid columns={2}>{cards}</OptionGrid>
      ) : (
        <View style={styles.list}>{cards}</View>
      )}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
});
