import { StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { colors, spacing } from '@/design-system';

type DayProgressHeaderProps = {
  currentDay: number;
  completedCount: number;
  showCount?: boolean;
  layout?: 'stacked' | 'inline';
  thickness?: number;
  fillColor?: string;
  trackColor?: string;
  startMarker?: boolean;
};

export function DayProgressHeader({
  currentDay,
  completedCount,
  showCount = true,
  layout = 'stacked',
  thickness,
  fillColor,
  trackColor,
  startMarker = false,
}: DayProgressHeaderProps) {
  const safeCompleted = Math.min(PLAN_DAY_COUNT, Math.max(0, completedCount));
  const progress = safeCompleted / PLAN_DAY_COUNT;
  const inline = layout === 'inline';
  const trackThickness = thickness ?? (inline ? spacing.xxs : undefined);
  const markerSize = (trackThickness ?? 7) + spacing.xxs;
  const resolvedTrack = trackColor ?? (inline ? colors.progress.trackStrong : undefined);

  return (
    <View style={inline ? styles.inlineRoot : styles.root}>
      <View style={inline ? styles.inlineLabel : styles.row}>
        <AppText variant="caption" color={inline ? 'primary' : 'secondary'}>
          day {currentDay} of {PLAN_DAY_COUNT}
        </AppText>
        {showCount && !inline ? (
          <AppText variant="caption" color="helper">
            {safeCompleted}/{PLAN_DAY_COUNT}
          </AppText>
        ) : null}
      </View>
      <View style={inline ? styles.inlineTrack : styles.trackWrap}>
        <ProgressBar
          progress={progress}
          accessibilityLabel="30-day reset progress"
          thickness={trackThickness}
          fillColor={fillColor}
          trackColor={resolvedTrack}
        />
        {startMarker ? (
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            style={[
              styles.startMarker,
              {
                width: markerSize,
                height: markerSize,
                borderRadius: markerSize / 2,
                backgroundColor: fillColor ?? colors.accent.gold,
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  inlineRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inlineLabel: {
    flexShrink: 0,
  },
  inlineTrack: {
    flex: 1,
  },
  trackWrap: {
    justifyContent: 'center',
  },
  startMarker: {
    position: 'absolute',
    left: 0,
  },
});
