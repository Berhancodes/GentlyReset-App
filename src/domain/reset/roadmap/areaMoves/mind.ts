import { during, fixed, move, upTo } from './move';

/** A calmer, clearer head: unload, single-task, breathe, and step away from screens. Every day stands alone. */
export const MIND_MOVES = [
  move(
    'Empty your head onto paper',
    'Getting thoughts out of your head and onto paper can make them feel more manageable.',
    [
      'Grab paper or open your notes app',
      'Write every worry and to-do for {m} minutes',
      'Circle the one that most needs sorting',
    ],
    { time: upTo(10) },
  ),
  move(
    'Breathe out longer than in',
    'Slower breathing with longer exhales helps many people feel calmer.',
    [
      'Sit comfortably and set a {m}-minute timer',
      'Breathe in for 4, out for 6',
      'Notice your shoulders drop',
    ],
    { time: upTo(10), lighter: 'Five slow breaths, wherever you are.' },
  ),
  move(
    'Do one thing at a time',
    'Juggling tasks is a big part of what makes a mind feel crowded.',
    [
      'Pick one task you need to do today',
      'Close everything else for {m} minutes',
      'Gently come back each time you drift',
    ],
    { time: upTo(20) },
  ),
  move(
    'A walk without headphones',
    'Quiet time without input gives your mind room to settle.',
    [
      'Leave your headphones at home',
      'Walk for {m} minutes',
      'Notice three things you hear or see',
    ],
    { time: upTo(20), lighter: 'Sit by an open window without audio.' },
  ),
  move(
    'Put tomorrow on paper',
    "Writing tomorrow's tasks before bed helps many people switch off.",
    [
      "Tonight, write tomorrow's top three tasks",
      'Add any worry, with one next step',
      'Close the notebook until morning',
    ],
    { time: fixed(5) },
  ),
  move(
    'Mute one noisy app',
    'Fewer interruptions means fewer things pulling at your attention.',
    [
      'Pick the app that interrupts you most',
      'Turn its notifications off',
      'Notice how the day feels with it quiet',
    ],
    { time: fixed(3), lighter: 'Mute it just for today.' },
  ),
  move(
    'Notice what calmed you',
    'Knowing what calms you means you can reach for it on purpose.',
    [
      'Think back over the past week',
      'Name the moment you felt calmest',
      'Plan to do that again tomorrow',
    ],
    { time: fixed(3) },
  ),
  move(
    'Sort one worry',
    'Asking whether a worry is in your hands helps you act on it or let it rest.',
    [
      'Pick one worry on your mind today',
      'Ask: can I do anything about this?',
      'If yes, take one small step. If not, let it rest',
    ],
    { time: fixed(5) },
  ),
  move(
    'Tidy one small space',
    'A clearer space often helps a busy mind feel a little clearer too.',
    [
      'Pick a desk, drawer or bedside table',
      'Clear and tidy it for {m} minutes',
      'Notice how it feels to look at now',
    ],
    { time: upTo(15) },
  ),
  move(
    'Check messages twice',
    'Checking at set times stops messages breaking up your whole day.',
    [
      'Pick two times today to check messages',
      'Keep the apps closed in between',
      'Notice how many urges pass on their own',
    ],
    { time: during, lighter: 'Pick three or four times instead.' },
  ),
  move(
    'Fact or story?',
    'Separating what you know from what you fear takes the sting out of a thought.',
    [
      "Notice a thought that's bothering you",
      'Ask: what do I actually know for sure?',
      'Say the facts-only version to yourself',
    ],
    { time: fixed(5) },
  ),
  move(
    'A screen-free hour',
    'Time away from screens gives your mind a real break.',
    [
      'Pick an hour today for no screens',
      'Read, walk, cook or make something instead',
      'Notice how your mind feels after',
    ],
    { time: during, lighter: '20 minutes.' },
  ),
  move(
    'Finish three small things',
    'Small unfinished jobs quietly take up space in your head.',
    [
      'Pick three tiny jobs you keep putting off',
      'Do them one after another',
      'Enjoy crossing them off',
    ],
    { time: upTo(20), lighter: 'Just one.' },
  ),
  move(
    'What cleared your head',
    'Your own experience is the best guide to what helps you think clearly.',
    [
      'Think about the past week',
      'Name what helped your head feel clearer',
      'Do more of it tomorrow',
    ],
    { time: fixed(3) },
  ),
  move(
    'Catch a spiral early',
    'Noticing racing thoughts early makes them much easier to slow down.',
    [
      'Notice when your thoughts start racing today',
      'Name it: "I\'m spiralling about…"',
      'Take five slow breaths, then do one small thing',
    ],
    { time: during },
  ),
  move(
    'Relax from toes to head',
    'Relaxing your body one part at a time helps quiet a busy mind before sleep.',
    [
      'Lie down in bed with the lights off',
      'Notice your feet, legs, belly, shoulders, face',
      'Soften each part as you go, for {m} minutes',
    ],
    { time: upTo(15) },
  ),
  move(
    'Do something with your hands',
    'Absorbing, hands-on activities give your mind a rest from overthinking.',
    [
      'Cook, draw, garden, build or fix something',
      'Give it your full attention for {m} minutes',
      'Notice when your mind goes quiet',
    ],
    { time: upTo(30) },
  ),
  move(
    'Be kind to yourself once',
    'Talking to yourself kindly lowers stress more than self-criticism does.',
    [
      'Notice one harsh thought about yourself',
      "Ask what you'd say to a friend instead",
      'Say that to yourself',
    ],
    { time: fixed(2) },
  ),
  move(
    'Decide and move on',
    'Making a small decision frees up the energy spent going back and forth.',
    [
      'Pick a small decision you keep revisiting',
      'Give yourself five minutes to decide',
      'Decide, and let yourself move on',
    ],
    { time: fixed(5) },
  ),
  move(
    'Time in nature',
    'Time around trees, water or green space helps many people feel calmer.',
    [
      'Find a park, trees, water or a garden',
      'Spend {m} minutes there',
      'Leave your phone in your pocket',
    ],
    { time: upTo(30), lighter: 'Look after a plant, or sit by a window with a view.' },
  ),
  move(
    "What's still on your mind",
    "Naming what's still weighing on you is the first step to easing it.",
    [
      'Think about the past week',
      'Name one thing still on your mind',
      'Pick one small step or person to talk to',
    ],
    { time: fixed(3) },
  ),
  move(
    'A slow first ten minutes',
    'A calm start makes the rest of the day feel less rushed.',
    [
      'Keep your phone away for 10 minutes after waking',
      'Have water, stretch or look outside',
      "Then choose today's one priority",
    ],
    { time: fixed(10), lighter: 'Three minutes before the phone.' },
  ),
  move(
    'Talk it through',
    'Saying a worry out loud often makes it feel smaller.',
    ['Pick someone you trust', "Share something that's on your mind", 'Ask them to just listen'],
    { time: upTo(30), lighter: 'Write it as a message, or in your journal.' },
  ),
  move(
    'Let it be good enough',
    'Aiming for perfect keeps your mind running long after a task is done.',
    [
      "Pick a task you'd usually over-polish",
      'Finish it at "good enough"',
      'Notice that nothing bad happens',
    ],
    { time: during },
  ),
  move(
    'Focus on what matters',
    'Giving your full attention to one important thing is calming in itself.',
    [
      'Pick the task that matters most today',
      'Phone in another room for {m} minutes',
      'Notice what you got done',
    ],
    { time: upTo(30) },
  ),
  move(
    'Three good things',
    'Noticing what went well, and why, helps balance a mind that scans for problems.',
    [
      'Tonight, write three good things from today',
      'Add why each one happened',
      'Read them back before sleep',
    ],
    { time: fixed(5) },
  ),
  move(
    'Your calm list',
    'Having your calming tools written down makes them easier to reach for when stressed.',
    [
      'Pick three things that calmed you this month',
      'Save them in your notes or journal',
      'Use one next time you feel tense',
    ],
    { time: fixed(5) },
  ),
  move(
    'Calm in a real moment',
    'Using a calming tool in a real moment is how it becomes second nature.',
    [
      'Notice the next tense moment today',
      'Use one of your calm tools',
      'Notice whether it helped',
    ],
    { time: during },
  ),
  move(
    "Notice what's quieter",
    "Seeing how far you've come makes the calm easier to protect.",
    [
      'Think back to how your mind felt at the start',
      'Name two things that feel quieter now',
      'Notice which ones now come naturally',
    ],
    { time: fixed(5) },
  ),
  move(
    'Keep what calms you',
    'Choosing what to keep makes a calmer mind part of your everyday life.',
    [
      'Pick the three practices that helped most',
      'Decide when each one fits in your day',
      'Save them in your journal or tell someone',
    ],
    { time: fixed(5) },
  ),
] as const;

/** Level 2: triggers, uncertainty and deeper focus once the basics are in place. */
export const MIND_DEEP_MOVES = [
  move('Season check-up', 'Going deeper starts with knowing exactly what to work on.', [
    'Rate noise, focus and sleep, 1 to 10 each',
    'Write your top 3 triggers',
    'Pick the one to work on this season',
  ]),
  move('Map your trigger', 'The first link in a chain is the easiest to break.', [
    'Write your chosen trigger at the top of a page',
    'List the thoughts, feelings and urges it brings',
    'Mark which one shows up first',
  ]),
  move('Breathing with a hold', 'Longer practice builds a calmer baseline, not just a quick fix.', [
    'Set a {m}-minute timer',
    'Breathe in 4, hold 4, out 6',
    'Write where you felt it in your body',
  ]),
  move('Label your thoughts', 'Naming thoughts puts space between you and them.', [
    'Sit quietly for {m} minutes',
    'Label each thought: plan, worry or memory',
    'Write which label showed up most',
  ]),
  move('Name what matters', 'A mind settles when your time matches what matters.', [
    'Write 5 things that matter most to you',
    'Circle the 2 getting the least time',
    'Write one action for each',
  ]),
  move('Screen sunset', 'Screens at night keep your brain on alert.', [
    'Pick a time your phone goes away tonight',
    'Set an alarm for it',
    'Spend the last {m} minutes before bed screen-free',
  ]),
  move('Week 1 check-up', 'Seeing the chain clearly shows you where to step in.', [
    'Re-rate noise, focus and sleep',
    'Write the trigger chain that showed up this week',
    'Pick one link to interrupt next week',
  ]),
  move('Write an if-then plan', 'If-then plans roughly double follow-through.', [
    'Pick a replacement for the link you chose',
    'Write "When ___ happens, I will ___"',
    'Use it the first time the trigger shows up',
  ]),
  move('Sit with not knowing', 'Handling small uncertainty shrinks big anxiety.', [
    'Leave one small thing unchecked today',
    'Notice the urge to check it',
    'Wait {m} minutes before you do anything',
  ]),
  move('Deep work sprint', "Deep focus is a muscle, and you're adding reps.", [
    'Pick a task that needs real thinking',
    'Work {m} minutes, phone in another room',
    'Write what you got done',
  ]),
  move('Self-kindness break', 'A few kind words to yourself lower stress.', [
    'When stress hits, say "this is hard"',
    'Then say "other people feel this too"',
    'Then say "I can be kind to myself right now"',
  ]),
  move('Solving or replaying?', 'Replaying a problem feels like work, but it changes nothing.', [
    "Notice a thought you've had 3+ times today",
    'Ask: am I solving this or replaying it?',
    'If replaying, do something hands-on for {m} minutes',
  ]),
  move('Gratitude with reasons', 'Adding "why" is what makes gratitude stick.', [
    'Write 3 good things from today',
    'Write why each one happened',
    'Read them again before bed',
  ]),
  move('Week 2 check-up', 'Checking the if-then shows whether it works or needs a tweak.', [
    'Re-rate noise, focus and sleep',
    'Count how often your if-then worked',
    'Adjust the plan if it missed',
  ]),
  move(
    'Face a thought you avoid',
    'Facing a thought on purpose takes away its power to ambush you.',
    [
      'Write the worry you avoid thinking about',
      'Read it slowly for {m} minutes',
      'Notice whether it feels less sharp by the end',
    ],
  ),
  move('Rehearse a hard moment', 'Practicing in your head makes the real moment easier.', [
    'Write the toughest moment coming up this week',
    "Pick the tool you'll use in it",
    'Picture yourself using it, start to finish',
  ]),
  move('One meal, no screen', 'Slowing down at meals trains attention all day.', [
    'Eat one meal with no phone or TV',
    'Notice taste, texture and fullness',
    'Stop when you feel about 80% full',
  ]),
  move('Clean up your feed', 'What you scroll shapes what you think about.', [
    'Mute or unfollow 5 accounts that stir you up',
    'Remove one app you open out of habit',
    'Notice the quiet it leaves',
  ]),
  move('Time in nature', 'Time around greenery lowers stress.', [
    'Find a park, trees or water nearby',
    'Spend {m} minutes there, phone in your pocket',
    'Write one thing you noticed',
  ]),
  move('Say it out loud', 'Saying a worry to someone often makes it smaller.', [
    'Pick someone you trust',
    "Share one thing that's on your mind",
    'Ask them to just listen, not fix',
  ]),
  move('Week 3 check-up', 'A pattern you can see is a pattern you can change.', [
    'Re-rate noise, focus and sleep',
    'Write which avoided thought got easier',
    'Pick the one still left to face',
  ]),
  move('Morning pages', 'Writing without stopping clears space before the day starts.', [
    'First thing today, write for {m} minutes',
    "Don't stop, edit or reread as you go",
    'Underline anything that surprised you',
  ]),
  move('Make a rule for a small choice', 'Rules for small choices save energy for big ones.', [
    'Pick a choice you overthink, like replies or meals',
    'Write a simple rule for it',
    'Use the rule today',
  ]),
  move('Teach one tool', 'Explaining a tool locks in what you know.', [
    'Pick the tool that works best for you',
    'Explain it to someone in 2 minutes',
    'Write what you understood better after',
  ]),
  move('Your best focus yet', 'Beating your own record shows your focus is growing.', [
    'Block {m} minutes in your calendar',
    'Phone in another room, one tab open',
    'Write your time and compare with day 10',
  ]),
  move('Let one thing be good enough', 'Perfectionism keeps a mind running long after the task.', [
    'Pick one task you usually over-polish',
    'Finish it at "good enough"',
    'Notice that nothing bad happens',
  ]),
  move('Update your calm plan', 'A plan built from your own season fits you best.', [
    "Add this season's best tools to your toolkit",
    'Add your trigger and your if-then plan',
    "Save it where you'll see it",
  ]),
  move('Test your plan', 'A plan you used under pressure is one you can trust.', [
    'Do one mildly stressful thing on purpose',
    'Use your calm plan during it',
    'Rate how well it held, 1 to 10',
  ]),
  move('Measure your season', 'Comparing with day 1 shows how much has changed.', [
    'Re-rate noise, focus and sleep',
    'Compare with day 1',
    'Write your biggest win',
  ]),
  move('Choose what comes next', 'Ending with a plan keeps the progress going.', [
    "Pick 3 practices you'll keep",
    'Write when each happens in your week',
    'Write what you want to work on next',
  ]),
] as const;
