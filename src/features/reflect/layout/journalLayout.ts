/**
 * Journal screen layout. Writing-card height and mascot size scale with the
 * viewport; the sky PNG is cover-cropped (never stretched or tiled).
 */

export const JOURNAL_SKY_ART = {
  width: 941,
  height: 1672,
} as const;

export const JOURNAL_SKY_ART_ASPECT = JOURNAL_SKY_ART.width / JOURNAL_SKY_ART.height;

export const JOURNAL_MASCOT_WRITING_ART = {
  width: 1536,
  height: 1024,
} as const;

export const JOURNAL_MASCOT_WRITING_ASPECT =
  JOURNAL_MASCOT_WRITING_ART.width / JOURNAL_MASCOT_WRITING_ART.height;

/**
 * Cover-crop focal point (0–1 in image space).
 * Keep the sun and cloud band at the top; crop extra cream at the sides first.
 */
export const JOURNAL_SKY_COVER_FOCUS = {
  x: 0.5,
  y: 0,
} as const;

/** Writing mascot, relative to the writing card. */
export const JOURNAL_MASCOT_WRITING_LAYOUT = {
  width: 0.46,
  right: 0,
  bottom: 0,
} as const;

export const JOURNAL_WRITING_CARD = {
  minHeightFloor: 260,
  minHeightCeiling: 360,
  heightRatio: 0.38,
  lineGap: 28,
} as const;

export type CoverLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export function getJournalSkyCoverLayout(viewWidth: number, viewHeight: number): CoverLayout {
  const safeHeight = Math.max(viewHeight, 1);
  const viewAspect = viewWidth / safeHeight;

  if (viewAspect > JOURNAL_SKY_ART_ASPECT) {
    const width = viewWidth;
    const height = viewWidth / JOURNAL_SKY_ART_ASPECT;
    const extra = Math.max(0, height - safeHeight);
    return {
      width,
      height,
      left: 0,
      top: -extra * JOURNAL_SKY_COVER_FOCUS.y,
    };
  }

  const height = safeHeight;
  const width = safeHeight * JOURNAL_SKY_ART_ASPECT;
  const extra = Math.max(0, width - viewWidth);
  return {
    width,
    height,
    left: -extra * JOURNAL_SKY_COVER_FOCUS.x,
    top: 0,
  };
}

export function getJournalWritingCardMinHeight(windowHeight: number): number {
  const proportional = windowHeight * JOURNAL_WRITING_CARD.heightRatio;
  return Math.max(
    JOURNAL_WRITING_CARD.minHeightFloor,
    Math.min(proportional, JOURNAL_WRITING_CARD.minHeightCeiling),
  );
}

export function toPercent(value: number): `${number}%` {
  return `${value * 100}%` as `${number}%`;
}
