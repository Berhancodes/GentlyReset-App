import { StyleSheet, View } from 'react-native';

import { AppText, MascotIcon, PrimaryButton } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { formatMinutesLabel } from '@/features/reset/utils/getTaskForDay';

type TodayResetCardProps = {
  title: string;
  description: string;
  supportLine?: string;
  minutes: number;
  started: boolean;
  completed: boolean;
  completionMessage: string;
  onStart: () => void;
  onComplete: () => void;
};

export function TodayResetCard({
  title,
  description,
  supportLine,
  minutes,
  started,
  completed,
  completionMessage,
  onStart,
  onComplete,
}: TodayResetCardProps) {
  if (completed) {
    return (
      <View
        style={[styles.card, styles.cardComplete]}
        accessibilityLabel={`Today's reset done. ${title}. ${completionMessage}`}
      >
        <AppText variant="label" color="helper">
          {"today's reset"}
        </AppText>
        <View style={styles.completeRow} accessibilityElementsHidden importantForAccessibility="no">
          <View style={styles.completeBadge}>
            <AppText variant="caption" color="inverse" align="center">
              ✓
            </AppText>
          </View>
          <AppText variant="optionTitle">complete</AppText>
        </View>
        <AppText variant="optionTitle">{title}</AppText>
        <AppText variant="optionSubtitle" color="secondary">
          {completionMessage}
        </AppText>
      </View>
    );
  }

  return (
    <View
      style={styles.card}
      accessibilityLabel={`Today's reset. ${title}. ${formatMinutesLabel(minutes)}. ${description}${
        supportLine ? ` ${supportLine}` : ''
      }`}
    >
      <View style={styles.eyebrow}>
        <AppText variant="label" color="helper">
          {"today's reset"}
        </AppText>
        <View style={styles.duration}>
          <MascotIcon name="clock" size={14} />
          <AppText variant="label" color="helper">
            {formatMinutesLabel(minutes)}
          </AppText>
        </View>
      </View>

      <View style={styles.taskRow}>
        <View style={styles.taskIcon} accessibilityElementsHidden importantForAccessibility="no">
          <MascotIcon name="book" size={18} />
        </View>
        <View style={styles.copy}>
          <AppText variant="optionTitle">{title}</AppText>
          <AppText variant="optionSubtitle" color="secondary">
            {description}
          </AppText>
          {supportLine ? (
            <AppText variant="caption" color="helper">
              {supportLine}
            </AppText>
          ) : null}
        </View>
      </View>

      {started ? (
        <PrimaryButton
          label="check in for today"
          accessibilityHint="Marks today's reset as done"
          haptic="success"
          onPress={onComplete}
        />
      ) : (
        <PrimaryButton
          label="start my reset →"
          accessibilityHint="Begins today's reset"
          onPress={onStart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexShrink: 0,
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.soft,
  },
  cardComplete: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  taskIcon: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.surface.selected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  completeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  completeBadge: {
    width: spacing.md + spacing.xxs,
    height: spacing.md + spacing.xxs,
    borderRadius: radius.pill,
    backgroundColor: colors.action.primaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
