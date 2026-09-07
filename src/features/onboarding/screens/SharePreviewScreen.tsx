import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { IllustrationPlaceholder } from '@/features/onboarding/components/IllustrationPlaceholder';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { getResetProfile } from '@/features/onboarding/data/mockResetProfile';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { SharePreviewStep } from '@/features/onboarding/types/onboarding';
import { shareReset } from '@/features/onboarding/utils/shareReset';

type SharePreviewScreenProps = {
  step: SharePreviewStep;
};

export function SharePreviewScreen({ step }: SharePreviewScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const profile = getResetProfile(step.profileId);

  return (
    <OnboardingScreenLayout
      title={step.title}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label={step.shareCtaLabel}
            haptic="none"
            onPress={() => {
              shareReset(profile);
            }}
          />
          <OnboardingTextButton label={step.continueCtaLabel} onPress={goToNext} />
        </View>
      }
    >
      <View style={styles.card}>
        <IllustrationPlaceholder illustrationKey={profile.illustrationKey} size="default" />
        <AppText variant="label" color="muted" align="center">
          THE {profile.name.replace(/^The /u, '').toUpperCase()}
        </AppText>
        <AppText variant="title" align="center">
          {profile.shareQuote}
        </AppText>
        <AppText variant="label" color="muted" align="center">
          Gently Reset
        </AppText>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.raised,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  footer: {
    gap: spacing.xs,
  },
});
