/**
 * Journal notebook overlay geometry.
 *
 * Measured from `journal-notebook.png` (1536×1024) with PIL so native text
 * can sit on the printed writing lines as the page scales.
 */

export const JOURNAL_NOTEBOOK_ART = {
  width: 1536,
  height: 1024,
} as const;

export const JOURNAL_NOTEBOOK_ASPECT = JOURNAL_NOTEBOOK_ART.width / JOURNAL_NOTEBOOK_ART.height;

export const JOURNAL_MASCOT_ART = {
  width: 1374,
  height: 1145,
} as const;

export const JOURNAL_FLORA_ART = {
  width: 1374,
  height: 1145,
} as const;

export const JOURNAL_LEAVES_ART = {
  width: 1293,
  height: 1216,
} as const;

/**
 * Ruled lines in image space.
 * First line y=349; following lines ~66px apart through y=809.
 */
export const JOURNAL_NOTEBOOK_LINES = {
  firstLineTop: 349 / JOURNAL_NOTEBOOK_ART.height,
  gap: 66 / JOURNAL_NOTEBOOK_ART.height,
  count: 8,
} as const;

/**
 * Safe writing box inside the page (fractions of the notebook).
 * Avoids the spiral binding, top-right flower, and bottom grass.
 */
export const JOURNAL_NOTEBOOK_CONTENT = {
  left: 0.168,
  right: 0.09,
  top: 0.1,
  bottom: 0.155,
} as const;

/** Seated mascot, relative to the notebook box. */
export const JOURNAL_MASCOT_LAYOUT = {
  width: 0.22,
  right: -0.015,
  bottom: -0.11,
} as const;

/** Bottom-left flora, relative to the notebook box. */
export const JOURNAL_FLORA_LAYOUT = {
  width: 0.3,
  left: -0.055,
  bottom: -0.07,
} as const;

/** Hanging leaves, relative to the Journal screen. */
export const JOURNAL_LEAVES_LAYOUT = {
  width: 0.3,
  top: -0.012,
  right: -0.06,
} as const;

export function toPercent(value: number): `${number}%` {
  return `${value * 100}%` as `${number}%`;
}

export function getNotebookLineHeight(notebookHeight: number): number {
  return notebookHeight * JOURNAL_NOTEBOOK_LINES.gap;
}

export function getNotebookWritingFontSize(lineHeight: number): number {
  return Math.max(13, lineHeight * 0.78);
}
