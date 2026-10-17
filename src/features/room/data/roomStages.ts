import type { MascotReaction } from '../../../components/mascot/mascotAnimations';

export type RoomStageId = 'corner' | 'nook' | 'cozy' | 'yours' | 'home';

export type RoomMilestone = {
  /** Small caps line above the card, e.g. "WEEK 1 COMPLETE". */
  kicker: string;
  text: string;
  /** What the mascot says when the room grows. */
  line: string;
  reaction: MascotReaction;
};

export type RoomStage = {
  id: RoomStageId;
  /** Check-ins needed to reach this stage. */
  fromCheckIns: number;
  /** Shown on the room label, e.g. "your nook · 7 things". */
  name: string;
  milestone?: RoomMilestone;
};

/** One season of the room: a little friend each day, a bigger upgrade each week. */
export const ROOM_STAGES: readonly RoomStage[] = [
  { id: 'corner', fromCheckIns: 0, name: 'your corner' },
  {
    id: 'nook',
    fromCheckIns: 7,
    name: 'your nook',
    milestone: {
      kicker: 'WEEK 1 COMPLETE',
      text: 'your corner grew into a nook',
      line: 'we have a window now! wooo!',
      reaction: 'hug',
    },
  },
  {
    id: 'cozy',
    fromCheckIns: 14,
    name: 'cozy room',
    milestone: {
      kicker: 'WEEK 2 COMPLETE',
      text: 'it’s a whole room now',
      line: 'a mushroom lamp! it’s so cute.',
      reaction: 'hug',
    },
  },
  {
    id: 'yours',
    fromCheckIns: 21,
    name: 'your room',
    milestone: {
      kicker: 'WEEK 3 COMPLETE',
      text: 'it really feels like yours',
      line: 'star lights! I love it here.',
      reaction: 'hug',
    },
  },
  {
    id: 'home',
    fromCheckIns: 30,
    name: 'home',
    milestone: {
      kicker: 'SEASON 1 COMPLETE',
      text: 'you built a home, one day at a time',
      line: 'we did it. this is ours. 🤍',
      reaction: 'jump',
    },
  },
];

/** Little friends drawn so far; later check-ins still count toward the label. */
export const ROOM_ITEM_COUNT = 5;

export const SEASON_LENGTH_DAYS = 30;

/** A year of seasons. Each season builds one room; together they make a home. */
export const SEASON_ROOMS: readonly string[] = [
  'cozy corner',
  'reading nook',
  'little kitchen',
  'garden window',
  'art corner',
  'music room',
  'tea room',
  'star attic',
  'bubble bath',
  'craft table',
  'sunroom',
  'front porch',
];

/** One small picture per season room, in SEASON_ROOMS order. */
export const SEASON_ROOM_ICONS: readonly string[] = [
  '🛋️',
  '📚',
  '🍳',
  '🪴',
  '🎨',
  '🎵',
  '🍵',
  '⭐',
  '🛁',
  '🧶',
  '☀️',
  '🏡',
];

export const NAME_TOKEN = '{name}';

/** The first time the room appears, the mascot introduces it over three taps. */
export const ROOM_INTRO: readonly { reaction: MascotReaction; line: string }[] = [
  { reaction: 'wave', line: `hey ${NAME_TOKEN}! 👋 look, this is our corner.` },
  {
    reaction: 'jump',
    line: 'did you know? it grows every time you check in. something new every day!',
  },
  { reaction: 'hug', line: 'wooo. I love you 🤍 let’s make it cozy together.' },
];
