import type { ImageSourcePropType } from 'react-native';

type SackFrame = {
  source: ImageSourcePropType;
  /** Trimmed sprite size in pixels. Every frame shares one scale, so he stays the same size. */
  width: number;
  height: number;
  /** How far his body's centre sits right of the image centre, in sprite pixels. */
  bodyOffset: number;
};

/**
 * The opening screen's set-down, in order: he carries the sack, sinks a step
 * as each worry lands, then rests beside it.
 */
export const WELCOME_SACK_FRAMES: readonly SackFrame[] = [
  {
    source: require('../../../../assets/images/mascot/stage/carry-sack.png'),
    width: 549,
    height: 490,
    bodyOffset: 61,
  },
  {
    source: require('../../../../assets/images/mascot/stage/sack-2-stop.png'),
    width: 558,
    height: 499,
    bodyOffset: 56,
  },
  {
    source: require('../../../../assets/images/mascot/stage/sack-3-lower.png'),
    width: 524,
    height: 472,
    bodyOffset: 39,
  },
  {
    source: require('../../../../assets/images/mascot/stage/sack-4-touch.png'),
    width: 507,
    height: 477,
    bodyOffset: 31,
  },
  {
    source: require('../../../../assets/images/mascot/stage/sack-5-exhale.png'),
    width: 542,
    height: 481,
    bodyOffset: 36,
  },
  {
    source: require('../../../../assets/images/mascot/stage/sack-down.png'),
    width: 464,
    height: 449,
    bodyOffset: 37,
  },
];

/** The carrying frame's height; the stage sizes him by it. */
export const WELCOME_SACK_REFERENCE_HEIGHT = 490;
export const WELCOME_SACK_LAST_FRAME = WELCOME_SACK_FRAMES.length - 1;
