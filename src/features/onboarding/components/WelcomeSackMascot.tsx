import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import Svg, { Ellipse } from 'react-native-svg';

import { colors, motion } from '@/design-system';
import {
  WELCOME_SACK_FRAMES,
  WELCOME_SACK_LAST_FRAME,
  WELCOME_SACK_REFERENCE_HEIGHT,
} from '@/features/onboarding/stage/welcomeSackFrames';

/** Where things sit on the opening stage, in points relative to the stage. */
export type WelcomeStageGeometry = {
  width: number;
  height: number;
  /** Height of the carrying frame. */
  mascotHeight: number;
  /** Gap below his feet; he and his bubble sit in the vertical middle. */
  floor: number;
  /** Sprite pixels to points. */
  scale: number;
  /** Where his body stands, so he and the sack together sit centred once he settles. */
  bodyX: number;
  /** Centre of the sack's mouth, where worries drop in. */
  sack: { x: number; y: number };
};

const MAX_MASCOT_HEIGHT = 210;
const SHADOW_WIDTH = 130;
const SHADOW_HEIGHT = 16;
const WALK_EASING = Easing.bezier(0.3, 0.7, 0.3, 1);

export function getWelcomeStageGeometry(width: number, height: number): WelcomeStageGeometry {
  const mascotHeight = Math.min(height * 0.47, MAX_MASCOT_HEIGHT);
  const floor = (height - mascotHeight) / 2;
  const scale = mascotHeight / WELCOME_SACK_REFERENCE_HEIGHT;
  const bodyX = width / 2 + (WELCOME_SACK_FRAMES[WELCOME_SACK_LAST_FRAME]?.bodyOffset ?? 0) * scale;
  return {
    width,
    height,
    mascotHeight,
    floor,
    scale,
    bodyX,
    sack: { x: bodyX - mascotHeight * 0.3, y: height - floor - mascotHeight * 0.55 },
  };
}

type WelcomeSackMascotProps = {
  geometry: WelcomeStageGeometry;
  frameIndex: number;
  /** Changes each time a worry lands, so he buckles under it. */
  buckleCount: number;
  /** Skip the walk and fades and show him settled. */
  instant: boolean;
};

/** He walks in with the sack and sinks a frame as each worry lands. */
export function WelcomeSackMascot({
  geometry,
  frameIndex,
  buckleCount,
  instant,
}: WelcomeSackMascotProps) {
  const shown = useSharedValue(frameIndex);
  const walk = useSharedValue(instant ? 1 : 0);
  const breath = useSharedValue(0);
  const buckle = useSharedValue(0);

  useEffect(() => {
    if (instant) {
      cancelAnimation(walk);
      walk.value = 1;
      return;
    }
    walk.value = withDelay(
      motion.duration.stageFlightStagger * 2,
      withTiming(1, {
        duration: motion.duration.welcomeWalk,
        easing: WALK_EASING,
      }),
    );
  }, [instant, walk]);

  useEffect(() => {
    breath.value = withDelay(
      instant ? 0 : motion.duration.welcomeWalk,
      withRepeat(
        withTiming(1, { duration: motion.duration.stageBreath, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(breath);
  }, [breath, instant]);

  useEffect(() => {
    shown.value = instant
      ? frameIndex
      : withTiming(frameIndex, { duration: motion.duration.welcomeFrameFade });
  }, [frameIndex, instant, shown]);

  useEffect(() => {
    if (buckleCount === 0 || instant) {
      return;
    }
    const half = motion.duration.welcomeSquash / 2;
    buckle.value = withSequence(
      withTiming(1, { duration: half * 0.8 }),
      withTiming(0, { duration: half * 1.2 }),
    );
  }, [buckle, buckleCount, instant]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(walk.value, [0, 1], [-geometry.width * 0.8, 0]) },
      { scaleX: 1 - breath.value * 0.008 + buckle.value * 0.05 },
      { scaleY: 1 + breath.value * 0.022 - buckle.value * 0.07 },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(walk.value, [0.85, 1], [0, 1], 'clamp'),
  }));

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      <Animated.View
        style={[
          styles.shadow,
          {
            bottom: geometry.floor - SHADOW_HEIGHT / 2 + 2,
            left: geometry.bodyX - SHADOW_WIDTH / 2,
          },
          shadowStyle,
        ]}
      >
        {/* A true ellipse; a pill radius leaves flat sides. */}
        <Svg width={SHADOW_WIDTH} height={SHADOW_HEIGHT}>
          <Ellipse
            cx={SHADOW_WIDTH / 2}
            cy={SHADOW_HEIGHT / 2}
            rx={SHADOW_WIDTH / 2}
            ry={SHADOW_HEIGHT / 2}
            fill={colors.stage.mascotShadow}
          />
        </Svg>
      </Animated.View>
      <Animated.View
        style={[
          styles.body,
          { bottom: geometry.floor, height: geometry.mascotHeight * 1.1 },
          bodyStyle,
        ]}
      >
        {/* Earlier frames sit on top, so the outgoing frame fades off the incoming one. */}
        {WELCOME_SACK_FRAMES.map((frame, index) => ({ frame, index }))
          .reverse()
          .map(({ frame, index }) => (
            <SackFrameImage
              key={index}
              index={index}
              shown={shown}
              source={frame.source}
              width={frame.width * geometry.scale}
              height={frame.height * geometry.scale}
              left={geometry.bodyX - (frame.width / 2 + frame.bodyOffset) * geometry.scale}
            />
          ))}
      </Animated.View>
    </View>
  );
}

type SackFrameImageProps = {
  index: number;
  shown: SharedValue<number>;
  source: (typeof WELCOME_SACK_FRAMES)[number]['source'];
  width: number;
  height: number;
  left: number;
};

/**
 * One frame. It appears the moment the move towards it starts (underneath the
 * outgoing frame), then fades out as the move past it plays.
 */
function SackFrameImage({ index, shown, source, width, height, left }: SackFrameImageProps) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      shown.value,
      [index - 1, index - 0.98, index, index + 1],
      [0, 1, 1, 0],
      'clamp',
    ),
  }));

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[styles.frame, { width, height, left }, style]}
    />
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    width: SHADOW_WIDTH,
    height: SHADOW_HEIGHT,
  },
  body: {
    position: 'absolute',
    left: 0,
    right: 0,
    transformOrigin: 'bottom',
  },
  frame: {
    position: 'absolute',
    bottom: 0,
  },
});
