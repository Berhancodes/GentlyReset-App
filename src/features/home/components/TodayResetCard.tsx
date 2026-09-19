import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { HOME_TASK_DESCRIPTION, getHomeTaskTitle } from '@/features/home/utils/homeCopy';
import { hapticSuccess } from '@/utils/haptics';

type TodayResetCardProps = {
  minutes: number;
  completed: boolean;
  onComplete: () => void;
};

export function TodayResetCard({ minutes, completed, onComplete }: TodayResetCardProps) {
  const title = getHomeTaskTitle(minutes);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed, disabled: completed }}
      accessibilityLabel={`Today's reset. ${title}. ${
        completed ? 'Done for today.' : HOME_TASK_DESCRIPTION
      }`}
      accessibilityHint={completed ? undefined : "Marks today's reset as done"}
      disabled={completed}
      onPress={() => {
        void hapticSuccess();
        onComplete();
      }}
      style={({ pressed }) => [styles.card, pressed && !completed ? styles.pressed : null]}
    >
      <AppText variant="label" color="helper">
        {"today's reset"}
      </AppText>

      <View style={styles.taskRow}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.checkbox, completed ? styles.checkboxComplete : null]}
        >
          {completed ? (
            <AppText variant="caption" color="inverse" align="center">
              ✓
            </AppText>
          ) : null}
        </View>

        <View style={styles.copy}>
          <AppText variant="optionTitle">{title}</AppText>
          <AppText variant="optionSubtitle" color="secondary">
            {completed ? 'done for today' : HOME_TASK_DESCRIPTION}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const CHECKBOX_SIZE = spacing.lg;

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.88,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkbox: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    marginTop: 2,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.accent.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxComplete: {
    backgroundColor: colors.action.primaryBackground,
    borderColor: colors.action.primaryBackground,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
    minHeight: 44,
    justifyContent: 'center',
  },
});
