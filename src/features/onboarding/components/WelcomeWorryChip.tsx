import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  motion,
  radius,
  spacing,
} from '@/design-system';

const POP = 0.12;
const SETTLE = 0.06;
const START_SCALE = 0.6;
const END_SCALE = 0.35;
const RISE = 12;
const DRIFT = 3;

type WelcomeWorryChipProps = {
  label: string;
  /** Top of the chip and its sideways nudge from centre, relative to the stage. */
  top: number;
  sway: number;
  stageWidth: number;
  /** Where it drops into the sack, relative to the stage. */
  target: { x: number; y: number };
};

/**
 * A worry pops up over the mascot, stays long enough to read, then drops into
 * his sack. The screen unmounts it once it has landed.
 */
export function WelcomeWorryChip({ label, top, sway, stageWidth, target }: WelcomeWorryChipProps) {
  const translateX = useSharedValue(sway);
  const translateY = useSharedValue(RISE);
  const scale = useSharedValue(START_SCALE);
  const opacity = useSharedValue(0);
  const started = useRef(false);

  const hold = motion.duration.welcomeWorryHold;
  const fall = motion.duration.welcomeWorryFall;
  const total = hold + fall;

  const start = (chipHeight: number) => {
    if (started.current) {
      return;
    }
    started.current = true;
    const fallEasing = { duration: fall, easing: Easing.inOut(Easing.quad) };
    const dropX = target.x - stageWidth / 2;
    const dropY = target.y - top - chipHeight / 2;

    opacity.value = withSequence(
      withTiming(1, { duration: total * POP }),
      withDelay(hold - total * POP, withTiming(0, fallEasing)),
    );
    scale.value = withSequence(
      withTiming(1.06, { duration: total * POP }),
      withTiming(1, { duration: total * SETTLE }),
      withDelay(hold - total * (POP + SETTLE), withTiming(END_SCALE, fallEasing)),
    );
    translateY.value = withSequence(
      withTiming(0, { duration: total * POP }),
      withTiming(-DRIFT, { duration: hold - total * POP }),
      withTiming(dropY, fallEasing),
    );
    translateX.value = withDelay(hold, withTiming(dropX, fallEasing));
  };

  const chipStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View pointerEvents="none" style={[styles.lane, { top }]}>
      <Animated.View
        style={[styles.chip, chipStyle]}
        onLayout={(event) => start(event.nativeEvent.layout.height)}
      >
        <Text style={styles.label} maxFontSizeMultiplier={1.2}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  lane: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  chip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  label: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.onboardingChoice,
    lineHeight: lineHeights.onboardingChoice,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
});
