import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/design-system';

const STAR_PATH =
  'M12 1.5C12.9 7.6 16.4 11.1 22.5 12 16.4 12.9 12.9 16.4 12 22.5 11.1 16.4 7.6 12.9 1.5 12 7.6 11.1 11.1 7.6 12 1.5Z';

const FALLING_COUNT = 18;
const FALL_MS = 2600;
const FALL_START_MS = 300;
const FALL_STAGGER_SPREAD_MS = 1400;
const SPARK_COUNT = 12;
const SPARK_MS = 900;
const SPARK_START_MS = 500;
const SPARK_STAGGER_MS = 140;

type FallingStar = {
  /** 0–1 across the width. */
  across: number;
  /** 0–1 down the top band where it starts. */
  startBand: number;
  size: number;
  drift: number;
  spin: number;
  delay: number;
  color: string;
};

type Spark = {
  dx: number;
  dy: number;
  size: number;
  delay: number;
  color: string;
};

/** Spread out evenly but not in rows, so every shower looks the same and none clump. */
function makeFallingStars(): FallingStar[] {
  const gold = colors.celebration.sparkles[0] ?? colors.accent.gold;
  const pale = colors.celebration.sparkles[2] ?? colors.accent.gold;
  return Array.from({ length: FALLING_COUNT }, (_, index) => ({
    across: ((index * 0.381966) % 1) * 0.92 + 0.04,
    startBand: ((index * 0.618034) % 1) * 0.25,
    size: index % 3 === 0 ? 22 : 14,
    drift: (index % 2 === 0 ? 1 : -1) * (10 + (index % 5) * 8),
    spin: (index % 2 === 0 ? 1 : -1) * 220,
    delay: FALL_START_MS + ((index * 0.23) % 1) * FALL_STAGGER_SPREAD_MS,
    color: index % 4 === 0 ? gold : pale,
  }));
}

/** The same every time, so it's built once. */
const FALLING_STARS = makeFallingStars();

function makeSparks(reach: number): Spark[] {
  const palette = colors.celebration.sparkles;
  return Array.from({ length: SPARK_COUNT }, (_, index) => {
    const angle = (Math.PI * 2 * index) / SPARK_COUNT;
    const distance = reach * (index % 2 === 0 ? 0.78 : 0.6);
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance * 0.9,
      size: index % 3 === 0 ? 26 : 18,
      delay: SPARK_START_MS + (index % 4) * SPARK_STAGGER_MS,
      color: palette[index % palette.length] ?? colors.accent.gold,
    };
  });
}

type JourneyStarShowerProps = {
  /** Changes to start a new shower; 0 never plays. */
  playKey: number;
  width: number;
  height: number;
  /** Where the sparkles burst from (the mascot), and how far they reach. */
  originX: number;
  originY: number;
  reach: number;
};

/**
 * Gold stars that rain down the screen, plus a ring of sparkles popping around
 * the mascot. Draws nothing under Reduce Motion.
 */
export function JourneyStarShower({
  playKey,
  width,
  height,
  originX,
  originY,
  reach,
}: JourneyStarShowerProps) {
  const reduceMotion = useReducedMotion();
  const sparks = useMemo(() => makeSparks(reach), [reach]);

  if (reduceMotion || playKey === 0 || width === 0) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {FALLING_STARS.map((star, index) => (
        <FallingStarView
          key={`fall-${index}`}
          star={star}
          playKey={playKey}
          width={width}
          height={height}
        />
      ))}
      {sparks.map((spark, index) => (
        <SparkView
          key={`spark-${index}`}
          spark={spark}
          playKey={playKey}
          originX={originX}
          originY={originY}
        />
      ))}
    </View>
  );
}

function StarGlyph({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={STAR_PATH} fill={color} stroke={colors.celebration.outline} strokeWidth={1} />
    </Svg>
  );
}

function FallingStarView({
  star,
  playKey,
  width,
  height,
}: {
  star: FallingStar;
  playKey: number;
  width: number;
  height: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withDelay(
      star.delay,
      withTiming(1, { duration: FALL_MS, easing: Easing.in(Easing.quad) }),
    );
  }, [playKey, progress, star.delay]);

  const fallDistance = height * 0.55;
  const style = useAnimatedStyle(() => {
    const t = progress.value;
    // In over the first sixth, gone by the end.
    const fade = t < 0.15 ? t / 0.15 : 1 - Math.max(0, (t - 0.7) / 0.3);
    return {
      opacity: t === 0 ? 0 : fade,
      transform: [
        { translateX: star.drift * t },
        { translateY: -40 + fallDistance * t },
        { rotate: `${star.spin * t}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        { left: star.across * width - star.size / 2, top: star.startBand * height * 0.4 },
        style,
      ]}
    >
      <StarGlyph size={star.size} color={star.color} />
    </Animated.View>
  );
}

function SparkView({
  spark,
  playKey,
  originX,
  originY,
}: {
  spark: Spark;
  playKey: number;
  originX: number;
  originY: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withDelay(spark.delay, withTiming(1, { duration: SPARK_MS }));
  }, [playKey, progress, spark.delay]);

  const style = useAnimatedStyle(() => {
    const t = progress.value;
    // Pops up to 1.25 by a third of the way, then shrinks away while turning.
    const scale = t < 0.35 ? (t / 0.35) * 1.25 : 1.25 * (1 - (t - 0.35) / 0.65);
    return {
      opacity: t === 0 || t === 1 ? 0 : 1,
      transform: [{ scale }, { rotate: `${t * 100}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: originX + spark.dx - spark.size / 2,
          top: originY + spark.dy - spark.size / 2,
        },
        style,
      ]}
    >
      <StarGlyph size={spark.size} color={spark.color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
  },
});
