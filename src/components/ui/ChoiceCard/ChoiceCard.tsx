import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/design-system';
import { hapticSelection, hapticSuccess } from '@/utils/haptics';

export type ChoiceCardVariant = 'row' | 'tile' | 'illustrated';

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
  const isIllustrated = variant === 'illustrated';
  const indicatorVisible = showIndicator ?? (!isTile && !isIllustrated);

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
        isIllustrated ? styles.illustrated : isTile ? styles.tile : styles.row,
        selected ? styles.selected : isIllustrated ? styles.illustratedIdle : styles.idle,
        isIllustrated ? shadows.soft : null,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={[styles.copy, (isTile || isIllustrated) && styles.copyTile]}>
        <AppText
          variant={
            description ? 'optionTitle' : isTile || isIllustrated ? 'optionLabel' : 'optionTitle'
          }
          color={disabled ? 'muted' : 'primary'}
          align={isTile || isIllustrated ? 'center' : 'left'}
          numberOfLines={isIllustrated ? 3 : undefined}
        >
          {label}
        </AppText>
        {description ? (
          <AppText variant="optionSubtitle" color="secondary" align={isTile ? 'center' : 'left'}>
            {description}
          </AppText>
        ) : null}
      </View>
      {isIllustrated && selected ? (
        <View
          style={[styles.indicator, styles.indicatorSelected, styles.illustratedCheck]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <AppText variant="caption" color="inverse" align="center">
            ✓
          </AppText>
        </View>
      ) : null}
      {indicatorVisible && selected ? (
        <View
          style={[styles.indicator, styles.indicatorSelected]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <AppText variant="caption" color="inverse" align="center">
            ✓
          </AppText>
        </View>
      ) : indicatorVisible ? (
        <View
          style={styles.indicatorSpacer}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
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
  illustrated: {
    minHeight: 124,
    flex: 1,
    paddingTop: 14,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.xs,
  },
  idle: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  illustratedIdle: {
    borderWidth: 1,
    borderColor: colors.border.default,
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
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  copyTile: {
    flex: 0,
    alignItems: 'center',
    width: '100%',
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: {
    backgroundColor: colors.text.primary,
  },
  illustratedCheck: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 20,
    height: 20,
  },
  indicatorSpacer: {
    width: 22,
    height: 22,
  },
});
