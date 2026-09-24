import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, motion, radius, shadows, spacing } from '@/design-system';
import type { PlanPreviewItem } from '@/features/onboarding/types/onboarding';

type PlanPreviewListProps = {
  items: readonly PlanPreviewItem[];
  revealed?: boolean;
};

type PlanPreviewRowProps = {
  item: PlanPreviewItem;
  index: number;
  revealed: boolean;
};

function PlanPreviewRow({ item, index, revealed }: PlanPreviewRowProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(revealed || reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = revealed ? 1 : 0;
      return;
    }

    progress.value = withDelay(
      revealed ? index * motion.typewriter.pillStaggerMs : 0,
      withTiming(revealed ? 1 : 0, {
        duration: motion.duration.pillReveal,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      }),
    );
  }, [index, progress, reduceMotion, revealed]);

  const revealStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * spacing.sm }],
  }));

  return (
    <Animated.View
      accessibilityElementsHidden={!revealed}
      importantForAccessibility={revealed ? 'yes' : 'no-hide-descendants'}
      style={[styles.row, revealStyle]}
    >
      <AppText variant="label" color="helper">
        {item.dayLabel}
      </AppText>
      <AppText variant="optionTitle">{item.title}</AppText>
    </Animated.View>
  );
}

/**
 * Day-preview pills used on the companion teaser and the plan-ready screen.
 */
export function PlanPreviewList({ items, revealed = true }: PlanPreviewListProps) {
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel="First three days of your reset"
      style={styles.preview}
    >
      {items.map((item, index) => (
        <PlanPreviewRow key={item.dayLabel} item={item} index={index} revealed={revealed} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    gap: spacing.md,
    width: '100%',
  },
  row: {
    minHeight: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    gap: spacing.xxs,
    ...shadows.whisper,
  },
});
