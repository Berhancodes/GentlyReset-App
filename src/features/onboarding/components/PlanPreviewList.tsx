import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, motion, radius, shadows, spacing } from '@/design-system';
import type { PlanPreviewItem } from '@/features/onboarding/types/onboarding';

type PlanPreviewListProps = {
  items: readonly PlanPreviewItem[];
  animateIn?: boolean;
};

/**
 * Day-preview pills used on the companion teaser and the plan-ready screen.
 */
export function PlanPreviewList({ items, animateIn = false }: PlanPreviewListProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animateIn && !reduceMotion;

  return (
    <Animated.View
      accessibilityRole="summary"
      accessibilityLabel="First three days of your reset"
      entering={shouldAnimate ? FadeIn.duration(motion.duration.selection * 2) : undefined}
      style={styles.preview}
    >
      {items.map((item) => (
        <View key={item.dayLabel} style={styles.row}>
          <AppText variant="label" color="helper">
            {item.dayLabel}
          </AppText>
          <AppText variant="optionTitle">{item.title}</AppText>
        </View>
      ))}
    </Animated.View>
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
