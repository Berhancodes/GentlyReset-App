import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { MOTION_EASING_STANDARD, motion } from '@/design-system/motion';
import { hapticImpact, hapticSuccess } from '@/utils/haptics';

const PRESS_TRAVEL = motion.offset.press;
const PRESS_DURATION_MS = `${motion.duration.press}ms`;
const PRESS_EASING = `cubic-bezier(${MOTION_EASING_STANDARD[0]}, ${MOTION_EASING_STANDARD[1]}, ${MOTION_EASING_STANDARD[2]}, ${MOTION_EASING_STANDARD[3]})`;

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
      style={styles.base}
    >
      {({ pressed }) => {
        const isPressed = pressed && !disabled;

        return (
          <>
            {disabled ? null : <View pointerEvents="none" style={styles.lip} />}
            {disabled ? null : (
              <View
                pointerEvents="none"
                style={[styles.shadow, isPressed ? styles.shadowPressed : null]}
              />
            )}
            <View
              style={[
                styles.face,
                disabled ? styles.faceDisabled : styles.faceEnabled,
                isPressed ? styles.facePressed : null,
              ]}
            >
              <Text
                allowFontScaling
                maxFontSizeMultiplier={1.4}
                style={[styles.label, disabled ? styles.labelDisabled : styles.labelEnabled]}
              >
                {label}
              </Text>
            </View>
          </>
        );
      }}
    </Pressable>
  );
}

const webPressTransition =
  Platform.OS === 'web'
    ? {
        transitionProperty: 'transform',
        transitionDuration: PRESS_DURATION_MS,
        transitionTimingFunction: PRESS_EASING,
      }
    : null;

const styles = StyleSheet.create({
  base: {
    position: 'relative',
    paddingBottom: PRESS_TRAVEL,
  },
  lip: {
    ...StyleSheet.absoluteFill,
    top: PRESS_TRAVEL,
    borderRadius: radius.pill,
    backgroundColor: colors.action.primaryBackgroundPressed,
  },
  shadow: {
    ...StyleSheet.absoluteFill,
    top: PRESS_TRAVEL,
    borderRadius: radius.pill,
    backgroundColor: colors.action.primaryBackgroundPressed,
    ...shadows.button,
    ...webPressTransition,
  },
  shadowPressed: {
    opacity: 0.2,
  },
  face: {
    minHeight: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...webPressTransition,
  },
  faceEnabled: {
    backgroundColor: colors.action.primaryBackground,
  },
  faceDisabled: {
    backgroundColor: colors.action.primaryBackgroundDisabled,
  },
  facePressed: {
    backgroundColor: colors.action.primaryBackgroundPressed,
    transform: [{ translateY: PRESS_TRAVEL }, { scale: motion.scale.press }],
  },
  label: {
    ...textVariants.button,
  },
  labelEnabled: {
    color: colors.action.primaryText,
  },
  labelDisabled: {
    color: colors.action.primaryTextDisabled,
  },
});
