import type { ImageSourcePropType } from 'react-native';

import {
  getOnboardingIllustrationSource,
  ONBOARDING_ILLUSTRATION_SOURCES,
  SCALE_ICON_SOURCES,
} from '@/features/onboarding/data/onboardingAssets';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { UNLOCK_ART } from '@/features/onboarding/data/unlockArt';
import { STAGE_POSE_ART, type StagePose } from '@/features/onboarding/stage/stagePoses';
import { WELCOME_SACK_FRAMES } from '@/features/onboarding/stage/welcomeSackFrames';
import type { OnboardingStep } from '@/features/onboarding/types/onboarding';

const MASCOT_RUN = require('../../../../assets/images/onboarding/mascot-run-intro.gif');
const MASCOT_RUN_FINAL = require('../../../../assets/images/onboarding/mascot-run-intro-final.png');
const BUILD_LOOP = require('../../../../assets/images/mascot/mascot-building-loop.gif');
const BUILD_STILL = require('../../../../assets/images/mascot/mascot-building-still.png');

function pushSource(sources: ImageSourcePropType[], source: ImageSourcePropType | undefined) {
  if (source) {
    sources.push(source);
  }
}

/** Every pose a clean-stage step can show: its own, its answers' reactions, and its submit reaction. */
function getStagePoseSources(step: OnboardingStep): ImageSourcePropType[] {
  const poses = new Set<StagePose>();
  if (step.mascot) {
    poses.add(step.mascot.pose);
  }
  if (step.type === 'singleChoice' || step.type === 'multiChoice') {
    for (const option of step.options) {
      if (option.reaction) {
        poses.add(option.reaction.pose);
      }
    }
  }
  if (step.type === 'textInput' && step.submitReaction) {
    poses.add(step.submitReaction.pose);
  }
  return [...poses].map((pose) => STAGE_POSE_ART[pose].source);
}

function getSceneSources(step: OnboardingStep): ImageSourcePropType[] {
  switch (step.type) {
    case 'welcome':
      return WELCOME_SACK_FRAMES.map((frame) => frame.source);
    case 'mascotIntro':
      return [MASCOT_RUN, MASCOT_RUN_FINAL];
    case 'loading':
      return step.scene === 'building' ? [BUILD_LOOP, BUILD_STILL] : [];
    case 'planReady':
      return [UNLOCK_ART.plan.source];
    case 'promise':
      return [UNLOCK_ART.holding];
    case 'paywall':
      return [STAGE_POSE_ART['react-hopeful'].source];
    default:
      return getStagePoseSources(step);
  }
}

/**
 * Bundled images the given step mounts. Keep in sync with the screen/mascot
 * `require()` paths so prefetch hits the same Metro modules.
 */
export function getOnboardingStepAssetSources(step: OnboardingStep): ImageSourcePropType[] {
  const sources: ImageSourcePropType[] = [...getSceneSources(step)];

  if (step.illustrationKey) {
    pushSource(sources, getOnboardingIllustrationSource(step.illustrationKey));
  }

  if (step.type === 'result' || step.type === 'sharePreview') {
    for (const illustration of Object.values(ONBOARDING_ILLUSTRATION_SOURCES)) {
      pushSource(sources, illustration);
    }
  }

  if (step.type === 'scale') {
    for (const icon of Object.values(SCALE_ICON_SOURCES)) {
      pushSource(sources, icon);
    }
  }

  return sources;
}

export function getOnboardingStepAssetSourcesAt(index: number): ImageSourcePropType[] {
  const step = ONBOARDING_STEPS[index];
  if (!step) {
    return [];
  }

  return getOnboardingStepAssetSources(step);
}
