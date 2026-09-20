import { useState } from 'react';
import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { JourneyDayNode } from '@/features/journey/components/JourneyDayNode';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import { getJourneyChapterForDay } from '@/features/journey/data/journeyChapters';
import { getJourneySignLine } from '@/features/journey/data/journeyCopy';
import {
  getJourneyStageLayout,
  getJourneyVisibleDays,
  splitJourneyTaskTitle,
  type JourneyRect,
  type JourneyStageLayout,
} from '@/features/journey/layout/journeyStageLayout';
import { getJourneyDayState } from '@/features/journey/utils/getJourneyDayState';

const NODE_SLOT_WIDTH = spacing.xxl + spacing.md;

type JourneyLinearStageProps = {
  currentDay: number;
  completedDays: readonly number[];
  todayCompleted: boolean;
  taskTitle: string;
  onPressDay: (day: number) => void;
};

function rectStyle(rect: JourneyRect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function DecorativeImage({ source, rect }: { source: ImageSourcePropType; rect: JourneyRect }) {
  return (
    <Image
      source={source}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.decorImage, rectStyle(rect)]}
    />
  );
}

export function JourneyLinearStage({
  currentDay,
  completedDays,
  todayCompleted,
  taskTitle,
  onPressDay,
}: JourneyLinearStageProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const layout =
    stageSize.width > 0 && stageSize.height > 0
      ? getJourneyStageLayout(stageSize.width, stageSize.height)
      : null;
  const titleLines = splitJourneyTaskTitle(taskTitle);
  const visibleDays = getJourneyVisibleDays(currentDay);
  const chapter = getJourneyChapterForDay(currentDay);
  const signLabel = chapter ? getJourneySignLine(chapter.id) : 'you can do this';

  return (
    <View
      style={styles.stage}
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width;
        const nextHeight = event.nativeEvent.layout.height;
        if (nextWidth !== stageSize.width || nextHeight !== stageSize.height) {
          setStageSize({ width: nextWidth, height: nextHeight });
        }
      }}
    >
      {layout ? <JourneySkyDecor layout={layout} /> : null}

      <View style={styles.titleBlock}>
        <AppText variant="journeyDay" color="primary" align="center">
          {`day ${currentDay}`}
        </AppText>
        <View style={styles.titleLines}>
          {titleLines.map((line) => (
            <AppText key={line} variant="journeyTask" color="primary" align="center">
              {line}
            </AppText>
          ))}
        </View>
      </View>

      <View style={styles.midStage}>
        {layout ? (
          <JourneyPathBand
            layout={layout}
            currentDay={currentDay}
            completedDays={completedDays}
            todayCompleted={todayCompleted}
            visibleDays={visibleDays}
            signLabel={signLabel}
            onPressDay={onPressDay}
          />
        ) : null}
      </View>
    </View>
  );
}

function JourneySkyDecor({ layout }: { layout: JourneyStageLayout }) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      {layout.clouds.map((cloud, index) => (
        <DecorativeImage key={`cloud-${index}`} source={JOURNEY_SPRITES.cloud} rect={cloud} />
      ))}
      <DecorativeImage source={JOURNEY_SPRITES.sun} rect={layout.sun} />
    </View>
  );
}

type JourneyPathBandProps = {
  layout: JourneyStageLayout;
  currentDay: number;
  completedDays: readonly number[];
  todayCompleted: boolean;
  visibleDays: readonly number[];
  signLabel: string;
  onPressDay: (day: number) => void;
};

function JourneyPathBand({
  layout,
  currentDay,
  completedDays,
  todayCompleted,
  visibleDays,
  signLabel,
  onPressDay,
}: JourneyPathBandProps) {
  const currentDayValue = visibleDays[0] ?? currentDay;
  const futureDay = visibleDays[1];

  return (
    <View style={[styles.pathBand, { height: layout.pathHeight }]}>
      <Image
        source={JOURNEY_SPRITES.bush}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.vegetationLayer, rectStyle(layout.bushLeft)]}
      />
      <Image
        source={JOURNEY_SPRITES.bush}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.vegetationLayer, rectStyle(layout.bush)]}
      />

      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={signLabel}
        pointerEvents="none"
        style={[styles.signLayer, rectStyle(layout.sign)]}
      >
        <Image
          source={JOURNEY_SPRITES.signEncouragement}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.fillImage, { width: layout.sign.width, height: layout.sign.height }]}
        />
      </View>

      <Pressable
        accessible={false}
        onPress={() => onPressDay(currentDayValue)}
        style={[styles.mascotLayer, rectStyle(layout.mascot)]}
      >
        <Image
          source={JOURNEY_SPRITES.mascotStand}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.fillImage, { width: layout.mascot.width, height: layout.mascot.height }]}
        />
      </Pressable>

      <View
        pointerEvents="none"
        style={[
          styles.line,
          {
            left: layout.lineLeft,
            top: layout.lineY - layout.lineThickness / 2,
            width: layout.lineWidth,
            height: layout.lineThickness,
          },
        ]}
      />

      <View
        style={[
          styles.nodeSlot,
          {
            left: layout.day1X - NODE_SLOT_WIDTH / 2,
            top: layout.lineY - spacing.hitTarget / 2,
            width: NODE_SLOT_WIDTH,
          },
        ]}
      >
        <JourneyDayNode
          size={layout.nodeSize}
          state={getJourneyDayState(currentDayValue, currentDay, completedDays, todayCompleted)}
          onPress={() => onPressDay(currentDayValue)}
        />
      </View>

      {futureDay !== undefined ? (
        <View
          style={[
            styles.nodeSlot,
            {
              left: layout.day2X - NODE_SLOT_WIDTH / 2,
              top: layout.lineY - spacing.hitTarget / 2,
              width: NODE_SLOT_WIDTH,
            },
          ]}
        >
          <JourneyDayNode
            size={layout.nodeSize}
            state={getJourneyDayState(futureDay, currentDay, completedDays, todayCompleted)}
            onPress={() => onPressDay(futureDay)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
  },
  titleBlock: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    zIndex: 2,
  },
  titleLines: {
    alignItems: 'center',
  },
  midStage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pathBand: {
    position: 'relative',
  },
  decorImage: {
    position: 'absolute',
  },
  fillImage: {
    width: '100%',
    height: '100%',
  },
  vegetationLayer: {
    position: 'absolute',
    zIndex: 1,
  },
  signLayer: {
    position: 'absolute',
    zIndex: 2,
  },
  line: {
    position: 'absolute',
    backgroundColor: colors.text.primary,
    borderRadius: 1,
    zIndex: 4,
  },
  mascotLayer: {
    position: 'absolute',
    zIndex: 3,
    overflow: 'visible',
  },
  nodeSlot: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
});
