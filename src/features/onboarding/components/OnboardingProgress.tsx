import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProgressBar } from '@/components/ui';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';
import { getCoreQuestionProgress } from '@/features/onboarding/utils/getCoreQuestionProgress';

const BAR_WIDTH = 160;

let lastCoreProgress = 0;

export function OnboardingProgress() {
  const { step, currentStepIndex } = useCurrentOnboardingStep();
  const progress = getCoreQuestionProgress(step?.id, currentStepIndex);
  const initialProgress = lastCoreProgress;

  useEffect(() => {
    lastCoreProgress = progress;
  }, [progress]);

  return (
    <View style={styles.root}>
      <View style={styles.bar}>
        <ProgressBar initialProgress={initialProgress} progress={progress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    maxWidth: '100%',
  },
});
