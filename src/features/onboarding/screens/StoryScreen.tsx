import { useMemo } from 'react';

import { PrimaryButton } from '@/components/ui';
import { BreathingMascot } from '@/features/onboarding/components/BreathingMascot';
import { CompanionMascot } from '@/features/onboarding/components/CompanionMascot';
import { NoticingMascot } from '@/features/onboarding/components/NoticingMascot';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { StoryCopy, type StoryCopyLine } from '@/features/onboarding/components/StoryCopy';
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

  const showBreathingScene = step.scene === 'breathing';
  const showNoticingScene = step.scene === 'noticing';
  const showCompanionScene = step.scene === 'companion';
  const hideStillIllustration = showBreathingScene || showNoticingScene || showCompanionScene;

  return (
    <OnboardingScreenLayout
      tone="story"
      title={step.title}
      showTitle={false}
      illustrationKey={hideStillIllustration ? undefined : step.illustrationKey}
      illustrationSize={step.illustrationSize ?? 'large'}
      illustrationPlacement="end"
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={<PrimaryButton label={step.ctaLabel} onPress={goToNext} />}
    >
      <StoryCopy lines={lines} />
      {showBreathingScene ? <BreathingMascot /> : null}
      {showNoticingScene ? <NoticingMascot /> : null}
      {showCompanionScene ? <CompanionMascot /> : null}
    </OnboardingScreenLayout>
  );
}
