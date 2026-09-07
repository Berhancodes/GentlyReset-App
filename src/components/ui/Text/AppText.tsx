import type { ReactNode } from 'react';
import { Text, type TextProps } from 'react-native';

import { colors, textVariants, type TextVariant } from '@/design-system';

const colorMap = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  inverse: colors.text.inverse,
  gold: colors.accent.gold,
} as const;

export type AppTextColor = keyof typeof colorMap;

type AppTextProps = Omit<TextProps, 'style'> & {
  variant?: TextVariant;
  color?: AppTextColor;
  align?: 'left' | 'center' | 'right';
  children: ReactNode;
};

const HEADER_VARIANTS: ReadonlySet<TextVariant> = new Set(['display', 'title']);

export function AppText({
  variant = 'body',
  color = 'primary',
  align = 'left',
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
      style={[textVariants[variant], { color: colorMap[color], textAlign: align }]}
    >
      {children}
    </Text>
  );
}
