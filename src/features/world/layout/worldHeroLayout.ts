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
 * Hero share of the usable screen. Landscape is cover-cropped into this band;
 * the cream sheet sits below. Keep in 0.36–0.40 so cards remain reachable.
 */
export const WORLD_HERO_FLEX = 0.36;

/** How far the stats pill sits up onto the hero grass. Matches `spacing.lg`. */
export const WORLD_STATS_OVERLAP = 24;

export const WORLD_COLUMN_MAX_WIDTH = 430;

/**
 * Cover-crop focal point (0–1 in extra-crop space).
 * Vertical: start ~16% down the tall art so sky, tree, mascots, log, and a
 * sliver of grass stay in a ~1.15 landscape frame. Never stretch.
 * Horizontal: unused on current phones (view is wider than the art).
 */
export const WORLD_COVER_FOCUS = {
  x: 0.46,
  y: 0.27,
} as const;

export type CoverLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export function getWorldCoverLayout(viewWidth: number, viewHeight: number): CoverLayout {
  const safeWidth = Math.max(viewWidth, 1);
  const safeHeight = Math.max(viewHeight, 1);
  const viewAspect = safeWidth / safeHeight;

  if (viewAspect > WORLD_HERO_ART_ASPECT) {
    const width = safeWidth;
    const height = safeWidth / WORLD_HERO_ART_ASPECT;
    const extra = Math.max(0, height - safeHeight);
    return {
      width,
      height,
      left: 0,
      top: -extra * WORLD_COVER_FOCUS.y,
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
