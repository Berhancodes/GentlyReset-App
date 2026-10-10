import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { getNoticedCopy } from '@/features/onboarding/data/noticedCopy';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStageScene } from '@/features/onboarding/stage/stageHooks';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { StageLayout } from '@/features/onboarding/stage/StageLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ResultDetailsStep } from '@/features/onboarding/types/onboarding';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';

type ResultDetailsScreenProps = {
  step: ResultDetailsStep;
};

/** What the mascot noticed: strengths, the pattern, and what helps. */
export function ResultDetailsScreen({ step }: ResultDetailsScreenProps) {
  const { goToNext } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfileForAnswers(answers);
  const copy = getNoticedCopy(profile.id);

  useStageScene(step.mascot?.pose ?? 'react-warm', step.mascot?.line);

  const facts = [
    { label: "what's already there", value: profile.strengths.join(', ') },
    { label: 'the pattern', value: copy.pattern[0] },
    { label: 'what usually helps', value: profile.whatUsuallyHelps },
  ];

  return (
    <StageLayout
      title={step.title}
      subtitle={copy.insight}
      footer={<StageButton label={step.ctaLabel} onPress={goToNext} />}
    >
      <View style={styles.facts}>
        {facts.map((fact) => (
          <View
            key={fact.label}
            style={styles.fact}
            accessible
            accessibilityLabel={`${fact.label}: ${fact.value}`}
          >
            <AppText variant="storyEyebrow" color="helper">
              {fact.label}
            </AppText>
            <AppText variant="optionTitle">{fact.value}</AppText>
          </View>
        ))}
      </View>
    </StageLayout>
  );
}

const styles = StyleSheet.create({
  facts: {
    gap: spacing.xs,
  },
  fact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    backgroundColor: colors.stage.chip,
    gap: spacing.xxs,
    ...shadows.soft,
  },
});
