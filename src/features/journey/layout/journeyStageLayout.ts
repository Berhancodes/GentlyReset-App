import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';
import { clampJourneyDay } from '../data/journeyChapters';

/**
 * Day 1 composition as fractions of the STAGE (not the window).
 * Node and mascot share day1X so the character stands on the current node.
 */
export const JOURNEY_DAY1_ANCHORS = {
  day1X: 0.4,
  day2X: 0.78,
  signX: 0.18,
  bushX: 0.84,
  sunX: 0.8,
  sunY: 0.14,
  cloudLeftX: 0.1,
  cloudLeftY: 0.1,
  cloudRightX: 0.9,
  cloudRightY: 0.3,
  cloudUpperRightX: 0.68,
  cloudUpperRightY: 0.02,
  lineLeftX: 0.22,
  lineRightX: 0.96,
} as const;

/** Intrinsic standing-mascot canvas, including sparkles to the right. */
export const JOURNEY_MASCOT_ART = {
  width: 1536,
  height: 1024,
  bodyCenterX: 0.493,
  feetY: 0.905,
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
 * Stage-relative layout. Art scales with WIDTH and is clamped so 430-wide
 * phones do not get oversized sprites. Extra HEIGHT becomes space between
 * the title and the path, not bigger art.
 */
export function getJourneyStageLayout(width: number, height: number): JourneyStageLayout {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  const scale = safeWidth / 390;
  const compact = safeHeight < 420;

  const mascotHeight = clampLayout(150 * scale, 122, 162);
  const mascotWidth = mascotHeight * (JOURNEY_MASCOT_ART.width / JOURNEY_MASCOT_ART.height);
  const signWidth = clampLayout(164 * scale, 136, 180);
  const signHeight = signWidth * (JOURNEY_SIGN_ART.height / JOURNEY_SIGN_ART.width);
  const bushWidth = clampLayout(102 * scale, 82, 114);
  const bushHeight = bushWidth * (JOURNEY_BUSH_ART.height / JOURNEY_BUSH_ART.width);
  const nodeSize = clampLayout(28 * scale, 24, 32);
  const sunSize = clampLayout(120 * scale, 100, 136);
  const cloudMain = clampLayout(136 * scale, 110, 154);
  const cloudSmall = clampLayout(96 * scale, 78, 110);
  const cloudMainHeight = cloudMain * (JOURNEY_CLOUD_ART.height / JOURNEY_CLOUD_ART.width);
  const cloudSmallHeight = cloudSmall * (JOURNEY_CLOUD_ART.height / JOURNEY_CLOUD_ART.width);

  const labelBlock = compact ? 20 : 24;
  const pathBottomPad = compact ? 4 : 8;
  const lineThickness = 2;
  const feetY = mascotHeight * JOURNEY_MASCOT_ART.feetY;
  const day1X = JOURNEY_DAY1_ANCHORS.day1X * safeWidth;
  const day2X = JOURNEY_DAY1_ANCHORS.day2X * safeWidth;
  const lineY = feetY + nodeSize * 0.55;
  const pathHeight = lineY + nodeSize / 2 + labelBlock + pathBottomPad;

  const mascotLeft = day1X - mascotWidth * JOURNEY_MASCOT_ART.bodyCenterX;
  const mascot: JourneyRect = {
    left: mascotLeft,
    top: 0,
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
