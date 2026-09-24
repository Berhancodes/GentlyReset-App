import { PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { PlanPreviewList } from '@/features/onboarding/components/PlanPreviewList';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { FinalStep } from '@/features/onboarding/types/onboarding';

type FinalScreenProps = {
  step: FinalStep;
};

export function FinalScreen({ step }: FinalScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();

  return (
    <OnboardingScreenLayout
      tone="story"
      title={step.title}
      subtitle={step.subtitle}
      eyebrow={step.eyebrow}
      illustrationKey={step.illustrationKey ?? 'journey'}
      illustrationSize={step.illustrationSize ?? 'default'}
      illustrationPlacement="afterHero"
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={<PrimaryButton label={step.ctaLabel} haptic="success" onPress={goToNext} />}
    >
      <PlanPreviewList items={step.preview} />
    </OnboardingScreenLayout>
  );
}
