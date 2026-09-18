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

const CARD_PADDING = spacing.md + spacing.xxs;

export function TodayResetCard({
  task,
  started,
  completed,
  onStart,
  onComplete,
}: TodayResetCardProps) {
  const reduceMotion = useReducedMotion();
  const entering = reduceMotion ? undefined : FadeIn.duration(280);
  const filled = started || completed;

  return (
    <View
      style={[styles.card, filled ? styles.cardFilled : null]}
      accessibilityLabel={
        completed
          ? `Today's reset complete. ${task.title}. Done for today.`
          : `Today's reset. ${task.title}. ${formatMinutesLabel(task.minutes)}.`
      }
    >
      <View style={styles.eyebrow}>
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
        {completed ? null : (
          <AppText variant="label" color="helper">
            {formatMinutesLabel(task.minutes)}
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
          <AppText variant="body" color="secondary" numberOfLines={1}>
            {task.description}
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
    paddingHorizontal: CARD_PADDING,
    paddingVertical: CARD_PADDING,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardFilled: {
    backgroundColor: colors.surface.choiceSelected,
    borderColor: colors.accent.gold,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
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
