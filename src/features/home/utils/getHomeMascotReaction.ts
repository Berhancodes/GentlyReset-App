import {
  getMascotReactionPool,
  MASCOT_ANIMATIONS,
  MASCOT_REACTIONS,
  pickMascotReaction,
  type MascotAnimation,
  type MascotReaction,
} from '../../../components/mascot/mascotAnimations';

export const HOME_MASCOT_POSES = MASCOT_ANIMATIONS;
export type HomeMascotPose = MascotAnimation;
export type HomeMascotReaction = MascotReaction;
export const HOME_MASCOT_REACTIONS = MASCOT_REACTIONS;
export const getHomeMascotReactionPool = getMascotReactionPool;
export const pickHomeMascotReaction = pickMascotReaction;

/** Where today stands, from the mascot's point of view. */
export type HomeMascotDayState = 'notStarted' | 'started' | 'done' | 'missedYesterday';

export type HomeMascotBubbleContext = {
  firstName?: string;
  dayState: HomeMascotDayState;
  /** Current streak; only mentioned once today is done. */
  streak: number;
  /** What he said last, so the same line never comes twice in a row. */
  previousLine?: string;
};

/** About every other tap is a tip (nudge, how the app works, or a cute line) instead of a reaction. */
const TIP_CHANCE = 1 / 2;

/** Gentle nudges that fit where today stands. Never guilt. */
const NUDGES: Record<HomeMascotDayState, readonly string[]> = {
  notStarted: ['Check in today to keep your streak going.', 'Your reset is waiting on Journey.'],
  started: ['Three small ticks and today is done.', "You're closer than you think."],
  done: ['Come back tomorrow to keep your streak.', 'Rest up. Tomorrow is a new step.'],
  missedYesterday: ["No restart needed. Just today's step.", 'Pick up right where you left off.'],
};

/**
 * How the app works, in the mascot's voice. True in every state, so any can come up any day.
 * There are deliberately more of these than cute lines, so tips are mostly helpful.
 */
const APP_GUIDE: readonly string[] = [
  'Every check-in on Journey adds a new friend to our room.',
  'Every 7 days our room gets a big upgrade. Day 7 brings a window!',
  'Finish 30 days and our room becomes a home. That’s one season.',
  'Tap the season pill up top to see all 12 rooms in your year.',
  'Missed a day? Nothing in our room disappears. Just continue.',
  'Check in on Journey, then come back. Something new will be here.',
  'Short on time? Today’s step only takes a few minutes.',
  'Did you know? Your Journey changes with the real seasons.',
  'Did you know? Tap me on Journey to open your reset.',
  'Did you know? The map on Journey shows your streak and calendar.',
  'One line in your journal is enough. It’s private, just for you.',
  'In Journal, slide the sack to show how heavy today felt.',
  'Add a friend in World and they can send you a kind postcard.',
  'Friends only see your day. Never your journal.',
  'Sign in on You and your progress is backed up.',
];

/** Just for fun, a few at a time. */
const CUTE_LINES: readonly string[] = [
  "Small steps count. I'm basically all small steps.",
  "I named my hat. It's called Hat.",
  'Did you know? I nap best after you check in.',
  "Psst. You're doing better than you think.",
  "I'm small, but my cheering is loud.",
  'Did you know? Leaves always come back. So do you.',
  "I'd high-five you, but my arms are tiny.",
  "Did you know? I'm your biggest fan. Literally.",
];

/** Streak length from which the jump celebrates it. */
const STREAK_SHOUTOUT = 3;
const NAME = '{name}';

/** Short lines per reaction and day state; one is picked at random each tap. */
const BUBBLE_LINES: Record<HomeMascotReaction, Record<HomeMascotDayState, readonly string[]>> = {
  wave: {
    notStarted: [`Hey, ${NAME} 👋`, "Oh hi! You're here."],
    started: ['Welcome back. Almost there.'],
    done: ['See you tomorrow 👋'],
    missedYesterday: ['Hey, you came back 👋'],
  },
  jump: {
    notStarted: ['Ready when you are!', "Today's a good day to start."],
    started: ["You started! That's the hard part."],
    done: ['You did it today!'],
    missedYesterday: ['Back at it! Love that.'],
  },
  hug: {
    notStarted: ['Be a little kinder to yourself today.'],
    started: ['Take your time. No rush.'],
    done: ['You did enough today.'],
    missedYesterday: ["Yesterday doesn't undo you.", 'Today still counts.'],
  },
  wiggle: {
    notStarted: ['Shake off the day first.'],
    started: ['Wiggle break, then finish!'],
    done: ['Victory wiggle!'],
    missedYesterday: ['Shaking off yesterday.'],
  },
};

export function getHomeMascotDayState(input: {
  todayStarted: boolean;
  todayCompleted: boolean;
  missedYesterday: boolean;
}): HomeMascotDayState {
  if (input.todayCompleted) {
    return 'done';
  }
  if (input.todayStarted) {
    return 'started';
  }
  return input.missedYesterday ? 'missedYesterday' : 'notStarted';
}

/**
 * The line the mascot says after a tap: usually a reaction that fits the move
 * and the day, sometimes a tip. Never repeats `previousLine`.
 * `random` is drawn twice: once to choose tip or reaction, once to pick the line.
 */
export function getHomeMascotBubble(
  reaction: HomeMascotReaction,
  context: HomeMascotBubbleContext,
  random: () => number = Math.random,
): string {
  const useTip = random() < TIP_CHANCE;
  const pool = useTip
    ? [...NUDGES[context.dayState], ...APP_GUIDE, ...CUTE_LINES]
    : getReactionLines(reaction, context);
  const fresh = pool.filter((line) => fillName(line, context.firstName) !== context.previousLine);
  const choices = fresh.length > 0 ? fresh : pool;
  const line = choices[Math.min(choices.length - 1, Math.floor(random() * choices.length))] ?? '';
  return fillName(line, context.firstName);
}

function getReactionLines(
  reaction: HomeMascotReaction,
  context: HomeMascotBubbleContext,
): string[] {
  const lines = [...BUBBLE_LINES[reaction][context.dayState]];
  if (reaction === 'jump' && context.dayState === 'done' && context.streak >= STREAK_SHOUTOUT) {
    lines.push(`${context.streak} days in a row!`);
  }
  return lines;
}

function fillName(line: string, firstName: string | undefined): string {
  if (!line.includes(NAME)) {
    return line;
  }
  const trimmed = firstName?.trim();
  const name = trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
  return name ? line.replace(NAME, name) : 'Hey 👋';
}

/** What the bubble says before any tap, by time of day. */
export function getHomeMascotIdleBubble(hour: number): string {
  if (hour < 12) {
    return 'tap me';
  }
  if (hour < 17) {
    return 'say hi?';
  }
  return 'how was today?';
}
