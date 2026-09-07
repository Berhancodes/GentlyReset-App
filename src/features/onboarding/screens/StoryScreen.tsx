import { AppText, PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { StoryStep } from '@/features/onboarding/types/onboarding';

type StoryScreenProps = {
  step: StoryStep;
};

export function StoryScreen({ step }: StoryScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
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
