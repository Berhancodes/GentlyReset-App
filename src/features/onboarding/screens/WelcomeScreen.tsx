import { PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { WelcomeStep } from '@/features/onboarding/types/onboarding';

type WelcomeScreenProps = {
  step: WelcomeStep;
};

export function WelcomeScreen({ step }: WelcomeScreenProps) {
  const { goToNext } = useOnboardingNavigation();

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      illustrationKey={step.illustrationKey}
      illustrationSize={step.illustrationSize}
      hideProgress
      footer={<PrimaryButton label={step.ctaLabel} onPress={goToNext} />}
    />
  );
}
