import { StyleSheet, View } from 'react-native';

import { ChoiceCard, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { ClimbingMascot } from '@/features/onboarding/components/ClimbingMascot';
import { IllustratedChoiceCard } from '@/features/onboarding/components/IllustratedChoiceCard';
import { IllustratedChoiceGrid } from '@/features/onboarding/components/IllustratedChoiceGrid';
import { MissedDayChoices } from '@/features/onboarding/components/MissedDayChoices';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OptionGrid } from '@/features/onboarding/components/OptionGrid';
import { OptionIcon } from '@/features/onboarding/components/OptionIcon';
import { SupportTimingChoices } from '@/features/onboarding/components/SupportTimingChoices';
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
  const denseGrid = illustratedGrid && step.options.length >= 8;
  const isHardestStep = step.id === 'consistencyStage';
  const isChangePatternStep = step.id === 'changePattern';
  const isDesiredIdentityStep = step.id === 'desiredIdentity';
  const isDailyCommitmentStep = step.id === 'dailyCommitment';
  const isSupportStyleStep = step.id === 'supportStyle';
  const isSupportTimingStep = step.id === 'supportTiming';
  const isMissedDayStep = step.id === 'missedDayResponse';
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
          compact={denseGrid || isDesiredIdentityStep || isSupportStyleStep}
          label={option.label}
          leading={
            icon ? (
              <OptionIcon
                source={icon}
                size={denseGrid || isDesiredIdentityStep || isSupportStyleStep ? 32 : 40}
              />
            ) : undefined
          }
          selected={selected}
          haptic={option.selectHaptic ?? 'selection'}
          onPress={onPress}
        />
      );
    }

    return (
      <ChoiceCard
        key={option.id}
        compact={
          isHardestStep ||
          isChangePatternStep ||
          isDailyCommitmentStep ||
          Boolean(step.illustrationKey)
        }
        tight={isHardestStep}
        label={option.label}
        description={option.description}
        leading={icon ? <OptionIcon source={icon} size={isHardestStep ? 28 : 40} /> : undefined}
        selected={selected}
        haptic={option.selectHaptic ?? 'selection'}
        onPress={onPress}
      />
    );
  });

  return (
    <OnboardingScreenLayout
      tone="question"
      compact
      compactTitle={
        isChangePatternStep || isDesiredIdentityStep || isDailyCommitmentStep || isSupportStyleStep
      }
      scrollEnabled={false}
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
      {isSupportTimingStep ? (
        <SupportTimingChoices
          options={step.options}
          selectedId={selectedId}
          onSelect={(optionId) => {
            setAnswer(step.id, { type: 'singleChoice', optionId });
          }}
        />
      ) : isMissedDayStep ? (
        <MissedDayChoices
          options={step.options}
          selectedId={selectedId}
          onSelect={(optionId) => {
            setAnswer(step.id, { type: 'singleChoice', optionId });
          }}
        />
      ) : isHardestStep ? (
        <View style={styles.hardestBlock}>
          <View style={styles.hardestChoices}>{cards}</View>
          <ClimbingMascot />
        </View>
      ) : illustratedGrid ? (
        <IllustratedChoiceGrid compact={denseGrid || isDesiredIdentityStep || isSupportStyleStep}>
          {cards}
        </IllustratedChoiceGrid>
      ) : useGrid ? (
        <OptionGrid columns={columns} compact={denseGrid}>
          {cards}
        </OptionGrid>
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
  hardestBlock: {
    flex: 1,
    minHeight: 0,
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  hardestChoices: {
    gap: spacing.xxs,
    flexShrink: 1,
  },
});
