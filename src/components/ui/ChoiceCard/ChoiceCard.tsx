import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/design-system';
import { hapticSelection, hapticSuccess } from '@/utils/haptics';

import { AppText } from '../Text';

type ChoiceCardProps = {
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  comfortable?: boolean;
  haptic?: 'selection' | 'success' | 'none';
  onPress: () => void;
};

export function ChoiceCard({
  label,
  description,
  selected = false,
  disabled = false,
  comfortable = false,
  haptic = 'selection',
  onPress,
}: ChoiceCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={description ? `${label}. ${description}` : label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => {
        if (haptic === 'selection') {
          void hapticSelection();
        }
        if (haptic === 'success') {
          void hapticSuccess();
        }
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        comfortable && styles.comfortable,
        selected ? styles.selected : styles.idle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.copy}>
        <AppText variant="body" color={disabled ? 'muted' : 'primary'}>
          {label}
        </AppText>
        {description ? (
          <AppText variant="caption" color="secondary">
            {description}
          </AppText>
        ) : null}
      </View>
      <View
        style={[styles.indicator, selected ? styles.indicatorSelected : styles.indicatorIdle]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {selected ? <View style={styles.indicatorDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.surface.raised,
    ...shadows.soft,
  },
  comfortable: {
    minHeight: 72,
    paddingVertical: spacing.lg,
  },
  idle: {
    borderColor: colors.border.default,
  },
  selected: {
    borderColor: colors.border.selected,
    backgroundColor: colors.surface.selected,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    backgroundColor: colors.surface.disabled,
    opacity: 0.7,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIdle: {
    borderColor: colors.border.default,
    backgroundColor: colors.surface.primary,
  },
  indicatorSelected: {
    borderColor: colors.text.primary,
    backgroundColor: colors.surface.raised,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
});
