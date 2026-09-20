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
  goldSoft: '#F4E4A8',
  goldDeep: '#C99A32',
  peach: '#EFAE82',
  peachSoft: '#F8E0D0',
  sage: '#8E9B63',
  sageSoft: '#E8EDD8',
  blue: '#8799A0',
  blueSoft: '#E4ECF0',
  sand: '#E8D7C3',
  sandSubtle: '#F0E4D4',
  sandTrack: '#EAD9C4',
  white: '#FFFFFF',
  night: '#152347',
  sky: '#C4D6E4',
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
    night: palette.night,
    sky: palette.sky,
  },
  surface: {
    primary: palette.creamSoft,
    raised: palette.white,
    selected: palette.creamPeach,
    disabled: palette.creamMuted,
    choice: palette.creamSoft,
    choiceSelected: palette.goldSoft,
    gold: palette.gold,
  },
  text: {
    primary: palette.brown,
    secondary: palette.brownSecondary,
    secondaryStrong: 'rgba(58, 33, 18, 0.82)',
    muted: palette.blue,
    inverse: palette.cream,
    helper: 'rgba(74, 44, 24, 0.64)',
  },
  accent: {
    gold: palette.gold,
    peach: palette.peach,
    sage: palette.sage,
    blue: palette.blue,
  },
  tint: {
    gold: palette.goldSoft,
    peach: palette.peachSoft,
    sage: palette.sageSoft,
    blue: palette.blueSoft,
  },
  border: {
    default: palette.sand,
    selected: palette.brown,
    subtle: palette.sandSubtle,
    gold: palette.gold,
  },
  action: {
    primaryBackground: palette.brown,
    primaryBackgroundPressed: palette.brownDeep,
    primaryBackgroundDisabled: palette.brownDisabled,
    primaryText: palette.cream,
    primaryTextDisabled: palette.creamDisabledText,
    saveBackground: palette.gold,
    saveBackgroundPressed: palette.goldDeep,
    saveText: palette.brown,
  },
  progress: {
    track: palette.sandSubtle,
    trackStrong: palette.sand,
    fill: palette.brown,
    fillGold: palette.gold,
  },
  overlay: {
    scrim: 'rgba(74, 44, 24, 0.35)',
    headerFadeStart: 'rgba(255, 253, 248, 0.62)',
    headerFadeMid: 'rgba(255, 248, 234, 0.36)',
    headerFadeEnd: 'rgba(255, 248, 234, 0)',
    clear: 'rgba(255, 253, 248, 0)',
  },
} as const;

export type Colors = typeof colors;
