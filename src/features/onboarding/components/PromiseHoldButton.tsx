import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Mascot, type MascotHandle } from '@/components/mascot';
import {
  MASCOT_SOURCE_HEIGHT,
  MASCOT_SOURCE_WIDTH,
  MASCOT_START_BOUNDS,
} from '@/components/mascot/mascotLayout';
import { colors, motion, radius, shadows, spacing, textVariants } from '@/design-system';
import { hapticHoldRumble, hapticPromiseMade } from '@/utils/haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 96;
const STROKE = 7;
const RING_RADIUS = (SIZE - STROKE) / 2 - 1;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
/** The round window inside the ring that he's drawn in, clipped so nothing spills over. */
const WINDOW_SIZE = (RING_RADIUS - STROKE / 2) * 2;
const WINDOW_INSET = (SIZE - WINDOW_SIZE) / 2;
/** He stands in the window: hat clear of the top, feet a little above the bottom. */
const MASCOT_FIGURE_HEIGHT = 58;
const MASCOT_FEET_Y = WINDOW_SIZE - 9;
const MASCOT_SCALE = MASCOT_FIGURE_HEIGHT / MASCOT_START_BOUNDS.idle.height;
const MASCOT_FRAME_WIDTH = MASCOT_SOURCE_WIDTH * MASCOT_SCALE;
const MASCOT_FRAME_HEIGHT = MASCOT_SOURCE_HEIGHT * MASCOT_SCALE;

type PromiseHoldButtonProps = {
  promise: string;
  kicker: string;
  hint: string;
  promisedKicker: string;
  promisedHint: string;
  promised: boolean;
  onPromised: () => void;
};

/**
 * The promise card: press and hold the circle until the gold ring closes, and the
 * mascot hugs. The phone rumbles while it's held, building from light to heavy.
 * Letting go early unwinds it. VoiceOver users make it with a double tap.
 */
export function PromiseHoldButton({
  promise,
  kicker,
  hint,
  promisedKicker,
  promisedHint,
  promised,
  onPromised,
}: PromiseHoldButtonProps) {
  const progress = useSharedValue(promised ? 1 : 0);
  const stopRumble = useRef<(() => void) | null>(null);
  const mascot = useRef<MascotHandle>(null);

  const endRumble = () => {
    stopRumble.current?.();
    stopRumble.current = null;
  };

  // Never leave it rumbling if the screen goes away mid-hold.
  useEffect(() => () => stopRumble.current?.(), []);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const complete = () => {
    endRumble();
    hapticPromiseMade();
    mascot.current?.play('hug');
    onPromised();
  };

  const startHold = () => {
    if (promised) {
      return;
    }
    endRumble();
    stopRumble.current = hapticHoldRumble(() => progress.value);
    cancelAnimation(progress);
    progress.value = withTiming(
      1,
      {
        duration: motion.duration.promiseHold * (1 - progress.value),
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(complete)();
        }
      },
    );
  };

  const releaseHold = () => {
    endRumble();
    if (promised || progress.value >= 1) {
      return;
    }
    cancelAnimation(progress);
    progress.value = withTiming(0, { duration: motion.duration.promiseRelease });
  };

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={promised ? 'Promise made' : 'Press and hold to make your promise'}
        accessibilityState={{ disabled: promised }}
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={() => {
          if (!promised) {
            progress.value = 1;
            complete();
          }
        }}
        onPressIn={startHold}
        onPressOut={releaseHold}
        style={styles.hold}
      >
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RING_RADIUS}
            fill={colors.unlock.holdWell}
            stroke={colors.unlock.track}
            strokeWidth={STROKE}
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke={colors.unlock.gold}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={ringProps}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        {/* The same animated mascot as Home: idle while held, a hug once promised. */}
        <View style={styles.window} pointerEvents="none">
          <View style={styles.mascot}>
            <Mascot ref={mascot} width={MASCOT_FRAME_WIDTH} height={MASCOT_FRAME_HEIGHT} />
          </View>
        </View>
      </Pressable>
      <View style={styles.copy}>
        <Text style={styles.kicker}>{promised ? promisedKicker : kicker}</Text>
        <Text style={styles.promise}>{`“${promise}”`}</Text>
        <Text style={styles.hint}>{promised ? promisedHint : hint}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    padding: spacing.sm + 2,
    borderRadius: radius.xl,
    borderWidth: 2.5,
    borderColor: colors.unlock.ink,
    backgroundColor: colors.unlock.sticker,
    ...shadows.unlockSticker,
  },
  hold: {
    width: SIZE,
    height: SIZE,
  },
  window: {
    position: 'absolute',
    left: WINDOW_INSET,
    top: WINDOW_INSET,
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  mascot: {
    position: 'absolute',
    left: WINDOW_SIZE / 2 - MASCOT_START_BOUNDS.idle.centerX * MASCOT_SCALE,
    top: MASCOT_FEET_Y - MASCOT_START_BOUNDS.idle.feetY * MASCOT_SCALE,
    width: MASCOT_FRAME_WIDTH,
    height: MASCOT_FRAME_HEIGHT,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  kicker: {
    ...textVariants.unlockLabel,
    color: colors.unlock.kicker,
  },
  promise: {
    ...textVariants.unlockValue,
    color: colors.unlock.ink,
  },
  hint: {
    ...textVariants.unlockSmall,
    color: colors.unlock.muted,
  },
});
