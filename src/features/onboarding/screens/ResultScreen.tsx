import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { getResetProfile } from '@/features/onboarding/data/mockResetProfile';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { ResultStep } from '@/features/onboarding/types/onboarding';

type ResultScreenProps = {
  step: ResultStep;
};

export function ResultScreen({ step }: ResultScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const profile = getResetProfile(step.profileId);

  return (
    <OnboardingScreenLayout
      title={profile.name}
      illustrationKey={profile.illustrationKey}
      illustrationSize={step.illustrationSize ?? 'large'}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={
        <View style={styles.footer}>
          <PrimaryButton label={step.ctaLabel} haptic="success" onPress={goToNext} />
          {step.secondaryCtaLabel ? (
            <OnboardingTextButton label={step.secondaryCtaLabel} onPress={goToNext} />
          ) : null}
        </View>
      }
    >
      <View style={styles.copy}>
        <AppText variant="title">{profile.summary}</AppText>
        <AppText variant="body" color="secondary">
          {profile.description}
        </AppText>
        <AppText variant="body" color="secondary">
          {profile.advice}
        </AppText>
        <AppText variant="title">{profile.emphasized}</AppText>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  copy: {
    gap: spacing.md,
  },
  footer: {
    gap: spacing.xs,
  },
});
