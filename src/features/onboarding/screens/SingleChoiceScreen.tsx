import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { ChoiceGlyph } from '@/features/onboarding/components/ChoiceGlyph';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OptionGrid } from '@/features/onboarding/components/OptionGrid';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { SingleChoiceStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';

type SingleChoiceScreenProps = {
  step: SingleChoiceStep;
};

export function SingleChoiceScreen({ step }: SingleChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const selectedId = answer?.type === 'singleChoice' ? answer.optionId : undefined;
  const layout = step.layout ?? 'stacked';
  const isTile = layout === 'grid2' || layout === 'grid3';

  const cards = step.options.map((option) => (
    <ChoiceCard
      key={option.id}
      label={option.label}
      description={option.description}
      variant={isTile ? 'tile' : 'row'}
      leading={
        layout === 'feelingList' || isTile ? <ChoiceGlyph optionId={option.id} /> : undefined
      }
      showIndicator={!isTile}
      selected={selectedId === option.id}
      haptic={option.selectHaptic ?? 'selection'}
      onPress={() => {
        setAnswer(step.id, { type: 'singleChoice', optionId: option.id });
      }}
    />
  ));

  return (
    <OnboardingScreenLayout
      tone="question"
      title={step.title}
      subtitle={getQuestionHelper(step)}
      eyebrow={step.eyebrow}
      hideProgress={step.hideProgress}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton label="next" disabled={!canProceed(step, answer)} onPress={goToNext} />
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
