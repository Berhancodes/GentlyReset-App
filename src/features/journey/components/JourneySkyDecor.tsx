import { useLayoutEffect, useRef } from 'react';
import { Image, StyleSheet, type ImageSourcePropType, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { motion } from '@/design-system';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import type { JourneyRect, JourneyStageLayout } from '@/features/journey/layout/journeyStageLayout';
import {
  getJourneySkyEntranceStart,
  getJourneySkyPieces,
  getJourneySkyRest,
  type JourneySkyEntranceStart,
} from '@/features/journey/utils/getJourneySkyEntrance';
import { JOURNEY_WALK_LAYERS } from '@/features/journey/utils/getJourneyWalkMotion';

const SKY_EASING = Easing.out(Easing.cubic);

type JourneySkyDecorProps = {
  layout: JourneyStageLayout;
  focused: boolean;
  walkProgress: SharedValue<number>;
  walkDirection: SharedValue<number>;
};

type SkyMotion = {
  sunX: SharedValue<number>;
  sunY: SharedValue<number>;
  leftX: SharedValue<number>;
  leftY: SharedValue<number>;
  rightX: SharedValue<number>;
  rightY: SharedValue<number>;
  upperX: SharedValue<number>;
  upperY: SharedValue<number>;
  upperOpacity: SharedValue<number>;
};

function rectStyle(rect: JourneyRect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function collectSkyMotion(
  sunX: SharedValue<number>,
  sunY: SharedValue<number>,
  leftX: SharedValue<number>,
  leftY: SharedValue<number>,
  rightX: SharedValue<number>,
  rightY: SharedValue<number>,
  upperX: SharedValue<number>,
  upperY: SharedValue<number>,
  upperOpacity: SharedValue<number>,
): SkyMotion {
  return {
    sunX,
    sunY,
    leftX,
    leftY,
    rightX,
    rightY,
    upperX,
    upperY,
    upperOpacity,
  };
}

function applySkyValues(motionValues: SkyMotion, next: JourneySkyEntranceStart) {
  cancelAnimation(motionValues.sunX);
  cancelAnimation(motionValues.sunY);
  cancelAnimation(motionValues.leftX);
  cancelAnimation(motionValues.leftY);
  cancelAnimation(motionValues.rightX);
  cancelAnimation(motionValues.rightY);
  cancelAnimation(motionValues.upperX);
  cancelAnimation(motionValues.upperY);
  cancelAnimation(motionValues.upperOpacity);

  motionValues.sunX.value = next.sunX;
  motionValues.sunY.value = next.sunY;
  motionValues.leftX.value = next.leftX;
  motionValues.leftY.value = next.leftY;
  motionValues.rightX.value = next.rightX;
  motionValues.rightY.value = next.rightY;
  motionValues.upperX.value = next.upperX;
  motionValues.upperY.value = next.upperY;
  motionValues.upperOpacity.value = next.upperOpacity;
}

function animateSkyToRest(motionValues: SkyMotion) {
  const timing = (duration: number) => ({
    duration,
    easing: SKY_EASING,
  });

  motionValues.leftX.value = withDelay(
    motion.delay.journeyLeftCloud,
    withTiming(0, timing(motion.duration.journeyLeftCloud)),
  );
  motionValues.leftY.value = withDelay(
    motion.delay.journeyLeftCloud,
    withTiming(0, timing(motion.duration.journeyLeftCloud)),
  );

  motionValues.sunX.value = withDelay(
    motion.delay.journeySun,
    withTiming(0, timing(motion.duration.journeySun)),
  );
  motionValues.sunY.value = withDelay(
    motion.delay.journeySun,
    withTiming(0, timing(motion.duration.journeySun)),
  );

  motionValues.rightX.value = withDelay(
    motion.delay.journeyRightCloud,
    withTiming(0, timing(motion.duration.journeyRightCloud)),
  );
  motionValues.rightY.value = withDelay(
    motion.delay.journeyRightCloud,
    withTiming(0, timing(motion.duration.journeyRightCloud)),
  );

  motionValues.upperX.value = withDelay(
    motion.delay.journeyUpperCloud,
    withTiming(0, timing(motion.duration.journeyUpperCloud)),
  );
  motionValues.upperY.value = withDelay(
    motion.delay.journeyUpperCloud,
    withTiming(0, timing(motion.duration.journeyUpperCloud)),
  );
  motionValues.upperOpacity.value = withDelay(
    motion.delay.journeyUpperCloud,
    withTiming(1, timing(motion.duration.journeyUpperCloud)),
  );
}

export function JourneySkyDecor({
  layout,
  focused,
  walkProgress,
  walkDirection,
}: JourneySkyDecorProps) {
  const reduceMotion = useReducedMotion() === true;
  const layoutRef = useRef(layout);
  const start = getJourneySkyEntranceStart(layout);
  const rest = getJourneySkyRest();
  const initial = reduceMotion ? rest : start;

  const sunX = useSharedValue(initial.sunX);
  const sunY = useSharedValue(initial.sunY);
  const leftX = useSharedValue(initial.leftX);
  const leftY = useSharedValue(initial.leftY);
  const rightX = useSharedValue(initial.rightX);
  const rightY = useSharedValue(initial.rightY);
  const upperX = useSharedValue(initial.upperX);
  const upperY = useSharedValue(initial.upperY);
  const upperOpacity = useSharedValue(initial.upperOpacity);

  useLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useLayoutEffect(() => {
    const values = collectSkyMotion(
      sunX,
      sunY,
      leftX,
      leftY,
      rightX,
      rightY,
      upperX,
      upperY,
      upperOpacity,
    );

    if (reduceMotion) {
      applySkyValues(values, getJourneySkyRest());
      return;
    }

    const nextStart = getJourneySkyEntranceStart(layoutRef.current);
    applySkyValues(values, nextStart);

    if (!focused) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      animateSkyToRest(values);
    });

    return () => cancelAnimationFrame(frame);
  }, [
    focused,
    leftX,
    leftY,
    reduceMotion,
    rightX,
    rightY,
    sunX,
    sunY,
    upperOpacity,
    upperX,
    upperY,
  ]);

  const sunStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: sunX.value - walkProgress.value * JOURNEY_WALK_LAYERS.sun * walkDirection.value,
      },
      { translateY: sunY.value },
    ],
  }));
  const pieces = getJourneySkyPieces(layout);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.sky}
    >
      <JourneySkyPiece source={JOURNEY_SPRITES.sun} rect={pieces.sun} animatedStyle={sunStyle} />
    </Animated.View>
  );
}

type JourneySkyPieceProps = {
  source: ImageSourcePropType;
  rect: JourneyRect;
  animatedStyle: AnimatedStyle<ViewStyle>;
};

function JourneySkyPiece({ source, rect, animatedStyle }: JourneySkyPieceProps) {
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.decorLayer, rectStyle(rect), animatedStyle]}
    >
      <Image
        source={source}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.fillImage}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sky: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  decorLayer: {
    position: 'absolute',
  },
  fillImage: {
    width: '100%',
    height: '100%',
  },
});
