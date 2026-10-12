import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/design-system';
import { UNLOCK_STEP_IDS } from '@/features/onboarding/data/onboardingSteps';

const BAR_HEIGHT = 6;

type UnlockStepsBarProps = {
  stepId: (typeof UNLOCK_STEP_IDS)[number];
};

/** Three bars across the plan, the promise and the paywall; filled up to this screen. */
export function UnlockStepsBar({ stepId }: UnlockStepsBarProps) {
  const current = UNLOCK_STEP_IDS.indexOf(stepId);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current + 1} of ${UNLOCK_STEP_IDS.length}`}
      style={styles.bar}
    >
      {UNLOCK_STEP_IDS.map((id, index) => (
        <View key={id} style={[styles.segment, index <= current ? styles.segmentDone : null]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs - 2,
  },
  segment: {
    flex: 1,
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: colors.unlock.track,
  },
  segmentDone: {
    backgroundColor: colors.unlock.stepDone,
  },
});
