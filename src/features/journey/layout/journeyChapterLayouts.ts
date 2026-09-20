export type JourneyLabelSide = 'left' | 'right';

export type JourneyMascotOffset = {
  x: number;
  y: number;
};

/**
 * One day marker in source-image space (0–1).
 * No task titles here — artwork is environment only.
 */
export type JourneyNodeLayout = {
  day: number;
  x: number;
  y: number;
  labelSide: JourneyLabelSide;
  checkpoint?: boolean;
  mascotOffset?: JourneyMascotOffset;
};

export type JourneyChapterId = 'week-1' | 'week-2' | 'week-3' | 'week-4' | 'finish';

/**
 * Hand-tuned to the five journey backgrounds so markers sit on the road.
 * y=0 is the top of the illustration; y=1 is the bottom.
 * Cover-crop keeps roughly y=0.20–0.82 in view on a phone chapter page.
 */
export const JOURNEY_CHAPTER_LAYOUTS: Record<JourneyChapterId, readonly JourneyNodeLayout[]> = {
  'week-1': [
    { day: 1, x: 0.58, y: 0.76, labelSide: 'left', mascotOffset: { x: -0.12, y: -0.01 } },
    { day: 2, x: 0.58, y: 0.63, labelSide: 'left' },
    { day: 3, x: 0.48, y: 0.53, labelSide: 'right' },
    { day: 4, x: 0.61, y: 0.45, labelSide: 'left' },
    { day: 5, x: 0.55, y: 0.39, labelSide: 'left' },
    { day: 6, x: 0.52, y: 0.355, labelSide: 'right' },
    {
      day: 7,
      x: 0.5,
      y: 0.33,
      labelSide: 'right',
      checkpoint: true,
      mascotOffset: { x: 0.12, y: 0.01 },
    },
  ],
  'week-2': [
    { day: 8, x: 0.56, y: 0.75, labelSide: 'left', mascotOffset: { x: -0.12, y: -0.01 } },
    { day: 9, x: 0.58, y: 0.64, labelSide: 'left' },
    { day: 10, x: 0.5, y: 0.55, labelSide: 'right' },
    { day: 11, x: 0.52, y: 0.47, labelSide: 'left' },
    { day: 12, x: 0.46, y: 0.42, labelSide: 'right' },
    { day: 13, x: 0.47, y: 0.37, labelSide: 'right' },
    {
      day: 14,
      x: 0.46,
      y: 0.34,
      labelSide: 'right',
      checkpoint: true,
      mascotOffset: { x: 0.12, y: 0.01 },
    },
  ],
  'week-3': [
    { day: 15, x: 0.6, y: 0.76, labelSide: 'left', mascotOffset: { x: -0.12, y: -0.01 } },
    { day: 16, x: 0.56, y: 0.63, labelSide: 'left' },
    { day: 17, x: 0.52, y: 0.54, labelSide: 'right' },
    { day: 18, x: 0.62, y: 0.47, labelSide: 'left' },
    { day: 19, x: 0.54, y: 0.41, labelSide: 'right' },
    { day: 20, x: 0.56, y: 0.36, labelSide: 'left' },
    {
      day: 21,
      x: 0.46,
      y: 0.322,
      labelSide: 'right',
      checkpoint: true,
      mascotOffset: { x: 0.12, y: 0.01 },
    },
  ],
  'week-4': [
    { day: 22, x: 0.66, y: 0.76, labelSide: 'left', mascotOffset: { x: -0.12, y: -0.01 } },
    { day: 23, x: 0.64, y: 0.62, labelSide: 'left' },
    { day: 24, x: 0.58, y: 0.52, labelSide: 'right' },
    { day: 25, x: 0.6, y: 0.46, labelSide: 'left' },
    { day: 26, x: 0.52, y: 0.4, labelSide: 'right' },
    { day: 27, x: 0.5, y: 0.355, labelSide: 'right' },
    {
      day: 28,
      x: 0.46,
      y: 0.33,
      labelSide: 'right',
      checkpoint: true,
      mascotOffset: { x: 0.12, y: 0.01 },
    },
  ],
  finish: [
    { day: 29, x: 0.56, y: 0.7, labelSide: 'left', mascotOffset: { x: -0.12, y: -0.01 } },
    {
      day: 30,
      x: 0.4,
      y: 0.36,
      labelSide: 'right',
      mascotOffset: { x: 0.12, y: -0.02 },
    },
  ],
};

export function getJourneyNodeLayout(
  chapterId: JourneyChapterId,
  day: number,
): JourneyNodeLayout | undefined {
  return JOURNEY_CHAPTER_LAYOUTS[chapterId].find((node) => node.day === day);
}
