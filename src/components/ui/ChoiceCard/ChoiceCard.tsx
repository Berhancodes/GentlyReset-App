import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/design-system';
import { hapticSelection, hapticSuccess } from '@/utils/haptics';

export type ChoiceCardVariant = 'row' | 'tile';

type ChoiceCardProps = {
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  variant?: ChoiceCardVariant;
  leading?: ReactNode;
  showIndicator?: boolean;
  haptic?: 'selection' | 'success' | 'none';
  onPress: () => void;
};

export function ChoiceCard({
  label,
  description,
  selected = false,
  disabled = false,
  variant = 'row',
  leading,
  showIndicator,
  haptic = 'selection',
  onPress,
}: ChoiceCardProps) {
  const isTile = variant === 'tile';
  const indicatorVisible = showIndicator ?? !isTile;

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
        isTile ? styles.tile : styles.row,
        selected ? styles.selected : styles.idle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={[styles.copy, isTile && styles.copyTile]}>
        <AppText
          variant={description ? 'optionTitle' : isTile ? 'optionLabel' : 'optionTitle'}
          color={disabled ? 'muted' : 'primary'}
          align={isTile ? 'center' : 'left'}
        >
          {label}
        </AppText>
        {description ? (
          <AppText variant="optionSubtitle" color="secondary" align={isTile ? 'center' : 'left'}>
            {description}
          </AppText>
        ) : null}
      </View>
      {indicatorVisible ? (
        <View
          style={[styles.indicator, selected ? styles.indicatorSelected : styles.indicatorIdle]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {selected ? (
            <AppText variant="caption" color="inverse" align="center">
              ✓
            </AppText>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.surface.choice,
  },
  row: {
    minHeight: 64,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tile: {
    minHeight: 112,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  idle: {
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  selected: {
    backgroundColor: colors.surface.choiceSelected,
    borderWidth: 1,
    borderColor: colors.accent.gold,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
  leading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  copyTile: {
    flex: 0,
    alignItems: 'center',
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIdle: {
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: 'transparent',
  },
  indicatorSelected: {
    backgroundColor: colors.text.primary,
  },
});
