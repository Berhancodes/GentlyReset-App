import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
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
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/design-system';

/**
 * Sun and clouds for the top right of Home, separated from one illustration
 * (241 x 292 canvas) so each piece can drift on its own. Positions are in that
 * canvas; the big cloud is cut flat on the right and sits on the screen edge.
 */
const SKY_CANVAS = { width: 241, height: 292 } as const;
const SKY_PIECES = {
  sun: {
    source: require('../../../../assets/home/home-sun.png'),
    left: 84,
    top: 35,
    width: 146,
    height: 120,
  },
  bigCloud: {
    source: require('../../../../assets/home/home-cloud-big.png'),
    left: 123,
    top: 84,
    width: 118,
    height: 100,
  },
  smallCloud: {
    source: require('../../../../assets/home/home-cloud-small.png'),
    left: 2,
    top: 169,
    width: 99,
    height: 56,
  },
} as const;

/**
 * Rendered size of the group as a fraction of the illustration, on a 390pt
 * screen. It grows and shrinks with the screen width so the composition holds.
 */
const SKY_SCALE_AT_390 = 0.66;
const SKY_SCALE_MIN = 0.58;
const SKY_SCALE_MAX = 0.74;
/** Each cloud sways this far, in points, over one slow loop. */
const CLOUD_SWAY = 4;
const CLOUD_LOOP_MS = 6000;
/**
 * Slide-in each time Home opens: every piece starts off the right edge and
 * eases into place, sun first, then the big cloud, then the small cloud.
 * Distances are in canvas pixels so they scale with the group.
 */
const ENTRANCE = {
  sun: { fromX: 170, fromY: -30, delay: 0 },
  bigCloud: { fromX: 150, fromY: 0, delay: 110 },
  smallCloud: { fromX: 260, fromY: 0, delay: 230 },
} as const;
const ENTRANCE_MS = 750;
/**
 * The glow behind the sun once today is checked in, as a multiple of the sun's
 * width. It must stay inside the sky group, which clips (the sun sits 84 canvas px
 * from the right edge), and it fades to nothing at its rim so no edge shows.
 */
const GLOW_SCALE = 1.15;
const GLOW_FADE_MS = 1200;

type HomeSkyProps = {
  /** Distance from the top of the screen (below the status bar). */
  top: number;
  /** Today is checked in: a warm glow comes up behind the sun. */
  glowing?: boolean;
};

/** Decorative sun and clouds pinned to the top-right corner of Home. */
export function HomeSky({ top, glowing = false }: HomeSkyProps) {
  const reduceMotion = useReducedMotion();
  const { width: screenWidth } = useWindowDimensions();
  const scale = Math.min(
    SKY_SCALE_MAX,
    Math.max(SKY_SCALE_MIN, SKY_SCALE_AT_390 * (screenWidth / 390)),
  );
  const drift = useSharedValue(0);
  const sunIn = useSharedValue(reduceMotion ? 1 : 0);
  const bigCloudIn = useSharedValue(reduceMotion ? 1 : 0);
  const smallCloudIn = useSharedValue(reduceMotion ? 1 : 0);
  const glow = useSharedValue(glowing ? 1 : 0);

  useEffect(() => {
    glow.value = withTiming(glowing ? 1 : 0, { duration: reduceMotion ? 0 : GLOW_FADE_MS });
  }, [glow, glowing, reduceMotion]);

  // Replay the slide-in whenever Home comes into view.
  const [focusCount, setFocusCount] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setFocusCount((count) => count + 1);
    }, []),
  );

  useEffect(() => {
    const slide = (delay: number) =>
      withDelay(delay, withTiming(1, { duration: ENTRANCE_MS, easing: Easing.out(Easing.cubic) }));
    if (reduceMotion) {
      sunIn.value = 1;
      bigCloudIn.value = 1;
      smallCloudIn.value = 1;
      return;
    }
    sunIn.value = 0;
    bigCloudIn.value = 0;
    smallCloudIn.value = 0;
    sunIn.value = slide(ENTRANCE.sun.delay);
    bigCloudIn.value = slide(ENTRANCE.bigCloud.delay);
    smallCloudIn.value = slide(ENTRANCE.smallCloud.delay);
  }, [bigCloudIn, focusCount, reduceMotion, smallCloudIn, sunIn]);

  useEffect(() => {
    if (reduceMotion) {
      drift.value = 0;
      return;
    }
    drift.value = withRepeat(
      withTiming(1, { duration: CLOUD_LOOP_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [drift, reduceMotion]);

  // The two clouds sway in opposite directions; the sun breathes very slightly.
  const bigCloudStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, bigCloudIn.value * 2),
    transform: [
      {
        translateX:
          (1 - bigCloudIn.value) * ENTRANCE.bigCloud.fromX * scale +
          (drift.value - 0.5) * -2 * CLOUD_SWAY,
      },
    ],
  }));
  const smallCloudStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, smallCloudIn.value * 2),
    transform: [
      {
        translateX:
          (1 - smallCloudIn.value) * ENTRANCE.smallCloud.fromX * scale +
          (drift.value - 0.5) * 2 * CLOUD_SWAY,
      },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity:
      glow.value * Math.min(1, sunIn.value * 2) * (0.85 + Math.sin(drift.value * Math.PI) * 0.15),
  }));
  const sunStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, sunIn.value * 2),
    transform: [
      { translateX: (1 - sunIn.value) * ENTRANCE.sun.fromX * scale },
      { translateY: (1 - sunIn.value) * ENTRANCE.sun.fromY * scale },
      { scale: 1 + Math.sin(drift.value * Math.PI) * 0.02 },
    ],
  }));

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.group,
        {
          top,
          width: SKY_CANVAS.width * scale,
          height: SKY_CANVAS.height * scale,
        },
      ]}
    >
      <Animated.View style={[styles.piece, glowFrame(scale), glowStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="sunGlow" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={colors.accent.gold} stopOpacity={0.55} />
              <Stop offset="1" stopColor={colors.accent.gold} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="50" fill="url(#sunGlow)" />
        </Svg>
      </Animated.View>
      <Animated.Image
        source={SKY_PIECES.sun.source}
        style={[styles.piece, pieceFrame(SKY_PIECES.sun, scale), sunStyle]}
      />
      <Animated.Image
        source={SKY_PIECES.bigCloud.source}
        style={[styles.piece, pieceFrame(SKY_PIECES.bigCloud, scale), bigCloudStyle]}
      />
      <Animated.Image
        source={SKY_PIECES.smallCloud.source}
        style={[styles.piece, pieceFrame(SKY_PIECES.smallCloud, scale), smallCloudStyle]}
      />
    </View>
  );
}

/** A soft halo centred on the sun, bigger than it. */
function glowFrame(scale: number) {
  const sun = SKY_PIECES.sun;
  const size = sun.width * GLOW_SCALE;
  return {
    left: (sun.left + sun.width / 2 - size / 2) * scale,
    top: (sun.top + sun.height / 2 - size / 2) * scale,
    width: size * scale,
    height: size * scale,
  };
}

/** A piece's place in the scaled group. */
function pieceFrame(
  piece: { left: number; top: number; width: number; height: number },
  scale: number,
) {
  return {
    left: piece.left * scale,
    top: piece.top * scale,
    width: piece.width * scale,
    height: piece.height * scale,
  };
}

const styles = StyleSheet.create({
  group: {
    position: 'absolute',
    right: 0,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
  },
});
