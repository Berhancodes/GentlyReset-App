import { move } from './move';

/** Confidence: keep small promises, collect evidence, and take up space. */
export const CONFIDENCE_MOVES = [
  move(
    'Pick something tiny',
    'Keep one promise',
    'Make yourself one tiny promise for today and keep it before bed.',
  ),
  move(
    'Notebook out',
    'Write one win',
    'Write down one thing you did well today, no matter how small.',
  ),
  move(
    'Pick an avoided task',
    'Finish one small thing',
    'Finish one small task you have been avoiding, from start to done.',
  ),
  move(
    'Roll your shoulders',
    'Stand tall {m} min',
    'Stand or sit tall for {m} minutes while you do something ordinary.',
  ),
  move(
    'Notebook out',
    'Name a strength',
    'Write down one strength that someone once noticed in you.',
  ),
  move(
    'Notice the urge',
    'Say a small yes',
    'Say yes to one small thing you would usually talk yourself out of.',
  ),
  move('Open your wins', 'Read your week', "Read this week's wins out loud to yourself."),
  move(
    'Pick a promise',
    'Keep a bigger promise',
    'Make one promise that takes {m} minutes and keep it today.',
  ),
  move(
    'Listen to your voice',
    'Catch one put-down',
    'Catch one moment you put yourself down and rewrite it kindly.',
  ),
  move(
    'Pick a skill',
    'Practice {m} min',
    'Spend {m} minutes practicing something you want to be better at.',
  ),
  move(
    'Pick a moment',
    'Speak up once',
    'Ask one question or share one opinion you would normally keep to yourself.',
  ),
  move(
    'Choose an outfit',
    'Dress for you',
    'Wear something today that makes you feel most like yourself.',
  ),
  move('Notebook out', 'Write two wins', 'Write down two things you handled well this week.'),
  move(
    'Open your list',
    'Count your promises',
    'Count the promises you have kept to yourself so far.',
  ),
  move(
    'Same time as before',
    'Practice {m} min',
    'Practice your skill for {m} minutes at the same time as last time.',
  ),
  move(
    'Pick a nervous thing',
    'Do it scared',
    'Do one thing that makes you a little nervous, even for just a few minutes.',
  ),
  move(
    'Notebook out',
    'Evidence list',
    'Write three pieces of evidence that you can be trusted to show up.',
  ),
  move(
    'Pick one request',
    'Say one kind no',
    "Say no to one thing that doesn't fit, kindly and without over-explaining.",
  ),
  move(
    'Set a timer',
    'Practice {m} min',
    'Practice your skill for {m} minutes and notice one thing that improved.',
  ),
  move('Pick someone', 'Ask for help', 'Ask someone for one small piece of help or advice today.'),
  move(
    'Read your notes',
    'Spot your growth',
    'Read your notes and write what you can do now that felt hard on day one.',
  ),
  move(
    'Choose a promise',
    'Your own promise',
    'Make a promise in your own words for the coming week and start it today.',
  ),
  move(
    'Check this week',
    'Keep going anyway',
    "If something went wrong this week, do one small thing that proves you're still in.",
  ),
  move('Pick a moment', 'Take up space', 'Share an idea, sit up front, or speak first once today.'),
  move('Set a timer', 'Practice {m} min', 'Practice your skill for the full {m} minutes today.'),
  move(
    'Notebook out',
    'Write a letter',
    'Write a few kind lines to the version of you from day one.',
  ),
  move('Calendar out', 'Plan your promises', 'Write three small promises you will keep next week.'),
  move(
    'Pick a challenge',
    'A bigger yes',
    'Say yes to something a little bigger than the small yes from week one.',
  ),
  move('Open your wins', 'Read your month', 'Read every win you have written down this month.'),
  move(
    'Notebook out',
    'Keep what worked',
    'Write down the promise you are carrying into the next season.',
  ),
] as const;

/** Level 2: from small promises to a stretch goal and braver everyday moments. */
export const CONFIDENCE_DEEP_MOVES = [
  move(
    'Notebook out',
    'Confidence check-up',
    'Rate your confidence from 1 to 10 and write where it feels lowest.',
  ),
  move(
    'Pick a goal',
    'Set a stretch goal',
    'Write one goal for this season that feels a little bit scary.',
  ),
  move(
    'Set a timer',
    'First step {m} min',
    'Spend {m} minutes on the first step toward your stretch goal.',
  ),
  move(
    'Pick a skill',
    'Practice {m} min',
    'Practice a skill that supports your goal for {m} minutes.',
  ),
  move(
    'Notebook out',
    'Brave wins',
    'Write down three things you did this week that took courage.',
  ),
  move(
    'Pick someone',
    'Ask for feedback',
    'Ask someone you trust what they think you are good at.',
  ),
  move(
    'Read your notes',
    'Weekly review',
    "Read this week's notes and write down the bravest thing you did.",
  ),
  move(
    'Pick a moment',
    'Lead once',
    'Take the lead on one small thing today, like a plan or a decision.',
  ),
  move(
    'Write the doubt',
    'Challenge a doubt',
    'Write down one self-doubt and three facts that prove it wrong.',
  ),
  move(
    'Set a timer',
    'Practice {m} min',
    'Practice your skill for {m} minutes and note one improvement.',
  ),
  move('Pick a request', 'Ask for what you want', 'Ask clearly for one thing you want today.'),
  move(
    'Pick something kind',
    'Look after yourself',
    'Do one thing that helps you feel good in your body, like a walk or a good meal.',
  ),
  move(
    'Notebook out',
    'Strength list',
    'Write five strengths you have, with one real example for each.',
  ),
  move('Read your goal', 'Goal check', 'Write down how far you have come on your stretch goal.'),
  move(
    'Same time as before',
    'Practice {m} min',
    'Practice your skill for {m} minutes at your usual time.',
  ),
  move(
    'Pick something scary',
    'Do the scary thing',
    'Do one thing this week that you have been too nervous to try.',
  ),
  move('Pick a moment', 'Share your work', 'Show someone something you made or did.'),
  move(
    'Pick a boundary',
    'Hold a boundary',
    'Hold one boundary today, even if it feels uncomfortable.',
  ),
  move('Set a timer', 'Goal step {m} min', 'Spend {m} minutes on your stretch goal.'),
  move(
    'Pick someone',
    'Encourage someone',
    'Give someone real encouragement, the kind you would like to hear.',
  ),
  move(
    'Read your notes',
    'Spot your growth',
    'Write what feels easier now than at the start of the season.',
  ),
  move(
    'Choose a challenge',
    'Your own challenge',
    'Pick your own confidence challenge for today and do it.',
  ),
  move(
    'After a setback',
    'Bounce back',
    'If something went badly, write what you learned and take one step forward.',
  ),
  move(
    'Pick a moment',
    'Speak first',
    'Speak first once today, in a meeting, a class, or a group chat.',
  ),
  move('Set a timer', 'Goal step {m} min', 'Spend the full {m} minutes on your stretch goal.'),
  move(
    'Notebook out',
    'Letter to future you',
    'Write a short letter to yourself one season from now.',
  ),
  move('Calendar out', 'Plan your courage', 'Write three brave things you will do next month.'),
  move(
    'Pick a big yes',
    'Your biggest yes',
    'Say yes to the biggest opportunity you can find this week.',
  ),
  move(
    'Notebook out',
    'Check-up again',
    'Rate your confidence from 1 to 10 and compare it with day one.',
  ),
  move(
    'Notebook out',
    'Your proof',
    'Write the moments from this season that prove you can trust yourself.',
  ),
] as const;
