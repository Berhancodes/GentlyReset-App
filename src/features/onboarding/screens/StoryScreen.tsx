import { AppText, PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { StoryStep } from '@/features/onboarding/types/onboarding';
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

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={subtitle}
      eyebrow={step.eyebrow}
      illustrationKey={step.illustrationKey}
      illustrationSize={step.illustrationSize ?? 'large'}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={<PrimaryButton label={step.ctaLabel} onPress={goToNext} />}
    >
      {step.body ? (
        <AppText variant="body" color="secondary">
          {step.body}
        </AppText>
      ) : null}
    </OnboardingScreenLayout>
  );
}
