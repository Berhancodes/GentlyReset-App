import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';
import { motion } from '../../../design-system/motion';
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
  lineY: number;
  lineLeft: number;
  lineWidth: number;
  lineThickness: number;
  nodeSize: number;
  day1X: number;
  day2X: number;
  currentX: number;
  incomingStartX: number;
  worldTravel: number;
  mascotLead: number;
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
  const track = getJourneyTimelineTrack(
    safeWidth,
    day1X,
    nodeSize + motion.offset.journeyTimelineEdgePad,
  );

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
    currentX: track.currentX,
    incomingStartX: track.incomingStartX,
    worldTravel: track.worldTravel,
    mascotLead: track.mascotLead,
    mascot,
    sign,
    bush,
    bushLeft,
    sun,
    clouds,
    progressMascot: getJourneyProgressMascotRect(mascot, day1X),
    travelDistance: track.worldTravel,
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
