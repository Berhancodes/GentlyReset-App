import { OnboardingRenderer } from '@/features/onboarding/components/OnboardingRenderer';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import { AppText, Screen } from '@/components/ui';

export function OnboardingFlow() {
  const { step } = useCurrentOnboardingStep();

  if (!step) {
    return (
      <Screen>
        <AppText variant="body" color="secondary">
          Onboarding is ready for another step.
        </AppText>
      </Screen>
    );
  }

  return <OnboardingRenderer step={step} />;
}
