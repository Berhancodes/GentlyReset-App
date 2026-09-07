import { AppText, PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ResultStep } from '@/features/onboarding/types/onboarding';

type ResultScreenProps = {
  step: ResultStep;
};

export function ResultScreen({ step }: ResultScreenProps) {
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
            setAnswer(step.id, { type: 'result' });
            goToNext();
          }}
        />
      }
    >
      <AppText variant="body" color="secondary">
        {step.body}
      </AppText>
    </OnboardingScreenLayout>
  );
}
