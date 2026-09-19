import { StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { spacing } from '@/design-system';

type DayProgressHeaderProps = {
  currentDay: number;
  completedCount: number;
  showCount?: boolean;
  layout?: 'stacked' | 'inline';
};

export function DayProgressHeader({
  currentDay,
  completedCount,
  showCount = true,
  layout = 'stacked',
}: DayProgressHeaderProps) {
  const safeCompleted = Math.min(PLAN_DAY_COUNT, Math.max(0, completedCount));
  const progress = safeCompleted / PLAN_DAY_COUNT;
  const inline = layout === 'inline';

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
      <View style={inline ? styles.inlineTrack : undefined}>
        <ProgressBar
          progress={progress}
          accessibilityLabel="30-day reset progress"
          thickness={inline ? spacing.xxs : undefined}
        />
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
});
