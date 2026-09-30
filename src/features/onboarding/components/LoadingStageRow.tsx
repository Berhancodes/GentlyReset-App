import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, radius, spacing, textVariants } from '@/design-system';
import { hapticSelection } from '@/utils/haptics';

type LoadingStageRowProps = {
  label: string;
  done: boolean;
  active: boolean;
};

const MARK_SIZE = 28;

/**
 * One personalization stage. Fills and pops when it completes; the active
 * unread row breathes so the list feels like work is happening.
 */
export function LoadingStageRow({ label, done, active }: LoadingStageRowProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(done ? 1 : 0);
  const pop = useSharedValue(1);
  const pulse = useSharedValue(0);
  const wasDone = useRef(done);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = done ? 1 : 0;
      pop.value = 1;
      return;
    }

    progress.value = withTiming(done ? 1 : 0, {
      duration: motion.duration.loadingMark,
      easing: Easing.out(Easing.cubic),
    });

    if (done && !wasDone.current) {
      pop.value = withSequence(
        withTiming(motion.scale.loadingPop, {
          duration: 130,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(1, motion.spring.release),
      );
    } else if (!done) {
      pop.value = withTiming(1, { duration: motion.duration.press });
    }
  }, [done, pop, progress, reduceMotion]);

  useEffect(() => {
    if (done && !wasDone.current) {
      void hapticSelection();
    }
    wasDone.current = done;
  }, [done]);

  useEffect(() => {
    if (reduceMotion || !active || done) {
      pulse.value = withTiming(0, { duration: motion.duration.press });
      return;
    }

    pulse.value = withRepeat(
      withTiming(1, {
        duration: motion.duration.loadingPulse,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [active, done, pulse, reduceMotion]);

  const markStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surface.raised, colors.accent.gold],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [
        interpolateColor(pulse.value, [0, 1], [colors.border.default, colors.border.gold]),
        colors.accent.gold,
      ],
    ),
    transform: [
      {
        scale: pop.value + pulse.value * 0.05,
      },
    ],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [motion.scale.checkFrom, 1]),
      },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [
        interpolateColor(pulse.value, [0, 1], [colors.text.helper, colors.text.secondary]),
        colors.text.primary,
      ],
    ),
  }));

  return (
    <Animated.View style={styles.row}>
      <Animated.View style={[styles.mark, markStyle]}>
        <Animated.View style={[styles.check, checkStyle]} />
      </Animated.View>
      <Animated.Text
        allowFontScaling
        maxFontSizeMultiplier={1.5}
        style={[textVariants.body, styles.label, labelStyle]}
      >
        {label}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
  },
  mark: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 10,
    height: 6,
    marginTop: -1,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.action.primaryText,
    transform: [{ rotate: '-45deg' }],
  },
  label: {
    flex: 1,
  },
});
