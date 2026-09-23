import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProgressBar } from '@/components/ui';
import { colors } from '@/design-system';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import { getCoreQuestionProgress } from '@/features/onboarding/utils/getCoreQuestionProgress';

const BAR_WIDTH = 136;
const QUESTION_BAR_THICKNESS = 6;

type OnboardingProgressProps = {
  fillColor?: string;
  stretch?: boolean;
  progressOverride?: number;
};

let lastCoreProgress = 0;

export function OnboardingProgress({
  fillColor,
  stretch = false,
  progressOverride,
}: OnboardingProgressProps) {
  const { step, currentStepIndex } = useCurrentOnboardingStep();
  const progress = progressOverride ?? getCoreQuestionProgress(step?.id, currentStepIndex);
  const initialProgress = lastCoreProgress;

  useEffect(() => {
    lastCoreProgress = progress;
  }, [progress]);

  return (
    <View style={[styles.root, stretch ? styles.stretch : null]}>
      <View style={[styles.bar, stretch ? styles.barStretch : null]}>
        <ProgressBar
          initialProgress={initialProgress}
          progress={progress}
          fillColor={fillColor ?? colors.progress.fillOnboarding}
          trackColor={colors.progress.trackOnboarding}
          thickness={stretch ? QUESTION_BAR_THICKNESS : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  stretch: {
    width: '100%',
    alignItems: 'stretch',
  },
  bar: {
    width: BAR_WIDTH,
    maxWidth: '100%',
  },
  barStretch: {
    width: '100%',
  },
});
