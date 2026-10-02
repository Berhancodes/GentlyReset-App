import Ionicons from '@expo/vector-icons/Ionicons';
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
  /** Trailing arrow, kept off the centered label (noticed-page continue). */
  showArrow?: boolean;
  /** Gold face for the paywall unlock CTA. Default stays the brown primary. */
  tone?: 'primary' | 'gold';
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  accessibilityHint,
  haptic = 'light',
  showArrow = false,
  tone = 'primary',
}: PrimaryButtonProps) {
  const isGold = tone === 'gold';
  const arrowColor = disabled
    ? colors.action.primaryTextDisabled
    : isGold
      ? colors.action.saveText
      : colors.action.primaryText;
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
            {disabled ? null : (
              <View pointerEvents="none" style={[styles.lip, isGold ? styles.lipGold : null]} />
            )}
            {disabled ? null : (
              <View
                pointerEvents="none"
                style={[
                  styles.shadow,
                  isGold ? styles.shadowGold : null,
                  isPressed ? styles.shadowPressed : null,
                ]}
              />
            )}
            <View
              style={[
                styles.face,
                disabled ? styles.faceDisabled : isGold ? styles.faceGold : styles.faceEnabled,
                isPressed ? (isGold ? styles.faceGoldPressed : styles.facePressed) : null,
              ]}
            >
              <Text
                allowFontScaling
                maxFontSizeMultiplier={1.4}
                style={[
                  styles.label,
                  disabled ? styles.labelDisabled : isGold ? styles.labelGold : styles.labelEnabled,
                ]}
              >
                {label}
              </Text>
              {showArrow ? (
                <View pointerEvents="none" style={styles.arrow}>
                  <Ionicons name="arrow-forward" size={20} color={arrowColor} />
                </View>
              ) : null}
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
  arrow: {
    position: 'absolute',
    right: spacing.md,
  },
  faceEnabled: {
    backgroundColor: colors.action.primaryBackground,
  },
  faceGold: {
    backgroundColor: colors.action.saveBackground,
  },
  faceDisabled: {
    backgroundColor: colors.action.primaryBackgroundDisabled,
  },
  facePressed: {
    backgroundColor: colors.action.primaryBackgroundPressed,
    transform: [{ translateY: PRESS_TRAVEL }, { scale: motion.scale.press }],
  },
  faceGoldPressed: {
    backgroundColor: colors.action.saveBackgroundPressed,
    transform: [{ translateY: PRESS_TRAVEL }, { scale: motion.scale.press }],
  },
  lipGold: {
    backgroundColor: colors.action.saveBackgroundPressed,
  },
  shadowGold: {
    backgroundColor: colors.action.saveBackgroundPressed,
  },
  label: {
    ...textVariants.button,
  },
  labelEnabled: {
    color: colors.action.primaryText,
  },
  labelGold: {
    color: colors.action.saveText,
  },
  labelDisabled: {
    color: colors.action.primaryTextDisabled,
  },
});
