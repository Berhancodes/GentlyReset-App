import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, radius, shadows, spacing, textVariants } from '@/design-system';
import { hapticImpact, hapticSuccess } from '@/utils/haptics';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
  haptic?: 'light' | 'success' | 'none';
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  accessibilityHint,
  haptic = 'light',
}: PrimaryButtonProps) {
  const reduceMotion = useReducedMotion();
  const enabledProgress = useSharedValue(disabled ? 0 : 1);
  const pressProgress = useSharedValue(0);

  useEffect(() => {
    enabledProgress.value = withTiming(disabled ? 0 : 1, {
      duration: reduceMotion ? 0 : motion.duration.selection,
      easing: Easing.out(Easing.cubic),
    });
  }, [disabled, enabledProgress, reduceMotion]);

  const setPressed = (isPressed: boolean) => {
    if (disabled) {
      return;
    }

    if (reduceMotion) {
      pressProgress.value = isPressed ? 1 : 0;
      return;
    }

    pressProgress.value = isPressed
      ? withTiming(1, {
          duration: motion.duration.press,
          easing: Easing.out(Easing.quad),
        })
      : withSpring(0, motion.spring.release);
  };

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressProgress.value * motion.offset.press }],
    backgroundColor: interpolateColor(
      enabledProgress.value,
      [0, 1],
      [
        colors.action.primaryBackgroundDisabled,
        interpolateColor(
          pressProgress.value,
          [0, 1],
          [colors.action.primaryBackground, colors.action.primaryBackgroundPressed],
        ),
      ],
    ),
  }));

  const lipStyle = useAnimatedStyle(() => ({
    opacity: enabledProgress.value,
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: enabledProgress.value * (1 - pressProgress.value * 0.72),
    transform: [{ translateY: pressProgress.value * motion.offset.press * 0.35 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      enabledProgress.value,
      [0, 1],
      [colors.action.primaryTextDisabled, colors.action.primaryText],
    ),
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(false);
      }}
      onPress={() => {
        if (haptic === 'light') {
          void hapticImpact();
        }
        if (haptic === 'success') {
          void hapticSuccess();
        }
        onPress();
      }}
      style={styles.base}
    >
      <Animated.View pointerEvents="none" style={[styles.lip, lipStyle]} />
      <Animated.View pointerEvents="none" style={[styles.shadow, shadowStyle]} />
      <Animated.View style={[styles.face, faceStyle]}>
        <Animated.Text
          allowFontScaling
          maxFontSizeMultiplier={1.4}
          style={[styles.label, labelStyle]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'relative',
    paddingBottom: motion.offset.press,
  },
  lip: {
    ...StyleSheet.absoluteFill,
    top: motion.offset.press,
    borderRadius: radius.xxl,
    backgroundColor: colors.action.primaryBackgroundPressed,
  },
  shadow: {
    ...StyleSheet.absoluteFill,
    top: motion.offset.press,
    borderRadius: radius.xxl,
    backgroundColor: colors.action.primaryBackgroundPressed,
    ...shadows.button,
  },
  face: {
    minHeight: 56,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: {
    ...textVariants.button,
  },
});
