import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { MOTION_EASING_STANDARD, motion } from '@/design-system/motion';
import { hapticImpact, hapticSuccess } from '@/utils/haptics';
import { MascotIcon } from '../MascotIcon';

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
  /** Gold face for the paywall unlock CTA; cream face over illustrations; cocoa for onboarding. Default stays the brown primary. */
  tone?: 'primary' | 'gold' | 'cream' | 'cocoa';
  /** Compact height for the paywall unlock button. */
  size?: 'default' | 'compact';
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  accessibilityHint,
  haptic = 'light',
  showArrow = false,
  tone = 'primary',
  size = 'default',
}: PrimaryButtonProps) {
  const isGold = tone === 'gold';
  const isCream = tone === 'cream';
  const isCocoa = tone === 'cocoa';
  const isCompact = size === 'compact';
  const showDepth = isGold || !disabled;
  const arrowColor = isGold
    ? colors.action.saveText
    : isCream
      ? colors.text.primary
      : disabled
        ? colors.action.primaryTextDisabled
        : colors.action.primaryText;
  const arrowSize = isCompact ? 18 : 20;
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
            {showDepth ? (
              <View
                pointerEvents="none"
                style={[
                  styles.lip,
                  isGold ? styles.lipGold : null,
                  isCream ? styles.lipCream : null,
                  isCocoa ? styles.lipCocoa : null,
                ]}
              />
            ) : null}
            {showDepth ? (
              <View
                pointerEvents="none"
                style={[
                  styles.shadow,
                  isGold ? styles.shadowGold : null,
                  isCream ? styles.lipCream : null,
                  isCocoa ? styles.lipCocoa : null,
                  isPressed ? styles.shadowPressed : null,
                ]}
              />
            ) : null}
            <View
              style={[
                styles.face,
                isCompact ? styles.faceCompact : null,
                disabled
                  ? isGold
                    ? styles.faceGoldDisabled
                    : styles.faceDisabled
                  : isGold
                    ? styles.faceGold
                    : isCream
                      ? styles.faceCream
                      : isCocoa
                        ? styles.faceCocoa
                        : styles.faceEnabled,
                isPressed
                  ? isGold
                    ? styles.faceGoldPressed
                    : isCream
                      ? styles.faceCreamPressed
                      : isCocoa
                        ? styles.faceCocoaPressed
                        : styles.facePressed
                  : null,
              ]}
            >
              <Text
                allowFontScaling
                maxFontSizeMultiplier={1.4}
                style={[
                  styles.label,
                  disabled
                    ? isGold
                      ? styles.labelGold
                      : styles.labelDisabled
                    : isGold
                      ? styles.labelGold
                      : isCream
                        ? styles.labelCream
                        : styles.labelEnabled,
                ]}
              >
                {label}
              </Text>
              {showArrow ? (
                <View pointerEvents="none" style={styles.arrow}>
                  <MascotIcon name="arrow" size={arrowSize} color={arrowColor} />
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
  faceCompact: {
    minHeight: spacing.hitTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
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
  faceGoldDisabled: {
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
  faceCream: {
    backgroundColor: colors.surface.primary,
  },
  faceCreamPressed: {
    backgroundColor: colors.surface.selected,
    transform: [{ translateY: PRESS_TRAVEL }, { scale: motion.scale.press }],
  },
  faceCocoa: {
    backgroundColor: colors.stage.cta,
  },
  faceCocoaPressed: {
    backgroundColor: colors.stage.ctaPressed,
    transform: [{ translateY: PRESS_TRAVEL }, { scale: motion.scale.press }],
  },
  lipCocoa: {
    backgroundColor: colors.stage.ctaPressed,
  },
  lipCream: {
    backgroundColor: colors.border.default,
  },
  labelCream: {
    color: colors.text.primary,
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
