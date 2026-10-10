import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStageScene } from '@/features/onboarding/stage/stageHooks';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { StageLayout } from '@/features/onboarding/stage/StageLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { SharePreviewStep } from '@/features/onboarding/types/onboarding';
import { shareReset } from '@/features/onboarding/utils/shareReset';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';

type SharePreviewScreenProps = {
  step: SharePreviewStep;
};

/** The reset card people can share, with the mascot cheering behind it. */
export function SharePreviewScreen({ step }: SharePreviewScreenProps) {
  const { goToNext } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfileForAnswers(answers);

  useStageScene(step.mascot?.pose ?? 'cheer', step.mascot?.line);

  return (
    <StageLayout
      title={step.title}
      footer={
        <>
          <StageButton
            label={step.shareCtaLabel}
            onPress={() => {
              void shareReset(profile);
            }}
          />
          <OnboardingTextButton label={step.continueCtaLabel} onPress={goToNext} />
        </>
      }
    >
      <View
        style={styles.card}
        accessible
        accessibilityLabel={`${profile.name}. ${profile.shareQuote}`}
      >
        <AppText variant="storyEyebrow" color="helper" align="center">
          {profile.name}
        </AppText>
        <AppText variant="optionTitle" align="center">
          {profile.shareQuote}
        </AppText>
        <AppText variant="label" color="helper" align="center">
          Gently Reset
        </AppText>
      </View>
    </StageLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface.selected,
    gap: spacing.xs,
    ...shadows.soft,
  },
});
