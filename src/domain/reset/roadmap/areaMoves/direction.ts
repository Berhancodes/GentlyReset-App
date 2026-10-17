import { during, fixed, move, upTo } from './move';

/** Progress on what matters: pick one goal and move it forward in focused steps. Every day stands alone. */
export const DIRECTION_MOVES = [
  move(
    'What matters to you',
    'Direction starts with knowing what you actually care about.',
    [
      'Write the five things that matter most to you',
      'Circle the two that get the least time',
      'Give one of them a little time this week',
    ],
    { time: fixed(10) },
  ),
  move(
    'Picture a good year',
    'A clear picture of where you want to be helps you choose what to do next.',
    [
      'Imagine your life a year from now, going well',
      "Write where you are, what you do, who's around",
      'Underline the part that excites you most',
    ],
    { time: upTo(15) },
  ),
  move(
    'Choose one thing to work on',
    'One clear goal is easier to move forward than five vague ones.',
    [
      'Pick one goal for the next 30 days',
      'Make it something you can see progress on',
      'Write why it matters to you',
    ],
    { time: fixed(10) },
  ),
  move(
    'Take the first step',
    'The first step is the hardest, and it makes everything else feel real.',
    [
      'Pick the smallest first step toward your goal',
      'Spend {m} minutes on it',
      'Note what the next step is',
    ],
    { time: upTo(30) },
  ),
  move(
    'Find time in your week',
    'Goals with a time in the calendar actually get done.',
    [
      'Look at your week in your calendar',
      'Book three short slots for your goal',
      'Treat them like appointments',
    ],
    { time: fixed(10), lighter: 'Book one slot.' },
  ),
  move(
    'Learn from someone ahead',
    "Learning from someone who's done it saves a lot of guessing.",
    [
      'Find an article, video or person on your goal',
      'Spend {m} minutes learning',
      'Pick one idea to try',
    ],
    { time: upTo(20) },
  ),
  move(
    'What moved this week',
    'Noticing progress, however small, keeps you going.',
    ['Think about your goal this week', 'Name one thing that moved forward', 'Pick your next step'],
    { time: fixed(3) },
  ),
  move(
    'Work on it, phone away',
    'Focused time, even short, moves goals further than scattered effort.',
    [
      'Put your phone in another room',
      'Work on your goal for {m} minutes',
      'Note where you got to',
    ],
    { time: upTo(30) },
  ),
  move(
    'Swap a scroll for a step',
    'Small pockets of time add up to real progress.',
    [
      'Notice the next time you reach to scroll',
      'Use that time for your goal instead',
      'Even five minutes counts',
    ],
    { time: during },
  ),
  move(
    'Ask one question',
    'One good question to the right person can save weeks.',
    [
      'Think of someone who knows about your goal',
      'Ask them one specific question',
      'Thank them, and note their answer',
    ],
    { time: fixed(5), lighter: 'Ask in an online community instead.' },
  ),
  move(
    'Clear one obstacle',
    'Removing one obstacle can unlock a lot of progress.',
    ["Name what's slowing you down", 'Find one way around it', 'Spend {m} minutes on that fix'],
    { time: upTo(20) },
  ),
  move(
    "The part you've avoided",
    'The part you avoid is often smaller than it looks once you start.',
    [
      'Pick the part of your goal you keep avoiding',
      'Do just {m} minutes of it',
      'Notice it was smaller than it looked',
    ],
    { time: upTo(30) },
  ),
  move(
    'Tell someone your plan',
    'Saying your goal out loud makes you more likely to follow through.',
    [
      'Tell one person your goal and your timeline',
      'Ask them to check in with you',
      'Notice how it feels to say it out loud',
    ],
    { time: fixed(5), lighter: 'Write it in your journal instead.' },
  ),
  move(
    'Halfway look',
    'A quick check halfway keeps your goal realistic.',
    [
      'Look at how far your goal has come',
      'Make it smaller or bigger if needed',
      'Book your next three sessions',
    ],
    { time: fixed(5) },
  ),
  move(
    'Make something you can see',
    'Something you can see or hold makes progress feel real.',
    [
      'Make a draft, list, sketch or sample',
      'Work on it for {m} minutes',
      'Save it so you can look back on it',
    ],
    { time: upTo(30) },
  ),
  move(
    'Say no to make room',
    'Making room for your goal matters as much as working on it.',
    [
      'Spot one thing competing with your goal',
      'Skip it, shorten it or move it',
      'Use the time you freed up',
    ],
    { time: fixed(5) },
  ),
  move(
    'Work somewhere new',
    'A change of scene can make focus easier.',
    [
      'Take your goal to a café, library or park',
      'Work there for {m} minutes',
      'Notice whether a new place helps',
    ],
    { time: upTo(30), lighter: 'A different room at home.' },
  ),
  move(
    'Plan your busy-day step',
    'A tiny step ready for busy days keeps momentum going.',
    [
      'Decide the smallest step for a busy day',
      'Keep it under five minutes',
      "Use it whenever a full session won't fit",
    ],
    { time: fixed(5) },
  ),
  move(
    'Your biggest step yet',
    "Taking on a bigger step shows you how far you've come.",
    ['Pick the biggest step left', 'Give it {m} focused minutes', 'Note how far you got'],
    { time: upTo(30) },
  ),
  move(
    'Check your balance',
    "Progress lasts longer when the rest of life isn't neglected.",
    [
      'Think about work, health, people, money, fun',
      'Notice which one needs a little care',
      'Do one small thing for it today',
    ],
    { time: fixed(5) },
  ),
  move(
    "What's working",
    'Knowing what works for you lets you do more of it on purpose.',
    [
      'Think about your goal this week',
      'Name what helped you make progress',
      'Plan more of it next week',
    ],
    { time: fixed(3) },
  ),
  move(
    'Show your progress',
    'Sharing your work brings feedback and encouragement.',
    [
      "Show someone what you've done so far",
      'Ask what they find most interesting',
      'Use one bit of their feedback',
    ],
    { time: fixed(10) },
  ),
  move(
    'A longer focus block',
    'A longer block lets you get into the hard, important parts.',
    [
      'Book {m} minutes in your calendar',
      'Work on the most important part',
      'Notice how much you got done',
    ],
    { time: upTo(30) },
  ),
  move(
    'Remember your why',
    'Reconnecting with why it matters refuels your motivation.',
    [
      'Remember why this goal matters to you',
      'Picture how finishing it would feel',
      'Take one small step while you feel it',
    ],
    { time: fixed(5) },
  ),
  move(
    'Finish one piece',
    'Finishing one complete piece is more motivating than starting many.',
    [
      'Pick one part you can complete',
      'Work on it for {m} minutes',
      "Finish it, even if it's not perfect",
    ],
    { time: upTo(30) },
  ),
  move(
    'Something for future you',
    'Small steps for future you add up to a different life.',
    [
      'Pick something that helps you a year from now',
      'Save, learn, apply, sign up or book',
      'Do the first part today',
    ],
    { time: fixed(10) },
  ),
  move(
    'Celebrate your progress',
    'Celebrating effort makes you want to keep going.',
    [
      "List what you've done toward your goal",
      'Celebrate in a small, real way',
      "Tell someone what you're proud of",
    ],
    { time: fixed(10) },
  ),
  move(
    'Pick your next goal',
    "Knowing what's next keeps your direction going.",
    [
      'Decide what comes after this goal',
      'Make it something you can see progress on',
      'Book the first step in your calendar',
    ],
    { time: fixed(10) },
  ),
  move(
    "See how far you've come",
    'Looking back honestly helps you set better goals next time.',
    [
      'Think back to where your goal was on day 1',
      'Name what you got done',
      "Name what you'd do differently",
    ],
    { time: fixed(5) },
  ),
  move(
    'Keep your momentum',
    'Choosing what to keep turns one goal into a direction.',
    [
      'Pick the habits that helped you progress',
      'Decide when each fits in your week',
      'Save them in your journal or tell someone',
    ],
    { time: fixed(5) },
  ),
] as const;

/** Level 2: a bigger goal, a skill to build, and a weekly system to steer by. */
export const DIRECTION_DEEP_MOVES = [
  move('Season check-up', 'Going deeper starts with an honest look at where you are.', [
    'Re-rate your 6 life areas, 1 to 10',
    "Write what last season's goal taught you",
    'Pick the area to grow this season',
  ]),
  move('Write your 90-day goal', 'A bigger goal gives your seasons a direction.', [
    'Write a goal for the next 90 days',
    'Make it measurable',
    'Write why it matters',
  ]),
  move('Set this month’s milestone', 'A monthly milestone makes a big goal manageable.', [
    'Write what must be done in 30 days',
    'Break it into 4 weekly targets',
    "Write this week's target",
  ]),
  move('Pick a skill to build', 'The right skill speeds up the whole goal.', [
    'Write the one skill your goal needs most',
    'Find one way to learn it',
    'Spend {m} minutes on it',
  ]),
  move('Plan your week', 'A weekly plan turns goals into calendar time.', [
    'Look at the week ahead',
    'Book 3 goal sessions',
    'Book one skill session',
  ]),
  move('Goal work session', 'Steady sessions are how big goals move.', [
    'Work on this week’s target for {m} minutes',
    'Phone in another room',
    'Write what you got done',
  ]),
  move('Week 1 review', 'A weekly review is how you steer.', [
    'Did you hit this week’s target? Write yes or no',
    'Write what helped and what got in the way',
    "Write next week's target",
  ]),
  move('Skill session', 'Practice compounds faster than you expect.', [
    'Practice your skill for {m} minutes',
    'Focus on the hardest part',
    'Write one improvement',
  ]),
  move('Find a mentor or a model', 'Learning from others shortens the path.', [
    'Find someone who has done what you want',
    'Study how they did it, or ask them',
    'Write 3 things to copy',
  ]),
  move('Goal work session', 'Steady sessions are how big goals move.', [
    'Work on this week’s target for {m} minutes',
    'Start with the most important task',
    'Write what you got done',
  ]),
  move('Cut a commitment', 'Making room is part of moving forward.', [
    "List your commitments that don't serve your goal",
    'Pick one to drop or shrink',
    'Act on it today',
  ]),
  move('Talk to someone in the field', 'One conversation can open doors.', [
    'Find someone who works in your goal area',
    'Send them a short, specific question',
    'Write what you learn',
  ]),
  move('Goal work session', 'Steady sessions are how big goals move.', [
    'Work on your goal for {m} minutes',
    'Finish one complete piece',
    'Write what you got done',
  ]),
  move('Week 2 review', 'Weekly reviews keep a big goal on track.', [
    'Did you hit this week’s target?',
    'Write what to change',
    "Write next week's target",
  ]),
  move('Skill session', 'Practice compounds faster than you expect.', [
    'Practice your skill for {m} minutes',
    'Try a harder version',
    'Write what improved',
  ]),
  move('Do the uncomfortable task', 'The uncomfortable task is often the important one.', [
    'Name the goal task that feels most uncomfortable',
    'Do the first part of it today',
    'Write how it felt after',
  ]),
  move('Goal work session', 'Steady sessions are how big goals move.', [
    'Work on your goal for {m} minutes',
    'Pick the step with the biggest impact',
    'Write what you got done',
  ]),
  move('Check your money and time', 'Goals need resources. Checking keeps them realistic.', [
    'Write what your goal needs in money and time',
    'Compare it with what you have',
    'Adjust the plan if needed',
  ]),
  move('Show your work', 'Sharing progress opens up feedback and chances.', [
    'Share what you have done with someone',
    'Ask for one piece of feedback',
    'Write what you will use',
  ]),
  move('Goal work session', 'Steady sessions are how big goals move.', [
    'Work on your goal for {m} minutes',
    'Use the feedback you got',
    'Write what you got done',
  ]),
  move('Week 3 review', 'Weekly reviews keep a big goal on track.', [
    'Did you hit this week’s target?',
    'Write the biggest lesson so far',
    "Write next week's target",
  ]),
  move('Skill session', 'Practice compounds faster than you expect.', [
    'Practice your skill for {m} minutes',
    'Compare with day 8',
    'Write how far you have come',
  ]),
  move('Deep work block', 'Long, focused blocks get the big work done.', [
    'Book {m} minutes with no interruptions',
    'Work on the hardest part of your goal',
    'Write what you finished',
  ]),
  move('Build your weekly system', 'A weekly system keeps you on track without willpower.', [
    'Write your weekly review questions',
    'Pick a day and time for the review',
    'Put it in your calendar, repeating',
  ]),
  move('Goal work session', 'Steady sessions are how big goals move.', [
    'Work on your goal for {m} minutes',
    'Close out the month’s milestone',
    'Write what you got done',
  ]),
  move('Re-rate your life areas', 'Comparing with day 1 shows the bigger picture.', [
    'Re-rate your 6 life areas, 1 to 10',
    'Compare with day 1',
    'Write which area moved most',
  ]),
  move('Plan next month’s milestone', 'Planning ahead keeps the 90-day goal moving.', [
    "Write next month's milestone",
    'Break it into 4 weekly targets',
    'Book your first session',
  ]),
  move('Celebrate the milestone', 'Celebrating keeps the long game fun.', [
    'List everything you did this month',
    'Celebrate in a small, real way',
    'Tell someone about it',
  ]),
  move('Measure your season', 'Honest review makes the next season better.', [
    'Write how close you got to your milestone, in %',
    'Write what worked best',
    'Write what you will change',
  ]),
  move('Choose what comes next', 'Ending with a plan keeps the progress going.', [
    "Pick 2 practices you'll keep",
    'Write when each happens',
    'Write your focus for next season',
  ]),
] as const;
