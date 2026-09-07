import { useRouter } from 'expo-router';

import { AppText, PrimaryButton } from '@/components/ui';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

export function OnboardingCompleteScreen() {
  const router = useRouter();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  return (
    <OnboardingScreenLayout
      title="your space is ready."
      subtitle="This is a temporary pause before the rest of Gently Reset is built."
      footer={
        <PrimaryButton
          label="enter Gently Reset"
          onPress={() => {
            completeOnboarding();
            router.replace('/(app)/(tabs)/home');
          }}
        />
      }
    >
      <AppText variant="body" color="secondary">
        The questions you answered live only on this device for now. Next we will add a home, a
        journey, and the rest of the ritual — without rushing.
      </AppText>
    </OnboardingScreenLayout>
  );
}
