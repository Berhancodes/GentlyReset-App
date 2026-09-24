import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { BreathingMascot } from '@/features/onboarding/components/BreathingMascot';
import { CompanionMascot } from '@/features/onboarding/components/CompanionMascot';
import { NoticingMascot } from '@/features/onboarding/components/NoticingMascot';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { PlanPreviewList } from '@/features/onboarding/components/PlanPreviewList';
import { StoryCopy, type StoryCopyLine } from '@/features/onboarding/components/StoryCopy';
import { PLAN_READY_COPY, PLAN_READY_PREVIEW } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { StoryStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import {
  deriveCarryingSubtitle,
  deriveConsistencyInsight,
} from '@/features/onboarding/utils/deriveIntermissionInsight';

type StoryScreenProps = {
  step: StoryStep;
};

export function StoryScreen({ step }: StoryScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const [companionCopyDone, setCompanionCopyDone] = useState(false);
  const [readyCopyDone, setReadyCopyDone] = useState(false);

  const subtitle =
    step.dynamicCopy === 'outOfBalance'
      ? deriveCarryingSubtitle(answers)
      : step.dynamicCopy === 'consistencyStage'
        ? deriveConsistencyInsight(answers)
        : step.subtitle;

  const lines = useMemo(() => {
    const nextLines: StoryCopyLine[] = [];

    if (step.eyebrow) {
      nextLines.push({
        id: 'eyebrow',
        text: step.eyebrow,
        variant: 'storyEyebrow',
        color: 'helper',
      });
    }

    nextLines.push({
      id: 'title',
      text: capitalizeHeading(step.title),
      variant: 'storyTitle',
      color: 'primary',
    });

    if (subtitle) {
      nextLines.push({
        id: 'subtitle',
        text: subtitle,
        variant: 'storySupporting',
        color: 'primary',
      });
    }

    if (step.body) {
      nextLines.push({
        id: 'body',
        text: step.body,
        variant: 'storySupporting',
        color: 'helper',
      });
    }

    return nextLines;
  }, [step.body, step.eyebrow, step.title, subtitle]);

  const readyLines = useMemo<StoryCopyLine[]>(
    () => [
      {
        id: 'ready-eyebrow',
        text: PLAN_READY_COPY.eyebrow,
        variant: 'onboardingHelper',
        color: 'helper',
      },
      {
        id: 'ready-title',
        text: PLAN_READY_COPY.title,
        variant: 'storyTitle',
        color: 'primary',
      },
      {
        id: 'ready-supporting',
        text: PLAN_READY_COPY.supporting,
        variant: 'storyTitle',
        color: 'primary',
      },
      {
        id: 'ready-subtitle',
        text: PLAN_READY_COPY.subtitle,
        variant: 'storySupporting',
        color: 'helper',
      },
    ],
    [],
  );

  const showBreathingScene = step.scene === 'breathing';
  const showNoticingScene = step.scene === 'noticing';
  const showCompanionScene = step.scene === 'companion';
  const hideStillIllustration = showBreathingScene || showNoticingScene || showCompanionScene;
  const handleCompanionFinished = useCallback(() => {
    setCompanionCopyDone(true);
  }, []);
  const handleReadyFinished = useCallback(() => {
    setReadyCopyDone(true);
  }, []);

  return (
    <OnboardingScreenLayout
      tone="story"
      title={step.title}
      showTitle={false}
      illustrationKey={hideStillIllustration ? undefined : step.illustrationKey}
      illustrationSize={step.illustrationSize ?? 'large'}
      illustrationPlacement="end"
      skipStorySpacer={showCompanionScene}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={<PrimaryButton label={step.ctaLabel} onPress={goToNext} />}
    >
      <StoryCopy
        lines={lines}
        onFinished={showCompanionScene ? handleCompanionFinished : undefined}
      />
      {showCompanionScene && companionCopyDone ? (
        <StoryCopy lines={readyLines} onFinished={handleReadyFinished} />
      ) : null}
      {showBreathingScene ? <BreathingMascot /> : null}
      {showNoticingScene ? <NoticingMascot /> : null}
      {showCompanionScene ? (
        <View style={styles.companionStage}>
          <CompanionMascot />
          {readyCopyDone ? <PlanPreviewList items={PLAN_READY_PREVIEW} animateIn /> : null}
        </View>
      ) : null}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  companionStage: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    width: '100%',
    paddingTop: spacing.sm,
  },
});
