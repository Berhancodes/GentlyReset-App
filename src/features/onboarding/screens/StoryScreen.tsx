import { StyleSheet, Text } from 'react-native';

import { colors, spacing, textVariants } from '@/design-system';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStageScene } from '@/features/onboarding/stage/stageHooks';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { StageLayout } from '@/features/onboarding/stage/StageLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { StoryStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import {
  deriveCarryingSubtitle,
  deriveConsistencyInsight,
} from '@/features/onboarding/utils/deriveIntermissionInsight';

type StoryScreenProps = {
  step: StoryStep;
};

/** A pause between chapters: the mascot says something, then the person continues. */
export function StoryScreen({ step }: StoryScreenProps) {
  const { goToNext } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);

  useStageScene(step.mascot?.pose ?? 'react-warm', step.mascot?.line);

  const subtitle =
    step.dynamicCopy === 'outOfBalance'
      ? deriveCarryingSubtitle(answers)
      : step.dynamicCopy === 'consistencyStage'
        ? deriveConsistencyInsight(answers)
        : step.subtitle;

  return (
    <StageLayout
      title={step.title}
      eyebrow={step.eyebrow}
      chapter={step.chapter}
      subtitle={subtitle}
      footer={step.ctaLabel ? <StageButton label={step.ctaLabel} onPress={goToNext} /> : null}
    >
      {step.body ? (
        <Text style={styles.body} maxFontSizeMultiplier={1.3}>
          {capitalizeHeading(step.body)}
        </Text>
      ) : null}
    </StageLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
