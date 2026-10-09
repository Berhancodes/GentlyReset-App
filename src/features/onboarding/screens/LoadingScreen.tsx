import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { motion, spacing } from '@/design-system';
import { BuildingMascot } from '@/features/onboarding/components/BuildingMascot';
import { LoadingStageRow } from '@/features/onboarding/components/LoadingStageRow';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { StoryCopy, type StoryCopyLine } from '@/features/onboarding/components/StoryCopy';
import { getOnboardingStepIndex } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStagedLoading } from '@/features/onboarding/hooks/useStagedLoading';
import type { LoadingStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

type LoadingScreenProps = {
  step: LoadingStep;
};

type LoadingPhase = 'checks' | 'gotYou';

const GOT_YOU_TITLE = "I think I've got you.";
const GOT_YOU_LINES: readonly StoryCopyLine[] = [
  {
    id: 'got-you',
    text: GOT_YOU_TITLE,
    variant: 'display',
    color: 'primary',
  },
];

export function LoadingScreen({ step }: LoadingScreenProps) {
  const { goToIndex, goBack, canGoBack } = useOnboardingNavigation();
  const [phase, setPhase] = useState<LoadingPhase>('checks');
  const [gotYouTyped, setGotYouTyped] = useState(false);
  const showBuildingScene = step.scene === 'building';
  const showGotYou = phase === 'gotYou';

  const handleChecksComplete = useCallback(() => {
    setPhase('gotYou');
  }, []);

  const handleGotYouFinished = useCallback(() => {
    setGotYouTyped(true);
  }, []);

  const completedCount = useStagedLoading({
    stageCount: step.stages.length,
    mockDurationMs: step.mockDurationMs,
    settleMs: motion.duration.loadingHold,
    onComplete: handleChecksComplete,
  });

  useEffect(() => {
    if (!gotYouTyped) {
      return;
    }

    const timeoutId = setTimeout(() => {
      goToIndex(getOnboardingStepIndex('resetReveal'));
    }, motion.duration.nameResponseHold);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [goToIndex, gotYouTyped]);

  const stageTotal = step.stages.length;

  return (
    <OnboardingScreenLayout
      tone="story"
      title={showGotYou ? GOT_YOU_TITLE : step.title}
      subtitle={showGotYou ? undefined : step.subtitle}
      showTitle={!showGotYou}
      illustrationKey={showGotYou || showBuildingScene ? undefined : step.illustrationKey}
      illustrationSize="large"
      illustrationPlacement="afterHero"
      skipStorySpacer={showGotYou}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
    >
      {showGotYou ? (
        <View style={styles.gotYou}>
          <StoryCopy lines={GOT_YOU_LINES} onFinished={handleGotYouFinished} />
        </View>
      ) : (
        <>
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
        </>
      )}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  gotYou: {
    flexGrow: 1,
    minHeight: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
