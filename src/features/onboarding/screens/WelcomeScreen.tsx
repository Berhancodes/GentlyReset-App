import { PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { WelcomeStep } from '@/features/onboarding/types/onboarding';

type WelcomeScreenProps = {
  step: WelcomeStep;
};

export function WelcomeScreen({ step }: WelcomeScreenProps) {
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton
          label={step.ctaLabel}
          onPress={() => {
            setAnswer(step.id, { type: 'welcome' });
            goToNext();
          }}
        />
      }
    />
  );
}
