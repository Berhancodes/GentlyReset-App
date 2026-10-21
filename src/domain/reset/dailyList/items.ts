import type { FocusAreaId } from '../roadmap/focusAreas';

/**
 * The small things a day's list is built from. Each is something anyone can do
 * in a minute or two, written as "make sure you…" without the prefix.
 * Pure data; `buildDailyList` picks from it.
 */

export type DaySlot = 'morning' | 'day' | 'evening';

export type DayItemSeed = { id: string; text: string; slot: DaySlot };

const item = (id: string, slot: DaySlot, text: string): DayItemSeed => ({ id, slot, text });

/** Everyday basics; three land on every list (one per part of the day). */
export const BASIC_ITEMS: readonly DayItemSeed[] = [
  item('water-first', 'morning', 'Drink a full glass of water before you check your phone'),
  item('light', 'morning', 'Open the curtains and stand in the light for 2 minutes'),
  item('stretch', 'morning', 'Stretch your arms over your head for 3 slow breaths'),
  item('breakfast', 'morning', 'Eat something with protein before 10am'),
  item('bed-made', 'morning', 'Make your bed, even roughly'),
  item('no-scroll-wake', 'morning', 'Give yourself 10 phone-free minutes after you wake up'),
  item('outside', 'day', 'Step outside for 5 minutes, even just to the door'),
  item('refill', 'day', 'Refill your water bottle once'),
  item('lunch-away', 'day', 'Eat lunch away from a screen'),
  item('shoulders', 'day', 'Drop your shoulders and unclench your jaw'),
  item('walk', 'day', 'Take a 10-minute walk'),
  item('fresh-air', 'day', 'Open a window for some fresh air'),
  item('one-good', 'evening', 'Write down one thing that went okay today'),
  item('phone-time', 'evening', 'Pick a phone-down time tonight and set an alarm for it'),
  item('water-bed', 'evening', 'Put a glass of water by your bed for tomorrow'),
  item('tidy-five', 'evening', 'Tidy one small surface for 5 minutes'),
  item('lay-out', 'evening', 'Lay out what you need for tomorrow morning'),
  item('wind-down', 'evening', 'Dim the lights 30 minutes before bed'),
];

/** Things that help each life area, spread across the day. */
export const AREA_ITEMS: Record<FocusAreaId, readonly DayItemSeed[]> = {
  mind: [
    item('mind-breaths', 'morning', 'Take 5 slow breaths before your phone (in for 4, out for 6)'),
    item('mind-three', 'morning', 'Write the 3 things that actually matter today. Only 3'),
    item('mind-notify', 'morning', 'Turn off notifications for one app that stresses you out'),
    item('mind-intention', 'morning', 'Pick one word for how you want today to feel'),
    item(
      'mind-catch',
      'day',
      'When you catch yourself overthinking, write the thought down and move on',
    ),
    item('mind-walk', 'day', 'Walk for 10 minutes without headphones'),
    item('mind-single', 'day', 'Finish one small thing completely before starting another'),
    item('mind-pause', 'day', 'Pause for one minute and notice 3 things you can hear'),
    item('mind-news', 'day', 'Skip the news and social feeds until after lunch'),
    item('mind-dump', 'evening', 'Brain dump: write everything on your mind, no order'),
    item('mind-next', 'evening', 'Pick one worry and write its smallest next step'),
    item('mind-okay', 'evening', 'Finish the sentence: "Today was okay because…"'),
    item('mind-bedroom', 'evening', 'Charge your phone outside the bedroom tonight'),
    item('mind-sleep-breath', 'evening', 'Do 5 slow breaths lying down before sleep'),
  ],
  energy: [
    item('energy-water', 'morning', 'Drink a glass of water as soon as you wake up'),
    item('energy-sun', 'morning', 'Get 2 minutes of daylight before 10am'),
    item('energy-move', 'morning', 'Move your body for 2 minutes: march, stretch or dance'),
    item('energy-protein', 'morning', 'Add one source of protein to breakfast'),
    item('energy-stairs', 'day', 'Take the stairs or walk the long way once'),
    item('energy-snack', 'day', 'Swap one sugary snack for fruit, nuts or yogurt'),
    item('energy-stand', 'day', 'Stand up and stretch every hour you sit'),
    item('energy-caffeine', 'day', 'Have your last coffee before 2pm'),
    item('energy-veg', 'day', 'Eat one meal with something green in it'),
    item('energy-screens', 'evening', 'Put screens away 30 minutes before bed'),
    item('energy-bedtime', 'evening', 'Get into bed 15 minutes earlier than last night'),
    item('energy-tired', 'evening', 'Write what drained you today and what gave you energy'),
    item('energy-cool', 'evening', 'Make your room a little cooler and darker for sleep'),
    item('energy-shower', 'evening', 'Take a warm shower to signal the end of the day'),
  ],
  habits: [
    item('habits-same-time', 'morning', 'Wake up at the same time as yesterday'),
    item('habits-anchor', 'morning', 'Do one tiny habit right after brushing your teeth'),
    item('habits-plan', 'morning', 'Write today’s one non-negotiable on a sticky note'),
    item('habits-two-min', 'morning', 'Do something you’ve been avoiding for just 2 minutes'),
    item('habits-cue', 'day', 'Put something where you’ll see it to remind you of your habit'),
    item('habits-timer', 'day', 'Set a 10-minute timer and work on one thing until it rings'),
    item('habits-tick', 'day', 'Tick off one small thing on a paper list'),
    item('habits-remove', 'day', 'Make one bad habit harder: move it, hide it or log out of it'),
    item('habits-prep', 'day', 'Prepare one thing now that makes tomorrow easier'),
    item('habits-review', 'evening', 'Write down one promise to yourself you kept today'),
    item(
      'habits-ready',
      'evening',
      'Set up tomorrow’s first habit tonight (clothes, shoes, glass)',
    ),
    item('habits-reset', 'evening', 'Do a 5-minute reset of your space'),
    item('habits-streak', 'evening', 'Mark today on a calendar if you did your habit'),
    item('habits-kind', 'evening', 'If today slipped, write what you’ll do differently, kindly'),
  ],
  confidence: [
    item('conf-mirror', 'morning', 'Say one kind thing to yourself in the mirror'),
    item('conf-posture', 'morning', 'Stand tall with your shoulders back for one minute'),
    item('conf-dress', 'morning', 'Wear something that makes you feel like yourself'),
    item('conf-promise', 'morning', 'Make one tiny promise to yourself, and keep it today'),
    item('conf-speak', 'day', 'Share one opinion out loud, even a small one'),
    item('conf-ask', 'day', 'Ask for one thing you need'),
    item('conf-compliment', 'day', 'Give someone a genuine compliment'),
    item('conf-hard', 'day', 'Do one slightly uncomfortable thing'),
    item('conf-no', 'day', 'Say no to one thing that isn’t for you'),
    item('conf-win', 'evening', 'Write down one thing you did well today'),
    item('conf-proof', 'evening', 'Add one line to a "proof I can do hard things" list'),
    item('conf-voice', 'evening', 'Notice one harsh thought and rewrite it as a friend would'),
    item('conf-tomorrow', 'evening', 'Pick one brave little thing for tomorrow'),
  ],
  relationships: [
    item('rel-message', 'morning', 'Send a "thinking of you" message to someone you miss'),
    item('rel-greet', 'morning', 'Greet the first person you see properly, with eye contact'),
    item('rel-grateful', 'morning', 'Think of one person you’re grateful for, and why'),
    item('rel-listen', 'day', 'Ask someone how their day actually was, and really listen'),
    item('rel-call', 'day', 'Call or voice-note someone instead of texting'),
    item('rel-lunch', 'day', 'Eat a meal with someone, or invite someone for one'),
    item('rel-reply', 'day', 'Reply to one message you’ve been leaving'),
    item('rel-thanks', 'day', 'Thank someone for something specific'),
    item('rel-phone-away', 'evening', 'Keep your phone in another room while you’re with people'),
    item('rel-plan', 'evening', 'Make a plan to see someone this week'),
    item('rel-note', 'evening', 'Write down one thing you appreciate about someone close'),
    item('rel-repair', 'evening', 'If something felt off with someone, send a gentle check-in'),
    item('rel-memory', 'evening', 'Look at an old photo of a good time with someone'),
  ],
  direction: [
    item('dir-why', 'morning', 'Re-read why you started this reset'),
    item('dir-one-step', 'morning', 'Pick one small step toward something you want'),
    item('dir-vision', 'morning', 'Picture your day one year from now for one minute'),
    item('dir-learn', 'day', 'Spend 10 minutes learning about something you’re curious about'),
    item('dir-ask', 'day', 'Ask someone a question about their path or work'),
    item('dir-try', 'day', 'Try one thing you’ve said "maybe one day" to'),
    item('dir-list', 'day', 'Write three things you’d love to do this year'),
    item('dir-cut', 'day', 'Drop one thing that isn’t taking you anywhere'),
    item('dir-progress', 'evening', 'Write one step you took toward what you want'),
    item('dir-values', 'evening', 'Write the 3 things that matter most to you right now'),
    item('dir-tomorrow', 'evening', 'Choose tomorrow’s one step before bed'),
    item('dir-enjoy', 'evening', 'Note one moment today that felt like the right direction'),
  ],
};

/** Things that get around what usually stops them (onboarding: primaryObstacle). */
export const OBSTACLE_ITEMS: Record<string, readonly DayItemSeed[]> = {
  overthink: [
    item('ob-over-timer', 'day', 'Give one decision 2 minutes, then go with your first choice'),
    item('ob-over-good', 'day', 'Do one thing "good enough" instead of perfect'),
    item(
      'ob-over-write',
      'evening',
      'Write the thought you keep replaying, then close the notebook',
    ),
  ],
  'put-off': [
    item('ob-put-first', 'morning', 'Do the thing you’re avoiding first, for just 5 minutes'),
    item('ob-put-start', 'day', 'Start one task without finishing it. Starting counts'),
    item('ob-put-next', 'evening', 'Write the very first step of tomorrow’s hardest task'),
  ],
  'no-energy': [
    item('ob-energy-sit', 'day', 'Pick the easiest thing on this list and do it sitting down'),
    item('ob-energy-rest', 'day', 'Take a real 10-minute rest, no phone'),
    item(
      'ob-energy-early',
      'evening',
      'Go to bed when you first feel tired, not after one more episode',
    ),
  ],
  'too-much': [
    item('ob-much-one', 'morning', 'Choose just one thing to focus on today'),
    item('ob-much-stop', 'day', 'Stop one task while you still have energy left'),
    item('ob-much-cut', 'evening', 'Cross one thing off tomorrow’s list before it starts'),
  ],
  'afraid-wont-stick': [
    item('ob-stick-tiny', 'morning', 'Make today’s goal so small it’s impossible to miss'),
    item('ob-stick-count', 'evening', 'Count how many days you’ve shown up. Every one counts'),
    item('ob-stick-plan', 'evening', 'Write what you’ll do if tomorrow is a bad day'),
  ],
  distracted: [
    item('ob-dist-away', 'day', 'Put your phone in another room for 20 minutes'),
    item('ob-dist-tab', 'day', 'Close every tab except the one you need'),
    item('ob-dist-focus', 'morning', 'Do the first 15 minutes of work with notifications off'),
  ],
};

/** How each focus area is talked about in the "why" line. */
export const AREA_PHRASES: Record<FocusAreaId, string> = {
  mind: 'your mind needs some quiet',
  energy: 'your energy needs looking after',
  habits: 'you want habits that actually stick',
  confidence: 'you want to trust yourself again',
  relationships: 'you want to feel close to people again',
  direction: 'you want to feel like you’re going somewhere',
};

/** Onboarding "recentFeeling" answers, as they read in a sentence. */
export const FEELING_PHRASES: Record<string, string> = {
  drained: 'you’ve been feeling drained',
  overwhelmed: 'you’ve been feeling overwhelmed',
  disconnected: 'you’ve been feeling disconnected',
  'getting-through': 'you’re just getting through the days',
};
