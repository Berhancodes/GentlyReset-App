import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { motion, spacing } from '@/design-system';

const REST_FRAME = require('../../../../assets/images/mascot/mascot-breathe-rest.png');
const INHALE_FRAME = require('../../../../assets/images/mascot/mascot-breathe-inhale.png');
const HOLD_FRAME = require('../../../../assets/images/mascot/mascot-breathe-hold.png');
const EXHALE_FRAME = require('../../../../assets/images/mascot/mascot-breathe-exhale.png');

const BREATH_FRAMES = [REST_FRAME, INHALE_FRAME, HOLD_FRAME, EXHALE_FRAME] as const;

const ART_WIDTH = 389;
const ART_HEIGHT = 423;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_MAX_WIDTH = 200;
const MASCOT_LOWER_OFFSET_FRACTION = 0.1;
const VARIATION_LOOPS = 8;

const {
  restHoldMs,
  inhaleEndMs,
  holdEndMs,
  exhaleEndMs,
  cycleMs,
  scaleX: peakScaleX,
  scaleY: peakScaleY,
  translateY: peakTranslateY,
} = motion.breathing;

function easeInOutCosine(progress: number): number {
  'worklet';
  const clamped = Math.min(1, Math.max(0, progress));
  return -(Math.cos(Math.PI * clamped) - 1) / 2;
}

function segmentProgress(timeMs: number, startMs: number, endMs: number): number {
  'worklet';
  if (endMs <= startMs) {
    return timeMs >= endMs ? 1 : 0;
  }
  return easeInOutCosine((timeMs - startMs) / (endMs - startMs));
}

function cycleClock(elapsedMs: number): { timeMs: number; loopIndex: number } {
  'worklet';
  const loopIndex = Math.floor(elapsedMs / cycleMs);
  return {
    timeMs: elapsedMs - loopIndex * cycleMs,
    loopIndex,
  };
}

function blinkShiftMs(loopIndex: number): number {
  'worklet';
  return (((loopIndex * 13) % 7) - 3) * 40;
}

function frameOpacity(elapsedMs: number, frameIndex: number): number {
  'worklet';
  const { timeMs, loopIndex } = cycleClock(elapsedMs);
  const shiftMs = blinkShiftMs(loopIndex);
  const holdStartMs = inhaleEndMs + shiftMs;
  const holdFinishMs = holdEndMs + shiftMs;
  const inhaleFinishMs = Math.min(inhaleEndMs, holdStartMs);

  if (timeMs < restHoldMs) {
    return frameIndex === 0 ? 1 : 0;
  }

  if (timeMs < inhaleFinishMs) {
    const progress = segmentProgress(timeMs, restHoldMs, inhaleFinishMs);
    if (frameIndex === 0) {
      return 1 - progress;
    }
    if (frameIndex === 1) {
      return progress;
    }
    return 0;
  }

  if (timeMs < holdStartMs) {
    return frameIndex === 1 ? 1 : 0;
  }

  if (timeMs < holdFinishMs) {
    const progress = segmentProgress(timeMs, holdStartMs, holdFinishMs);
    if (frameIndex === 1) {
      return 1 - progress;
    }
    if (frameIndex === 2) {
      return progress;
    }
    return 0;
  }

  if (timeMs < exhaleEndMs) {
    const progress = segmentProgress(timeMs, holdFinishMs, exhaleEndMs);
    if (frameIndex === 2) {
      return 1 - progress;
    }
    if (frameIndex === 3) {
      return progress;
    }
    return 0;
  }

  const progress = segmentProgress(timeMs, exhaleEndMs, cycleMs);
  if (frameIndex === 3) {
    return 1 - progress;
  }
  if (frameIndex === 0) {
    return progress;
  }
  return 0;
}

function breathAmount(elapsedMs: number): number {
  'worklet';
  const { timeMs } = cycleClock(elapsedMs);
  if (timeMs < restHoldMs) {
    return 0;
  }
  if (timeMs < inhaleEndMs) {
    return segmentProgress(timeMs, restHoldMs, inhaleEndMs);
  }
  if (timeMs < holdEndMs) {
    return 1;
  }
  if (timeMs < exhaleEndMs) {
    return 1 - segmentProgress(timeMs, holdEndMs, exhaleEndMs);
  }
  return 0;
}

type BreathFrameLayerProps = {
  source: (typeof BREATH_FRAMES)[number];
  frameIndex: number;
  elapsedMs: SharedValue<number>;
  reduceMotion: boolean;
  width: number;
  height: number;
};

function BreathFrameLayer({
  source,
  frameIndex,
  elapsedMs,
  reduceMotion,
  width,
  height,
}: BreathFrameLayerProps) {
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? (frameIndex === 0 ? 1 : 0) : frameOpacity(elapsedMs.value, frameIndex),
  }));

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.frame, opacityStyle, { width, height }]}
    />
  );
}

/**
 * Four-pose breath loop for the first reminder screen.
 * Artwork carries the inhale; transforms stay under 2%.
 */
export function BreathingMascot() {
  const reduceMotion = useReducedMotion();
  const elapsedMs = useSharedValue(0);
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
      cancelAnimation(elapsedMs);
      elapsedMs.value = 0;
      return;
    }

    elapsedMs.value = 0;
    elapsedMs.value = withRepeat(
      withTiming(cycleMs * VARIATION_LOOPS, {
        duration: cycleMs * VARIATION_LOOPS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(elapsedMs);
    };
  }, [elapsedMs, reduceMotion]);

  const mascotMotionStyle = useAnimatedStyle(() => {
    const breath = reduceMotion ? 0 : breathAmount(elapsedMs.value);
    return {
      transform: [
        { translateY: interpolate(breath, [0, 1], [0, peakTranslateY]) },
        { scaleX: interpolate(breath, [0, 1], [1, peakScaleX]) },
        { scaleY: interpolate(breath, [0, 1], [1, peakScaleY]) },
      ],
    };
  });

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Take a deep breath"
      style={[styles.root, { marginTop: Math.round(windowHeight * MASCOT_LOWER_OFFSET_FRACTION) }]}
    >
      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.mascotStage, { width: artWidth, height: artHeight }, mascotMotionStyle]}
      >
        {BREATH_FRAMES.map((source, frameIndex) => (
          <BreathFrameLayer
            key={frameIndex}
            source={source}
            frameIndex={frameIndex}
            elapsedMs={elapsedMs}
            reduceMotion={Boolean(reduceMotion)}
            width={artWidth}
            height={artHeight}
          />
        ))}
      </Animated.View>

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
  frame: {
    ...StyleSheet.absoluteFill,
  },
});
