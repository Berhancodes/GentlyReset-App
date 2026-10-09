import type { MascotAnimation } from './mascotAnimations';

export const MASCOT_SOURCE_WIDTH = 720;
export const MASCOT_SOURCE_HEIGHT = 1280;

type MascotStartBounds = {
  centerX: number;
  height: number;
  feetY: number;
};

/**
 * Neutral-pose character bounds from the first frame of each clip.
 * Idle is the planted Home registration; other clips are zoomed out / higher.
 */
export const MASCOT_START_BOUNDS: Record<MascotAnimation, MascotStartBounds> = {
  idle: { centerX: 361, height: 760, feetY: 1099 },
  wave: { centerX: 361.5, height: 758, feetY: 1047 },
  jump: { centerX: 356, height: 673, feetY: 959 },
  hug: { centerX: 355, height: 675, feetY: 961 },
  wiggle: { centerX: 354.5, height: 673, feetY: 959 },
};

const REFERENCE = MASCOT_START_BOUNDS.idle;
const SOURCE_CENTER_X = MASCOT_SOURCE_WIDTH / 2;
const SOURCE_CENTER_Y = MASCOT_SOURCE_HEIGHT / 2;

export type MascotClipAlign = {
  scale: number;
  sourceTranslateX: number;
  sourceTranslateY: number;
};

export function getMascotClipAlign(animation: MascotAnimation): MascotClipAlign {
  const bounds = MASCOT_START_BOUNDS[animation];
  const scale = REFERENCE.height / bounds.height;
  const scaledCenterX = SOURCE_CENTER_X + (bounds.centerX - SOURCE_CENTER_X) * scale;
  const scaledFeetY = SOURCE_CENTER_Y + (bounds.feetY - SOURCE_CENTER_Y) * scale;

  return {
    scale,
    sourceTranslateX: REFERENCE.centerX - scaledCenterX,
    sourceTranslateY: REFERENCE.feetY - scaledFeetY,
  };
}

export function getMascotClipTransform(
  animation: MascotAnimation,
  frameWidth: number,
  frameHeight: number,
) {
  const align = getMascotClipAlign(animation);
  const containScale = Math.min(
    frameWidth / MASCOT_SOURCE_WIDTH,
    frameHeight / MASCOT_SOURCE_HEIGHT,
  );

  return {
    transformOrigin: 'center' as const,
    transform: [
      { translateX: align.sourceTranslateX * containScale },
      { translateY: align.sourceTranslateY * containScale },
      { scale: align.scale },
    ],
  };
}
