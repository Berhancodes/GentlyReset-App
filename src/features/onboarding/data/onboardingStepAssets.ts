import type { ImageSourcePropType } from 'react-native';

import {
  getOnboardingIllustrationSource,
  getOptionIconSource,
  ONBOARDING_ILLUSTRATION_SOURCES,
  PAYWALL_MASCOT_ART,
  PAYWALL_SKY_ART,
  SCALE_ICON_SOURCES,
} from '@/features/onboarding/data/onboardingAssets';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import type { OnboardingStep } from '@/features/onboarding/types/onboarding';

const WELCOME_ART = require('../../../../assets/images/onboarding/welcome-first-screen.png');
const MASCOT_RUN = require('../../../../assets/images/onboarding/mascot-run-intro.gif');
const MASCOT_RUN_FINAL = require('../../../../assets/images/onboarding/mascot-run-intro-final.png');
const THINKING_ART = require('../../../../assets/images/onboarding/reason/reason-mascot-thinking.png');
const HANG_LOOP = require('../../../../assets/images/onboarding/consistency/hardest-mascot-hang.gif');
const HANG_STILL = require('../../../../assets/images/onboarding/consistency/hardest-mascot-hang-still.png');
const LOUNGE_ART = require('../../../../assets/images/onboarding/support-timing/support-mascot-lounge.png');
const BELT_ART = require('../../../../assets/images/onboarding/missed-day/missed-mascot-belt.png');
const JOURNAL_ART = require('../../../../assets/images/onboarding/reset-reason/reset-mascot-journal.png');
const BREATHE_LOOP = require('../../../../assets/images/mascot/mascot-breathe.gif');
const BREATHE_STILL = require('../../../../assets/images/mascot/mascot-breathe-still.png');
const NOTICE_LOOP = require('../../../../assets/images/onboarding/noticing/noticing-mascot-boba.gif');
const NOTICE_STILL = require('../../../../assets/images/onboarding/noticing/noticing-mascot-boba-still.png');
const BUILD_LOOP = require('../../../../assets/images/mascot/mascot-building-loop.gif');
const BUILD_STILL = require('../../../../assets/images/mascot/mascot-building-still.png');
const WAVE_LOOP = require('../../../../assets/images/mascot/mascot-companion-loop.gif');
const WAVE_STILL = require('../../../../assets/images/mascot/mascot-companion-still.png');
const NOTICED_ART = require('../../../../assets/images/onboarding/noticed/noticed-mascot.png');
const NEW_LIFE_LOOP = require('../../../../assets/images/onboarding/new-life/new-life-mascot-box.gif');
const NEW_LIFE_STILL = require('../../../../assets/images/onboarding/new-life/new-life-mascot-box-still.png');

function pushSource(sources: ImageSourcePropType[], source: ImageSourcePropType | undefined) {
  if (source) {
    sources.push(source);
  }
}

function getSceneSources(step: OnboardingStep): ImageSourcePropType[] {
  switch (step.id) {
    case 'welcome':
      return [WELCOME_ART];
    case 'mascotRunIntro':
      return [MASCOT_RUN, MASCOT_RUN_FINAL];
    case 'reason':
      return [THINKING_ART];
    case 'consistencyStage':
      return [HANG_LOOP, HANG_STILL];
    case 'supportTiming':
      return [LOUNGE_ART];
    case 'missedDayResponse':
      return [BELT_ART];
    case 'resetReason':
      return [JOURNAL_ART];
    case 'noticedDetails':
      return [NOTICED_ART];
    default:
      break;
  }

  if (step.type === 'story') {
    if (step.scene === 'breathing') {
      return [BREATHE_LOOP, BREATHE_STILL];
    }
    if (step.scene === 'noticing') {
      return [NOTICE_LOOP, NOTICE_STILL];
    }
    if (step.scene === 'newLife') {
      return [NEW_LIFE_LOOP, NEW_LIFE_STILL];
    }
    if (step.scene === 'companion') {
      return [WAVE_LOOP, WAVE_STILL];
    }
  }

  if (step.type === 'loading' && step.scene === 'building') {
    return [BUILD_LOOP, BUILD_STILL];
  }

  if (step.type === 'paywall') {
    return [PAYWALL_SKY_ART, PAYWALL_MASCOT_ART];
  }

  return [];
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

  if (step.type === 'singleChoice' || step.type === 'multiChoice') {
    for (const option of step.options) {
      pushSource(sources, getOptionIconSource(option.id));
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
