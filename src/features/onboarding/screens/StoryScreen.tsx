import { AppText, PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { StoryStep } from '@/features/onboarding/types/onboarding';

type StoryScreenProps = {
  step: StoryStep;
};

export function StoryScreen({ step }: StoryScreenProps) {
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton
          label={step.ctaLabel ?? 'continue'}
          onPress={() => {
            setAnswer(step.id, { type: 'story' });
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
