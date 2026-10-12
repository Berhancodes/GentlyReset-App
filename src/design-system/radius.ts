export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  tabItem: 20,
  card: 20,
  xl: 24,
  tabBar: 40,
  xxl: 32,
  homeBubble: 20,
  onboardingBubble: 25,
  statsPanel: 24,
  quote: 36,
  pill: 999,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof typeof radius;
