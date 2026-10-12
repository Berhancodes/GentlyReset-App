import {
  getHomeMascotBubble,
  getHomeMascotDayState,
  getHomeMascotIdleBubble,
  getHomeMascotReactionPool,
  HOME_MASCOT_REACTIONS,
  pickHomeMascotReaction,
} from './getHomeMascotReaction';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }

  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

check(
  'full pool has every reaction and no idle',
  HOME_MASCOT_REACTIONS.length === 4 && !HOME_MASCOT_REACTIONS.includes('idle' as never),
);

const afterWave = getHomeMascotReactionPool('wave');
check(
  'previous reaction is excluded from the next pool',
  afterWave.length === 3 && !afterWave.includes('wave'),
);

check(
  'pick never repeats the previous reaction',
  pickHomeMascotReaction('wiggle', () => 0) !== 'wiggle' &&
    pickHomeMascotReaction('wiggle', () => 0.99) !== 'wiggle',
);

const fresh = { dayState: 'notStarted' as const, streak: 0 };
/** Plays back fixed random draws: first decides tip vs reaction, second picks the line. */
function draws(...values: number[]) {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)] ?? 0;
}
const REACTION = 0.9;
const TIP = 0;

check(
  'wave bubble uses the given name',
  getHomeMascotBubble('wave', { ...fresh, firstName: 'Maya' }, draws(REACTION, 0)) ===
    'Hey, Maya 👋',
);
check(
  'wave bubble works without a name',
  getHomeMascotBubble('wave', fresh, draws(REACTION, 0)) === 'Hey 👋',
);
check(
  'blank name is treated as missing',
  getHomeMascotBubble('wave', { ...fresh, firstName: '   ' }, draws(REACTION, 0)) === 'Hey 👋',
);
check(
  'lines follow the day: started, done, missed yesterday',
  getHomeMascotBubble('jump', { dayState: 'started', streak: 0 }, draws(REACTION, 0)) ===
    "You started! That's the hard part." &&
    getHomeMascotBubble('hug', { dayState: 'done', streak: 1 }, draws(REACTION, 0)) ===
      'You did enough today.' &&
    getHomeMascotBubble(
      'wiggle',
      { dayState: 'missedYesterday', streak: 0 },
      draws(REACTION, 0),
    ) === 'Shaking off yesterday.',
);
check(
  'a done-day jump can celebrate a streak of 3 or more',
  getHomeMascotBubble('jump', { dayState: 'done', streak: 4 }, draws(REACTION, 0.99)) ===
    '4 days in a row!' &&
    getHomeMascotBubble('jump', { dayState: 'done', streak: 2 }, draws(REACTION, 0.99)) ===
      'You did it today!',
);
check(
  'a tip opens with the nudge that fits the day',
  getHomeMascotBubble('wave', fresh, draws(TIP, 0)) ===
    'Check in today to keep your streak going.' &&
    getHomeMascotBubble('wave', { dayState: 'done', streak: 1 }, draws(TIP, 0)) ===
      'Come back tomorrow to keep your streak.',
);
check(
  'tips never nudge a finished day to check in',
  Array.from({ length: 40 }, (_, step) =>
    getHomeMascotBubble('hug', { dayState: 'done', streak: 1 }, draws(TIP, step / 40)),
  ).every((line) => !line.startsWith('Check in today')),
);
check(
  'the same line never comes twice in a row',
  getHomeMascotBubble(
    'hug',
    { dayState: 'missedYesterday', streak: 0, previousLine: "Yesterday doesn't undo you." },
    draws(REACTION, 0),
  ) === 'Today still counts.',
);
check(
  'day state prefers done, then started, then missed yesterday',
  getHomeMascotDayState({ todayStarted: true, todayCompleted: true, missedYesterday: true }) ===
    'done' &&
    getHomeMascotDayState({ todayStarted: true, todayCompleted: false, missedYesterday: true }) ===
      'started' &&
    getHomeMascotDayState({ todayStarted: false, todayCompleted: false, missedYesterday: true }) ===
      'missedYesterday',
);
check(
  'idle prompt changes with the time of day',
  getHomeMascotIdleBubble(9) === 'tap me' &&
    getHomeMascotIdleBubble(14) === 'say hi?' &&
    getHomeMascotIdleBubble(20) === 'how was today?',
);

const tipLines = new Set<string>();
for (let step = 0; step < 200; step += 1) {
  tipLines.add(getHomeMascotBubble('wave', fresh, draws(TIP, step / 200)));
}
check(
  'tips explain how the room grows',
  tipLines.has('Every check-in on Journey adds a new friend to our room.'),
);
const cuteSamples = [
  "I'm small, but my cheering is loud.",
  "I named my hat. It's called Hat.",
  "Psst. You're doing better than you think.",
];
const cuteSeen = [...tipLines].filter((line) => cuteSamples.includes(line)).length;
check(
  'tips are mostly helpful, with a little fun mixed in',
  cuteSeen > 0 && tipLines.size - cuteSeen > cuteSeen * 3,
);
check(
  'reactions and tips come up about equally',
  getHomeMascotBubble('wave', fresh, draws(0.49, 0)) !==
    getHomeMascotBubble('wave', fresh, draws(0.51, 0)),
);

if (failed > 0) {
  throw new Error(`${failed} home mascot reaction check(s) failed`);
}

console.log('\nall home mascot reaction checks passed');
