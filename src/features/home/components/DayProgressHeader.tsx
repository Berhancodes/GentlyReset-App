import { StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { spacing } from '@/design-system';

type DayProgressHeaderProps = {
  currentDay: number;
  completedCount: number;
  showCount?: boolean;
};

export function DayProgressHeader({
  currentDay,
  completedCount,
  showCount = true,
}: DayProgressHeaderProps) {
  const safeCompleted = Math.min(PLAN_DAY_COUNT, Math.max(0, completedCount));
  const progress = safeCompleted / PLAN_DAY_COUNT;

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <AppText variant="caption" color="secondary">
          day {currentDay} of {PLAN_DAY_COUNT}
        </AppText>
        {showCount ? (
          <AppText variant="caption" color="helper">
            {safeCompleted}/{PLAN_DAY_COUNT}
          </AppText>
        ) : null}
      </View>
      <ProgressBar progress={progress} accessibilityLabel="30-day reset progress" />
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
});
