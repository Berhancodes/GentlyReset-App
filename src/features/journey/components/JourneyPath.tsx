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
const NODE_CENTER_Y = 88;

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
            pointerEvents="none"
            style={[
              styles.line,
              {
                left: slotWidth / 2,
                width: lineWidth,
                top: NODE_CENTER_Y,
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
                  <View style={styles.currentArt} pointerEvents="none">
                    <View style={styles.sign}>
                      <JourneySign line={signLine} />
                    </View>
                    <View style={styles.mascot}>
                      <JourneyCurrentMascot pose={getJourneyPathMascotPose(day)} size="path" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.currentArt} />
                )}
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
  track: {
    minHeight: PATH_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  line: {
    position: 'absolute',
    height: LINE_THICKNESS,
    borderRadius: LINE_THICKNESS,
    backgroundColor: colors.border.default,
    overflow: 'hidden',
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
  currentArt: {
    minHeight: spacing.xxxl + spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: -spacing.sm,
  },
  sign: {
    marginRight: -spacing.xs,
    marginBottom: spacing.sm,
  },
  mascot: {
    marginLeft: -spacing.xs,
  },
});
