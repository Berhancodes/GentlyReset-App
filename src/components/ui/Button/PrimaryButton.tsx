import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, textVariants } from '@/design-system';
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
      style={({ pressed }) => [
        styles.base,
        disabled ? styles.disabled : styles.enabled,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Text
        allowFontScaling
        maxFontSizeMultiplier={1.4}
        style={[styles.label, disabled ? styles.labelDisabled : styles.labelEnabled]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  enabled: {
    backgroundColor: colors.action.primaryBackground,
  },
  disabled: {
    backgroundColor: colors.action.primaryBackgroundDisabled,
  },
  pressed: {
    backgroundColor: colors.action.primaryBackgroundPressed,
    transform: [{ scale: 0.98 }],
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
