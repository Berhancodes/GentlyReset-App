import { spacing } from '@/design-system';

/**
 * Transparent 9:16 run GIF. Bounds are the opaque mascot in the final frame,
 * measured from `mascot-run-intro-final.png` (720×1280).
 */
const FRAME_WIDTH = 720;
const FRAME_HEIGHT = 1280;
const FRAME_ASPECT = FRAME_WIDTH / FRAME_HEIGHT;

const MASCOT_BOUNDS = {
  left: 155 / FRAME_WIDTH,
  right: 563 / FRAME_WIDTH,
  top: 423 / FRAME_HEIGHT,
  bottom: 902 / FRAME_HEIGHT,
  centerX: 359 / FRAME_WIDTH,
  hatRight: 511 / FRAME_WIDTH,
  hatTop: 423 / FRAME_HEIGHT,
  /** Right edge of the brown head at face height, not the hat brim. */
  headRight: 482 / FRAME_WIDTH,
  /** Where the hat meets the face. */
  faceTop: 640 / FRAME_HEIGHT,
} as const;

export const MASCOT_INTRO_LAYOUT = {
  settleScale: 0.5,
  clusterCenterRatio: 0.5,
  clusterNudgeY: -10,
  /** Wide enough that "what should I call you?" and the reply each stay on one line. */
  bubbleMaxWidth: 310,
  bubbleMinWidth: 136,
  /** Cream gap from the hat brim to the tail tip. */
  bubbleHeadGap: 10,
  bubbleTailHeight: 12,
  /** Two one-line rows (24pt) plus the bubble's top and bottom padding (16pt each). */
  estimatedBubbleHeight: 80,
  characterToForm: 40,
  fieldHeight: 60,
  submitSize: 36,
  formWidthRatio: 0.84,
} as const;

export type MascotIntroLayout = {
  settleScale: number;
  settleX: number;
  settleY: number;
  bubbleMaxWidth: number;
  bubbleLeft: number;
  bubbleTop: number;
  bubbleTailOffset: number;
  formWidth: number;
  formLeft: number;
  formTop: number;
  fieldHeight: number;
  submitSize: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function containImageRect(viewWidth: number, viewHeight: number) {
  const viewAspect = viewWidth / viewHeight;
  if (viewAspect > FRAME_ASPECT) {
    const imageHeight = viewHeight;
    const imageWidth = viewHeight * FRAME_ASPECT;
    return {
      imageWidth,
      imageHeight,
      imageLeft: (viewWidth - imageWidth) / 2,
      imageTop: 0,
    };
  }

  const imageWidth = viewWidth;
  const imageHeight = viewWidth / FRAME_ASPECT;
  return {
    imageWidth,
    imageHeight,
    imageLeft: 0,
    imageTop: (viewHeight - imageHeight) / 2,
  };
}

export function getMascotIntroLayout(
  viewWidth: number,
  viewHeight: number,
  insets: { top: number; bottom: number },
): MascotIntroLayout {
  const { imageWidth, imageHeight, imageLeft, imageTop } = containImageRect(viewWidth, viewHeight);
  const settleScale = MASCOT_INTRO_LAYOUT.settleScale;
  const originX = viewWidth / 2;
  const originY = viewHeight / 2;
  const imageX = (ratio: number) => imageLeft + ratio * imageWidth;
  const imageY = (ratio: number) => imageTop + ratio * imageHeight;

  const formWidth = Math.min(
    Math.round(viewWidth * MASCOT_INTRO_LAYOUT.formWidthRatio),
    viewWidth - spacing.lg * 2,
  );
  const formLeft = (viewWidth - formWidth) / 2;
  const unshiftedMascotX = (imageX(MASCOT_BOUNDS.centerX) - originX) * settleScale + originX;
  const settleX = originX - unshiftedMascotX;

  const applySettle = (x: number, y: number, extraY: number) => ({
    x: (x - originX) * settleScale + originX + settleX,
    y: (y - originY) * settleScale + originY + extraY,
  });
  const formHeight = MASCOT_INTRO_LAYOUT.fieldHeight;
  const maxFormTop = viewHeight - formHeight - Math.max(insets.bottom, spacing.lg);

  const unshiftedHat = applySettle(imageX(MASCOT_BOUNDS.hatRight), imageY(MASCOT_BOUNDS.hatTop), 0);
  const unshiftedFeet = applySettle(imageX(MASCOT_BOUNDS.centerX), imageY(MASCOT_BOUNDS.bottom), 0);
  const clusterCenter = (unshiftedHat.y + unshiftedFeet.y) / 2;
  const targetCenter = viewHeight * MASCOT_INTRO_LAYOUT.clusterCenterRatio;
  let settleY = targetCenter - clusterCenter;
  const overflow = unshiftedFeet.y + settleY + MASCOT_INTRO_LAYOUT.characterToForm - maxFormTop;
  if (overflow > 0) {
    settleY -= overflow;
  }
  settleY += MASCOT_INTRO_LAYOUT.clusterNudgeY;

  const minBubbleTop = insets.top + spacing.hitTarget + spacing.xs;
  const bubbleStack =
    MASCOT_INTRO_LAYOUT.estimatedBubbleHeight +
    MASCOT_INTRO_LAYOUT.bubbleTailHeight +
    MASCOT_INTRO_LAYOUT.bubbleHeadGap;
  const unshiftedHatTop = applySettle(
    imageX(MASCOT_BOUNDS.centerX),
    imageY(MASCOT_BOUNDS.hatTop),
    settleY,
  );
  const bubbleOverlap = minBubbleTop + bubbleStack - unshiftedHatTop.y;
  if (bubbleOverlap > 0) {
    settleY += bubbleOverlap;
  }

  const hat = applySettle(imageX(MASCOT_BOUNDS.centerX), imageY(MASCOT_BOUNDS.hatTop), settleY);
  const feet = applySettle(imageX(MASCOT_BOUNDS.centerX), imageY(MASCOT_BOUNDS.bottom), settleY);

  const margin = spacing.md;
  const widthLimit = viewWidth - margin * 2;
  const bubbleMaxWidth = clamp(
    Math.round(Math.min(MASCOT_INTRO_LAYOUT.bubbleMaxWidth, widthLimit)),
    MASCOT_INTRO_LAYOUT.bubbleMinWidth,
    widthLimit,
  );
  const desiredBubbleLeft = hat.x - bubbleMaxWidth / 2;
  const bubbleLeft = clamp(desiredBubbleLeft, margin, viewWidth - bubbleMaxWidth - margin);
  const desiredBubbleTop = hat.y - bubbleStack;
  const bubbleTop = clamp(
    desiredBubbleTop,
    minBubbleTop,
    viewHeight - MASCOT_INTRO_LAYOUT.estimatedBubbleHeight - spacing.lg,
  );
  const bubbleTailOffset = clamp(hat.x - bubbleLeft, spacing.md, bubbleMaxWidth - spacing.md);

  return {
    settleScale,
    settleX,
    settleY,
    bubbleMaxWidth,
    bubbleLeft,
    bubbleTop,
    bubbleTailOffset,
    formWidth,
    formLeft,
    formTop: Math.min(feet.y + MASCOT_INTRO_LAYOUT.characterToForm, maxFormTop),
    fieldHeight: MASCOT_INTRO_LAYOUT.fieldHeight,
    submitSize: MASCOT_INTRO_LAYOUT.submitSize,
  };
}

export function getMascotIntroKeyboardLift(
  layout: MascotIntroLayout,
  viewHeight: number,
  keyboardHeight: number,
): number {
  if (keyboardHeight <= 0) {
    return 0;
  }

  const formBottom = layout.formTop + layout.fieldHeight;
  const visibleBottom = viewHeight - keyboardHeight;
  return Math.max(0, formBottom - visibleBottom + spacing.md);
}
