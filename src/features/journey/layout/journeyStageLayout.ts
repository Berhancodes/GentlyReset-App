import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';
import { clampJourneyDay } from '../data/journeyChapters';

/**
 * Day 1 composition as fractions of the STAGE (not the window).
 * Mascot center X and Day 1 node X stay locked so the character stands on the node.
 */
export const JOURNEY_DAY1_ANCHORS = {
  day1X: 0.44,
  day2X: 0.79,
  signX: 0.205,
  bushX: 0.84,
  sunX: 0.8,
  sunY: 0.14,
  cloudLeftX: 0.1,
  cloudLeftY: 0.1,
  cloudRightX: 0.9,
  cloudRightY: 0.3,
  cloudUpperRightX: 0.68,
  cloudUpperRightY: 0.02,
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

export const JOURNEY_SUN_ART = {
  width: 1254,
  height: 1254,
} as const;

/** Sprite sizes at a 390-wide stage, then scaled and clamped. */
export const JOURNEY_STAGE_BASE = {
  mascotHeight: 186,
  mascotHeightMin: 158,
  mascotHeightMax: 210,
  signWidth: 212,
  signWidthMin: 176,
  signWidthMax: 236,
  bushWidth: 168,
  bushWidthMin: 140,
  bushWidthMax: 196,
  nodeSize: 32,
  nodeSizeMin: 28,
  nodeSizeMax: 36,
  sunSize: 120,
  sunSizeMin: 100,
  sunSizeMax: 136,
  cloudMain: 136,
  cloudMainMin: 110,
  cloudMainMax: 154,
  cloudSmall: 96,
  cloudSmallMin: 78,
  cloudSmallMax: 110,
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
  lineY: number;
  lineLeft: number;
  lineWidth: number;
  lineThickness: number;
  nodeSize: number;
  day1X: number;
  day2X: number;
  mascot: JourneyRect;
  sign: JourneyRect;
  bush: JourneyRect;
  sun: JourneyRect;
  clouds: readonly JourneyRect[];
};

export function clampLayout(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Current day plus the next neighbor. Day 1 never shows Day 3. */
export function getJourneyVisibleDays(
  currentDay: number,
  planDayCount: number = PLAN_DAY_COUNT,
): readonly number[] {
  const current = Math.min(planDayCount, Math.max(1, clampJourneyDay(currentDay)));
  if (current >= planDayCount) {
    return [current];
  }
  return [current, current + 1];
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

  const labelBlock = compact ? 20 : 26;
  const pathBottomPad = compact ? 4 : 8;
  const lineThickness = 2;
  const day1X = JOURNEY_DAY1_ANCHORS.day1X * safeWidth;
  const day2X = JOURNEY_DAY1_ANCHORS.day2X * safeWidth;

  // Line through the standing plane so the gold node tucks under the body
  // and the toes rest on the circle. Using toe-tips alone leaves a float gap.
  const standingFromMascotTop = mascotHeight * JOURNEY_MASCOT_ART.standingY;
  const lineFromMascotTop = standingFromMascotTop + nodeSize * 0.22;
  const sceneHeight = lineFromMascotTop + nodeSize / 2 + labelBlock + pathBottomPad;
  const illustratedMin = clampLayout(safeHeight * 0.52, compact ? 200 : 236, 340);
  const pathHeight = Math.max(sceneHeight, illustratedMin);
  const originY = pathHeight - sceneHeight;

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
    top: lineY - signVisualBottom,
    width: signWidth,
    height: signHeight,
  };

  const bushCenterX = JOURNEY_DAY1_ANCHORS.bushX * safeWidth;
  const bushVisualBottom = bushHeight * JOURNEY_BUSH_ART.visualBottom;
  const bush: JourneyRect = {
    left: bushCenterX - bushWidth / 2,
    top: lineY - bushVisualBottom,
    width: bushWidth,
    height: bushHeight,
  };

  const sunTop = clampLayout(safeHeight * JOURNEY_DAY1_ANCHORS.sunY, compact ? 40 : 52, 78);
  const sun = centerBox(JOURNEY_DAY1_ANCHORS.sunX * safeWidth, sunTop, sunSize, sunSize);

  const clouds: JourneyRect[] = [
    centerBox(
      JOURNEY_DAY1_ANCHORS.cloudLeftX * safeWidth,
      clampLayout(safeHeight * JOURNEY_DAY1_ANCHORS.cloudLeftY, 8, 48),
      cloudMain,
      cloudMainHeight,
    ),
    centerBox(
      JOURNEY_DAY1_ANCHORS.cloudUpperRightX * safeWidth,
      clampLayout(safeHeight * JOURNEY_DAY1_ANCHORS.cloudUpperRightY, 0, 20),
      cloudSmall,
      cloudSmallHeight,
    ),
    centerBox(
      JOURNEY_DAY1_ANCHORS.cloudRightX * safeWidth,
      clampLayout(safeHeight * JOURNEY_DAY1_ANCHORS.cloudRightY, 72, 120),
      cloudSmall,
      cloudSmallHeight,
    ),
  ];

  const lineLeft = JOURNEY_DAY1_ANCHORS.lineLeftX * safeWidth;
  const lineWidth = (JOURNEY_DAY1_ANCHORS.lineRightX - JOURNEY_DAY1_ANCHORS.lineLeftX) * safeWidth;

  return {
    width: safeWidth,
    height: safeHeight,
    pathHeight,
    lineY,
    lineLeft,
    lineWidth,
    lineThickness,
    nodeSize,
    day1X,
    day2X,
    mascot,
    sign,
    bush,
    sun,
    clouds,
  };
}
