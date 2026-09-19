import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ResultDetailsStep } from '@/features/onboarding/types/onboarding';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';

type ResultDetailsScreenProps = {
  step: ResultDetailsStep;
};

export function ResultDetailsScreen({ step }: ResultDetailsScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfileForAnswers(answers);

  return (
    <OnboardingScreenLayout
      tone="story"
      title={step.title}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={<PrimaryButton label={step.ctaLabel} onPress={goToNext} />}
    >
      <View style={styles.sections}>
        <TraitGroup eyebrow="strengths" values={profile.strengths} tone="strength" />
        <TraitGroup eyebrow="challenges" values={profile.challenges} tone="challenge" />
      </View>
    </OnboardingScreenLayout>
  );
}

function TraitGroup({
  eyebrow,
  values,
  tone,
}: {
  eyebrow: string;
  values: readonly string[];
  tone: 'strength' | 'challenge';
}) {
  return (
    <View style={styles.group}>
      <AppText variant="label" color="muted">
        {eyebrow}
      </AppText>
      <View style={styles.chips}>
        {values.map((value) => (
          <View
            key={value}
            style={[styles.chip, tone === 'strength' ? styles.chipStrength : styles.chipChallenge]}
          >
            <AppText variant="body">{value}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: spacing.xl,
  },
  group: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    ...shadows.soft,
  },
  chipStrength: {
    backgroundColor: colors.surface.choiceSelected,
    borderColor: colors.accent.gold,
  },
  chipChallenge: {
    backgroundColor: colors.surface.choice,
    borderColor: colors.border.default,
  },
});
