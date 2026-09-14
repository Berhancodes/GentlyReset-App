import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { formatMinutesLabel } from '@/features/reset/utils/getTaskForDay';
import type { TodayTask } from '@/features/reset/types';

type TodayResetCardProps = {
  task: TodayTask;
  started: boolean;
  completed: boolean;
  onStart: () => void;
  onComplete: () => void;
};

export function TodayResetCard({
  task,
  started,
  completed,
  onStart,
  onComplete,
}: TodayResetCardProps) {
  const reduceMotion = useReducedMotion();
  const entering = reduceMotion ? undefined : FadeIn.duration(280);

  return (
    <View
      style={styles.card}
      accessibilityLabel={
        completed
          ? `Today's reset complete. ${task.title}. Done for today.`
          : `Today's reset. ${task.title}. ${formatMinutesLabel(task.minutes)}.`
      }
    >
      <View style={styles.heading}>
        {completed ? (
          <Animated.View entering={entering} style={styles.doneLabel}>
            <View accessibilityElementsHidden importantForAccessibility="no" style={styles.check}>
              <AppText variant="caption" color="inverse" align="center">
                ✓
              </AppText>
            </View>
            <AppText variant="label" color="helper">
              {"today's reset"}
            </AppText>
          </Animated.View>
        ) : (
          <AppText variant="label" color="helper">
            {"today's reset"}
          </AppText>
        )}
      </View>

      <AppText variant="title">{task.title}</AppText>

      {completed ? (
        <AppText variant="body" color="secondary">
          done for today
        </AppText>
      ) : (
        <>
          <AppText variant="body" color="secondary">
            {task.description}
          </AppText>
          <AppText variant="caption" color="helper">
            {formatMinutesLabel(task.minutes)}
          </AppText>
          {started ? (
            <PrimaryButton
              label="mark as complete"
              accessibilityHint="Marks today's reset as done"
              haptic="success"
              onPress={onComplete}
            />
          ) : (
            <PrimaryButton
              label="start my reset"
              accessibilityHint="Begins today's reset"
              onPress={onStart}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  heading: {
    minHeight: spacing.md,
  },
  doneLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.action.primaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
