import { during, fixed, move, upTo } from './move';

/** Everyday routines that make life run smoother: tidy, prep, bedtime and a weekly reset. Every day stands alone. */
export const HABITS_MOVES = [
  move(
    'Make your bed',
    'A small finished task first thing can make the rest of the day feel more doable.',
    ['Straighten the sheets and the duvet', 'Plump up the pillows', 'Take a second to enjoy it'],
    { time: fixed(2), lighter: 'Just pull the covers up.' },
  ),
  move(
    'A quick tidy',
    'A short, timed tidy keeps mess from piling up into a big job.',
    [
      'Set a timer for {m} minutes',
      'Put things back where they belong',
      'Stop when the timer ends',
    ],
    { time: upTo(15) },
  ),
  move(
    'Lay out tomorrow',
    'Getting ready the night before makes mornings calmer.',
    [
      "Pick tomorrow's clothes tonight",
      'Put keys, bag and essentials together',
      'Leave them by the door',
    ],
    { time: fixed(5) },
  ),
  move(
    'Clear the sink',
    'A clean kitchen at night makes the next morning smoother.',
    ['Wash or load every dish', 'Wipe down the counter', 'Enjoy waking up to a clear kitchen'],
    { time: upTo(15), lighter: 'Wash just the dishes you used today.' },
  ),
  move(
    'A set time for bed',
    'A regular bedtime is the base of most good routines.',
    [
      'Choose a bedtime you can keep this week',
      'Set a reminder 30 minutes before it',
      'Start winding down when it goes off',
    ],
    { time: fixed(2) },
  ),
  move(
    'Do the two-minute jobs',
    'Lots of tiny jobs feel heavy until you knock them out in one go.',
    [
      'Spot jobs that take under two minutes',
      'Do as many as fit in {m} minutes',
      'Bin, reply, hang up, put away. Done',
    ],
    { time: upTo(15) },
  ),
  move(
    'What made days easier',
    'Noticing which routines helped tells you which ones to keep.',
    [
      'Think back over the past week',
      'Name the routine that made days easier',
      'Do it again tomorrow',
    ],
    { time: fixed(3) },
  ),
  move(
    'Look at the week ahead',
    'A quick look ahead means fewer surprises and less last-minute stress.',
    [
      'Open your calendar for the coming week',
      'Spot the busy days and the free ones',
      'Prepare one thing for the busiest day',
    ],
    { time: fixed(10) },
  ),
  move(
    'Prep one meal ahead',
    'A meal ready to go makes busy days easier and healthier.',
    [
      'Pick something easy: oats, a salad, a batch',
      'Make it for tomorrow',
      'Store it ready to grab',
    ],
    { time: upTo(30), lighter: 'Chop or prep one ingredient.' },
  ),
  move(
    'Tidy your phone screen',
    'A calmer home screen means fewer apps opened on autopilot.',
    [
      'Move distracting apps off your first screen',
      'Put useful ones there instead',
      'Notice how often you open it out of habit',
    ],
    { time: fixed(10) },
  ),
  move(
    'Clear your inbox a bit',
    'A lighter inbox stops small tasks nagging at you.',
    [
      'Open your email or messages',
      'Delete, archive or reply for {m} minutes',
      "Stop at the timer, not when it's perfect",
    ],
    { time: upTo(20) },
  ),
  move(
    'Water and light first',
    'Starting with water and daylight beats starting with your phone.',
    [
      'Drink a glass of water when you get up',
      'Open the curtains or step outside',
      'Then check your phone',
    ],
    { time: fixed(5) },
  ),
  move(
    'Reset your main room',
    'A five-minute reset each day keeps a room from ever getting out of hand.',
    [
      'Pick the room you use the most',
      'Straighten cushions, clear surfaces, tidy floor',
      'Do the same thing at the same time tomorrow',
    ],
    { time: fixed(5) },
  ),
  move(
    'Which routine helped most',
    'The routine that helped most is the one worth protecting.',
    [
      'Think back over this week',
      'Name the routine that helped the most',
      'Pick a regular time for it',
    ],
    { time: fixed(3) },
  ),
  move(
    'Sort one pile',
    'Piles take up space in your home and in your head.',
    [
      'Pick a pile: mail, clothes or papers',
      'Sort it into keep, bin, deal with later',
      'Deal with the bin pile today',
    ],
    { time: upTo(20) },
  ),
  move(
    "A list for the week's food",
    'Planning a few meals ahead saves time, money and decisions.',
    [
      'Check what you already have at home',
      'Plan three or four easy meals around it',
      'Write a shopping list for the rest',
    ],
    { time: fixed(10) },
  ),
  move(
    'The busy-day version',
    'Doing a tiny version on busy days keeps routines alive.',
    [
      'On a busy day, pick your smallest routine',
      'Make the bed, or wash one dish',
      'Count it. Small still counts',
    ],
    { time: fixed(2) },
  ),
  move(
    'Plan a weekly reset',
    'One set time a week for chores stops them spilling into every day.',
    [
      'Pick a time each week for a home reset',
      'Add it to your calendar, repeating',
      'Choose what it covers: laundry, tidy, plan',
    ],
    { time: fixed(5) },
  ),
  move(
    'Clean a forgotten spot',
    'The spots you always skip are often the ones that bother you most.',
    [
      'Pick a spot you skip: fridge, car or a drawer',
      'Clean it for {m} minutes',
      'Notice how good it looks',
    ],
    { time: upTo(20) },
  ),
  move(
    'Do a weekly reset',
    'A short weekly reset makes the whole week feel more under control.',
    [
      'Put a load of laundry on',
      'Clear surfaces and plan the week ahead',
      'Stop when {m} minutes are up',
    ],
    { time: upTo(30), lighter: 'Do just one of the three.' },
  ),
  move(
    'Routines that stuck',
    'The routines you kept without trying are the ones that fit your life.',
    [
      'Think about the past week',
      'Name the routines you did without thinking',
      'Notice what made them easy',
    ],
    { time: fixed(3) },
  ),
  move(
    'Your morning order',
    'Doing a few things in the same order each morning means less to think about.',
    [
      'Pick three morning routines that work for you',
      'Do them in the same order tomorrow',
      'Notice how little you have to think',
    ],
    { time: fixed(10) },
  ),
  move(
    'Your evening order',
    'A set evening routine leads naturally into rest.',
    [
      'Pick three: dishes, prep, wind-down',
      'Do them in the same order tonight',
      'Lights out at your bedtime',
    ],
    { time: fixed(15) },
  ),
  move(
    "Fix something you've put off",
    'Finishing a long-avoided job is a relief out of all proportion to its size.',
    [
      'Pick a small repair or chore you keep avoiding',
      'Spend {m} minutes on it',
      'Finish it, or book the next step',
    ],
    { time: upTo(30) },
  ),
  move(
    'Fill one bag to give away',
    'Less stuff means less to tidy, clean and think about.',
    [
      'Pick a cupboard, drawer or wardrobe',
      'Fill one bag to donate or bin',
      'Get it out of the house this week',
    ],
    { time: upTo(20), lighter: 'Five things instead of a bag.' },
  ),
  move(
    'A chore for someone else',
    'Small acts of help make a shared home feel lighter for everyone.',
    ["Pick a chore you don't usually do", 'Do it without being asked', 'Notice how it lands'],
    { time: upTo(15), lighter: 'Living alone? Do a chore that helps future you.' },
  ),
  move(
    'A full routine day',
    'Seeing your routines work together shows how much easier they make a day.',
    [
      'Follow your morning order',
      'Do one quick tidy during the day',
      'Follow your evening order tonight',
    ],
    { time: during },
  ),
  move(
    'Routines that travel',
    "Knowing your essentials means a change of plans doesn't undo everything.",
    [
      'Think of a day away from home or a busy week',
      "Pick the two routines you'd keep anywhere",
      'Plan what they need',
    ],
    { time: fixed(5) },
  ),
  move(
    'Look around your space',
    'Your home shows the difference small routines make.',
    [
      'Look around your home',
      "Notice what's calmer or easier than before",
      'Name the routine that made it happen',
    ],
    { time: fixed(5) },
  ),
  move(
    'Choose your daily few',
    "A short list of routines you keep beats a long list you don't.",
    [
      'Pick the three routines you want to keep',
      'Decide when each one happens',
      'Save them in your journal or tell someone',
    ],
    { time: fixed(5) },
  ),
] as const;

/** Level 2: break an old habit, build a routine, and design your surroundings. */
export const HABITS_DEEP_MOVES = [
  move('Habit audit', "Seeing all your habits at once shows what's worth changing.", [
    'List your daily habits, good and bad',
    'Star the one you kept from last season',
    'Pick one bad habit to break this season',
  ]),
  move(
    'Find the bad habit’s cue',
    'Every habit starts with a cue. Find it and you can change it.',
    [
      'Write when and where the bad habit happens',
      'Write what you feel right before it',
      'Name the cue in one word',
    ],
  ),
  move('Add friction', 'Making a habit harder to start cuts how often it happens.', [
    'Make the bad habit one step harder to start',
    'Like logging out, or hiding it away',
    'Write how often you still did it',
  ]),
  move('Pick a replacement', 'A habit is easier to swap than to stop.', [
    'Pick something to do instead when the cue hits',
    'Write "When I feel ___, I will ___"',
    'Use it once today',
  ]),
  move('Design a morning routine', 'A set routine saves willpower for the rest of the day.', [
    'Write 3 steps for your first 20 minutes',
    'Put them in order',
    'Set out what you need for tomorrow',
  ]),
  move(
    'Run your morning routine',
    'A routine becomes automatic by doing it the same way each time.',
    ['Do your 3 steps in order', 'Time how long it takes', 'Write what slowed you down'],
  ),
  move('Week 1 check-up', 'Tracking both habits shows if the swap is working.', [
    'Count how often the bad habit happened',
    'Count your morning routine days',
    'Write one fix for each',
  ]),
  move('Redesign one room', 'Your surroundings shape your habits more than willpower does.', [
    'Pick the room where your habits happen',
    'Make good habits visible and bad ones hidden',
    'Take {m} minutes to rearrange it',
  ]),
  move('Design an evening routine', 'A set evening routine leads into better sleep.', [
    'Write 3 steps for your last 30 minutes',
    'Include getting ready for tomorrow',
    'Do it tonight',
  ]),
  move('Track the bad habit', "You can't change what you don't measure.", [
    'Tally each time the bad habit happens',
    'Note the time beside each tally',
    'Look for the pattern tonight',
  ]),
  move('Find an accountability partner', 'Checking in with someone makes you more consistent.', [
    'Ask a friend to swap daily check-ins',
    'Agree on what you each will report',
    'Send your first check-in today',
  ]),
  move('Keep your habit, go deeper', 'Your main habit grows by going deeper, not by adding more.', [
    'Do last season’s habit for {m} minutes',
    'Make it a bit harder or more focused',
    'Write what you improved',
  ]),
  move('Try a slip-up plan', 'Planning for a slip stops one miss becoming a week.', [
    'Write what you will do after a slip',
    'Keep it to one small step',
    'Read it once out loud',
  ]),
  move('Week 2 check-up', 'Two weeks of tallies shows if the bad habit is shrinking.', [
    'Compare your bad-habit tallies with week 1',
    'Count your routine days',
    'Pick one thing to tighten',
  ]),
  move('Go a full day without it', 'One full day without it shows you can.', [
    'Pick today to skip the bad habit entirely',
    'Use your replacement each time the cue hits',
    'Write how many times you used it',
  ]),
  move('Make the routine shorter', 'A shorter routine is more likely to happen every day.', [
    'Find the step that takes too long',
    'Shrink it or drop it',
    'Run the new routine tomorrow',
  ]),
  move('Join two habits', 'Linking habits together makes each one easier.', [
    'Put your main habit right after your routine',
    'Write the new order',
    'Do them back to back today',
  ]),
  move('Plan for a busy day', 'Planning a busy-day version keeps you consistent.', [
    'Write a 5-minute version of your routine',
    'Write a 1-minute version of your main habit',
    'Use both on your next busy day',
  ]),
  move('Weekly reset', 'A weekly reset stops small slips from adding up.', [
    'Set aside {m} minutes this week',
    'Tidy your space and plan your week',
    'Put your habits in your calendar',
  ]),
  move('Check in with your partner', 'Reporting back keeps you honest.', [
    'Send your partner this week’s numbers',
    'Ask how theirs went',
    'Agree on one goal each for next week',
  ]),
  move('Week 3 check-up', 'Three weeks in, the new pattern should be visible.', [
    'Compare bad-habit tallies with week 1',
    'Count routine and habit days',
    'Write what has become automatic',
  ]),
  move('Travel-proof your habits', 'A habit that survives a change of routine is truly yours.', [
    'Write how your habits work away from home',
    'Pack or prep what you would need',
    'Do your habit today in a different setting',
  ]),
  move('Raise your standard', 'A slightly higher standard keeps you growing.', [
    'Pick one habit to make a little harder',
    'Do the harder version for {m} minutes',
    'Write how it felt',
  ]),
  move('Clean up your phone', 'Your phone holds the cues for many bad habits.', [
    'Move distracting apps off your home screen',
    'Turn off non-essential notifications',
    'Put your habit tracker on the first screen',
  ]),
  move('Teach your system', 'Explaining your system shows how much you know now.', [
    'Explain your cues and routines to someone',
    'Write what you would tell a beginner',
    'Do your habit today',
  ]),
  move('Full routine day', 'A full day of routines shows the system working.', [
    'Run your morning routine',
    'Do your main habit on cue',
    'Run your evening routine',
  ]),
  move('Write your habit system', 'A written system is easy to restart after a break.', [
    'Write your cues, routines and backups on one page',
    "Save it where you'll see it",
    'Do your habit today',
  ]),
  move('No reminders day', 'Remembering without a reminder means the habit is yours.', [
    'Turn off habit reminders for today',
    'Run your routines from memory',
    'Write what you remembered',
  ]),
  move('Measure your season', 'Comparing with day 1 shows what changed.', [
    'Compare bad-habit tallies with week 1',
    'Count all your routine and habit days',
    'Write your biggest win',
  ]),
  move('Choose what comes next', 'Ending with a plan keeps the progress going.', [
    'Decide which habits stay as they are',
    'Pick one habit to build or break next',
    'Write when you will start',
  ]),
] as const;
