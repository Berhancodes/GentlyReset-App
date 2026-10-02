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
  mascotNudgeXRatio: 0.06,
  mascotNudgeXMin: 18,
  mascotNudgeXMax: 28,
  clusterCenterRatio: 0.35,
  mascotShiftX: 5,
  mascotShiftY: 5,
  bubbleMaxWidth: 220,
  bubbleMinWidth: 136,
  /** Cream gap from the hat brim to the bubble body. */
  bubbleHeadGap: 24,
  /** How far the bubble sits above the hat top. */
  bubbleLift: 44,
  estimatedBubbleHeight: 108,
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
  const formCenterX = formLeft + formWidth / 2;
  const unshiftedMascotX = (imageX(MASCOT_BOUNDS.centerX) - originX) * settleScale + originX;
  const mascotNudgeX = -clamp(
    viewWidth * MASCOT_INTRO_LAYOUT.mascotNudgeXRatio,
    MASCOT_INTRO_LAYOUT.mascotNudgeXMin,
    MASCOT_INTRO_LAYOUT.mascotNudgeXMax,
  );
  const settleX = formCenterX - unshiftedMascotX + mascotNudgeX;

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

  const hat = applySettle(imageX(MASCOT_BOUNDS.hatRight), imageY(MASCOT_BOUNDS.hatTop), settleY);
  const feet = applySettle(imageX(MASCOT_BOUNDS.centerX), imageY(MASCOT_BOUNDS.bottom), settleY);

  const margin = spacing.md;
  const gap = MASCOT_INTRO_LAYOUT.bubbleHeadGap;
  const widthLimit = viewWidth - margin * 2;
  const widthBesideMascot = viewWidth - margin - hat.x - gap;
  const bubbleMaxWidth = clamp(
    Math.round(
      Math.min(
        MASCOT_INTRO_LAYOUT.bubbleMaxWidth,
        widthLimit,
        Math.max(widthBesideMascot, MASCOT_INTRO_LAYOUT.bubbleMinWidth),
      ),
    ),
    MASCOT_INTRO_LAYOUT.bubbleMinWidth,
    widthLimit,
  );
  const desiredBubbleLeft = hat.x + gap;
  const bubbleLeft = clamp(desiredBubbleLeft, margin, viewWidth - bubbleMaxWidth - margin);
  const desiredBubbleTop = hat.y - MASCOT_INTRO_LAYOUT.bubbleLift;
  const bubbleTop = clamp(
    desiredBubbleTop,
    insets.top + spacing.sm,
    viewHeight - MASCOT_INTRO_LAYOUT.estimatedBubbleHeight - spacing.lg,
  );

  return {
    settleScale,
    settleX: settleX + MASCOT_INTRO_LAYOUT.mascotShiftX,
    settleY: settleY + MASCOT_INTRO_LAYOUT.mascotShiftY,
    bubbleMaxWidth,
    bubbleLeft,
    bubbleTop,
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
