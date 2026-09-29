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
} as const;

export const MASCOT_INTRO_LAYOUT = {
  settleScale: 0.85,
  translateXRatio: 0.108,
  translateXMin: 36,
  translateXMax: 48,
  bubbleWidthRatio: 0.6,
  bubbleMaxWidth: 248,
  bubbleTailGap: 20,
  bubbleTailInset: 28,
  estimatedBubbleHeight: 118,
  characterToForm: 20,
  formGap: 12,
  fieldHeight: 56,
  buttonHeight: 64,
  formMaxWidth: 286,
} as const;

export type MascotIntroLayout = {
  settleScale: number;
  settleX: number;
  settleY: number;
  bubbleMaxWidth: number;
  bubbleLeft: number;
  bubbleBottom: number;
  formWidth: number;
  formLeft: number;
  formTop: number;
  formGap: number;
  fieldHeight: number;
  buttonTop: number;
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

  const margin = spacing.md;
  const bubbleMaxWidth = Math.min(
    Math.round(viewWidth * MASCOT_INTRO_LAYOUT.bubbleWidthRatio),
    MASCOT_INTRO_LAYOUT.bubbleMaxWidth,
    viewWidth - margin * 2,
  );

  const formWidth = Math.min(viewWidth - spacing.lg * 2, MASCOT_INTRO_LAYOUT.formMaxWidth);
  const formHeight =
    MASCOT_INTRO_LAYOUT.fieldHeight +
    MASCOT_INTRO_LAYOUT.formGap +
    MASCOT_INTRO_LAYOUT.buttonHeight;
  const maxFormTop = viewHeight - formHeight - Math.max(insets.bottom, spacing.md);

  const unshiftedFeet = applySettle(imageX(MASCOT_BOUNDS.centerX), imageY(MASCOT_BOUNDS.bottom), 0);
  const overflow = unshiftedFeet.y + MASCOT_INTRO_LAYOUT.characterToForm - maxFormTop;
  const settleY = overflow > 0 ? -overflow : 0;

  const hat = applySettle(imageX(MASCOT_BOUNDS.hatRight), imageY(MASCOT_BOUNDS.hatTop), settleY);
  const feet = applySettle(imageX(MASCOT_BOUNDS.centerX), imageY(MASCOT_BOUNDS.bottom), settleY);
  const characterCenter = applySettle(
    imageX(MASCOT_BOUNDS.centerX),
    imageY((MASCOT_BOUNDS.top + MASCOT_BOUNDS.bottom) / 2),
    settleY,
  );

  const unclampedBubbleLeft = hat.x - MASCOT_INTRO_LAYOUT.bubbleTailInset - spacing.xs;
  const bubbleLeft = clamp(unclampedBubbleLeft, margin, viewWidth - bubbleMaxWidth - margin);

  const desiredBubbleBottom = viewHeight - hat.y + MASCOT_INTRO_LAYOUT.bubbleTailGap;
  const maxBubbleBottom =
    viewHeight - (insets.top + spacing.xs + MASCOT_INTRO_LAYOUT.estimatedBubbleHeight);
  const bubbleBottom = Math.min(desiredBubbleBottom, maxBubbleBottom);

  const formLeft = clamp(
    characterCenter.x - formWidth / 2,
    spacing.lg,
    Math.max(spacing.lg, viewWidth - formWidth - spacing.lg),
  );
  const formTop = Math.min(feet.y + MASCOT_INTRO_LAYOUT.characterToForm, maxFormTop);

  return {
    settleScale,
    settleX,
    settleY,
    bubbleMaxWidth,
    bubbleLeft,
    bubbleBottom,
    formWidth,
    formLeft,
    formTop,
    formGap: MASCOT_INTRO_LAYOUT.formGap,
    fieldHeight: MASCOT_INTRO_LAYOUT.fieldHeight,
    buttonTop: formTop + MASCOT_INTRO_LAYOUT.fieldHeight + MASCOT_INTRO_LAYOUT.formGap,
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

  const formBottom = layout.buttonTop + MASCOT_INTRO_LAYOUT.buttonHeight;
  const visibleBottom = viewHeight - keyboardHeight;
  return Math.max(0, formBottom - visibleBottom + spacing.md);
}
