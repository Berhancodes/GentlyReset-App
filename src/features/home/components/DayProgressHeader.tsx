import { StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { spacing } from '@/design-system';

type DayProgressHeaderProps = {
  currentDay: number;
  completedCount: number;
};

export function DayProgressHeader({ currentDay, completedCount }: DayProgressHeaderProps) {
  const safeCompleted = Math.min(PLAN_DAY_COUNT, Math.max(0, completedCount));
  const progress = safeCompleted / PLAN_DAY_COUNT;

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <AppText variant="optionTitle">
          Day {currentDay} of {PLAN_DAY_COUNT}
        </AppText>
        <AppText variant="caption" color="helper">
          {safeCompleted}/{PLAN_DAY_COUNT}
        </AppText>
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
