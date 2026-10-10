import type { StagePose } from '@/features/onboarding/stage/stagePoses';

/** Where today stands, which picks his pose, his line and the button. */
export type JourneyGardenMood = 'ready' | 'started' | 'done';

type GardenMoodCopy = {
  pose: StagePose;
  line: string;
  ctaLabel: string;
};

export const JOURNEY_GARDEN_MOODS: Record<JourneyGardenMood, GardenMoodCopy> = {
  ready: { pose: 'idle-listen', line: 'Ready when you are.', ctaLabel: "start today's reset" },
  started: {
    pose: 'react-hopeful',
    line: "Let's finish it together.",
    ctaLabel: "continue today's reset",
  },
  done: { pose: 'react-warm', line: 'See you tomorrow.', ctaLabel: "see today's reset" },
};

/** He peeks over the top of the day pop-up in this pose. */
export const JOURNEY_GARDEN_SHEET_POSE: StagePose = 'react-warm';

/**
 * One spot per day of the season, in the order sprouts come up: alternating
 * sides, working outwards, then back a row. `x` is points from his centre,
 * `y` is points up from the ground, `scale` shrinks the rows further back.
 */
export const JOURNEY_GARDEN_SPOTS: readonly { x: number; y: number; scale: number }[] = Array.from(
  { length: 30 },
  (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const step = Math.floor(index / 2);
    const row = Math.floor(step / 5);
    const column = step % 5;
    return {
      x: side * (68 + column * 20 + (row % 2) * 10),
      y: row * 12 + (column % 2) * 3,
      scale: 1 - row * 0.14,
    };
  },
);
