import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { IllustratedChoiceCard } from '@/features/onboarding/components/IllustratedChoiceCard';
import { IllustratedChoiceGrid } from '@/features/onboarding/components/IllustratedChoiceGrid';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OptionGrid } from '@/features/onboarding/components/OptionGrid';
import { OptionIcon } from '@/features/onboarding/components/OptionIcon';
import { getOptionIconSource } from '@/features/onboarding/data/onboardingAssets';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { SingleChoiceStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';
import { shouldUseIllustratedGrid } from '@/features/onboarding/utils/shouldUseIllustratedGrid';

type SingleChoiceScreenProps = {
  step: SingleChoiceStep;
};

export function SingleChoiceScreen({ step }: SingleChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const selectedId = answer?.type === 'singleChoice' ? answer.optionId : undefined;
  const layout = step.layout ?? 'stacked';
  const illustratedGrid = shouldUseIllustratedGrid(step);
  const useGrid = illustratedGrid || layout === 'grid2' || layout === 'grid3';
  const columns = illustratedGrid || layout === 'grid2' ? 2 : 3;

  const cards = step.options.map((option) => {
    const icon = getOptionIconSource(option.id);
    const selected = selectedId === option.id;
    const onPress = () => {
      setAnswer(step.id, { type: 'singleChoice', optionId: option.id });
    };

    if (illustratedGrid) {
      return (
        <IllustratedChoiceCard
          key={option.id}
          label={option.label}
          leading={icon ? <OptionIcon source={icon} /> : undefined}
          selected={selected}
          haptic={option.selectHaptic ?? 'selection'}
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
        haptic={option.selectHaptic ?? 'selection'}
        onPress={onPress}
      />
    );
  });

  return (
    <OnboardingScreenLayout
      tone="question"
      compact={illustratedGrid && step.options.length >= 8}
      title={step.title}
      subtitle={getQuestionHelper(step)}
      eyebrow={step.eyebrow}
      illustrationKey={step.illustrationKey}
      illustrationSize={step.illustrationSize}
      hideProgress={step.hideProgress}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton label="next" disabled={!canProceed(step, answer)} onPress={goToNext} />
      }
    >
      {illustratedGrid ? (
        <IllustratedChoiceGrid>{cards}</IllustratedChoiceGrid>
      ) : useGrid ? (
        <OptionGrid columns={columns}>{cards}</OptionGrid>
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
