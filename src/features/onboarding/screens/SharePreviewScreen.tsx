import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { IllustrationPlaceholder } from '@/features/onboarding/components/IllustrationPlaceholder';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { SharePreviewStep } from '@/features/onboarding/types/onboarding';
import { shareReset } from '@/features/onboarding/utils/shareReset';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';

type SharePreviewScreenProps = {
  step: SharePreviewStep;
};

export function SharePreviewScreen({ step }: SharePreviewScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfileForAnswers(answers);

  return (
    <OnboardingScreenLayout
      tone="story"
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
    backgroundColor: colors.surface.choice,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  footer: {
    gap: spacing.xs,
  },
});
