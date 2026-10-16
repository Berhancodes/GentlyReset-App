import { move } from './move';

/** Relationships: reach out, be present, and keep small plans with people. */
export const RELATIONSHIPS_MOVES = [
  move(
    'Think of someone',
    'Send one message',
    'Send a short, kind message to someone you have been missing.',
  ),
  move(
    'Phone away',
    'Be fully present',
    'Give one conversation today your full attention, with your phone away.',
  ),
  move(
    'Notebook out',
    'Name your people',
    'Write down the names of three people who make you feel better.',
  ),
  move(
    'Pick a person',
    'Say thank you',
    'Thank someone specifically for something they did for you.',
  ),
  move(
    'Pick a time',
    'Call {m} min',
    'Call or voice-note someone for {m} minutes instead of texting.',
  ),
  move(
    'Notice yourself',
    'Listen first',
    'In one conversation, ask one more question before you share your side.',
  ),
  move(
    'Notebook out',
    'Your best moment',
    'Write down which moment with someone felt best this week, and why.',
  ),
  move(
    'Pick someone',
    'Make a plan',
    'Make one small plan with someone, like a walk, a coffee, or a call.',
  ),
  move('Find a photo', 'Send a memory', 'Send someone a photo or a memory the two of you share.'),
  move(
    'Phone away',
    'Present {m} min',
    'Spend {m} minutes with someone, fully there and with no screens.',
  ),
  move(
    'Notebook out',
    'Name one need',
    'Write down one thing you need more of from the people around you.',
  ),
  move(
    'Pick someone',
    'Ask how they are',
    'Ask someone how they are really doing and listen to the whole answer.',
  ),
  move(
    'Pick a person',
    'Give a compliment',
    'Give one honest, specific compliment to someone today.',
  ),
  move(
    'Check your plan',
    'Follow through',
    "Keep the plan you made this week, even if it's a shorter version.",
  ),
  move(
    'Same time as before',
    'Weekly check-in',
    'Message one of your three people at the same time as last week.',
  ),
  move(
    'Pick one thing',
    'Mend something small',
    'Send one message to repair something small that went wrong.',
  ),
  move(
    'Phone away',
    'Present {m} min',
    'Give {m} minutes of full attention to someone you live or work with.',
  ),
  move(
    'Check your week',
    'Protect your time',
    'Say no, kindly, to one plan that would leave you drained.',
  ),
  move(
    'Pick someone',
    'Do something kind',
    'Do one small kind thing for someone without being asked.',
  ),
  move(
    'Pick a time',
    'Call {m} min',
    'Call someone for {m} minutes and let the conversation be easy.',
  ),
  move(
    'Notebook out',
    'Who lifts you',
    'Write down who you felt best around this week and plan to see them more.',
  ),
  move(
    'Choose your way',
    'Your connection habit',
    'Pick the way of connecting that felt best this month and do it today.',
  ),
  move(
    'Feeling distant?',
    'Reach out anyway',
    'On a low day, send one short message instead of going quiet.',
  ),
  move('Pick someone', 'Plan something fun', 'Make a plan with someone purely for fun.'),
  move(
    'Pick a person',
    'Share something real',
    'Tell someone one honest thing about how this month has been.',
  ),
  move('Phone away', 'Present {m} min', 'Spend {m} minutes fully with someone you care about.'),
  move(
    'Calendar out',
    'Plan your people',
    'Write down who you will reach out to in each week of next month.',
  ),
  move('Pick someone', 'Say what they mean', 'Tell someone what they mean to you, in plain words.'),
  move(
    'Read your notes',
    'Look back',
    "Read this month's notes and name who you feel closer to now.",
  ),
  move(
    'Notebook out',
    'Keep what worked',
    'Write down the connection habit you are keeping for the next season.',
  ),
] as const;

/** Level 2: from reaching out to deeper, honest, regular connection. */
export const RELATIONSHIPS_DEEP_MOVES = [
  move(
    'Notebook out',
    'Connection check-up',
    'Write who you feel close to now and who you want to be closer to.',
  ),
  move(
    'Pick someone',
    'Reach out deeper',
    'Message someone you want to be closer to and ask them a real question.',
  ),
  move('Pick a time', 'Call {m} min', 'Call someone for {m} minutes and ask about their week.'),
  move(
    'Notice yourself',
    'Listen fully',
    'In one conversation, listen without planning what you will say next.',
  ),
  move('Pick someone', 'Plan a meetup', 'Make a plan to see someone in person this week.'),
  move(
    'Phone away',
    'Present {m} min',
    'Spend {m} minutes fully present with someone, with phones away.',
  ),
  move(
    'Read your notes',
    'Weekly review',
    'Write down which conversation this week meant the most to you.',
  ),
  move(
    'Pick a person',
    'Show appreciation',
    'Tell someone one specific thing you appreciate about them.',
  ),
  move(
    'Pick someone',
    'Remember a detail',
    'Follow up with someone on something they told you last time.',
  ),
  move(
    'Check your plan',
    'Keep the meetup',
    'Keep the plan you made this week, even if it ends up short.',
  ),
  move(
    'Notebook out',
    'Name your needs',
    'Write what you need from your closest people and how you could ask for it.',
  ),
  move(
    'Pick someone',
    'Ask for support',
    'Ask someone for support with one thing you are dealing with.',
  ),
  move('Pick a person', 'Do a favor', 'Do a small favor for someone without being asked.'),
  move('Read your notes', 'Who lifts you', 'Write down who you felt best around this week.'),
  move(
    'Same time as before',
    'Weekly call',
    'Call one of your close people at the same time as last week.',
  ),
  move(
    'Pick a hard talk',
    'Honest conversation',
    'Gently have one honest conversation you have been putting off.',
  ),
  move(
    'Phone away',
    'Present {m} min',
    'Give {m} minutes of full attention to someone at home or at work.',
  ),
  move(
    'Check your week',
    'Protect your energy',
    'Step back from one plan or relationship that keeps draining you.',
  ),
  move('Look around', 'Find your people', 'Look for one group, class, or club you could join.'),
  move(
    'Pick a time',
    'Call {m} min',
    "Call someone you haven't spoken to in a while for {m} minutes.",
  ),
  move(
    'Read your notes',
    'Look at your circle',
    'Write down how your connections have changed this season.',
  ),
  move(
    'Choose your way',
    'Your weekly ritual',
    'Pick a weekly ritual with someone, like a walk or a call, and start it.',
  ),
  move(
    'Feeling alone?',
    'Reach out first',
    'On a lonely day, reach out first instead of waiting to hear from someone.',
  ),
  move('Pick someone', 'Plan something fun', 'Plan an activity with someone purely for fun.'),
  move(
    'Pick a person',
    'Share something real',
    'Share something you are proud of or worried about with someone you trust.',
  ),
  move('Phone away', 'Present {m} min', 'Spend {m} minutes with someone you love, fully there.'),
  move('Calendar out', 'Plan your people', "Put time with your people into next month's calendar."),
  move(
    'Pick someone',
    'Write a note',
    'Write a heartfelt note or message to someone important to you.',
  ),
  move(
    'Notebook out',
    'Check-up again',
    'Write who you feel closer to now than at the start of this season.',
  ),
  move(
    'Notebook out',
    'Your people plan',
    'Write down how you will keep your important relationships strong.',
  ),
] as const;
