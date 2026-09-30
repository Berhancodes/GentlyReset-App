import type { ReactNode } from 'react';
import { Text, StyleSheet, type TextProps } from 'react-native';

import { colors, textVariants, type TextVariant } from '@/design-system';

const colorMap = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  secondaryStrong: colors.text.secondaryStrong,
  muted: colors.text.muted,
  inverse: colors.text.inverse,
  gold: colors.accent.gold,
  helper: colors.text.helper,
} as const;

export type AppTextColor = keyof typeof colorMap;

type AppTextProps = Omit<TextProps, 'style'> & {
  variant?: TextVariant;
  color?: AppTextColor;
  align?: 'left' | 'center' | 'right';
  /** Stretch to the parent width so long labels wrap instead of spilling. */
  fillWidth?: boolean;
  children: ReactNode;
};

const HEADER_VARIANTS: ReadonlySet<TextVariant> = new Set([
  'display',
  'journeyDay',
  'title',
  'questionTitle',
  'storyTitle',
  'journalHero',
  'navTitle',
]);

export function AppText({
  variant = 'body',
  color = 'primary',
  align = 'left',
  fillWidth = false,
  children,
  allowFontScaling = true,
  maxFontSizeMultiplier,
  accessibilityRole,
  ...rest
}: AppTextProps) {
  const isHeader = HEADER_VARIANTS.has(variant);

  return (
    <Text
      {...rest}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? (isHeader ? 1.4 : 1.6)}
      accessibilityRole={accessibilityRole ?? (isHeader ? 'header' : undefined)}
      style={[
        textVariants[variant],
        { color: colorMap[color], textAlign: align },
        fillWidth ? styles.fillWidth : null,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  fillWidth: {
    width: '100%',
    maxWidth: '100%',
  },
});
