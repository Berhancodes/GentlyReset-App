import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { IllustratedChoiceCard } from '@/features/onboarding/components/IllustratedChoiceCard';
import { IllustratedChoiceGrid } from '@/features/onboarding/components/IllustratedChoiceGrid';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OptionGrid } from '@/features/onboarding/components/OptionGrid';
import { OptionIcon } from '@/features/onboarding/components/OptionIcon';
import { ThinkingLogMascot } from '@/features/onboarding/components/ThinkingLogMascot';
import { getOptionIconSource } from '@/features/onboarding/data/onboardingAssets';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { MultiChoiceStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';
import { shouldUseIllustratedGrid } from '@/features/onboarding/utils/shouldUseIllustratedGrid';

type MultiChoiceScreenProps = {
  step: MultiChoiceStep;
};

export function MultiChoiceScreen({ step }: MultiChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const toggleMultiAnswer = useOnboardingStore((state) => state.toggleMultiAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const selectedIds = answer?.type === 'multiChoice' ? answer.optionIds : [];
  const layout = step.layout ?? 'stacked';
  const isReasonStep = step.id === 'reason';
  const illustratedGrid = shouldUseIllustratedGrid(step);
  const useGrid = illustratedGrid || layout === 'grid2' || layout === 'grid3';
  const columns = illustratedGrid || layout === 'grid2' ? 2 : 3;

  const cards = step.options.map((option) => {
    const icon = getOptionIconSource(option.id);
    const selected = selectedIds.includes(option.id);
    const onPress = () => {
      toggleMultiAnswer(step.id, option.id, step.maxSelections);
    };

    if (illustratedGrid) {
      return (
        <IllustratedChoiceCard
          key={option.id}
          label={option.label}
          leading={icon ? <OptionIcon source={icon} size={isReasonStep ? 36 : 48} /> : undefined}
          selected={selected}
          onPress={onPress}
        />
      );
    }

    return (
      <ChoiceCard
        key={option.id}
        label={option.label}
        description={option.description}
        leading={icon ? <OptionIcon source={icon} size={40} /> : undefined}
        selected={selected}
        onPress={onPress}
      />
    );
  });

  const options = illustratedGrid ? (
    <IllustratedChoiceGrid>{cards}</IllustratedChoiceGrid>
  ) : useGrid ? (
    <OptionGrid columns={columns}>{cards}</OptionGrid>
  ) : (
    <View style={styles.list}>{cards}</View>
  );

  return (
    <OnboardingScreenLayout
      tone="question"
      compact={isReasonStep || (illustratedGrid && step.options.length >= 8)}
      title={step.title}
      subtitle={getQuestionHelper(step)}
      hideProgress={step.hideProgress}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton
          label="next"
          showArrow
          disabled={!canProceed(step, answer)}
          onPress={goToNext}
        />
      }
    >
      {isReasonStep ? (
        <View style={styles.reasonBlock}>
          {options}
          <ThinkingLogMascot />
        </View>
      ) : (
        options
      )}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  reasonBlock: {
    gap: spacing.sm,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});
