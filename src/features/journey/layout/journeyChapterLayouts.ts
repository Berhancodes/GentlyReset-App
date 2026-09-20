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
 */
export const JOURNEY_CHAPTER_LAYOUTS: Record<JourneyChapterId, readonly JourneyNodeLayout[]> = {
  'week-1': [
    { day: 1, x: 0.5, y: 0.86, labelSide: 'left', mascotOffset: { x: -0.14, y: -0.03 } },
    { day: 2, x: 0.6, y: 0.74, labelSide: 'left' },
    { day: 3, x: 0.38, y: 0.63, labelSide: 'right' },
    { day: 4, x: 0.58, y: 0.5, labelSide: 'left' },
    { day: 5, x: 0.47, y: 0.4, labelSide: 'right' },
    { day: 6, x: 0.5, y: 0.32, labelSide: 'left' },
    {
      day: 7,
      x: 0.48,
      y: 0.245,
      labelSide: 'right',
      checkpoint: true,
      mascotOffset: { x: 0.12, y: -0.02 },
    },
  ],
  'week-2': [
    { day: 8, x: 0.48, y: 0.86, labelSide: 'right', mascotOffset: { x: 0.13, y: -0.03 } },
    { day: 9, x: 0.52, y: 0.72, labelSide: 'left' },
    { day: 10, x: 0.55, y: 0.6, labelSide: 'left' },
    { day: 11, x: 0.4, y: 0.5, labelSide: 'right' },
    { day: 12, x: 0.36, y: 0.41, labelSide: 'right' },
    { day: 13, x: 0.33, y: 0.33, labelSide: 'right' },
    {
      day: 14,
      x: 0.4,
      y: 0.255,
      labelSide: 'left',
      checkpoint: true,
      mascotOffset: { x: -0.12, y: -0.02 },
    },
  ],
  'week-3': [
    { day: 15, x: 0.52, y: 0.86, labelSide: 'left', mascotOffset: { x: -0.14, y: -0.03 } },
    { day: 16, x: 0.5, y: 0.72, labelSide: 'right' },
    { day: 17, x: 0.46, y: 0.6, labelSide: 'right' },
    { day: 18, x: 0.54, y: 0.5, labelSide: 'left' },
    { day: 19, x: 0.44, y: 0.4, labelSide: 'right' },
    { day: 20, x: 0.39, y: 0.32, labelSide: 'right' },
    {
      day: 21,
      x: 0.4,
      y: 0.245,
      labelSide: 'right',
      checkpoint: true,
      mascotOffset: { x: 0.12, y: -0.02 },
    },
  ],
  'week-4': [
    { day: 22, x: 0.5, y: 0.86, labelSide: 'left', mascotOffset: { x: -0.14, y: -0.03 } },
    { day: 23, x: 0.58, y: 0.72, labelSide: 'left' },
    { day: 24, x: 0.46, y: 0.62, labelSide: 'right' },
    { day: 25, x: 0.54, y: 0.5, labelSide: 'left' },
    { day: 26, x: 0.46, y: 0.4, labelSide: 'right' },
    { day: 27, x: 0.38, y: 0.32, labelSide: 'right' },
    {
      day: 28,
      x: 0.4,
      y: 0.24,
      labelSide: 'right',
      checkpoint: true,
      mascotOffset: { x: 0.12, y: -0.02 },
    },
  ],
  finish: [
    { day: 29, x: 0.52, y: 0.7, labelSide: 'left', mascotOffset: { x: -0.13, y: -0.03 } },
    {
      day: 30,
      x: 0.36,
      y: 0.3,
      labelSide: 'right',
      mascotOffset: { x: 0.12, y: -0.04 },
    },
  ],
};

export function getJourneyNodeLayout(
  chapterId: JourneyChapterId,
  day: number,
): JourneyNodeLayout | undefined {
  return JOURNEY_CHAPTER_LAYOUTS[chapterId].find((node) => node.day === day);
}
