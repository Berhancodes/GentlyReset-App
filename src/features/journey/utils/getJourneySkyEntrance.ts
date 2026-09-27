import { motion } from '../../../design-system/motion';

import type { JourneyRect, JourneyStageLayout } from '../layout/journeyStageLayout';

export type JourneySkyPieces = {
  sun: JourneyRect;
  leftCloud: JourneyRect | undefined;
  upperCloud: JourneyRect | undefined;
  rightCloud: JourneyRect | undefined;
};

export type JourneySkyEntranceStart = {
  sunX: number;
  sunY: number;
  leftX: number;
  leftY: number;
  rightX: number;
  rightY: number;
  upperX: number;
  upperY: number;
  upperOpacity: number;
};

const REST: JourneySkyEntranceStart = {
  sunX: 0,
  sunY: 0,
  leftX: 0,
  leftY: 0,
  rightX: 0,
  rightY: 0,
  upperX: 0,
  upperY: 0,
  upperOpacity: 1,
};

/** Existing layout order: left, small upper, right. */
export function getJourneySkyPieces(layout: JourneyStageLayout): JourneySkyPieces {
  return {
    sun: layout.sun,
    leftCloud: layout.clouds[0],
    upperCloud: layout.clouds[1],
    rightCloud: layout.clouds[2],
  };
}

function offscreenRight(rect: JourneyRect, stageWidth: number): number {
  return stageWidth - rect.left + motion.offset.journeySkyEdgePad;
}

function offscreenLeft(rect: JourneyRect): number {
  return -(rect.left + rect.width + motion.offset.journeySkyEdgePad);
}

/**
 * Temporary transform offsets. Layout left/top stay the final position.
 * Rest is always translate 0 / opacity 1.
 */
export function getJourneySkyEntranceStart(layout: JourneyStageLayout): JourneySkyEntranceStart {
  const pieces = getJourneySkyPieces(layout);
  const leftCloud = pieces.leftCloud;
  const rightCloud = pieces.rightCloud;
  const upperCloud = pieces.upperCloud;

  return {
    sunX: offscreenRight(pieces.sun, layout.width),
    sunY: motion.offset.journeySunRise,
    leftX: leftCloud ? offscreenLeft(leftCloud) : 0,
    leftY: motion.offset.journeyLeftCloudLift,
    rightX: rightCloud ? offscreenRight(rightCloud, layout.width) : 0,
    rightY: motion.offset.journeyRightCloudLift,
    upperX: upperCloud ? motion.offset.journeyUpperCloudX : 0,
    upperY: upperCloud ? motion.offset.journeyUpperCloudY : 0,
    upperOpacity: 0,
  };
}

export function getJourneySkyRest(): JourneySkyEntranceStart {
  return REST;
}
