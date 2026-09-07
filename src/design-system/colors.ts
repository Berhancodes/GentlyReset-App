const palette = {
  cream: '#FFF8EA',
  creamSoft: '#FFFDF8',
  creamPeach: '#F8E6D4',
  creamMuted: '#F3E6D4',
  creamDisabledText: '#F6EDE2',
  brown: '#4A2C18',
  brownDeep: '#3A2112',
  brownSecondary: '#8B5A32',
  brownDisabled: '#C4A88F',
  gold: '#E6B84A',
  peach: '#EFAE82',
  sage: '#8E9B63',
  blue: '#8799A0',
  sand: '#E8D7C3',
  sandSubtle: '#F0E4D4',
  sandTrack: '#EAD9C4',
  white: '#FFFFFF',
} as const;

/**
 * Semantic color tokens. Components should consume these names, never raw hex.
 * Raw palette values stay in this file so the visual language can shift in one place.
 */
export const colors = {
  background: {
    primary: palette.cream,
    secondary: palette.creamSoft,
    inverse: palette.brown,
  },
  surface: {
    primary: palette.creamSoft,
    raised: palette.white,
    selected: palette.creamPeach,
    disabled: palette.creamMuted,
  },
  text: {
    primary: palette.brown,
    secondary: palette.brownSecondary,
    muted: palette.blue,
    inverse: palette.cream,
  },
  accent: {
    gold: palette.gold,
    peach: palette.peach,
    sage: palette.sage,
    blue: palette.blue,
  },
  border: {
    default: palette.sand,
    selected: palette.brown,
    subtle: palette.sandSubtle,
  },
  action: {
    primaryBackground: palette.brown,
    primaryBackgroundPressed: palette.brownDeep,
    primaryBackgroundDisabled: palette.brownDisabled,
    primaryText: palette.cream,
    primaryTextDisabled: palette.creamDisabledText,
  },
  progress: {
    track: palette.sandSubtle,
    fill: palette.brown,
  },
  overlay: {
    scrim: 'rgba(74, 44, 24, 0.35)',
  },
} as const;

export type Colors = typeof colors;
