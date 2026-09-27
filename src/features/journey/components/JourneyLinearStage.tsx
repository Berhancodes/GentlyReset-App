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
const TIMELINE_VIEWPORT_EXTRA = spacing.xl;

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
  const travelProgress = useSharedValue(0);
  const decorProgress = useSharedValue(0);
  const fadeProgress = useSharedValue(0);
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

    if (presentation.phase === 'idle' || presentation.phase === 'holding') {
      cancelAnimation(travelProgress);
      cancelAnimation(decorProgress);
      cancelAnimation(fadeProgress);
      travelProgress.value = 0;
      decorProgress.value = 0;
      fadeProgress.value = 0;
      return;
    }

    if (reduceMotion) {
      cancelAnimation(travelProgress);
      cancelAnimation(decorProgress);
      travelProgress.value = 0;
      decorProgress.value = 0;
      fadeProgress.value = 0;
      fadeProgress.value = withTiming(1, {
        duration: motion.duration.journeyProgressSettle,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (presentation.phase === 'walking') {
      cancelAnimation(travelProgress);
      cancelAnimation(decorProgress);
      travelProgress.value = 0;
      decorProgress.value = 0;
      travelProgress.value = withTiming(1, {
        duration: motion.duration.journeyProgressWalk,
        easing: WALK_EASING,
      });
      decorProgress.value = withTiming(1, {
        duration: motion.duration.journeyProgressWalk,
        easing: WALK_EASING,
      });
      return;
    }

    cancelAnimation(travelProgress);
    travelProgress.value = 1;
    if (presentation.phase === 'celebrating') {
      cancelAnimation(decorProgress);
      decorProgress.value = withTiming(0, {
        duration: motion.duration.journeyArrivalTilt,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [
    decorProgress,
    fadeProgress,
    presentation.phase,
    presentation.walkDirection,
    reduceMotion,
    travelProgress,
    walkDirection,
  ]);

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
          walkProgress={decorProgress}
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
            travelProgress={travelProgress}
            decorProgress={decorProgress}
            fadeProgress={fadeProgress}
            walkDirection={walkDirection}
            reduceMotion={reduceMotion}
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
  travelProgress: SharedValue<number>;
  decorProgress: SharedValue<number>;
  fadeProgress: SharedValue<number>;
  walkDirection: SharedValue<number>;
  reduceMotion: boolean;
};

function JourneyPathBand({
  layout,
  presentation,
  signLabel,
  onPressDay,
  travelProgress,
  decorProgress,
  fadeProgress,
  walkDirection,
  reduceMotion,
}: JourneyPathBandProps) {
  const nodePop = useSharedValue(1);
  const arrivalRing = useSharedValue(0);
  const plantTilt = useSharedValue(0);
  const outgoingDay = presentation.outgoingNode.day;
  const incomingDay = presentation.incomingNode?.day;
  const ringSize = layout.nodeSize * 1.7;
  const showIncoming = presentation.incomingNode !== undefined;
  const timelineTop = layout.lineY - spacing.hitTarget / 2;
  const timelineHeight = spacing.hitTarget + TIMELINE_VIEWPORT_EXTRA;

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
    transform: [
      {
        translateX: travelProgress.value * layout.travelDistance * walkDirection.value,
      },
    ],
  }));
  const leftBushStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -decorProgress.value * JOURNEY_WALK_LAYERS.foreground * walkDirection.value },
    ],
  }));
  const rightBushStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -decorProgress.value * JOURNEY_WALK_LAYERS.bush * walkDirection.value },
      { rotate: `${plantTilt.value}deg` },
    ],
  }));
  const signStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -decorProgress.value * JOURNEY_WALK_LAYERS.sign * walkDirection.value },
    ],
  }));
  const outgoingNodeStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 1 - fadeProgress.value : 1,
  }));
  const incomingNodeStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? fadeProgress.value : 1,
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
      <View
        pointerEvents="box-none"
        style={[
          styles.timelineViewport,
          {
            top: timelineTop,
            height: timelineHeight,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.line,
            {
              left: layout.lineLeft,
              top: layout.lineY - timelineTop - layout.lineThickness / 2,
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
              left: layout.nextX - ringSize / 2,
              top: layout.lineY - timelineTop - ringSize / 2,
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
            },
            arrivalRingStyle,
          ]}
        />

        <Animated.View
          style={[
            styles.nodeSlot,
            {
              left: layout.currentX - NODE_SLOT_WIDTH / 2,
              top: layout.lineY - timelineTop - spacing.hitTarget / 2,
              width: NODE_SLOT_WIDTH,
            },
            outgoingNodeStyle,
          ]}
        >
          <JourneyDayNode
            size={layout.nodeSize}
            state={presentation.outgoingNode}
            onPress={() => onPressDay(outgoingDay)}
          />
        </Animated.View>

        {showIncoming && presentation.incomingNode ? (
          <Animated.View
            style={[
              styles.nodeSlot,
              {
                left: (reduceMotion ? layout.currentX : layout.nextX) - NODE_SLOT_WIDTH / 2,
                top: layout.lineY - timelineTop - spacing.hitTarget / 2,
                width: NODE_SLOT_WIDTH,
              },
              incomingNodeStyle,
            ]}
          >
            <JourneyDayNode
              size={layout.nodeSize}
              state={presentation.incomingNode}
              onPress={() => onPressDay(incomingDay ?? outgoingDay)}
            />
          </Animated.View>
        ) : null}
      </View>

      <View pointerEvents="box-none" style={styles.worldPlane}>
        <Animated.Image
          source={JOURNEY_SPRITES.bush}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.worldLayer, rectStyle(layout.bushLeft), leftBushStyle]}
        />
        <Animated.Image
          source={JOURNEY_SPRITES.bush}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.worldLayer, rectStyle(layout.bush), rightBushStyle]}
        />

        <Animated.View
          accessible
          accessibilityRole="text"
          accessibilityLabel={signLabel}
          pointerEvents="none"
          style={[styles.worldLayer, rectStyle(layout.sign), signStyle]}
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
            style={[styles.worldLayer, rectStyle(layout.progressMascot), mascotMotionStyle]}
          >
            <JourneyProgressMascot rect={layout.progressMascot} playing />
          </Animated.View>
        ) : (
          <Pressable
            accessible={false}
            onPress={() => onPressDay(outgoingDay)}
            style={[styles.worldHit, rectStyle(layout.mascot)]}
          >
            <Image
              source={JOURNEY_SPRITES.mascotStand}
              resizeMode="contain"
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={[
                styles.fillImage,
                { width: layout.mascot.width, height: layout.mascot.height },
              ]}
            />
          </Pressable>
        )}
      </View>
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
    overflow: 'visible',
  },
  fillImage: {
    width: '100%',
    height: '100%',
  },
  timelineViewport: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    backgroundColor: colors.text.primary,
    borderRadius: 1,
  },
  arrivalRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: colors.accent.gold,
  },
  nodeSlot: {
    position: 'absolute',
    alignItems: 'center',
  },
  worldPlane: {
    ...StyleSheet.absoluteFill,
    overflow: 'visible',
    zIndex: 2,
  },
  worldLayer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  worldHit: {
    position: 'absolute',
  },
});
