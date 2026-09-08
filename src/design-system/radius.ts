export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  tabItem: 18,
  card: 20,
  xl: 24,
  tabBar: 28,
  xxl: 32,
  pill: 999,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof typeof radius;
