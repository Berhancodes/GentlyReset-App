/**
 * 4-point spacing scale. Prefer these over one-off padding values.
 */
export const spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  hitTarget: 44,
  xxl: 48,
  xxxl: 64,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
