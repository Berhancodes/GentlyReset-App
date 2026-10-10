import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/design-system';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { CORE_QUESTION_IDS } from '@/features/onboarding/data/onboardingSteps';

const DOT = 7;
/** Space above the dots, counting the status bar, as in the mockup. */
const TOP_ROOM = spacing.xxl;

type StageTopBarProps = {
  stepId: string;
  onBack?: () => void;
};

/**
 * Back button and a dot per core question. The current question's dot is gold;
 * screens between questions (stories, results) show no dots.
 */
export function StageTopBar({ stepId, onBack }: StageTopBarProps) {
  const current = CORE_QUESTION_IDS.findIndex((id) => id === stepId);
  // Keep the dots clear of the top edge where there's no status bar to do it (web, older phones).
  const topRoom = Math.max(0, TOP_ROOM - useSafeAreaInsets().top);

  return (
    <View style={[styles.bar, { marginTop: topRoom }]}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={spacing.sm}
          style={styles.back}
        >
          <BackChevron />
        </Pressable>
      ) : null}
      {current >= 0 ? (
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={`Question ${current + 1} of ${CORE_QUESTION_IDS.length}`}
          style={styles.dots}
        >
          {CORE_QUESTION_IDS.map((id, index) => (
            <View
              key={id}
              style={[
                styles.dot,
                index < current ? styles.dotDone : null,
                index === current ? styles.dotNow : null,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: 0,
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.dot,
  },
  dotDone: {
    backgroundColor: colors.text.primary,
  },
  dotNow: {
    backgroundColor: colors.accent.gold,
    transform: [{ scale: 1.5 }],
  },
});
