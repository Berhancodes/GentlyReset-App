import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { PLAN_WEEKS } from '@/features/reset/data/thirtyDayPlan';
import { formatMinutesLabel } from '@/features/reset/utils/getTaskForDay';
import type { TodayTask } from '@/features/reset/types';

type JourneyPathProps = {
  currentDay: number;
  completedDays: readonly number[];
  todayCompleted: boolean;
  tasksByDay: ReadonlyMap<number, TodayTask>;
  expandedDay: number | null;
  onPressDay: (day: number, kind: 'today' | 'completed' | 'future') => void;
};

function dayKind(
  day: number,
  currentDay: number,
  completedDays: readonly number[],
): 'today' | 'completed' | 'future' {
  if (day === currentDay) {
    return 'today';
  }
  if (completedDays.includes(day)) {
    return 'completed';
  }
  return 'future';
}

export function JourneyPath({
  currentDay,
  completedDays,
  todayCompleted,
  tasksByDay,
  expandedDay,
  onPressDay,
}: JourneyPathProps) {
  return (
    <View style={styles.root}>
      {PLAN_WEEKS.map((week) => {
        const days: number[] = [];
        for (let day = week.startDay; day <= week.endDay; day += 1) {
          days.push(day);
        }

        return (
          <View key={week.id} style={styles.week}>
            <AppText variant="label" color="helper">
              {`week ${week.id.slice(-1)} · ${week.label}`}
            </AppText>
            <View style={styles.days}>
              {days.map((day, index) => {
                const kind = dayKind(day, currentDay, completedDays);
                const task = tasksByDay.get(day);
                const isLast = index === days.length - 1;
                const expanded = expandedDay === day && kind === 'completed';
                const todayMark = kind === 'today' && todayCompleted ? 'completed' : kind;

                return (
                  <View key={day} style={styles.item}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{
                        disabled: kind === 'future',
                        selected: kind === 'today',
                      }}
                      accessibilityLabel={
                        kind === 'today'
                          ? `Day ${day}, ${task?.title ?? ''}. You are here.`
                          : kind === 'completed'
                            ? `Day ${day} completed. ${task?.title ?? ''}`
                            : `Day ${day} locked. ${task?.title ?? ''}`
                      }
                      accessibilityHint={
                        kind === 'today'
                          ? 'Opens Home to do today’s reset'
                          : kind === 'completed'
                            ? 'Shows this day’s details'
                            : undefined
                      }
                      disabled={kind === 'future'}
                      onPress={() => onPressDay(day, kind)}
                      style={({ pressed }) => [
                        styles.row,
                        todayMark === 'today' ? styles.rowToday : null,
                        kind === 'future' ? styles.rowFuture : null,
                        pressed && kind !== 'future' ? styles.rowPressed : null,
                      ]}
                    >
                      <View
                        style={[
                          styles.node,
                          kind === 'completed' || (kind === 'today' && todayCompleted)
                            ? styles.nodeDone
                            : null,
                          kind === 'today' && !todayCompleted ? styles.nodeToday : null,
                          kind === 'future' ? styles.nodeFuture : null,
                        ]}
                      >
                        {kind === 'completed' || (kind === 'today' && todayCompleted) ? (
                          <AppText variant="caption" color="inverse" align="center">
                            ✓
                          </AppText>
                        ) : kind === 'today' ? (
                          <View style={styles.nodeDot} />
                        ) : null}
                      </View>
                      <View style={styles.copy}>
                        <AppText
                          variant="optionTitle"
                          color={kind === 'future' ? 'helper' : 'primary'}
                        >
                          Day {day}
                          {kind === 'today' ? '  ·  you are here' : ''}
                        </AppText>
                        <AppText
                          variant="caption"
                          color={kind === 'future' ? 'helper' : 'secondary'}
                        >
                          {task?.title ?? ''}
                        </AppText>
                        {expanded && task ? (
                          <AppText variant="caption" color="helper">
                            {`${formatMinutesLabel(task.minutes)} · ${task.description}`}
                          </AppText>
                        ) : null}
                      </View>
                    </Pressable>
                    {isLast ? null : <View style={styles.connector} />}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.lg,
  },
  week: {
    gap: spacing.sm,
  },
  days: {
    gap: 0,
  },
  item: {
    paddingLeft: spacing.xxs,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
  },
  rowToday: {
    backgroundColor: colors.surface.choiceSelected,
  },
  rowFuture: {
    opacity: 0.72,
  },
  rowPressed: {
    opacity: 0.82,
  },
  node: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.raised,
  },
  nodeDone: {
    borderColor: colors.action.primaryBackground,
    backgroundColor: colors.action.primaryBackground,
  },
  nodeToday: {
    borderColor: colors.action.primaryBackground,
    backgroundColor: colors.surface.raised,
  },
  nodeFuture: {
    borderColor: colors.border.subtle,
  },
  nodeDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.action.primaryBackground,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  connector: {
    width: 2,
    height: spacing.md,
    marginLeft: 18,
    backgroundColor: colors.border.subtle,
  },
});
