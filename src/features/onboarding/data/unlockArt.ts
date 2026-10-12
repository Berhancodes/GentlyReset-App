import { MASCOT_IDLE_STILL } from '@/components/mascot/mascotAssets';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';

/** Pictures on the plan and promise screens before the paywall. */
export const UNLOCK_ART = {
  plan: STAGE_POSE_ART['react-hopeful'],
  /** Shown in the promise circle until the animated mascot is ready. */
  holding: MASCOT_IDLE_STILL,
} as const;
