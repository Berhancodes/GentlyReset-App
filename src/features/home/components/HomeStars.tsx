import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/design-system';

/**
 * A handful of small twinkling stars in the open sky, clear of the greeting,
 * the sun and the mascot. `x` and `y` are fractions of the screen, `size` is in points.
 */
const STARS = [
  { x: 0.6, y: 0.085, size: 15, ms: 2600, delay: 0 },
  { x: 0.9, y: 0.25, size: 11, ms: 3400, delay: 700 },
  { x: 0.07, y: 0.32, size: 12, ms: 3000, delay: 1400 },
  { x: 0.86, y: 0.4, size: 16, ms: 2800, delay: 400 },
  { x: 0.52, y: 0.29, size: 10, ms: 3800, delay: 1900 },
  { x: 0.13, y: 0.5, size: 13, ms: 3200, delay: 1100 },
] as const;

/** Four-point twinkle, drawn in a 24 x 24 box. */
const STAR_PATH =
  'M12 1.5C12.9 7.6 16.4 11.1 22.5 12 16.4 12.9 12.9 16.4 12 22.5 11.1 16.4 7.6 12.9 1.5 12 7.6 11.1 11.1 7.6 12 1.5Z';

/** Small gold stars that softly twinkle behind Home. */
export function HomeStars() {
  const reduceMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      {STARS.map((star) => (
        <TwinklingStar
          key={`${star.x}-${star.y}`}
          left={star.x * width - star.size / 2}
          top={star.y * height - star.size / 2}
          size={star.size}
          ms={star.ms}
          delay={star.delay}
          still={reduceMotion}
        />
      ))}
    </View>
  );
}

type TwinklingStarProps = {
  left: number;
  top: number;
  size: number;
  ms: number;
  delay: number;
  still: boolean;
};

function TwinklingStar({ left, top, size, ms, delay, still }: TwinklingStarProps) {
  const glow = useSharedValue(0.6);

  useEffect(() => {
    if (still) {
      glow.value = 0.7;
      return;
    }
    glow.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: ms, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [delay, glow, ms, still]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.45 + glow.value * 0.55,
    transform: [{ scale: 0.8 + glow.value * 0.25 }],
  }));

  return (
    <Animated.View style={[styles.star, { left, top, width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={STAR_PATH} fill={colors.accent.gold} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
  },
});
