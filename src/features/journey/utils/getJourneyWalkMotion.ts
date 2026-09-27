import { MOTION_EASING_JOURNEY_WALK, motion } from '../../../design-system/motion';

export type JourneyWalkDirection = 1 | -1;

export const JOURNEY_WALK_LAYERS = {
  foreground: motion.offset.journeyParallaxForeground,
  sign: motion.offset.journeyParallaxSign,
  bush: motion.offset.journeyParallaxBush,
  cloudFar: motion.offset.journeyParallaxCloudFar,
  cloud: motion.offset.journeyParallaxCloud,
  sun: motion.offset.journeyParallaxSun,
} as const;

export function getJourneyWalkDirection(fromDay: number, toDay: number): JourneyWalkDirection {
  return toDay < fromDay ? -1 : 1;
}

/** Decorative world moves opposite the mascot. Progress 0–1, already eased. */
export function getJourneyParallaxOffset(
  progress: number,
  direction: JourneyWalkDirection,
  amount: number,
): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return -clamped * amount * direction;
}

function cubicComponent(time: number, startHandle: number, endHandle: number): number {
  const inverse = 1 - time;
  return (
    3 * inverse * inverse * time * startHandle +
    3 * inverse * time * time * endHandle +
    time * time * time
  );
}

function cubicDerivative(time: number, startHandle: number, endHandle: number): number {
  const inverse = 1 - time;
  return (
    3 * inverse * inverse * startHandle +
    6 * inverse * time * (endHandle - startHandle) +
    3 * time * time * (1 - endHandle)
  );
}

function solveCubicTime(progress: number, x1: number, x2: number): number {
  let time = progress;
  for (let iteration = 0; iteration < 8; iteration += 1) {
    const current = cubicComponent(time, x1, x2) - progress;
    const slope = cubicDerivative(time, x1, x2);
    if (Math.abs(slope) < 1e-6) {
      break;
    }
    time = Math.min(1, Math.max(0, time - current / slope));
  }
  return time;
}

/** Sample the walk cubic-bezier so tests can check mid-walk linearity. */
export function sampleJourneyWalkEased(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  const [x1, y1, x2, y2] = MOTION_EASING_JOURNEY_WALK;
  const time = solveCubicTime(clamped, x1, x2);
  return cubicComponent(time, y1, y2);
}

export function getJourneyWalkTranslate(progress: number, travelDistance: number): number {
  return sampleJourneyWalkEased(progress) * travelDistance;
}
