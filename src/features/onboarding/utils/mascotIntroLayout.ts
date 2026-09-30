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
  translateXRatio: 0.13,
  translateXMin: 40,
  translateXMax: 56,
  clusterCenterRatio: 0.39,
  bubbleMaxWidth: 126,
  bubbleHeadGap: 2,
  bubbleLift: 22,
  estimatedBubbleHeight: 104,
  characterToForm: 36,
  fieldHeight: 54,
  submitSize: 40,
  formWidthRatio: 0.83,
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
  const settleX = -clamp(
    viewWidth * MASCOT_INTRO_LAYOUT.translateXRatio,
    MASCOT_INTRO_LAYOUT.translateXMin,
    MASCOT_INTRO_LAYOUT.translateXMax,
  );

  const originX = viewWidth / 2;
  const originY = viewHeight / 2;
  const applySettle = (x: number, y: number, extraY: number) => ({
    x: (x - originX) * settleScale + originX + settleX,
    y: (y - originY) * settleScale + originY + extraY,
  });

  const imageX = (ratio: number) => imageLeft + ratio * imageWidth;
  const imageY = (ratio: number) => imageTop + ratio * imageHeight;

  const formWidth = Math.min(
    Math.round(viewWidth * MASCOT_INTRO_LAYOUT.formWidthRatio),
    viewWidth - spacing.lg * 2,
  );
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

  const head = applySettle(imageX(MASCOT_BOUNDS.headRight), imageY(MASCOT_BOUNDS.faceTop), settleY);
  const feet = applySettle(imageX(MASCOT_BOUNDS.centerX), imageY(MASCOT_BOUNDS.bottom), settleY);

  const margin = spacing.md;
  const bubbleMaxWidth = Math.min(MASCOT_INTRO_LAYOUT.bubbleMaxWidth, viewWidth - margin * 2);
  const desiredBubbleLeft = head.x + MASCOT_INTRO_LAYOUT.bubbleHeadGap;
  const bubbleLeft = clamp(desiredBubbleLeft, margin, viewWidth - bubbleMaxWidth - margin);
  const desiredBubbleTop = head.y - MASCOT_INTRO_LAYOUT.bubbleLift;
  const bubbleTop = clamp(
    desiredBubbleTop,
    insets.top + spacing.sm,
    viewHeight - MASCOT_INTRO_LAYOUT.estimatedBubbleHeight - spacing.lg,
  );

  return {
    settleScale,
    settleX,
    settleY,
    bubbleMaxWidth,
    bubbleLeft,
    bubbleTop,
    formWidth,
    formLeft: (viewWidth - formWidth) / 2,
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
