import type { ImageSourcePropType } from 'react-native';

import type { JourneyChapterId } from './journeyChapters';

export const JOURNEY_CHAPTER_IMAGES: Record<JourneyChapterId, ImageSourcePropType> = {
  'week-1': require('../../../../assets/images/app/journey/journey-days-01-07.png'),
  'week-2': require('../../../../assets/images/app/journey/journey-days-08-14.png'),
  'week-3': require('../../../../assets/images/app/journey/journey-days-15-21.png'),
  'week-4': require('../../../../assets/images/app/journey/journey-days-22-28.png'),
  finish: require('../../../../assets/images/app/journey/journey-days-29-30.png'),
};

export const JOURNEY_SPRITES = {
  mascotIdle: require('../../../../assets/images/app/journey/journey-mascot-idle.png'),
  mascotWalk: require('../../../../assets/images/app/journey/journey-mascot-walk.png'),
  mascotLook: require('../../../../assets/images/app/journey/journey-mascot-look.png'),
  mascotSit: require('../../../../assets/images/app/journey/journey-mascot-sit.png'),
  mascotCelebrate: require('../../../../assets/images/app/journey/journey-mascot-celebrate.png'),
  checkpointSign: require('../../../../assets/images/app/journey/journey-checkpoint-sign.png'),
} as const;
