import type { ImageSourcePropType } from 'react-native';

import { colors } from '@/design-system';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';

/**
 * One falling piece, as fractions of the screen. `x` / `y` is the mid-fall
 * position; each piece drifts down `fall` screen-heights per loop.
 */
export type JourneyFallingPieceSpec = {
  x: number;
  y: number;
  /** Width as a fraction of screen width. */
  size: number;
  rotate: number;
  fall: number;
  delay: number;
};

export type JourneySeasonParticles =
  | {
      kind: 'image';
      source: ImageSourcePropType;
      /** Height / width of the art. */
      aspect: number;
      pieces: readonly JourneyFallingPieceSpec[];
    }
  | {
      kind: 'snow';
      pieces: readonly JourneyFallingPieceSpec[];
    };

export type JourneySeasonScene = {
  background: ImageSourcePropType;
  /** Tint for the mascot's ground shadow, matched to the painted ground. */
  shadowTint: string;
  particles: JourneySeasonParticles;
};

/** Leaves and petals: resting spots match the Day 1 mockups. */
const DRIFTING_PIECES: readonly JourneyFallingPieceSpec[] = [
  { x: 0.82, y: 0.29, size: 0.075, rotate: -28, fall: 0.22, delay: 0 },
  { x: 0.31, y: 0.36, size: 0.072, rotate: 32, fall: 0.2, delay: 2400 },
  { x: 0.71, y: 0.41, size: 0.06, rotate: -40, fall: 0.18, delay: 4800 },
  { x: 0.39, y: 0.28, size: 0.035, rotate: 18, fall: 0.16, delay: 6200 },
  { x: 0.83, y: 0.39, size: 0.032, rotate: 50, fall: 0.15, delay: 3600 },
];

/** Petals are smaller than leaves. */
const PETAL_PIECES: readonly JourneyFallingPieceSpec[] = DRIFTING_PIECES.map((piece) => ({
  ...piece,
  size: piece.size * 0.6,
}));

const SNOW_PIECES: readonly JourneyFallingPieceSpec[] = [
  { x: 0.12, y: 0.24, size: 0.018, rotate: 0, fall: 0.3, delay: 0 },
  { x: 0.27, y: 0.34, size: 0.012, rotate: 0, fall: 0.28, delay: 1800 },
  { x: 0.44, y: 0.26, size: 0.016, rotate: 0, fall: 0.3, delay: 5200 },
  { x: 0.58, y: 0.38, size: 0.011, rotate: 0, fall: 0.26, delay: 900 },
  { x: 0.7, y: 0.28, size: 0.02, rotate: 0, fall: 0.32, delay: 3300 },
  { x: 0.86, y: 0.35, size: 0.013, rotate: 0, fall: 0.28, delay: 6100 },
  { x: 0.18, y: 0.45, size: 0.014, rotate: 0, fall: 0.24, delay: 4200 },
  { x: 0.78, y: 0.47, size: 0.016, rotate: 0, fall: 0.24, delay: 7400 },
  { x: 0.92, y: 0.22, size: 0.012, rotate: 0, fall: 0.3, delay: 2600 },
  { x: 0.05, y: 0.4, size: 0.015, rotate: 0, fall: 0.26, delay: 8000 },
];

export const JOURNEY_SEASON_SCENES: Record<JourneySeason, JourneySeasonScene> = {
  spring: {
    background: require('../../../../assets/journey/seasons/spring/spring-background.png'),
    shadowTint: colors.journeyShadow.rose,
    particles: {
      kind: 'image',
      source: require('../../../../assets/journey/seasons/spring/spring-petal.png'),
      aspect: 1,
      pieces: PETAL_PIECES,
    },
  },
  summer: {
    background: require('../../../../assets/journey/seasons/summer/summer-background.png'),
    shadowTint: colors.journeyShadow.warm,
    particles: {
      kind: 'image',
      source: require('../../../../assets/journey/seasons/summer/summer-leaf.png'),
      aspect: 73 / 113,
      pieces: DRIFTING_PIECES,
    },
  },
  autumn: {
    background: require('../../../../assets/journey/seasons/autumn/autumn-background.png'),
    shadowTint: colors.journeyShadow.warm,
    particles: {
      kind: 'image',
      source: require('../../../../assets/journey/seasons/autumn/autumn-leaf-red.png'),
      aspect: 73 / 113,
      pieces: DRIFTING_PIECES,
    },
  },
  winter: {
    background: require('../../../../assets/journey/seasons/winter/winter-background.png'),
    shadowTint: colors.journeyShadow.cool,
    particles: { kind: 'snow', pieces: SNOW_PIECES },
  },
};
