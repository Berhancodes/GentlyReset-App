import { during, fixed, move, upTo } from './move';

/** Closer relationships: small, specific ways to reach out, listen and make plans. Every day stands alone. */
export const RELATIONSHIPS_MOVES = [
  move(
    'Send a "thinking of you"',
    'A short, specific message is one of the easiest ways to keep a connection warm.',
    [
      "Think of someone you've meant to message",
      'Mention a memory or what reminded you of them',
      'Send it, with no need for a reply',
    ],
    { time: fixed(3), lighter: 'React to or comment on something they shared.' },
  ),
  move(
    'Give someone your full attention',
    'Feeling properly listened to is something people remember.',
    [
      'In your next real chat, put your phone away',
      'Ask one follow-up question about what they said',
      'Let them finish before you share yours',
    ],
    { time: during },
  ),
  move(
    'Say a specific thank-you',
    'Thanks for something specific lands far deeper than a general "thanks".',
    [
      'Think of someone who made your week easier',
      'Tell them exactly what they did',
      'Say what difference it made to you',
    ],
    { time: fixed(3), lighter: 'Write it in a text instead of saying it.' },
  ),
  move(
    'Turn "we should" into a plan',
    'A date on the calendar is what turns "we should hang out" into seeing each other.',
    [
      "Pick someone you'd genuinely like to see",
      'Suggest a day, a time and a simple idea',
      "Put it in your calendar if they're in",
    ],
    { time: fixed(5), lighter: 'Suggest a video call instead.' },
  ),
  move(
    'Ask a better question',
    'A better question gets past small talk without making things heavy.',
    [
      'Swap "how are you?" for "what\'s been good lately?"',
      'Listen for one thing to ask about later',
      'Share one real thing about your day too',
    ],
    { time: during },
  ),
  move(
    "Make someone's day easier",
    'Small practical help builds trust faster than words do.',
    [
      'Notice something small someone could use help with',
      "Offer it, or just do it if it's welcome",
      'Keep it simple: a coffee, a lift, a dish',
    ],
    { time: upTo(15), lighter: "Send a link, tip or recipe they'd like." },
  ),
  move(
    'Notice who lifts you up',
    'Knowing who leaves you feeling lighter shows where to spend your time.',
    [
      'Think about who you talked with this week',
      'Notice who left you feeling lighter',
      'Plan to reach out to them again soon',
    ],
    { time: fixed(3) },
  ),
  move(
    'Call instead of text',
    "Hearing someone's voice connects you in a way text can't.",
    [
      'Pick someone you usually only text',
      'Call for {m} minutes, or send a voice note',
      'Ask about something real in their life',
    ],
    { time: upTo(15), lighter: 'A one-minute voice note.' },
  ),
  move(
    'Follow up on something',
    'Following up shows people you were really listening.',
    [
      'Think of something a friend mentioned lately',
      'Message to ask how it went',
      'Keep it short and warm',
    ],
    { time: fixed(3) },
  ),
  move(
    'Share how you really are',
    'Opening up a little invites other people to do the same.',
    [
      "In a chat today, share how you've actually been",
      "Keep it honest; it doesn't have to be heavy",
      'Notice how they respond',
    ],
    { time: during, lighter: 'Share one small true thing about your day.' },
  ),
  move(
    'Share a meal or a coffee',
    'Eating together is one of the oldest ways people feel close.',
    [
      'Have a meal or coffee with someone today',
      'Keep phones off the table',
      'Ask about their week, then listen',
    ],
    { time: during, lighter: 'A coffee together over video.' },
  ),
  move(
    'Reach out to someone you miss',
    'A warm, low-pressure message can quietly reopen a door.',
    [
      'Think of someone you drifted away from',
      'Mention one thing you remember about them',
      'Send it with no pressure to reply',
    ],
    { time: fixed(5) },
  ),
  move(
    "Ask for what you'd like",
    'Asking kindly and clearly is easier on everyone than hoping people guess.',
    [
      "Think of something small you'd like from someone",
      'Ask clearly: "Would you be up for…?"',
      'Accept the answer either way',
    ],
    { time: fixed(3), lighter: 'Ask for something tiny, like a recommendation.' },
  ),
  move(
    'Your most real conversation',
    'Noticing what made a conversation feel real helps you have more of them.',
    [
      "Think about this week's conversations",
      'Pick the one that felt most real',
      'Notice what made it different',
    ],
    { time: fixed(3) },
  ),
  move(
    "Celebrate someone's win",
    'Being genuinely happy for others brings you closer.',
    [
      'Notice good news from someone you know',
      'Congratulate them on it specifically',
      'Ask how it feels',
    ],
    { time: fixed(3) },
  ),
  move(
    'Do something together',
    'Shared activities build connection without needing big conversations.',
    [
      'Invite someone for a walk, game or errand',
      'Pick a time this week',
      'Keep it simple and low-cost',
    ],
    { time: upTo(30), lighter: 'An online game or watching the same show.' },
  ),
  move(
    "Learn someone's name",
    'Small friendly moments with familiar faces make daily life feel warmer.',
    [
      'Pick someone you see often, like a neighbour',
      'Say something friendly and ask one easy question',
      'Learn their name and use it next time',
    ],
    { time: fixed(2), lighter: 'A warm hello and a thank-you.' },
  ),
  move(
    'Check in with family',
    'Small regular contact keeps family ties from fading.',
    [
      'Message or call a family member',
      'Ask about something in their life',
      'Share a small update about yours',
    ],
    {
      time: upTo(15),
      lighter: 'Send a photo with a line. If family is hard, pick anyone who feels like family.',
    },
  ),
  move(
    'Write a note of thanks',
    'Written appreciation is often kept and re-read for years.',
    [
      'Think of someone who has mattered to you',
      'Write a few lines about what they mean to you',
      'Send it, or give it by hand',
    ],
    { time: upTo(15), lighter: 'Three sentences in a text.' },
  ),
  move(
    'Clear the air',
    'Small repairs stop distance from quietly building up.',
    [
      'Think of a recent small awkward moment',
      'Say "I\'ve been thinking about…" to them',
      'Own your part in one sentence',
    ],
    {
      time: fixed(5),
      lighter: "Send a friendly message to break the ice. Skip anything that doesn't feel safe.",
    },
  ),
  move(
    'Where you felt most yourself',
    'The people you can be yourself with are worth more of your time.',
    [
      'Think about time with people this week',
      'Notice when you felt most like yourself',
      'Plan more time with that person',
    ],
    { time: fixed(3) },
  ),
  move(
    'Be the one who organises',
    'Friendships often fade simply because nobody makes the plan.',
    [
      'Invite two or more people to something small',
      'Suggest two possible times',
      'Confirm one and add it to your calendar',
    ],
    { time: fixed(10), lighter: 'Invite one person.' },
  ),
  move(
    'Listen without fixing',
    'Sometimes people need to be heard more than helped.',
    [
      'When someone shares a problem, just listen',
      'Ask: "Do you want ideas or just to vent?"',
      'Go with their answer',
    ],
    { time: during },
  ),
  move(
    'Start a small ritual',
    'A regular ritual keeps people close without needing to plan each time.',
    [
      'Pick one person to stay in touch with',
      'Suggest a ritual, like a weekly call or walk',
      'Set the date for the first one',
    ],
    { time: fixed(5), lighter: 'A monthly message on a set day.' },
  ),
  move(
    'Say a kind no',
    'Healthy limits protect the relationships you care about.',
    [
      "Notice a request you'd rather not take on",
      'Say no warmly, in one or two sentences',
      "Offer something smaller if you'd like to",
    ],
    { time: fixed(3) },
  ),
  move(
    'Introduce two people',
    "Connecting people who'd get along makes your circle stronger.",
    [
      "Think of two people who'd get along",
      'Introduce them by message or in person',
      "Say why you think they'd click",
    ],
    { time: fixed(5), lighter: 'Mention one to the other in conversation.' },
  ),
  move(
    'Show up for someone',
    'Being there in a hard moment builds the deepest trust.',
    [
      'Think of someone going through a hard time',
      'Offer something specific, like a meal or walk',
      'Follow through on it',
    ],
    { time: upTo(30), lighter: "Send a message saying you're thinking of them." },
  ),
  move(
    'Time with your people',
    'Time with people who lift you up is one of the best things for wellbeing.',
    [
      'Spend time with someone who lifts you up',
      "Keep phones away while you're together",
      "Tell them you're glad you did this",
    ],
    { time: upTo(30), lighter: 'A call instead of meeting up.' },
  ),
  move(
    "Notice who's closer now",
    'Seeing how your connections grew shows the effort was worth it.',
    [
      'Think back to who you talked with at the start',
      'Notice who you feel closer to now',
      "Name one moment you're glad happened",
    ],
    { time: fixed(5) },
  ),
  move(
    'Choose who to stay close to',
    'A little intention keeps the people who matter close.',
    [
      'Pick three people you want to stay close to',
      "Decide how often you'll reach out to each",
      'Set a reminder for the first one',
    ],
    { time: fixed(5) },
  ),
] as const;

/** Level 2: being open, handling conflict, and building a circle that lasts. */
export const RELATIONSHIPS_DEEP_MOVES = [
  move('Season check-up', 'Going deeper starts with knowing which relationship to invest in.', [
    'Rate how connected you feel, 1 to 10',
    'Write the relationship you most want to deepen',
    'Write what is in the way',
  ]),
  move('Share something real', 'Opening up a little invites others to open up too.', [
    'Pick someone you trust',
    'Share one thing you usually keep to yourself',
    'Notice how they respond',
  ]),
  move('Learn how they feel cared for', 'People feel cared for in different ways.', [
    'Ask someone "What makes you feel cared for?"',
    'Listen closely',
    'Do one thing that matches their answer',
  ]),
  move('Plan quality time', 'Undistracted time builds the deepest bonds.', [
    'Plan {m} minutes of focused time with someone',
    'No phones, no TV',
    'Ask about their hopes, not just their week',
  ]),
  move('Notice your conflict style', 'Knowing how you handle conflict lets you change it.', [
    'Think of your last disagreement',
    'Write whether you shut down, pushed back or gave in',
    'Write what you would do differently',
  ]),
  move('Use "I feel" once', '"I feel" statements lower defensiveness.', [
    'Pick a small frustration',
    'Say "I feel ___ when ___"',
    'Ask what they think',
  ]),
  move('Week 1 check-up', 'Checking in shows whether going deeper is working.', [
    'Re-rate how connected you feel',
    'Write what you shared this week',
    'Write how people responded',
  ]),
  move('Have a hard conversation', 'Hard conversations handled well bring people closer.', [
    'Pick something you have been avoiding saying',
    'Plan your first sentence',
    'Have the conversation, calmly',
  ]),
  move('Apologize fully', 'A full apology repairs more than a quick sorry.', [
    'Think of something you could apologize for',
    'Name what you did and how it affected them',
    'Say what you will do differently',
  ]),
  move('Ask for help with something real', 'Letting others help you deepens the bond.', [
    'Pick something you are struggling with',
    'Ask someone for help with it',
    'Thank them specifically after',
  ]),
  move('Find your community', 'Belonging to a group is good for your health.', [
    'List groups or clubs that match your interests',
    'Pick one to try',
    'Look up when it next meets',
  ]),
  move('Show up for someone', 'Being there when it counts builds deep trust.', [
    'Think of someone going through a hard time',
    'Reach out with a specific offer of help',
    'Follow through on it',
  ]),
  move('Share a memory', 'Shared memories strengthen the bond.', [
    'Pick a good memory with someone',
    'Send it to them, or a photo of it',
    'Ask what they remember about it',
  ]),
  move('Week 2 check-up', 'Comparing weeks shows the bonds growing.', [
    'Re-rate how connected you feel',
    'Write the most meaningful talk this week',
    'Write what made it meaningful',
  ]),
  move('Go to your community', 'Showing up is how belonging starts.', [
    'Go to the group you found on day 11',
    'Introduce yourself to one person',
    'Write how it felt',
  ]),
  move('Listen without fixing', 'Sometimes people need to be heard, not helped.', [
    'When someone shares a problem, just listen',
    'Ask "Do you want help or just to talk?"',
    'Follow their answer',
  ]),
  move('Plan something meaningful', 'Thoughtful plans show people they matter.', [
    'Pick someone important to you',
    'Plan something they would really enjoy',
    'Invite them',
  ]),
  move('Talk about the future together', 'Talking about the future builds a shared path.', [
    'Ask someone close "What are you looking forward to?"',
    'Share your own answer',
    'Find one thing to do together',
  ]),
  move('Give without keeping score', 'Giving freely builds generous relationships.', [
    'Do something kind for someone today',
    "Don't expect anything back",
    'Write how it felt',
  ]),
  move('Repair an old crack', 'Old cracks can heal with one honest step.', [
    'Think of a relationship with an old hurt',
    'Write what you would want to say',
    'Decide when and how to reach out',
  ]),
  move('Week 3 check-up', 'Three weeks of effort should show in how you feel.', [
    'Re-rate how connected you feel',
    'Write the relationship that grew most',
    'Write one that needs more attention',
  ]),
  move('Introduce two people', 'Connecting others builds a stronger circle.', [
    'Think of two people who would get along',
    'Introduce them by message or in person',
    'Say why you think they would click',
  ]),
  move(
    'Celebrate a relationship',
    'Saying out loud what someone means to you strengthens the bond.',
    ['Pick someone who matters to you', 'Tell them what they have meant to you', 'Be specific'],
  ),
  move('Host something small', 'Hosting brings people together and closer to you.', [
    'Invite 2 or 3 people over or out',
    'Keep it simple',
    'Pick a date',
  ]),
  move('Check your boundaries', 'Healthy boundaries keep relationships balanced.', [
    'Write where you feel drained by someone',
    'Pick one boundary to set',
    'Say it kindly this week',
  ]),
  move('Deepen your ritual', 'A deeper ritual keeps a close relationship growing.', [
    'Look at your regular ritual with someone',
    'Add one deeper question to it',
    'Do it this week',
  ]),
  move('Write your relationship values', 'Knowing what you value guides how you show up.', [
    'Write 3 things you want to be as a friend or partner',
    'Write one example of each',
    'Pick one to practice this week',
  ]),
  move('Thank your people', 'Thanks at the end of a season closes it with warmth.', [
    'Pick the 3 people who mattered most this season',
    'Thank each one specifically',
    'Make plans with at least one',
  ]),
  move('Measure your season', 'Comparing with day 1 shows how much closer you are.', [
    'Re-rate how connected you feel',
    'Compare with day 1',
    'Write your biggest relationship win',
  ]),
  move('Choose what comes next', 'Ending with a plan keeps the progress going.', [
    "Pick 2 practices you'll keep",
    'Write when each happens',
    'Write which relationship you will focus on next',
  ]),
] as const;
