import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { motion, spacing } from '@/design-system';
import { BuildingMascot } from '@/features/onboarding/components/BuildingMascot';
import { LoadingStageRow } from '@/features/onboarding/components/LoadingStageRow';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { getOnboardingStepIndex } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStagedLoading } from '@/features/onboarding/hooks/useStagedLoading';
import type { LoadingStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

type LoadingScreenProps = {
  step: LoadingStep;
};

export function LoadingScreen({ step }: LoadingScreenProps) {
  const { goToIndex, goBack, canGoBack } = useOnboardingNavigation();
  const handleComplete = useCallback(() => {
    const gotYouIndex = getOnboardingStepIndex('gotYouStory');
    goToIndex(gotYouIndex);
  }, [goToIndex]);
  const completedCount = useStagedLoading({
    stageCount: step.stages.length,
    mockDurationMs: step.mockDurationMs,
    settleMs: motion.duration.loadingHold,
    onComplete: handleComplete,
  });
  const showBuildingScene = step.scene === 'building';
  const stageTotal = step.stages.length;

  return (
    <OnboardingScreenLayout
      tone="story"
      title={step.title}
      subtitle={step.subtitle}
      illustrationKey={showBuildingScene ? undefined : step.illustrationKey}
      illustrationSize="large"
      illustrationPlacement="afterHero"
      hideProgress
      onBack={canGoBack ? goBack : undefined}
    >
      {showBuildingScene ? <BuildingMascot /> : null}
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={capitalizeHeading(step.title)}
        accessibilityValue={{ min: 0, max: stageTotal, now: completedCount }}
        style={styles.list}
      >
        {step.stages.map((stage, index) => (
          <LoadingStageRow
            key={stage.id}
            label={stage.label}
            done={index < completedCount}
            active={index === completedCount}
          />
        ))}
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    flexGrow: 1,
  },
});
