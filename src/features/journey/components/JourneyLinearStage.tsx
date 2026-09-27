import { useLayoutEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, MOTION_EASING_JOURNEY_WALK, motion, spacing } from '@/design-system';
import { JourneyDayNode } from '@/features/journey/components/JourneyDayNode';
import { JourneyHeroCopy } from '@/features/journey/components/JourneyHeroCopy';
import { JourneyProgressMascot } from '@/features/journey/components/JourneyProgressMascot';
import { JourneySkyDecor } from '@/features/journey/components/JourneySkyDecor';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import { getJourneyChapterForDay } from '@/features/journey/data/journeyChapters';
import { getJourneySignLine } from '@/features/journey/data/journeyCopy';
import {
  getJourneyStageLayout,
  type JourneyRect,
  type JourneyStageLayout,
} from '@/features/journey/layout/journeyStageLayout';
import type { JourneyProgressionPresentation } from '@/features/journey/hooks/useJourneyProgression';
import { JOURNEY_WALK_LAYERS } from '@/features/journey/utils/getJourneyWalkMotion';

const NODE_SLOT_WIDTH = spacing.xxl + spacing.md;

const WALK_EASING = Easing.bezier(
  MOTION_EASING_JOURNEY_WALK[0],
  MOTION_EASING_JOURNEY_WALK[1],
  MOTION_EASING_JOURNEY_WALK[2],
  MOTION_EASING_JOURNEY_WALK[3],
);
const ARRIVAL_RING_FROM = motion.scale.journeyArrivalRingFrom;
const ARRIVAL_RING_TO = motion.scale.journeyArrivalRingTo;

type JourneyLinearStageProps = {
  presentation: JourneyProgressionPresentation;
  onPressDay: (day: number) => void;
  focused: boolean;
};

function rectStyle(rect: JourneyRect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export function JourneyLinearStage({ presentation, onPressDay, focused }: JourneyLinearStageProps) {
  const reduceMotion = useReducedMotion() === true;
  const walkProgress = useSharedValue(0);
  const walkDirection = useSharedValue(1);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const layout =
    stageSize.width > 0 && stageSize.height > 0
      ? getJourneyStageLayout(stageSize.width, stageSize.height)
      : null;
  const chapter = getJourneyChapterForDay(presentation.headingDay);
  const signLabel = chapter ? getJourneySignLine(chapter.id) : 'you can do this';

  useLayoutEffect(() => {
    walkDirection.value = presentation.walkDirection;

    if (reduceMotion || presentation.phase === 'idle' || presentation.phase === 'holding') {
      cancelAnimation(walkProgress);
      walkProgress.value = 0;
      return;
    }

    if (presentation.phase === 'walking') {
      cancelAnimation(walkProgress);
      walkProgress.value = 0;
      walkProgress.value = withTiming(1, {
        duration: motion.duration.journeyProgressWalk,
        easing: WALK_EASING,
      });
      return;
    }

    cancelAnimation(walkProgress);
    walkProgress.value = 1;
  }, [presentation.phase, presentation.walkDirection, reduceMotion, walkDirection, walkProgress]);

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
      <Image
        source={JOURNEY_SPRITES.mascotProgress}
        resizeMode="contain"
        fadeDuration={0}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.preload}
      />
      {layout ? (
        <JourneySkyDecor
          layout={layout}
          focused={focused}
          walkProgress={walkProgress}
          walkDirection={walkDirection}
        />
      ) : null}

      <JourneyHeroCopy day={presentation.headingDay} title={presentation.headingTitle} />

      <View style={styles.midStage}>
        {layout ? (
          <JourneyPathBand
            layout={layout}
            presentation={presentation}
            signLabel={signLabel}
            onPressDay={onPressDay}
            walkProgress={walkProgress}
            walkDirection={walkDirection}
          />
        ) : null}
      </View>
    </View>
  );
}

type JourneyPathBandProps = {
  layout: JourneyStageLayout;
  presentation: JourneyProgressionPresentation;
  signLabel: string;
  onPressDay: (day: number) => void;
  walkProgress: SharedValue<number>;
  walkDirection: SharedValue<number>;
};

function JourneyPathBand({
  layout,
  presentation,
  signLabel,
  onPressDay,
  walkProgress,
  walkDirection,
}: JourneyPathBandProps) {
  const reduceMotion = useReducedMotion() === true;
  const nodePop = useSharedValue(1);
  const arrivalRing = useSharedValue(0);
  const plantTilt = useSharedValue(0);
  const leftDay = presentation.visibleDays[0] ?? presentation.toDay;
  const rightDay = presentation.visibleDays[1];
  const ringSize = layout.nodeSize * 1.7;

  useLayoutEffect(() => {
    if (presentation.phase !== 'celebrating' || reduceMotion) {
      nodePop.value = 1;
      arrivalRing.value = 0;
      plantTilt.value = 0;
      return;
    }

    nodePop.value = motion.scale.journeyArrivalFrom;
    nodePop.value = withSequence(
      withTiming(motion.scale.journeyArrivalPeak, {
        duration: 150,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1, {
        duration: 180,
        easing: Easing.inOut(Easing.cubic),
      }),
    );

    arrivalRing.value = 0;
    arrivalRing.value = withTiming(1, {
      duration: motion.duration.journeyArrivalRing,
      easing: Easing.out(Easing.cubic),
    });

    plantTilt.value = 0;
    plantTilt.value = withSequence(
      withTiming(motion.offset.journeyArrivalTilt, {
        duration: 120,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(0, {
        duration: motion.duration.journeyArrivalTilt,
        easing: Easing.inOut(Easing.cubic),
      }),
    );
  }, [arrivalRing, nodePop, plantTilt, presentation.phase, reduceMotion]);

  const mascotMotionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: walkProgress.value * layout.travelDistance }],
  }));
  const leftBushStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -walkProgress.value * JOURNEY_WALK_LAYERS.foreground * walkDirection.value },
    ],
  }));
  const rightBushStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -walkProgress.value * JOURNEY_WALK_LAYERS.bush * walkDirection.value },
      { rotate: `${plantTilt.value}deg` },
    ],
  }));
  const signStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -walkProgress.value * JOURNEY_WALK_LAYERS.sign * walkDirection.value },
    ],
  }));
  const rightNodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nodePop.value }],
  }));
  const arrivalRingStyle = useAnimatedStyle(() => ({
    opacity: arrivalRing.value <= 0 ? 0 : (1 - arrivalRing.value) * 0.38,
    transform: [
      {
        scale: ARRIVAL_RING_FROM + arrivalRing.value * (ARRIVAL_RING_TO - ARRIVAL_RING_FROM),
      },
    ],
  }));

  return (
    <View style={[styles.pathBand, { height: layout.pathHeight }]}>
      <Animated.Image
        source={JOURNEY_SPRITES.bush}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.vegetationLayer, rectStyle(layout.bushLeft), leftBushStyle]}
      />
      <Animated.Image
        source={JOURNEY_SPRITES.bush}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.vegetationLayer, rectStyle(layout.bush), rightBushStyle]}
      />

      <Animated.View
        accessible
        accessibilityRole="text"
        accessibilityLabel={signLabel}
        pointerEvents="none"
        style={[styles.signLayer, rectStyle(layout.sign), signStyle]}
      >
        <Image
          source={JOURNEY_SPRITES.signEncouragement}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.fillImage, { width: layout.sign.width, height: layout.sign.height }]}
        />
      </Animated.View>

      {presentation.showProgressMascot ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.mascotLayer, rectStyle(layout.progressMascot), mascotMotionStyle]}
        >
          <JourneyProgressMascot rect={layout.progressMascot} playing />
        </Animated.View>
      ) : (
        <Pressable
          accessible={false}
          onPress={() => onPressDay(leftDay)}
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
      )}

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

      <Animated.View
        pointerEvents="none"
        style={[
          styles.arrivalRing,
          {
            left: layout.day2X - ringSize / 2,
            top: layout.lineY - ringSize / 2,
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
          },
          arrivalRingStyle,
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
          state={presentation.leftNode}
          onPress={() => onPressDay(leftDay)}
        />
      </View>

      {rightDay !== undefined && presentation.rightNode ? (
        <Animated.View
          style={[
            styles.nodeSlot,
            {
              left: layout.day2X - NODE_SLOT_WIDTH / 2,
              top: layout.lineY - spacing.hitTarget / 2,
              width: NODE_SLOT_WIDTH,
            },
            rightNodeStyle,
          ]}
        >
          <JourneyDayNode
            size={layout.nodeSize}
            state={presentation.rightNode}
            onPress={() => onPressDay(rightDay)}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
  },
  preload: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  midStage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pathBand: {
    position: 'relative',
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
    zIndex: 3,
  },
  arrivalRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: colors.accent.gold,
    zIndex: 4,
  },
  nodeSlot: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  mascotLayer: {
    position: 'absolute',
    zIndex: 6,
    overflow: 'visible',
  },
});
