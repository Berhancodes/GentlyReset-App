import type { ImageSourcePropType } from 'react-native';

import type { OnboardingIllustrationKey } from '@/features/onboarding/types/onboarding';

const ICONS = {
  brain: require('../../../../assets/onboarding/icons/brain.png'),
  signpost: require('../../../../assets/onboarding/icons/signpost.png'),
  starFace: require('../../../../assets/onboarding/icons/star-face.png'),
  dumbbell: require('../../../../assets/onboarding/icons/dumbbell.png'),
  hearts: require('../../../../assets/onboarding/icons/hearts.png'),
  calendar: require('../../../../assets/onboarding/icons/calendar.png'),
  sunFace: require('../../../../assets/onboarding/icons/sun-face.png'),
  sprout: require('../../../../assets/onboarding/icons/sprout.png'),
  target: require('../../../../assets/onboarding/icons/target.png'),
  calendarDone: require('../../../../assets/onboarding/icons/calendar-done.png'),
  battery: require('../../../../assets/onboarding/icons/battery.png'),
  sunriseLeaves: require('../../../../assets/onboarding/icons/sunrise-leaves.png'),
  chat: require('../../../../assets/onboarding/icons/chat.png'),
  hourglass: require('../../../../assets/onboarding/icons/hourglass.png'),
  flowers: require('../../../../assets/onboarding/icons/flowers.png'),
  mountain: require('../../../../assets/onboarding/icons/mountain.png'),
  book: require('../../../../assets/onboarding/icons/book.png'),
  alarm: require('../../../../assets/onboarding/icons/alarm.png'),
  scribble: require('../../../../assets/images/onboarding/reason/tangled-scribble.png'),
  lowBattery: require('../../../../assets/images/onboarding/reason/low-battery.png'),
  patchedHeart: require('../../../../assets/images/onboarding/reason/patched-heart.png'),
  sproutingPlant: require('../../../../assets/images/onboarding/reason/sprouting-plant.png'),
  star: require('../../../../assets/images/onboarding/reason/star.png'),
  sunriseHills: require('../../../../assets/images/onboarding/reason/sunrise-hills.png'),
} as const;

export type OnboardingIllustrationMeta = {
  label: string;
  motif: 'rest' | 'carry' | 'detect' | 'path' | 'desk' | 'spark' | 'stack' | 'companion';
  aspectRatio: number;
};

const SCENE_ASPECT = 1086 / 1448;

export const ONBOARDING_ILLUSTRATIONS: Record<
  OnboardingIllustrationKey,
  OnboardingIllustrationMeta
> = {
  welcome: { label: 'Gently Reset welcome', motif: 'rest', aspectRatio: 1.5 },
  carrying: { label: 'Mascot carrying too much', motif: 'carry', aspectRatio: SCENE_ASPECT },
  detective: {
    label: 'Mascot noticing a small pattern',
    motif: 'detect',
    aspectRatio: SCENE_ASPECT,
  },
  path: { label: 'Mascot choosing a path', motif: 'path', aspectRatio: SCENE_ASPECT },
  self: { label: 'Mascot choosing a path', motif: 'path', aspectRatio: SCENE_ASPECT },
  buildingReset: { label: 'Mascot studying your answers', motif: 'desk', aspectRatio: 1536 / 1024 },
  gotYou: { label: 'Gently Reset has you', motif: 'spark', aspectRatio: SCENE_ASPECT },
  overloadedDreamer: { label: 'The Overloaded Dreamer', motif: 'stack', aspectRatio: 1 },
  softRestarter: { label: 'The Soft Restarter', motif: 'path', aspectRatio: 1 },
  almostStarter: { label: 'The Almost Starter', motif: 'path', aspectRatio: 1 },
  fadingFlame: { label: 'The Fading Flame', motif: 'rest', aspectRatio: 1 },
  allInHeart: { label: 'The All-In Heart', motif: 'rest', aspectRatio: 1 },
  quietDrain: { label: 'The Quiet Drain', motif: 'rest', aspectRatio: 1 },
  driftingCompass: { label: 'The Drifting Compass', motif: 'path', aspectRatio: 1 },
  quietStranger: { label: 'The Quiet Stranger', motif: 'path', aspectRatio: 1246 / 1263 },
  softScatter: { label: 'The Soft Scatter', motif: 'path', aspectRatio: 1 },
  companion: { label: 'Gently Reset companion', motif: 'companion', aspectRatio: SCENE_ASPECT },
  journey: { label: 'Mascot setting out on his journey', motif: 'path', aspectRatio: SCENE_ASPECT },
};

export const ONBOARDING_ILLUSTRATION_SOURCES: Partial<
  Record<OnboardingIllustrationKey, ImageSourcePropType>
> = {
  carrying: require('../../../../assets/images/mascot/mascot-carrying-too-much.png'),
  detective: require('../../../../assets/images/mascot/mascot-noticing.png'),
  path: require('../../../../assets/images/mascot/mascot-choosing-path.png'),
  buildingReset: require('../../../../assets/images/onboarding/building-reset.png'),
  overloadedDreamer: require('../../../../assets/images/reset-types/overloaded-dreamer.png'),
  softRestarter: require('../../../../assets/images/reset-types/soft-restarter.png'),
  almostStarter: require('../../../../assets/images/reset-types/almost-starter.png'),
  fadingFlame: require('../../../../assets/images/reset-types/fading-flame.png'),
  allInHeart: require('../../../../assets/images/reset-types/all-in-heart.png'),
  quietDrain: require('../../../../assets/images/reset-types/quiet-drain.png'),
  driftingCompass: require('../../../../assets/images/reset-types/drifting-compass.png'),
  quietStranger: require('../../../../assets/images/reset-types/quiet-stranger.png'),
  softScatter: require('../../../../assets/images/reset-types/soft-scatter.png'),
  companion: require('../../../../assets/images/mascot/mascot-companion.png'),
  journey: require('../../../../assets/images/mascot/mascot-30-day-journey.png'),
};

export function getOnboardingIllustrationSource(key: OnboardingIllustrationKey) {
  return ONBOARDING_ILLUSTRATION_SOURCES[key];
}

export const PAYWALL_REST_ART =
  require('../../../../assets/images/onboarding/paywall-rest.png') as ImageSourcePropType;
export const PAYWALL_SKY_ART =
  require('../../../../assets/images/onboarding/paywall-sky.png') as ImageSourcePropType;
export const PAYWALL_MASCOT_ART =
  require('../../../../assets/images/onboarding/paywall-mascot-rest.png') as ImageSourcePropType;

/**
 * Illustrated icons for the "what brought you here today?" cards.
 * Paths stay identical so Page 2 rendering does not change.
 */
export const REASON_OPTION_ICON_SOURCES: Partial<Record<string, ImageSourcePropType>> = {
  stuck: ICONS.scribble,
  overwhelmed: ICONS.lowBattery,
  'lost-motivation': ICONS.patchedHeart,
  'not-myself': ICONS.sproutingPlant,
  'could-be-better': ICONS.star,
  'fresh-start': ICONS.sunriseHills,
};

export const OPTION_ICON_SOURCES: Partial<Record<string, ImageSourcePropType>> = {
  ...REASON_OPTION_ICON_SOURCES,
  mind: ICONS.brain,
  energy: ICONS.sunFace,
  habits: ICONS.calendar,
  confidence: ICONS.starFace,
  relationships: ICONS.hearts,
  direction: ICONS.signpost,
  routine: ICONS.calendarDone,
  everything: ICONS.hourglass,
  drained: ICONS.battery,
  disconnected: ICONS.chat,
  'getting-through': ICONS.hourglass,
  'mostly-okay': ICONS.flowers,
  'pretty-good': ICONS.sunFace,
  overthink: ICONS.brain,
  'put-off': ICONS.hourglass,
  'no-energy': ICONS.battery,
  'too-much': ICONS.mountain,
  'lose-motivation': ICONS.patchedHeart,
  'afraid-wont-stick': ICONS.calendar,
  distracted: ICONS.signpost,
  'dont-know': ICONS.book,
  starting: ICONS.sprout,
  'staying-consistent': ICONS.calendarDone,
  restarting: ICONS.sunriseLeaves,
  'wake-up-better': ICONS.sunFace,
  consistent: ICONS.calendarDone,
  'quieter-mind': ICONS.brain,
  'trust-myself': ICONS.starFace,
  'more-energy': ICONS.sunFace,
  'taking-care': ICONS.flowers,
  'working-toward': ICONS.target,
  'feel-like-me': ICONS.sprout,
  calm: ICONS.flowers,
  confident: ICONS.starFace,
  motivated: ICONS.target,
  proud: ICONS.mountain,
  energized: ICONS.sunFace,
  present: ICONS.sprout,
  hopeful: ICONS.sunriseLeaves,
  'in-control': ICONS.calendarDone,
  structure: ICONS.calendar,
  exercise: ICONS.dumbbell,
  sleep: ICONS.hourglass,
  'less-phone': ICONS.book,
  'meaningful-work': ICONS.book,
  'time-for-myself': ICONS.flowers,
  'healthier-routines': ICONS.sprout,
  people: ICONS.chat,
  'keeps-promises': ICONS.calendarDone,
  'feels-calm': ICONS.flowers,
  disciplined: ICONS.target,
  'knows-direction': ICONS.signpost,
  excited: ICONS.sunFace,
  'stuck-with-it': ICONS.calendarDone,
  'feel-better': ICONS.sunFace,
  'less-hard': ICONS.hearts,
  'routine-back': ICONS.calendar,
  'something-else': ICONS.book,
  five: ICONS.alarm,
  ten: ICONS.hourglass,
  twenty: ICONS.calendar,
  'thirty-plus': ICONS.mountain,
  'wake-up': ICONS.alarm,
  'during-day': ICONS.sunFace,
  'after-work': ICONS.hourglass,
  'before-bed': ICONS.flowers,
  'whenever-struggling': ICONS.battery,
  'be-gentle': ICONS.hearts,
  'remind-what-matters': ICONS.starFace,
  'something-small': ICONS.sprout,
  accountable: ICONS.target,
  'need-to-hear': ICONS.chat,
  depends: ICONS.signpost,
  continue: ICONS.sunriseLeaves,
  'easier-day': ICONS.flowers,
  'remind-why': ICONS.book,
  'ask-what-happened': ICONS.chat,
  'little-push': ICONS.dumbbell,
  'asks-too-much': ICONS.mountain,
  'forget-apps': ICONS.hourglass,
  'no-progress': ICONS.target,
  repetitive: ICONS.calendar,
  'too-busy': ICONS.alarm,
  'not-sure': ICONS.signpost,
  in: ICONS.calendarDone,
  'scarily-accurate': ICONS.starFace,
  mostly: ICONS.flowers,
  'not-really': ICONS.signpost,
  'all-in-burn-out': ICONS.battery,
  'plan-dont-start': ICONS.calendar,
  'start-strong-fall-off': ICONS.sprout,
  'bad-day-week': ICONS.hourglass,
  'keep-changing': ICONS.signpost,
  'never-know-start': ICONS.book,
  'here-we-go': ICONS.hourglass,
  'ruined-progress': ICONS.patchedHeart,
  'restart-monday': ICONS.calendar,
  'just-lazy': ICONS.battery,
  'knew-i-wouldnt': ICONS.scribble,
  'try-again': ICONS.sprout,
  'further-ahead': ICONS.mountain,
  'get-it-together': ICONS.scribble,
  'start-tomorrow': ICONS.calendar,
  'tired-of-starting-over': ICONS.hourglass,
  'dont-know-life': ICONS.signpost,
  'miss-old-me': ICONS.hearts,
  'capable-of-more': ICONS.starFace,
};

export function getOptionIconSource(optionId: string) {
  return OPTION_ICON_SOURCES[optionId];
}

export function getReasonOptionIconSource(optionId: string) {
  return REASON_OPTION_ICON_SOURCES[optionId];
}

export const SCALE_ICON_SOURCES: Record<number, ImageSourcePropType> = {
  1: ICONS.hourglass,
  2: ICONS.battery,
  3: ICONS.sprout,
  4: ICONS.sunFace,
  5: ICONS.mountain,
};
