import type { ImageSourcePropType } from 'react-native';

import type { StagePose } from './stagePoseNames';

export { STAGE_POSES, type StagePose } from './stagePoseNames';

type PoseArt = {
  source: ImageSourcePropType;
  /** Trimmed sprite size in pixels; sprites share one scale so he stays the same size. */
  width: number;
  height: number;
  /**
   * How far his body's centre sits right of the image centre, in sprite pixels.
   * Props like the sack or a raised arm widen the trim, so this re-centres him.
   */
  bodyOffset: number;
};

export const STAGE_POSE_ART: Record<StagePose, PoseArt> = {
  'idle-listen': {
    source: require('../../../../assets/images/mascot/stage/idle-listen.png'),
    width: 452,
    height: 498,
    bodyOffset: 9,
  },
  'react-warm': {
    source: require('../../../../assets/images/mascot/stage/react-warm.png'),
    width: 445,
    height: 479,
    bodyOffset: 4,
  },
  'react-thinking': {
    source: require('../../../../assets/images/mascot/stage/react-thinking.png'),
    width: 435,
    height: 491,
    bodyOffset: 8,
  },
  'react-low': {
    source: require('../../../../assets/images/mascot/stage/react-low.png'),
    width: 419,
    height: 473,
    bodyOffset: -34,
  },
  'react-oof': {
    source: require('../../../../assets/images/mascot/stage/react-oof.png'),
    width: 472,
    height: 496,
    bodyOffset: 6,
  },
  'react-hopeful': {
    source: require('../../../../assets/images/mascot/stage/react-hopeful.png'),
    width: 425,
    height: 478,
    bodyOffset: 4,
  },
  cheer: {
    source: require('../../../../assets/images/mascot/stage/cheer.png'),
    width: 426,
    height: 485,
    bodyOffset: 14,
  },
  'carry-sack': {
    source: require('../../../../assets/images/mascot/stage/carry-sack.png'),
    width: 549,
    height: 490,
    bodyOffset: 40,
  },
  'sack-down': {
    source: require('../../../../assets/images/mascot/stage/sack-down.png'),
    width: 464,
    height: 449,
    bodyOffset: 30,
  },
  'hold-hourglass': {
    source: require('../../../../assets/images/mascot/stage/hold-hourglass.png'),
    width: 444,
    height: 523,
    bodyOffset: -4,
  },
  'tuck-note': {
    source: require('../../../../assets/images/mascot/stage/tuck-note.png'),
    width: 428,
    height: 545,
    bodyOffset: 6,
  },
  'breathe-calm': {
    source: require('../../../../assets/images/mascot/stage/breathe-calm.png'),
    width: 480,
    height: 508,
    bodyOffset: -2,
  },
  'plant-sprout': {
    source: require('../../../../assets/images/mascot/stage/plant-sprout.png'),
    width: 491,
    height: 490,
    bodyOffset: 0,
  },
};

/** Sprite pixels to points at full stage size (idle is about 200pt tall). */
export const STAGE_POSE_SCALE = 0.4;
