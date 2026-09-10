import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { getResetProfile } from '@/features/onboarding/data/mockResetProfile';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ResultStep } from '@/features/onboarding/types/onboarding';
import { deriveResetApproach } from '@/features/onboarding/utils/deriveResetApproach';

type ResultScreenProps = {
  step: ResultStep;
};

export function ResultScreen({ step }: ResultScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfile(step.profileId);
  const approach = deriveResetApproach(answers);
  const approachLines = [approach.time, approach.support, approach.length].filter(
    (value): value is string => Boolean(value),
  );

  return (
    <OnboardingScreenLayout
      tone="story"
      eyebrow="your reset type is..."
      title={profile.name}
      illustrationKey={profile.illustrationKey}
      illustrationSize="large"
      illustrationAfterCopy
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
        <ProfileSection label="your biggest pattern" value={profile.biggestPattern} />
        <ProfileSection label="what usually helps" value={profile.whatUsuallyHelps} />
        {approachLines.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="label" color="helper">
              your Gently Reset approach
            </AppText>
            {approachLines.map((line) => (
              <AppText key={line} variant="body">
                {line}
              </AppText>
            ))}
          </View>
        ) : null}
        <AppText variant="body" color="secondary">
          {profile.advice}
        </AppText>
        <AppText variant="title">{profile.emphasized}</AppText>
      </View>
    </OnboardingScreenLayout>
  );
}

function ProfileSection({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.section}>
      <AppText variant="label" color="helper">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.xxs,
    paddingTop: spacing.xs,
  },
  footer: {
    gap: spacing.xs,
  },
});
