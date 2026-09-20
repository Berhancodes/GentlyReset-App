import { useLayoutEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/design-system';
import {
  getJourneyPathMascotPose,
  JourneyCurrentMascot,
} from '@/features/journey/components/JourneyCurrentMascot';
import { JourneyDayNode } from '@/features/journey/components/JourneyDayNode';
import { JourneySign } from '@/features/journey/components/JourneySign';
import type { JourneyChapterId } from '@/features/journey/data/journeyChapters';
import { getJourneySignLine } from '@/features/journey/data/journeyCopy';
import {
  getJourneyPlanDays,
  getJourneyPathScrollIndex,
  getJourneySlotWidth,
  getJourneyVisibleCount,
} from '@/features/journey/layout/journeyPathLayout';
import { getJourneyDayState } from '@/features/journey/utils/getJourneyDayState';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';

const PATH_HEIGHT = 168;
const LINE_THICKNESS = 3;
const LINE_BOTTOM = spacing.xs + spacing.md + spacing.xxs + spacing.sm;
const MASCOT_BOTTOM = LINE_BOTTOM + spacing.sm;

type JourneyPathProps = {
  width: number;
  currentDay: number;
  completedDays: readonly number[];
  todayCompleted: boolean;
  chapterId: JourneyChapterId;
  onPressDay: (day: number) => void;
};

export function JourneyPath({
  width,
  currentDay,
  completedDays,
  todayCompleted,
  chapterId,
  onPressDay,
}: JourneyPathProps) {
  const scrollRef = useRef<ScrollView>(null);
  const visibleCount = getJourneyVisibleCount(width);
  const slotWidth = getJourneySlotWidth(width, visibleCount);
  const days = useMemo(() => getJourneyPlanDays(), []);
  const startIndex = getJourneyPathScrollIndex(currentDay, visibleCount);
  const signLine = getJourneySignLine(chapterId);

  useLayoutEffect(() => {
    if (width <= 0 || slotWidth <= 0) {
      return;
    }
    scrollRef.current?.scrollTo({
      x: startIndex * slotWidth,
      animated: false,
    });
  }, [slotWidth, startIndex, width]);

  if (width <= 0) {
    return null;
  }

  const contentWidth = PLAN_DAY_COUNT * slotWidth;
  const lineWidth = Math.max(0, (PLAN_DAY_COUNT - 1) * slotWidth);
  const goldRatio = PLAN_DAY_COUNT <= 1 ? 0 : (currentDay - 1) / (PLAN_DAY_COUNT - 1);

  return (
    <View style={[styles.root, { width }]}>
      <View style={styles.signDock}>
        <JourneySign line={signLine} />
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
      >
        <View style={[styles.track, { width: contentWidth }]}>
          <View
            style={[
              styles.line,
              {
                left: slotWidth / 2,
                width: lineWidth,
              },
            ]}
          >
            <View style={[styles.lineFill, { width: goldRatio * lineWidth }]} />
          </View>
          {days.map((day) => {
            const state = getJourneyDayState(day, currentDay, completedDays, todayCompleted);
            const isCurrent = state.kind === 'current';
            return (
              <View key={day} style={[styles.slot, { width: slotWidth }]}>
                {isCurrent ? (
                  <View style={styles.mascot}>
                    <JourneyCurrentMascot pose={getJourneyPathMascotPose(day)} size="path" />
                  </View>
                ) : null}
                <JourneyDayNode state={state} onPress={() => onPressDay(day)} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: PATH_HEIGHT,
  },
  signDock: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.xs,
    zIndex: 4,
    pointerEvents: 'none',
  },
  track: {
    minHeight: PATH_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  line: {
    position: 'absolute',
    bottom: LINE_BOTTOM,
    height: LINE_THICKNESS,
    borderRadius: LINE_THICKNESS,
    backgroundColor: colors.border.default,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  lineFill: {
    height: '100%',
    backgroundColor: colors.accent.gold,
  },
  slot: {
    height: PATH_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.xs,
  },
  mascot: {
    position: 'absolute',
    bottom: MASCOT_BOTTOM,
    alignItems: 'center',
    pointerEvents: 'none',
  },
});
