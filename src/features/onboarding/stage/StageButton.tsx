import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontWeights, radius, spacing, textVariants } from '@/design-system';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { hapticImpact } from '@/utils/haptics';

type StageButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

/** The clean stage's flat dark pill. Disabled turns a soft taupe instead of fading. */
export function StageButton({ label, onPress, disabled = false }: StageButtonProps) {
  const text = capitalizeHeading(label);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        void hapticImpact();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: spacing.xxl + spacing.xxs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.cta,
    shadowColor: colors.stage.ctaGlow,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  disabled: {
    backgroundColor: colors.stage.ctaDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    backgroundColor: colors.stage.ctaPressed,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...textVariants.button,
    fontWeight: fontWeights.heavy,
    color: colors.text.inverse,
  },
});
