import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, shadows, spacing, textVariants } from '@/design-system';

const SLAP_DELAY_MS = 350;
const SLAP_IN_MS = 330;
const SLAP_SETTLE_MS = 140;
const SLAP_REST_MS = 130;
const FADE_OUT_MS = 300;
/** It lands a little crooked, like a real sticker. */
const REST_TILT_DEG = -4;
const START_TILT_DEG = -24;
const START_SCALE = 0.2;
const MAX_WIDTH = 300;

type JourneyCelebrationStickerProps = {
  day: number;
  /** Horizontal centre and the bottom edge it sits on, in the overlay's coordinates. */
  centerX: number;
  bottom: number;
  visible: boolean;
};

/** "WOOOO! Day N done" on a white sticker that slaps on above the mascot. */
export function JourneyCelebrationSticker({
  day,
  centerX,
  bottom,
  visible,
}: JourneyCelebrationStickerProps) {
  const reduceMotion = useReducedMotion();
  const slap = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      opacity.value = withTiming(0, { duration: reduceMotion ? 0 : FADE_OUT_MS });
      return;
    }
    if (reduceMotion) {
      slap.value = 1;
      opacity.value = 1;
      return;
    }
    slap.value = 0;
    opacity.value = withDelay(SLAP_DELAY_MS, withTiming(1, { duration: SLAP_IN_MS / 2 }));
    // 0 → overshoot (1.12) → dip (0.96) → rest (1).
    slap.value = withDelay(
      SLAP_DELAY_MS,
      withSequence(
        withTiming(1.12, { duration: SLAP_IN_MS, easing: Easing.out(Easing.back(1.6)) }),
        withTiming(0.96, { duration: SLAP_SETTLE_MS }),
        withTiming(1, { duration: SLAP_REST_MS }),
      ),
    );
  }, [opacity, reduceMotion, slap, visible]);

  const slapStyle = useAnimatedStyle(() => {
    const landed = Math.min(slap.value, 1);
    return {
      opacity: opacity.value,
      transform: [
        { scale: START_SCALE + slap.value * (1 - START_SCALE) },
        { rotate: `${START_TILT_DEG + (REST_TILT_DEG - START_TILT_DEG) * landed}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.sticker, { left: centerX - MAX_WIDTH / 2, bottom }, slapStyle]}
    >
      <Text style={styles.shout} maxFontSizeMultiplier={1.2}>
        WOOOO!
      </Text>
      <Text style={styles.day} maxFontSizeMultiplier={1.3}>
        {`Day ${day} done`}
      </Text>
      <Text style={styles.line} maxFontSizeMultiplier={1.3}>
        I’m so proud of you.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    width: MAX_WIDTH,
    alignItems: 'center',
    gap: 2,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl + 2,
    borderWidth: 3,
    borderColor: colors.celebration.outline,
    backgroundColor: colors.celebration.sticker,
    ...shadows.celebrationSticker,
  },
  shout: {
    ...textVariants.celebrationShout,
    color: colors.celebration.outline,
  },
  day: {
    ...textVariants.unlockValue,
    color: colors.celebration.day,
  },
  line: {
    ...textVariants.unlockBody,
    color: colors.celebration.line,
  },
});
