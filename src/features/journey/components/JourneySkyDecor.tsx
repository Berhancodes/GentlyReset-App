import { useLayoutEffect, useRef } from 'react';
import { StyleSheet, type ImageSourcePropType, type ImageStyle } from 'react-native';
import { useIsFocused } from 'expo-router';
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

const SKY_EASING = Easing.out(Easing.cubic);

type JourneySkyDecorProps = {
  layout: JourneyStageLayout;
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

function playSkyEntrance(motionValues: SkyMotion, start: JourneySkyEntranceStart) {
  applySkyValues(motionValues, start);

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

export function JourneySkyDecor({ layout }: JourneySkyDecorProps) {
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

  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useLayoutEffect(() => {
    const values: SkyMotion = {
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

    if (reduceMotion) {
      applySkyValues(values, getJourneySkyRest());
      return;
    }

    const nextStart = getJourneySkyEntranceStart(layoutRef.current);
    if (!isFocused) {
      applySkyValues(values, nextStart);
      return;
    }

    playSkyEntrance(values, nextStart);
  }, [
    isFocused,
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
    transform: [{ translateX: sunX.value }, { translateY: sunY.value }],
  }));
  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftX.value }, { translateY: leftY.value }],
  }));
  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightX.value }, { translateY: rightY.value }],
  }));
  const upperStyle = useAnimatedStyle(() => ({
    opacity: upperOpacity.value,
    transform: [{ translateX: upperX.value }, { translateY: upperY.value }],
  }));

  const pieces = getJourneySkyPieces(layout);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.sky}
    >
      {pieces.leftCloud ? (
        <JourneySkyPiece
          source={JOURNEY_SPRITES.cloud}
          rect={pieces.leftCloud}
          animatedStyle={leftStyle}
        />
      ) : null}
      {pieces.upperCloud ? (
        <JourneySkyPiece
          source={JOURNEY_SPRITES.cloud}
          rect={pieces.upperCloud}
          animatedStyle={upperStyle}
        />
      ) : null}
      {pieces.rightCloud ? (
        <JourneySkyPiece
          source={JOURNEY_SPRITES.cloud}
          rect={pieces.rightCloud}
          animatedStyle={rightStyle}
        />
      ) : null}
      <JourneySkyPiece source={JOURNEY_SPRITES.sun} rect={pieces.sun} animatedStyle={sunStyle} />
    </Animated.View>
  );
}

type JourneySkyPieceProps = {
  source: ImageSourcePropType;
  rect: JourneyRect;
  animatedStyle: AnimatedStyle<ImageStyle>;
};

function JourneySkyPiece({ source, rect, animatedStyle }: JourneySkyPieceProps) {
  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.decorImage, rectStyle(rect), animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  sky: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  decorImage: {
    position: 'absolute',
  },
});
