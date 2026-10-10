import { StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { colors, spacing } from '@/design-system';

const HERO_TRACK_WIDTH = 118;
/** Home hero bar thickness. */
const HERO_TRACK_THICKNESS = 6;

type DayProgressHeaderProps = {
  currentDay: number;
  completedCount: number;
  progress: number;
  showCount?: boolean;
  layout?: 'stacked' | 'inline' | 'hero';
  thickness?: number;
  fillColor?: string;
  trackColor?: string;
  startMarker?: boolean;
};

export function DayProgressHeader({
  currentDay,
  completedCount,
  progress,
  showCount = true,
  layout = 'stacked',
  thickness,
  fillColor,
  trackColor,
  startMarker = false,
}: DayProgressHeaderProps) {
  const safeCompleted = Math.min(PLAN_DAY_COUNT, Math.max(0, completedCount));
  const inline = layout === 'inline';
  const hero = layout === 'hero';
  const trackThickness =
    thickness ?? (hero ? HERO_TRACK_THICKNESS : inline ? spacing.xxs : undefined);
  const markerSize = (trackThickness ?? 7) + spacing.xxs;
  const resolvedTrack =
    trackColor ??
    (hero ? colors.progress.trackOnboarding : inline ? colors.progress.trackStrong : undefined);
  const resolvedFill = fillColor ?? (hero ? colors.progress.fillGold : undefined);

  if (hero) {
    return (
      <View style={styles.heroRoot}>
        <AppText variant="homeDay" color="home">
          {`☀️ Day ${currentDay}`}
        </AppText>
        <View style={styles.heroTrack}>
          <ProgressBar
            progress={progress}
            accessibilityLabel={`Day ${currentDay}`}
            thickness={trackThickness}
            fillColor={resolvedFill}
            trackColor={resolvedTrack}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={inline ? styles.inlineRoot : styles.root}>
      <View style={inline ? styles.inlineLabel : styles.row}>
        <AppText variant="caption" color={inline ? 'primary' : 'secondary'}>
          day {currentDay} · first season
        </AppText>
        {showCount && !inline ? (
          <AppText variant="caption" color="helper">
            {safeCompleted} checked in
          </AppText>
        ) : null}
      </View>
      <View style={inline ? styles.inlineTrack : styles.trackWrap}>
        <ProgressBar
          progress={progress}
          accessibilityLabel="First season progress"
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
                marginTop: -markerSize / 2,
                backgroundColor: resolvedFill ?? colors.accent.gold,
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
    gap: spacing.xxs,
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
    top: '50%',
  },
  heroRoot: {
    alignItems: 'flex-start',
    gap: spacing.xxs,
  },
  heroTrack: {
    width: HERO_TRACK_WIDTH,
  },
});
