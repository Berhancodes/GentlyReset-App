import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, radius, spacing, textVariants } from '@/design-system';
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

  useEffect(() => {
    enabledProgress.value = withTiming(disabled ? 0 : 1, {
      duration: reduceMotion ? 0 : motion.duration.selection,
      easing: Easing.out(Easing.cubic),
    });
  }, [disabled, enabledProgress, reduceMotion]);

  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      enabledProgress.value,
      [0, 1],
      [colors.action.primaryBackgroundDisabled, colors.action.primaryBackground],
    ),
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
      onPress={() => {
        if (haptic === 'light') {
          void hapticImpact();
        }
        if (haptic === 'success') {
          void hapticSuccess();
        }
        onPress();
      }}
      style={({ pressed }) => [styles.base, pressed && !disabled ? styles.pressed : null]}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
      <Animated.Text
        allowFontScaling
        maxFontSizeMultiplier={1.4}
        style={[styles.label, labelStyle]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.xxl,
    pointerEvents: 'none',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...textVariants.button,
  },
});
