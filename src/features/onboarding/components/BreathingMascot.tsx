import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, motion, radius, spacing } from '@/design-system';

const OPEN_EYES = require('../../../../assets/images/mascot/mascot-breathe-open.png');
const CLOSED_EYES = require('../../../../assets/images/mascot/mascot-breathe-closed.png');

const ART_WIDTH = 804;
const ART_HEIGHT = 843;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_MAX_WIDTH = 200;

const {
  idleMs,
  inhaleMs,
  holdMs,
  exhaleMs,
  restMs,
  eyeCrossfadeMs,
  scaleX: peakScaleX,
  scaleY: peakScaleY,
  translateY: peakTranslateY,
  indicatorRestWidth,
  indicatorPeakWidth,
  indicatorHeight,
} = motion.breathing;

const INHALE_END_MS = idleMs + inhaleMs;
const HOLD_END_MS = INHALE_END_MS + holdMs;
const EXHALE_END_MS = HOLD_END_MS + exhaleMs;
const CYCLE_MS = EXHALE_END_MS + restMs;
const EYE_CLOSE_START_MS = INHALE_END_MS - eyeCrossfadeMs;
const EYE_OPEN_START_MS = EXHALE_END_MS - eyeCrossfadeMs;
const INDICATOR_PEAK_SCALE = indicatorPeakWidth / indicatorRestWidth;

function easeInOutCosine(progress: number): number {
  'worklet';
  const clamped = Math.min(1, Math.max(0, progress));
  return -(Math.cos(Math.PI * clamped) - 1) / 2;
}

function breathAmount(cycleMs: number): number {
  'worklet';
  if (cycleMs < idleMs) {
    return 0;
  }
  if (cycleMs < INHALE_END_MS) {
    return easeInOutCosine((cycleMs - idleMs) / inhaleMs);
  }
  if (cycleMs < HOLD_END_MS) {
    return 1;
  }
  if (cycleMs < EXHALE_END_MS) {
    return 1 - easeInOutCosine((cycleMs - HOLD_END_MS) / exhaleMs);
  }
  return 0;
}

function eyeClosedAmount(cycleMs: number): number {
  'worklet';
  if (cycleMs < EYE_CLOSE_START_MS) {
    return 0;
  }
  if (cycleMs < INHALE_END_MS) {
    return easeInOutCosine((cycleMs - EYE_CLOSE_START_MS) / eyeCrossfadeMs);
  }
  if (cycleMs < EYE_OPEN_START_MS) {
    return 1;
  }
  if (cycleMs < EXHALE_END_MS) {
    return 1 - easeInOutCosine((cycleMs - EYE_OPEN_START_MS) / eyeCrossfadeMs);
  }
  return 0;
}

/**
 * Slow inhale / exhale loop for the first reminder screen.
 * Motion stays on the UI thread and yields to Reduce Motion.
 */
export function BreathingMascot() {
  const reduceMotion = useReducedMotion();
  const cycleMs = useSharedValue(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxHeight = Math.round(windowHeight * 0.24);
  const widthFromHeight = Math.round(maxHeight * ART_ASPECT);
  const artWidth = Math.max(
    spacing.xxxl,
    Math.min(availableWidth, widthFromHeight, MASCOT_MAX_WIDTH),
  );
  const artHeight = Math.round(artWidth / ART_ASPECT);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(cycleMs);
      cycleMs.value = 0;
      return;
    }

    cycleMs.value = 0;
    cycleMs.value = withRepeat(
      withTiming(CYCLE_MS, { duration: CYCLE_MS, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(cycleMs);
    };
  }, [cycleMs, reduceMotion]);

  const mascotMotionStyle = useAnimatedStyle(() => {
    const breath = reduceMotion ? 0 : breathAmount(cycleMs.value);
    return {
      transform: [
        { translateY: interpolate(breath, [0, 1], [0, peakTranslateY]) },
        { scaleX: interpolate(breath, [0, 1], [1, peakScaleX]) },
        { scaleY: interpolate(breath, [0, 1], [1, peakScaleY]) },
      ],
    };
  });

  const openEyesStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 1 : 1 - eyeClosedAmount(cycleMs.value),
  }));

  const closedEyesStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : eyeClosedAmount(cycleMs.value),
  }));

  const indicatorStyle = useAnimatedStyle(() => {
    const breath = reduceMotion ? 0 : breathAmount(cycleMs.value);
    return {
      transform: [{ scaleX: interpolate(breath, [0, 1], [1, INDICATOR_PEAK_SCALE]) }],
    };
  });

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Take a deep breath"
      style={styles.root}
    >
      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.mascotStage, { width: artWidth, height: artHeight }, mascotMotionStyle]}
      >
        <Animated.Image
          source={OPEN_EYES}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[openEyesStyle, { width: artWidth, height: artHeight }]}
        />
        <Animated.Image
          source={CLOSED_EYES}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.closedFrame, closedEyesStyle, { width: artWidth, height: artHeight }]}
        />
      </Animated.View>

      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.indicator, indicatorStyle]}
      />

      <AppText variant="onboardingHelper" color="helper" align="center">
        Take a deep breath
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    pointerEvents: 'none',
  },
  mascotStage: {
    transformOrigin: '50% 100%',
  },
  closedFrame: {
    ...StyleSheet.absoluteFill,
  },
  indicator: {
    width: indicatorRestWidth,
    height: indicatorHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.gold,
    marginTop: spacing.xs,
  },
});
