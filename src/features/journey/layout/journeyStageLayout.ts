import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';
import { clampJourneyDay } from '../data/journeyChapters';
import { getJourneyTimelineTrack } from '../utils/getJourneyTimelineMotion';

/**
 * Day 1 composition as fractions of the STAGE (not the window).
 * Mascot center X and Day 1 node X stay locked so the character stands on the node.
 */
export const JOURNEY_DAY1_ANCHORS = {
  day1X: 0.44,
  day2X: 0.79,
  signX: 0.205,
  bushLeftX: 0.055,
  bushX: 0.84,
  sunX: 0.82,
  sunY: 0.125,
  cloudLeftX: 0.12,
  cloudLeftY: 0.175,
  cloudRightX: 0.92,
  cloudRightY: 0.255,
  cloudUpperRightX: 0.66,
  cloudUpperRightY: 0.0,
  lineLeftX: 0.09,
  lineRightX: 0.93,
} as const;

/** Intrinsic standing-mascot canvas, including sparkles to the right. */
export const JOURNEY_MASCOT_ART = {
  width: 1536,
  height: 1024,
  bodyCenterX: 0.49,
  /** Lowest toe pixels. */
  feetY: 0.916,
  /** Visual sit: oval bottom / between the feet, where the node should tuck. */
  standingY: 0.828,
} as const;

export const JOURNEY_SIGN_ART = {
  width: 1448,
  height: 1086,
  visualBottom: 0.882,
} as const;

export const JOURNEY_BUSH_ART = {
  width: 1448,
  height: 1086,
  visualBottom: 0.811,
} as const;

export const JOURNEY_CLOUD_ART = {
  width: 1448,
  height: 1086,
} as const;

/**
 * Progress GIF canvas. Transparent padding stays in the file; we only
 * use these fractions to size/align the container to the standing mascot.
 */
export const JOURNEY_PROGRESS_MASCOT_ART = {
  width: 720,
  height: 1280,
  bodyCenterX: 360 / 720,
  feetY: 925 / 1280,
  walkBodyHeight: 574 / 1280,
} as const;

export const JOURNEY_SUN_ART = {
  width: 1254,
  height: 1254,
} as const;

/** Distant autumn ridge. Intrinsic size of `autumn-mountains.png`. */
export const JOURNEY_MOUNTAIN_ART = {
  width: 1024,
  height: 341,
} as const;

/**
 * Environment-relative mountain placement.
 * Width overflow crops the sides so the center-left peak stays in frame
 * on every iPhone. Height always follows the art aspect. Lifted from the
 * navbar so peaks sit in the lower-middle, behind the future mascot.
 */
export const JOURNEY_MOUNTAIN_LAYOUT = {
  widthScale: 1.14,
  /** Lift from the environment bottom, as a fraction of environment height. */
  bottom: 0.5,
  /** Keep peaks out of the heading / cloud band. */
  minTop: 0.16,
} as const;

export type JourneyMountainRect = {
  left: number;
  bottom: number;
  width: number;
  height: number;
};

function getLiftedBottom(
  environmentHeight: number,
  assetHeight: number,
  bottomFraction: number,
  minTopFraction: number,
): number {
  const safeHeight = Math.max(environmentHeight, 1);
  const desired = safeHeight * bottomFraction;
  const minTop = safeHeight * minTopFraction;
  return Math.min(desired, safeHeight - assetHeight - minTop);
}

export function getJourneyMountainRect(
  environmentWidth: number,
  environmentHeight: number,
): JourneyMountainRect {
  const safeWidth = Math.max(environmentWidth, 1);
  const width = safeWidth * JOURNEY_MOUNTAIN_LAYOUT.widthScale;
  const height = width * (JOURNEY_MOUNTAIN_ART.height / JOURNEY_MOUNTAIN_ART.width);

  return {
    left: (safeWidth - width) / 2,
    bottom: getLiftedBottom(
      environmentHeight,
      height,
      JOURNEY_MOUNTAIN_LAYOUT.bottom,
      JOURNEY_MOUNTAIN_LAYOUT.minTop,
    ),
    width,
    height,
  };
}

/** Left autumn tree. Intrinsic size of `autumn-tree-left.png`. */
export const JOURNEY_TREE_LEFT_ART = {
  width: 682,
  height: 1024,
  /** Visible canopy / fence right edge. Empty PNG on the right is ignored. */
  contentRight: 0.58,
  /** Trunk in PNG space. Kept near or past the left clip. */
  trunkX: 0.17,
} as const;

/**
 * Environment-relative left tree. Sized from width, cropped from the left,
 * and lifted so foliage enters from the middle-left without covering the
 * heading or cloud band.
 */
export const JOURNEY_TREE_LEFT_LAYOUT = {
  widthScale: 0.9,
  /** How far the visible trunk sits past the left edge, at the 390 composition. */
  trunkPastLeft: -0.02,
  /** Extra left crop on a 320-wide phone, as a fraction of rendered width. */
  narrowCropExtra: 0.08,
  /** Less left crop on a 430-wide phone, as a fraction of rendered width. */
  wideCropRelief: 0.05,
  /** Lift from the environment bottom, as a fraction of environment height. */
  bottom: 0.22,
  /** Leave a thin band under the heading; extra height crops at the bottom. */
  minTop: 0.04,
} as const;

export type JourneyTreeLeftRect = {
  left: number;
  bottom: number;
  width: number;
  height: number;
};

/** Right autumn foliage. Intrinsic size of `autumn-right-foreground.png`. */
export const JOURNEY_TREE_RIGHT_ART = {
  width: 1024,
  height: 935,
  /** Visible bushes / path left edge. Empty PNG on the left is ignored. */
  contentLeft: 0.42,
  /** Large tree in PNG space. Kept near or past the right clip. */
  treeX: 0.9,
} as const;

/**
 * Environment-relative right foliage. Smaller and lower than the left tree,
 * cropped from the right, and lifted into the lower-middle.
 */
export const JOURNEY_TREE_RIGHT_LAYOUT = {
  widthScale: 0.52,
  /** How far the visible tree sits past the right edge, at the 390 composition. */
  treePastRight: 0.05,
  /** Extra right crop on a 320-wide phone, as a fraction of rendered width. */
  narrowCropExtra: 0.07,
  /** Less right crop on a 430-wide phone, as a fraction of rendered width. */
  wideCropRelief: 0.04,
  /** Lift from the environment bottom, as a fraction of environment height. */
  bottom: 0.2,
  /** Keep the right side lower than the left tree. */
  minTop: 0.38,
} as const;

export type JourneyTreeRightRect = {
  right: number;
  bottom: number;
  width: number;
  height: number;
};

/** Sprite sizes at a 390-wide stage, then scaled and clamped. */
export const JOURNEY_STAGE_BASE = {
  mascotHeight: 210,
  mascotHeightMin: 180,
  mascotHeightMax: 232,
  signWidth: 220,
  signWidthMin: 184,
  signWidthMax: 244,
  bushWidth: 172,
  bushWidthMin: 144,
  bushWidthMax: 200,
  bushLeftWidth: 132,
  bushLeftWidthMin: 110,
  bushLeftWidthMax: 152,
  nodeSize: 34,
  nodeSizeMin: 30,
  nodeSizeMax: 38,
  sunSize: 128,
  sunSizeMin: 108,
  sunSizeMax: 144,
  cloudMain: 128,
  cloudMainMin: 104,
  cloudMainMax: 144,
  cloudSmall: 88,
  cloudSmallMin: 72,
  cloudSmallMax: 102,
} as const;

export type JourneyRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type JourneyStageLayout = {
  width: number;
  height: number;
  pathHeight: number;
  groundY: number;
  lineY: number;
  lineLeft: number;
  lineWidth: number;
  lineThickness: number;
  nodeSize: number;
  day1X: number;
  day2X: number;
  currentX: number;
  nextX: number;
  mascot: JourneyRect;
  sign: JourneyRect;
  bush: JourneyRect;
  bushLeft: JourneyRect;
  sun: JourneyRect;
  clouds: readonly JourneyRect[];
  progressMascot: JourneyRect;
  travelDistance: number;
};

export function clampLayout(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getJourneyTreeLeftRect(
  environmentWidth: number,
  environmentHeight: number,
): JourneyTreeLeftRect {
  const safeWidth = Math.max(environmentWidth, 1);
  const width = safeWidth * JOURNEY_TREE_LEFT_LAYOUT.widthScale;
  const height = width * (JOURNEY_TREE_LEFT_ART.height / JOURNEY_TREE_LEFT_ART.width);
  const trunkX = width * JOURNEY_TREE_LEFT_ART.trunkX;
  const left = -safeWidth * JOURNEY_TREE_LEFT_LAYOUT.trunkPastLeft - trunkX;
  const narrowT = clampLayout((390 - safeWidth) / 70, 0, 1);
  const wideT = clampLayout((safeWidth - 390) / 40, 0, 1);
  const cropAdjust =
    width * JOURNEY_TREE_LEFT_LAYOUT.narrowCropExtra * narrowT -
    width * JOURNEY_TREE_LEFT_LAYOUT.wideCropRelief * wideT;

  return {
    left: left - cropAdjust,
    bottom: getLiftedBottom(
      environmentHeight,
      height,
      JOURNEY_TREE_LEFT_LAYOUT.bottom,
      JOURNEY_TREE_LEFT_LAYOUT.minTop,
    ),
    width,
    height,
  };
}

export function getJourneyTreeRightRect(
  environmentWidth: number,
  environmentHeight: number,
): JourneyTreeRightRect {
  const safeWidth = Math.max(environmentWidth, 1);
  const width = safeWidth * JOURNEY_TREE_RIGHT_LAYOUT.widthScale;
  const height = width * (JOURNEY_TREE_RIGHT_ART.height / JOURNEY_TREE_RIGHT_ART.width);
  const crop =
    safeWidth * JOURNEY_TREE_RIGHT_LAYOUT.treePastRight +
    width * (1 - JOURNEY_TREE_RIGHT_ART.treeX);
  const narrowT = clampLayout((390 - safeWidth) / 70, 0, 1);
  const wideT = clampLayout((safeWidth - 390) / 40, 0, 1);
  const cropAdjust =
    width * JOURNEY_TREE_RIGHT_LAYOUT.narrowCropExtra * narrowT -
    width * JOURNEY_TREE_RIGHT_LAYOUT.wideCropRelief * wideT;

  return {
    right: -(crop + cropAdjust),
    bottom: getLiftedBottom(
      environmentHeight,
      height,
      JOURNEY_TREE_RIGHT_LAYOUT.bottom,
      JOURNEY_TREE_RIGHT_LAYOUT.minTop,
    ),
    width,
    height,
  };
}

/** Full-screen season painting. All four `*-background.png` files share this size. */
export const JOURNEY_SEASON_BACKGROUND_ART = {
  width: 852,
  height: 1846,
} as const;

/**
 * Looping mascot video `assets/videos/journey/mascot-idle.mov` (768 x 1344,
 * transparent). Measured on the first frame; feet stay planted for the loop.
 */
export const JOURNEY_SEASON_MASCOT_ART = {
  width: 768,
  height: 1344,
  /** Body center between the feet. */
  bodyCenterX: 0.488,
  /** Top of the hat. */
  contentTop: 0.25,
  /** Lowest toe pixels. */
  feetY: 0.762,
  /** Widest extent (hat brim and pack), as a fraction of the art width. */
  brimWidth: 0.84,
} as const;

/**
 * Day-complete jump `assets/videos/journey/mascot-day-done.mov` (720 x 1280,
 * transparent). First and last frames match the idle pose, so it swaps in place.
 */
export const JOURNEY_DAY_DONE_MASCOT_ART = {
  width: 720,
  height: 1280,
  bodyCenterX: 0.4875,
  feetY: 0.749,
  brimWidth: 0.833,
} as const;

/**
 * Mascot placement in BACKGROUND space so the character stays on the same
 * spot of the painted path on every screen size.
 */
export const JOURNEY_SEASON_MASCOT_LAYOUT = {
  centerX: 0.5,
  /** Painted toes on the path, as a fraction of background height. */
  feetY: 0.714,
  /** Hat brim width, as a fraction of background width. */
  brimWidth: 0.383,
  /**
   * `mascot-ground-shadow.png` (1000 x 200) is drawn in brim units: its width
   * is one brim and its vertical center sits on the toes. One soft shadow
   * under the whole body, darker in the middle.
   */
  shadowWidth: 1.3,
  shadowHeight: 0.2,
} as const;

export type JourneySeasonSceneLayout = {
  background: JourneyRect;
  mascot: JourneyRect;
  /** Same feet and size as `mascot`, framed for the day-complete video. */
  celebrationMascot: JourneyRect;
  shadow: JourneyRect;
};

/**
 * Covers the screen with the painting, anchored to the bottom so the path and
 * mascot never crop. Wider screens (SE, iPad) trim sky from the top instead.
 */
export function getJourneySeasonSceneLayout(
  screenWidth: number,
  screenHeight: number,
): JourneySeasonSceneLayout {
  const safeWidth = Math.max(screenWidth, 1);
  const safeHeight = Math.max(screenHeight, 1);
  const scale = Math.max(
    safeWidth / JOURNEY_SEASON_BACKGROUND_ART.width,
    safeHeight / JOURNEY_SEASON_BACKGROUND_ART.height,
  );
  const backgroundWidth = JOURNEY_SEASON_BACKGROUND_ART.width * scale;
  const backgroundHeight = JOURNEY_SEASON_BACKGROUND_ART.height * scale;
  const background: JourneyRect = {
    left: (safeWidth - backgroundWidth) / 2,
    top: safeHeight - backgroundHeight,
    width: backgroundWidth,
    height: backgroundHeight,
  };

  const brimWidth = backgroundWidth * JOURNEY_SEASON_MASCOT_LAYOUT.brimWidth;
  const mascotWidth = brimWidth / JOURNEY_SEASON_MASCOT_ART.brimWidth;
  const mascotHeight =
    mascotWidth * (JOURNEY_SEASON_MASCOT_ART.height / JOURNEY_SEASON_MASCOT_ART.width);
  const centerX = background.left + backgroundWidth * JOURNEY_SEASON_MASCOT_LAYOUT.centerX;
  const feetY = background.top + backgroundHeight * JOURNEY_SEASON_MASCOT_LAYOUT.feetY;
  const shadowWidth = brimWidth * JOURNEY_SEASON_MASCOT_LAYOUT.shadowWidth;
  const shadowHeight = brimWidth * JOURNEY_SEASON_MASCOT_LAYOUT.shadowHeight;

  return {
    background,
    mascot: {
      left: centerX - mascotWidth * JOURNEY_SEASON_MASCOT_ART.bodyCenterX,
      top: feetY - mascotHeight * JOURNEY_SEASON_MASCOT_ART.feetY,
      width: mascotWidth,
      height: mascotHeight,
    },
    celebrationMascot: placeArtOnFeet(JOURNEY_DAY_DONE_MASCOT_ART, brimWidth, centerX, feetY),
    shadow: centerBox(centerX, feetY - shadowHeight / 2, shadowWidth, shadowHeight),
  };
}

/** Sizes art so its widest extent matches `brimWidth`, standing on `feetY` at `centerX`. */
function placeArtOnFeet(
  art: { width: number; height: number; bodyCenterX: number; feetY: number; brimWidth: number },
  brimWidth: number,
  centerX: number,
  feetY: number,
): JourneyRect {
  const width = brimWidth / art.brimWidth;
  const height = width * (art.height / art.width);
  return {
    left: centerX - width * art.bodyCenterX,
    top: feetY - height * art.feetY,
    width,
    height,
  };
}

/** Resting timeline shows only the real current day. */
export function getJourneyVisibleDays(
  currentDay: number,
  planDayCount: number = PLAN_DAY_COUNT,
): readonly number[] {
  const current = Math.min(planDayCount, Math.max(1, clampJourneyDay(currentDay)));
  return [current];
}

/** Two-line task title for the Day 1 hero, matching “start smaller / than usual”. */
export function splitJourneyTaskTitle(title: string): readonly string[] {
  const normalized = title.trim().toLowerCase();
  if (!normalized) {
    return [''];
  }
  const words = normalized.split(/\s+/).filter((word) => word.length > 0);
  if (words.length <= 2) {
    return [normalized];
  }
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function centerBox(centerX: number, top: number, width: number, height: number): JourneyRect {
  return {
    left: centerX - width / 2,
    top,
    width,
    height,
  };
}

/**
 * Stage-relative layout. Art scales with WIDTH and is clamped so 390 / 393 / 430
 * phones keep the same composition. The path is a tall illustrated world: the
 * mascot stands on the Day 1 node, not in a thin floating strip.
 */
export function getJourneyStageLayout(width: number, height: number): JourneyStageLayout {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  const scale = safeWidth / 390;
  const compact = safeHeight < 420;

  const mascotHeight = clampLayout(
    JOURNEY_STAGE_BASE.mascotHeight * scale,
    JOURNEY_STAGE_BASE.mascotHeightMin,
    JOURNEY_STAGE_BASE.mascotHeightMax,
  );
  const mascotWidth = mascotHeight * (JOURNEY_MASCOT_ART.width / JOURNEY_MASCOT_ART.height);
  const signWidth = clampLayout(
    JOURNEY_STAGE_BASE.signWidth * scale,
    JOURNEY_STAGE_BASE.signWidthMin,
    JOURNEY_STAGE_BASE.signWidthMax,
  );
  const signHeight = signWidth * (JOURNEY_SIGN_ART.height / JOURNEY_SIGN_ART.width);
  const bushWidth = clampLayout(
    JOURNEY_STAGE_BASE.bushWidth * scale,
    JOURNEY_STAGE_BASE.bushWidthMin,
    JOURNEY_STAGE_BASE.bushWidthMax,
  );
  const bushHeight = bushWidth * (JOURNEY_BUSH_ART.height / JOURNEY_BUSH_ART.width);
  const bushLeftWidth = clampLayout(
    JOURNEY_STAGE_BASE.bushLeftWidth * scale,
    JOURNEY_STAGE_BASE.bushLeftWidthMin,
    JOURNEY_STAGE_BASE.bushLeftWidthMax,
  );
  const bushLeftHeight = bushLeftWidth * (JOURNEY_BUSH_ART.height / JOURNEY_BUSH_ART.width);
  const nodeSize = clampLayout(
    JOURNEY_STAGE_BASE.nodeSize * scale,
    JOURNEY_STAGE_BASE.nodeSizeMin,
    JOURNEY_STAGE_BASE.nodeSizeMax,
  );
  const sunSize = clampLayout(
    JOURNEY_STAGE_BASE.sunSize * scale,
    JOURNEY_STAGE_BASE.sunSizeMin,
    JOURNEY_STAGE_BASE.sunSizeMax,
  );
  const cloudMain = clampLayout(
    JOURNEY_STAGE_BASE.cloudMain * scale,
    JOURNEY_STAGE_BASE.cloudMainMin,
    JOURNEY_STAGE_BASE.cloudMainMax,
  );
  const cloudSmall = clampLayout(
    JOURNEY_STAGE_BASE.cloudSmall * scale,
    JOURNEY_STAGE_BASE.cloudSmallMin,
    JOURNEY_STAGE_BASE.cloudSmallMax,
  );
  const cloudMainHeight = cloudMain * (JOURNEY_CLOUD_ART.height / JOURNEY_CLOUD_ART.width);
  const cloudSmallHeight = cloudSmall * (JOURNEY_CLOUD_ART.height / JOURNEY_CLOUD_ART.width);

  const labelBlock = compact ? 22 : 28;
  const pathBottomPad = compact ? 6 : 10;
  const lineThickness = 2;
  const day1X = JOURNEY_DAY1_ANCHORS.day1X * safeWidth;
  const day2X = JOURNEY_DAY1_ANCHORS.day2X * safeWidth;

  // Mascot, plants, and sign share one ground at the painted toes.
  // The day line sits just under that ground so it does not cut the feet.
  const toeFromMascotTop = mascotHeight * JOURNEY_MASCOT_ART.feetY;
  const lineFromMascotTop = toeFromMascotTop + nodeSize * 0.3;
  const sceneHeight = lineFromMascotTop + nodeSize / 2 + labelBlock + pathBottomPad;
  // Hug the illustrated characters so leftover stage height becomes sky
  // between the hero copy and the path, not a gap under the feet.
  const pathHeight = sceneHeight;
  const originY = 0;

  const groundY = originY + toeFromMascotTop;
  const lineY = originY + lineFromMascotTop;
  const mascotLeft = day1X - mascotWidth * JOURNEY_MASCOT_ART.bodyCenterX;
  const mascot: JourneyRect = {
    left: mascotLeft,
    top: originY,
    width: mascotWidth,
    height: mascotHeight,
  };

  const signCenterX = JOURNEY_DAY1_ANCHORS.signX * safeWidth;
  const signVisualBottom = signHeight * JOURNEY_SIGN_ART.visualBottom;
  const sign: JourneyRect = {
    left: signCenterX - signWidth / 2,
    top: groundY - signVisualBottom,
    width: signWidth,
    height: signHeight,
  };

  const bushCenterX = JOURNEY_DAY1_ANCHORS.bushX * safeWidth;
  const bushVisualBottom = bushHeight * JOURNEY_BUSH_ART.visualBottom;
  const bush: JourneyRect = {
    left: bushCenterX - bushWidth / 2,
    top: groundY - bushVisualBottom,
    width: bushWidth,
    height: bushHeight,
  };

  const bushLeftCenterX = JOURNEY_DAY1_ANCHORS.bushLeftX * safeWidth;
  const bushLeftVisualBottom = bushLeftHeight * JOURNEY_BUSH_ART.visualBottom;
  const bushLeft: JourneyRect = {
    left: bushLeftCenterX - bushLeftWidth / 2,
    top: groundY - bushLeftVisualBottom,
    width: bushLeftWidth,
    height: bushLeftHeight,
  };

  const sunTop = clampLayout(
    safeHeight * JOURNEY_DAY1_ANCHORS.sunY,
    compact ? 36 : 48,
    compact ? 68 : 96,
  );
  const sun = centerBox(JOURNEY_DAY1_ANCHORS.sunX * safeWidth, sunTop, sunSize, sunSize);

  const clouds: JourneyRect[] = [
    centerBox(
      JOURNEY_DAY1_ANCHORS.cloudLeftX * safeWidth,
      clampLayout(
        safeHeight * JOURNEY_DAY1_ANCHORS.cloudLeftY,
        compact ? 40 : 56,
        compact ? 88 : 120,
      ),
      cloudMain,
      cloudMainHeight,
    ),
    centerBox(
      JOURNEY_DAY1_ANCHORS.cloudUpperRightX * safeWidth,
      clampLayout(safeHeight * JOURNEY_DAY1_ANCHORS.cloudUpperRightY, 0, compact ? 12 : 18),
      cloudSmall,
      cloudSmallHeight,
    ),
    centerBox(
      JOURNEY_DAY1_ANCHORS.cloudRightX * safeWidth,
      clampLayout(
        safeHeight * JOURNEY_DAY1_ANCHORS.cloudRightY,
        compact ? 80 : 100,
        compact ? 128 : 160,
      ),
      cloudSmall,
      cloudSmallHeight,
    ),
  ];

  const lineLeft = JOURNEY_DAY1_ANCHORS.lineLeftX * safeWidth;
  const lineWidth = (JOURNEY_DAY1_ANCHORS.lineRightX - JOURNEY_DAY1_ANCHORS.lineLeftX) * safeWidth;
  const track = getJourneyTimelineTrack(day1X, day2X);

  return {
    width: safeWidth,
    height: safeHeight,
    pathHeight,
    groundY,
    lineY,
    lineLeft,
    lineWidth,
    lineThickness,
    nodeSize,
    day1X,
    day2X,
    currentX: track.currentX,
    nextX: track.nextX,
    mascot,
    sign,
    bush,
    bushLeft,
    sun,
    clouds,
    progressMascot: getJourneyProgressMascotRect(mascot, day1X),
    travelDistance: track.travelDistance,
  };
}

function getJourneyProgressMascotRect(mascot: JourneyRect, day1X: number): JourneyRect {
  const standBodyHeight = mascot.height * JOURNEY_MASCOT_ART.standingY;
  const height = standBodyHeight / JOURNEY_PROGRESS_MASCOT_ART.walkBodyHeight;
  const width = height * (JOURNEY_PROGRESS_MASCOT_ART.width / JOURNEY_PROGRESS_MASCOT_ART.height);
  const standFeetY = mascot.top + mascot.height * JOURNEY_MASCOT_ART.feetY;
  return {
    left: day1X - width * JOURNEY_PROGRESS_MASCOT_ART.bodyCenterX,
    top: standFeetY - height * JOURNEY_PROGRESS_MASCOT_ART.feetY,
    width,
    height,
  };
}
