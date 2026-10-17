import { during, fixed, move, upTo } from './move';

/** Confidence from real moments: keep promises, speak up, try new things, be seen. Every day stands alone. */
export const CONFIDENCE_MOVES = [
  move(
    'Three things you did well',
    'Noticing what you already do well is a fairer starting point than focusing on gaps.',
    [
      'Think back over the last week',
      'Write three things you handled well',
      'Include small ones. They count',
    ],
    { time: fixed(5) },
  ),
  move(
    'Keep one small promise',
    'Every promise you keep to yourself builds trust in yourself.',
    [
      'Promise yourself one small thing for today',
      'Make it something you can do by tonight',
      'Do it, and notice that you did',
    ],
    { time: during },
  ),
  move(
    'Stand tall, speak slow',
    'A steadier posture and pace can help you feel more settled.',
    [
      'Before a conversation or task, stand tall',
      'Shoulders back, one slow breath',
      'Speak a little slower than usual',
    ],
    { time: fixed(2) },
  ),
  move(
    'Wear what feels like you',
    'Feeling like yourself on the outside often helps you act like yourself.',
    [
      'Pick an outfit you feel good in',
      'Wear it today, even if nothing is planned',
      'Notice how you carry yourself',
    ],
    { time: during },
  ),
  move(
    'Finish one avoided task',
    "Finishing something you've been avoiding is quick proof you can follow through.",
    ["Pick a small task you've been dodging", 'Work on it for {m} minutes', 'Finish it if you can'],
    { time: upTo(20) },
  ),
  move(
    'Share one opinion',
    'Your voice gets steadier every time you use it.',
    [
      'In a chat, meeting or class, share a view',
      'Keep it to one or two sentences',
      'Let it stand. No need to apologise',
    ],
    { time: during, lighter: 'Share it in a group chat or comment.' },
  ),
  move(
    'Your brave moments',
    'Noticing small brave moments helps you believe in bigger ones.',
    [
      'Think back over the past week',
      'Name one moment you were braver than usual',
      'Notice what helped you do it',
    ],
    { time: fixed(3) },
  ),
  move(
    'Answer your inner critic',
    'A harsh inner voice loses power when you answer it fairly.',
    [
      'Notice one harsh thought about yourself',
      'Ask: would I say this to a friend?',
      'Replace it with something fair and true',
    ],
    { time: fixed(3) },
  ),
  move(
    'Practise a skill you love',
    'Getting better at something real builds confidence that lasts.',
    [
      'Pick a skill: cooking, drawing, a language',
      'Practise it for {m} minutes',
      'Notice one small improvement',
    ],
    { time: upTo(30) },
  ),
  move(
    'Ask for something small',
    'Asking clearly, without apologising, builds self-respect.',
    [
      'Ask for help, advice or a small favour',
      'Ask clearly, without saying sorry first',
      'Notice that asking was okay',
    ],
    { time: fixed(3) },
  ),
  move(
    'Take a compliment',
    'Letting kind words land helps you see what others see in you.',
    [
      'When someone says something kind, pause',
      'Just say "thank you"',
      'Let it land. No brushing it off',
    ],
    { time: during, lighter: 'No compliments today? Give yourself one, out loud.' },
  ),
  move(
    'Start before you feel ready',
    'Confidence often comes after you act, not before.',
    [
      "Pick something you're waiting to feel ready for",
      'Spend {m} minutes starting it anyway',
      'Notice how it feels to have begun',
    ],
    { time: upTo(15) },
  ),
  move(
    "Make the call you've avoided",
    'Ticking off a dreaded call frees up a surprising amount of headspace.',
    [
      "Pick a call you've put off: doctor, bank, booking",
      'Jot down what you need to say',
      'Make the call',
    ],
    { time: fixed(10), lighter: 'Book or message online instead.' },
  ),
  move(
    'What felt easier',
    "Noticing what's getting easier shows your confidence is growing.",
    [
      'Think about the past two weeks',
      'Name one thing that feels easier now',
      'Do a slightly bigger version tomorrow',
    ],
    { time: fixed(3) },
  ),
  move(
    'Hold your ground kindly',
    'Sharing your preference calmly shows you that your needs count too.',
    [
      "Notice when you'd usually just go along",
      'Share your preference calmly',
      "You don't need to win, just be heard",
    ],
    { time: during },
  ),
  move(
    'Go somewhere on your own',
    'Being comfortable on your own is a quiet kind of confidence.',
    [
      'Go to a café, park, gallery or class alone',
      'Stay for {m} minutes',
      "Notice that you're fine on your own",
    ],
    { time: upTo(30), lighter: 'A short walk somewhere new.' },
  ),
  move(
    'Share something you made',
    'Letting your work be seen gets easier every time.',
    ['Pick something you made or did', 'Show it to one person', 'Notice their reaction'],
    { time: fixed(5) },
  ),
  move(
    'Try something new',
    'New experiences remind you that you can handle the unfamiliar.',
    [
      "Pick something you've never tried",
      'A recipe, a route, a class or a hobby',
      'Give it {m} minutes and see how it goes',
    ],
    { time: upTo(30) },
  ),
  move(
    'Speak first',
    'Going first gets easier with practice, and nerves fade fast.',
    [
      'In a group or meeting, speak early',
      'Say hello, or share the first idea',
      'Notice how quickly the nerves pass',
    ],
    { time: during, lighter: 'Be first to reply in a group chat.' },
  ),
  move(
    'Back to your skill',
    'Coming back to a skill is how real progress happens.',
    [
      "Pick a skill you'd like to be better at",
      'Practise it for {m} minutes',
      'Notice what feels easier than before',
    ],
    { time: upTo(30) },
  ),
  move(
    'What felt braver',
    "Seeing how far you've stretched makes the next stretch feel possible.",
    [
      'Think about the past week',
      'Name the bravest thing you did',
      'Notice that you got through it',
    ],
    { time: fixed(3) },
  ),
  move(
    'Take the lead once',
    'Leading small things helps you trust your own judgement.',
    [
      'Offer to plan, decide or organise something',
      'Make the call without asking everyone',
      'Notice that people follow',
    ],
    { time: during },
  ),
  move(
    'Ask for honest feedback',
    'Feedback you asked for is easier to hear and more useful.',
    [
      'Pick someone you trust',
      'Ask: "What\'s one thing I do well?"',
      'Then: "What\'s one thing I could try?"',
    ],
    { time: fixed(5) },
  ),
  move(
    'Lift someone else up',
    'Encouraging others reminds you of your own worth too.',
    [
      'Notice someone working hard',
      'Tell them exactly what you see',
      'Notice how it feels to lift someone up',
    ],
    { time: fixed(3) },
  ),
  move(
    'Do the slightly scary thing',
    'Growth lives just outside what feels comfortable.',
    [
      'Pick something a little outside your comfort zone',
      'Do the first step today',
      'Notice that you got through it',
    ],
    { time: upTo(30), lighter: "Plan exactly when you'll do it." },
  ),
  move(
    'Look after yourself on purpose',
    'Treating yourself with care tells you that you matter.',
    [
      'Do one thing that helps you feel good',
      'A walk, a good meal, a long shower, an early night',
      'Treat it as respect, not a reward',
    ],
    { time: upTo(30) },
  ),
  move(
    'A letter to future you',
    "Picturing who you're becoming makes it easier to act like them.",
    [
      'Write a few lines to you, one year from now',
      "Describe who you're becoming",
      "Save it somewhere you'll find it",
    ],
    { time: fixed(10) },
  ),
  move(
    'Say yes to something',
    "Saying yes to things you'd usually skip widens what feels possible.",
    ["Look for an invite or chance you'd usually skip", 'Say yes to it', 'Plan your first step'],
    { time: fixed(5), lighter: 'Say "maybe" and find out more.' },
  ),
  move(
    "Notice how you've grown",
    'Seeing your own growth is the strongest evidence you can trust yourself.',
    [
      'Think back to how you felt at the start',
      'Name two things you do now that felt hard',
      'Notice how you handled them',
    ],
    { time: fixed(5) },
  ),
  move(
    'Keep what made you braver',
    'Choosing what to keep helps confidence keep growing.',
    [
      'Pick the three things that helped you most',
      'Decide where each fits in your weeks',
      'Save them in your journal or tell someone',
    ],
    { time: fixed(5) },
  ),
] as const;

/** Level 2: a stretch goal, feedback, boundaries and being seen. */
export const CONFIDENCE_DEEP_MOVES = [
  move('Season check-up', 'Going deeper starts with knowing what to stretch toward.', [
    'Rate your confidence, 1 to 10',
    'Write where you still hold back',
    'Pick one area to stretch this season',
  ]),
  move('Set a stretch goal', 'A goal that scares you a little is one that grows you.', [
    'Write one goal for this season that feels a bit scary',
    'Make it specific, with a date',
    'Write why it matters to you',
  ]),
  move('Take the first step', 'Starting the scary goal is the hardest part.', [
    'Write the very first step',
    'Work on it for {m} minutes',
    'Write what you did',
  ]),
  move('Find your doubts', 'Doubts lose their grip once you test them.', [
    'Write 3 doubts about reaching your goal',
    'Next to each, write one fact against it',
    'Read the facts out loud',
  ]),
  move('Ask for honest feedback', 'Asking for feedback builds confidence that lasts.', [
    'Ask someone you trust what you could do better',
    'Listen without defending yourself',
    'Write one useful thing they said',
  ]),
  move('Practice for your goal', 'Skill is the base of real confidence.', [
    'Pick a skill your goal needs',
    'Practice it for {m} minutes',
    'Write one improvement',
  ]),
  move('Week 1 check-up', 'Tracking progress shows your goal is real, not just a wish.', [
    'Write your progress on your stretch goal',
    'Re-rate your confidence',
    'Plan next week’s 3 steps',
  ]),
  move('Lead something small', 'Leading builds trust in your own judgment.', [
    'Offer to organize something small',
    'Make the decisions it needs',
    'Write how it went',
  ]),
  move('Speak first', 'Going first gets easier every time.', [
    'In a meeting, class or group chat, speak first',
    'Keep it short and clear',
    'Write how it felt',
  ]),
  move('Goal work session', 'Steady work is what moves a stretch goal.', [
    'Work on your stretch goal for {m} minutes',
    'Phone in another room',
    'Write what you got done',
  ]),
  move('Hold a boundary', 'Holding a boundary teaches you that your needs count.', [
    'Pick one boundary that matters to you',
    'Say it clearly when it comes up',
    "Don't over-explain or apologize",
  ]),
  move('Ask for what you want', 'Asking clearly is a skill you can train.', [
    'Pick one thing you really want',
    'Ask for it in one clear sentence',
    'Write the answer and how you feel',
  ]),
  move('Your strength list', 'Specific examples make strengths impossible to deny.', [
    'Write 5 strengths you have',
    'Add one real example to each',
    'Read them before something hard',
  ]),
  move('Week 2 check-up', 'Halfway through, your goal should feel more real.', [
    'Write your progress on your stretch goal',
    'Re-rate your confidence',
    'Adjust the plan if you need to',
  ]),
  move('Do the scary step', "The step you've been avoiding is where the growth is.", [
    "Name the goal step you've been avoiding",
    'Do the first 5 minutes of it',
    'Keep going if you can',
  ]),
  move('Share your work', 'Being seen is part of being confident.', [
    'Share something you made with a group or online',
    'Leave it up, no deleting',
    'Write how it felt',
  ]),
  move('Goal work session', 'Steady work is what moves a stretch goal.', [
    'Work on your stretch goal for {m} minutes',
    'Pick the most important next step',
    'Write what you got done',
  ]),
  move('Respond to criticism calmly', 'Staying steady under criticism shows real confidence.', [
    'Next time you get criticized, pause first',
    'Ask one question to understand it',
    "Decide whether it's useful, then move on",
  ]),
  move('Encourage someone', 'Lifting others up builds your own sense of worth.', [
    'Notice someone working hard',
    'Tell them specifically what you see',
    'Write how they reacted',
  ]),
  move('Bounce back from a setback', 'Recovering fast matters more than never failing.', [
    'Write one recent setback',
    'Write what you learned from it',
    'Take one step forward today',
  ]),
  move('Week 3 check-up', 'Three weeks of steps should show real progress.', [
    'Write your progress on your stretch goal',
    'Re-rate your confidence',
    'Plan the final push',
  ]),
  move('Take up space', 'Taking up space tells your brain you belong.', [
    'Sit up front or speak early today',
    'Keep your posture open',
    'Write how people responded',
  ]),
  move('Goal work session', 'The final push is where the goal comes together.', [
    'Work on your stretch goal for {m} minutes',
    'Do the biggest remaining step',
    'Write what you got done',
  ]),
  move('Say yes to something bigger', 'Saying yes to more shows how far you have come.', [
    "Find an opportunity you'd usually skip",
    'Say yes to it',
    'Write the first step',
  ]),
  move('Teach what you know', 'Teaching shows you how much you really know.', [
    'Pick something you are good at',
    'Teach it to someone for {m} minutes',
    'Write what you noticed',
  ]),
  move('Your proof from this season', 'Listing your brave moments locks them in.', [
    'Write the bravest things you did this season',
    'Star the one you are proudest of',
    'Read the list out loud',
  ]),
  move('Plan your next stretch', 'A new stretch keeps your confidence growing.', [
    'Write a bigger goal for next season',
    'Write its first step',
    'Put it in your calendar',
  ]),
  move('Final goal push', 'Finishing strong is part of the goal.', [
    'Spend {m} minutes on your stretch goal',
    'Finish or wrap up one part of it',
    'Write where you ended up',
  ]),
  move('Measure your season', 'Comparing with day 1 shows the real change.', [
    'Rate your confidence, 1 to 10',
    'Compare with day 1',
    'Write how close you got to your goal',
  ]),
  move('Choose what comes next', 'Ending with a plan keeps the progress going.', [
    "Pick 2 practices you'll keep",
    'Write when each happens',
    'Write what you want to work on next',
  ]),
] as const;
