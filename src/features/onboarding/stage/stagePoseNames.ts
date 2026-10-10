/** Poses the onboarding mascot can take on the clean stage. */
export const STAGE_POSES = [
  'idle-listen',
  'react-warm',
  'react-thinking',
  'react-low',
  'react-oof',
  'react-hopeful',
  'cheer',
  'carry-sack',
  'sack-down',
  'hold-hourglass',
  'tuck-note',
  'breathe-calm',
  'plant-sprout',
] as const;

export type StagePose = (typeof STAGE_POSES)[number];
