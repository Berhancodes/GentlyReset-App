import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';

type OnboardingTextButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function OnboardingTextButton({
  label,
  onPress,
  disabled = false,
}: OnboardingTextButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={spacing.sm}
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && !disabled && styles.pressed]}
    >
      <AppText variant="button" color={disabled ? 'muted' : 'secondary'} align="center">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
});
