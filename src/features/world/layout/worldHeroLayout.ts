/**
 * Intrinsic size of `world-friends-background.png`.
 * Chosen production landscape: two mascots on a log, tree left, cabin right, sunset.
 */
export const WORLD_HERO_ART = {
  width: 853,
  height: 1844,
} as const;

export const WORLD_HERO_ART_ASPECT = WORLD_HERO_ART.width / WORLD_HERO_ART.height;

/**
 * Hero share of a tall phone. The page scrolls — do not shrink this to
 * fit cards in one viewport. Keep in 0.48–0.55 so sky, mascots, and grass
 * under the log read as a real landscape band.
 */
export const WORLD_HERO_FLEX = 0.52;

/** Floor so short phones still get a generous landscape, then scroll. */
export const WORLD_HERO_MIN_HEIGHT = 420;

/**
 * Image-space y (0–1) where the hero frame ends: foreground grass just
 * beneath the log. Taller heroes reveal more sky; the bottom stays put.
 */
export const WORLD_COVER_BOTTOM = 0.575;

/**
 * How far the stats pill sits up onto the hero grass. Stay inside the
 * grass band so faces and the log stay clear.
 */
export const WORLD_STATS_OVERLAP = 28;

export const WORLD_COLUMN_MAX_WIDTH = 430;

/**
 * Cover-crop focal point (0–1 in extra-crop space).
 * Horizontal: unused on current phones (view is wider than the art).
 * Vertical crop is bottom-aligned to `WORLD_COVER_BOTTOM` instead of FOCUS_Y
 * so a taller hero adds sky rather than zooming into the mascots.
 */
export const WORLD_COVER_FOCUS = {
  x: 0.46,
  y: 0.12,
} as const;

export type CoverLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export function getWorldHeroHeight(windowHeight: number): number {
  return Math.max(WORLD_HERO_MIN_HEIGHT, Math.round(Math.max(windowHeight, 1) * WORLD_HERO_FLEX));
}

export function getWorldCoverLayout(viewWidth: number, viewHeight: number): CoverLayout {
  const safeWidth = Math.max(viewWidth, 1);
  const safeHeight = Math.max(viewHeight, 1);
  const viewAspect = safeWidth / safeHeight;

  if (viewAspect > WORLD_HERO_ART_ASPECT) {
    const width = safeWidth;
    const height = safeWidth / WORLD_HERO_ART_ASPECT;
    const extra = Math.max(0, height - safeHeight);
    const unclampedTop = safeHeight - WORLD_COVER_BOTTOM * height;
    const top = Math.min(0, Math.max(-extra, unclampedTop));
    return {
      width,
      height,
      left: 0,
      top,
    };
  }

  const height = safeHeight;
  const width = safeHeight * WORLD_HERO_ART_ASPECT;
  const extra = Math.max(0, width - safeWidth);
  return {
    width,
    height,
    left: -extra * WORLD_COVER_FOCUS.x,
    top: 0,
  };
}

/** Image-space y of the top edge currently visible in the hero frame. */
export function getWorldCoverImageTop(viewWidth: number, viewHeight: number): number {
  const cover = getWorldCoverLayout(viewWidth, viewHeight);
  if (cover.height <= 0) {
    return 0;
  }
  return -cover.top / cover.height;
}

/** Image-space y of the bottom edge currently visible in the hero frame. */
export function getWorldCoverImageBottom(viewWidth: number, viewHeight: number): number {
  const cover = getWorldCoverLayout(viewWidth, viewHeight);
  if (cover.height <= 0) {
    return 1;
  }
  return (-cover.top + Math.max(viewHeight, 1)) / cover.height;
}
