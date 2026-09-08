import { Platform, type TextStyle } from 'react-native';

/**
 * Swap these family names when custom files are added to assets/fonts.
 * Components should read from textVariants rather than setting fontFamily inline.
 */
export const fontFamilies = {
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) ?? 'System',
  rounded:
    Platform.select({
      ios: 'ui-rounded',
      android: 'sans-serif-medium',
      default: 'System',
    }) ?? 'System',
} as const;

export const fontSizes = {
  xs: 13,
  sm: 15,
  md: 17,
  lg: 20,
  xl: 28,
  question: 30,
  display: 34,
} as const;

export const lineHeights = {
  xs: 18,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 34,
  question: 36,
  display: 40,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

export const textVariants = {
  display: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.6,
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.regular,
  },
  label: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.4,
  },
  button: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.semibold,
  },
  navTitle: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.semibold,
  },
  questionTitle: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.question,
    lineHeight: lineHeights.question,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.45,
  },
  questionHelper: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    lineHeight: 22,
    fontWeight: fontWeights.medium,
  },
  optionLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.medium,
  },
  optionTitle: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.semibold,
  },
  optionSubtitle: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.regular,
  },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
