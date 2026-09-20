import { Image, StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';

const YOU_MASCOT = require('../../../../assets/images/app/you-mascot.png');
const MASCOT_ASPECT_RATIO = 1536 / 1024;

type ProfileHeroProps = {
  name: string;
  shortSummary: string;
  resetApproach: string;
  currentDay: number;
  completedCount: number;
};

export function ProfileHero({
  name,
  shortSummary,
  resetApproach,
  currentDay,
  completedCount,
}: ProfileHeroProps) {
  const safeCompleted = Math.min(PLAN_DAY_COUNT, Math.max(0, completedCount));
  const progress = safeCompleted / PLAN_DAY_COUNT;
  const approach = resetApproach.trim().length > 0 ? resetApproach : 'one thing at a time';

  return (
    <View style={styles.root}>
      <Image
        source={YOU_MASCOT}
        accessibilityLabel={`${name} artwork`}
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        style={styles.mascot}
      />
      <AppText variant="title" align="center">
        {name}
      </AppText>
      <View style={styles.progressBlock}>
        <AppText variant="label" color="helper" align="center">
          {`DAY ${currentDay} OF ${PLAN_DAY_COUNT}`}
        </AppText>
        <ProgressBar
          progress={progress}
          accessibilityLabel="30-day reset progress"
          fillColor={colors.progress.fillGold}
          trackColor={colors.progress.trackStrong}
          thickness={spacing.xxs}
        />
      </View>
      <AppText variant="body" color="secondary" align="center">
        {shortSummary}
      </AppText>
      <View
        style={styles.pill}
        accessibilityRole="text"
        accessibilityLabel={`your reset. ${approach}`}
      >
        <AppText variant="label" color="gold" align="center">
          YOUR RESET
        </AppText>
        <AppText variant="caption" color="primary" align="center">
          {approach}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  mascot: {
    width: '92%',
    aspectRatio: MASCOT_ASPECT_RATIO,
    maxHeight: spacing.xxxl * 4,
  },
  progressBlock: {
    width: '46%',
    minWidth: spacing.xxxl + spacing.xxl,
    gap: spacing.xs,
    alignItems: 'stretch',
  },
  pill: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.tint.gold,
    maxWidth: '92%',
  },
});
