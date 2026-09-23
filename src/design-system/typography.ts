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
  tab: 11,
  xs: 13,
  statLabel: 14,
  sm: 15,
  statValue: 18,
  md: 17,
  lg: 20,
  nav: 22,
  xl: 28,
  question: 36,
  questionHelper: 18,
  onboardingChoice: 18,
  onboardingChoiceTitle: 20,
  journalHero: 32,
  display: 34,
  hero: 52,
} as const;

export const lineHeights = {
  tab: 14,
  xs: 18,
  statLabel: 16,
  sm: 20,
  statValue: 20,
  md: 24,
  lg: 28,
  nav: 28,
  xl: 34,
  question: 43,
  questionHelper: 26,
  onboardingChoice: 24,
  onboardingChoiceTitle: 29,
  journalHero: 36,
  display: 40,
  hero: 58,
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
  journeyDay: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.hero,
    lineHeight: lineHeights.hero,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.9,
  },
  journeyTask: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg,
    lineHeight: 26,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.25,
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
    fontSize: fontSizes.nav,
    lineHeight: lineHeights.nav,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.35,
  },
  tabHeaderSubtitle: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.medium,
  },
  tabLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    lineHeight: lineHeights.tab,
    fontWeight: fontWeights.medium,
  },
  tabLabelActive: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    lineHeight: lineHeights.tab,
    fontWeight: fontWeights.semibold,
  },
  questionTitle: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.question,
    lineHeight: lineHeights.question,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.45,
  },
  journalHero: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.journalHero,
    lineHeight: lineHeights.journalHero,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  },
  questionHelper: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    lineHeight: 22,
    fontWeight: fontWeights.medium,
  },
  onboardingHelper: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.questionHelper,
    lineHeight: lineHeights.questionHelper,
    fontWeight: fontWeights.medium,
  },
  onboardingChoice: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.onboardingChoice,
    lineHeight: lineHeights.onboardingChoice,
    fontWeight: fontWeights.medium,
  },
  onboardingChoiceTitle: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.onboardingChoiceTitle,
    lineHeight: lineHeights.onboardingChoiceTitle,
    fontWeight: fontWeights.semibold,
  },
  onboardingChoiceSubtitle: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.onboardingChoice,
    lineHeight: lineHeights.onboardingChoice,
    fontWeight: fontWeights.regular,
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
  moodLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    lineHeight: lineHeights.tab,
    fontWeight: fontWeights.medium,
  },
  moodLabelSelected: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    lineHeight: lineHeights.tab,
    fontWeight: fontWeights.bold,
  },
  notebookDate: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.medium,
  },
  notebookHeading: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
  notebookPrompt: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.regular,
  },
  journalSave: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.semibold,
  },
  worldHeroQuote: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg,
    lineHeight: 28,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
  worldStatValue: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.statValue,
    lineHeight: lineHeights.statValue,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.3,
  },
  worldStatLabel: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.statLabel,
    lineHeight: lineHeights.statLabel,
    fontWeight: fontWeights.medium,
  },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
