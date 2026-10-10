import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
} from '@/design-system';

type StageChipProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  /** Multi-choice chips toggle; single-choice chips act like radio buttons. */
  multi?: boolean;
  onPress: () => void;
};

/** A soft cream pill answer. */
export const StageChip = forwardRef<View, StageChipProps>(function StageChip(
  { label, selected, disabled = false, multi = false, onPress },
  ref,
) {
  return (
    <Pressable
      ref={ref}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={multi ? { checked: selected, disabled } : { selected, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={styles.chipLabel} maxFontSizeMultiplier={1.4}>
        {label}
      </Text>
    </Pressable>
  );
});

type StageOptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** A full-width answer with a short description underneath. */
export const StageOptionCard = forwardRef<View, StageOptionCardProps>(function StageOptionCard(
  { label, description, selected, disabled = false, onPress },
  ref,
) {
  return (
    <Pressable
      ref={ref}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.chipSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={styles.cardLabel} maxFontSizeMultiplier={1.4}>
        {label}
      </Text>
      {description ? (
        <Text style={styles.cardDescription} maxFontSizeMultiplier={1.4}>
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
});

export function StageChipRow({ children }: { children: React.ReactNode }) {
  return (
    <View accessibilityRole="radiogroup" style={styles.row}>
      {children}
    </View>
  );
}

export function StageCardList({ children }: { children: React.ReactNode }) {
  return (
    <View accessibilityRole="radiogroup" style={styles.list}>
      {children}
    </View>
  );
}

const softShadow = {
  shadowColor: colors.stage.chipShadow,
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  list: {
    gap: spacing.xs,
  },
  chip: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    ...softShadow,
  },
  chipSelected: {
    borderColor: colors.stage.chipBorderSelected,
    backgroundColor: colors.stage.chipSelected,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  chipLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.stageChip,
    lineHeight: lineHeights.stageChip,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    textAlign: 'center',
  },
  card: {
    minHeight: spacing.hitTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    gap: spacing.none,
    ...softShadow,
  },
  cardLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  cardDescription: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.bold,
    color: colors.text.helper,
  },
});
