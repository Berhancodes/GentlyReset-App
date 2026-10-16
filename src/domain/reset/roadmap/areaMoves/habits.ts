import { move } from './move';

/** Consistency with one habit: tiny version, a cue, and never missing twice. */
export const HABITS_MOVES = [
  move(
    'Notebook out',
    'Pick your habit',
    'Choose one habit you want back and write down the tiniest version of it.',
  ),
  move(
    'Set a timer',
    'Habit {m} min',
    'Do the tiniest version of your habit for {m} minutes, then stop on purpose.',
  ),
  move(
    'Choose a cue',
    'Tie it to a cue',
    'Attach your habit to something you already do, like after coffee or brushing your teeth.',
  ),
  move(
    'Set out your things',
    'Make it easy',
    'Put whatever your habit needs somewhere you will see it tomorrow.',
  ),
  move(
    'Wait for your cue',
    'Habit {m} min',
    'Right after your cue, do your habit for {m} minutes.',
  ),
  move(
    'Grab a calendar',
    'Mark the day',
    'Mark today on a calendar or a piece of paper the moment you do your habit.',
  ),
  move('Set a timer', 'Habit {m} min', 'Do your habit for {m} minutes, even if it is messy.'),
  move(
    'Pick the hour',
    'Same time',
    'Do your habit for {m} minutes within the same hour as yesterday.',
  ),
  move(
    'Spot the friction',
    'Remove one blocker',
    'Find one thing that makes your habit harder and remove it today.',
  ),
  move(
    'Wait for your cue',
    'Habit {m} min',
    'Do your habit for {m} minutes right after your cue, without negotiating.',
  ),
  move(
    'Notebook out',
    'Plan a backup',
    "Write a tiny backup version of your habit for days when the full one won't happen.",
  ),
  move(
    'Set a timer',
    'Habit {m} min',
    'Do your habit for {m} minutes and mark the calendar straight after.',
  ),
  move(
    'Pick a person',
    'Tell one person',
    'Tell one person which habit you are building this month.',
  ),
  move(
    'Look at your marks',
    'Count your days',
    'Count your marks so far and write down what made the good days work.',
  ),
  move(
    'Same place',
    'Same time and place',
    'Do your habit for {m} minutes at the same time and in the same place.',
  ),
  move(
    'Pick your backup',
    'Busy-day version',
    'Do the backup version on purpose today so a busy day feels normal.',
  ),
  move(
    'Wait for your cue',
    'Habit {m} min',
    'Do your habit for {m} minutes without thinking about it first.',
  ),
  move(
    'Pick a reward',
    'Add a tiny reward',
    'Pair your habit with something you enjoy, like a favorite song or a good drink.',
  ),
  move(
    'Set a timer',
    'Habit {m} min',
    'Do your habit for {m} minutes and stop while it still feels good.',
  ),
  move(
    'Prep tonight',
    'Ready for tomorrow',
    'Set up everything your habit needs for tomorrow before you go to bed.',
  ),
  move(
    'Look at your marks',
    'Find your pattern',
    'Look at your marks and write down which days are hardest and why.',
  ),
  move(
    'Choose your version',
    'Your own version',
    'Do the version of your habit that fits your life now, for {m} minutes.',
  ),
  move(
    'Check this week',
    'Never miss twice',
    'If you missed a day this week, do your habit today, no matter how small.',
  ),
  move('Set a timer', 'Habit {m} min', 'Do your habit for {m} minutes and mark the calendar.'),
  move(
    'Look at your setup',
    'Upgrade one thing',
    'Make one small upgrade that makes your habit more enjoyable to do.',
  ),
  move(
    'Wait for your cue',
    'Habit {m} min',
    'Do your full habit for {m} minutes at your usual time.',
  ),
  move(
    'Calendar out',
    'Plan next week',
    'Write down which days and times your habit will happen next week.',
  ),
  move(
    'Set a timer',
    'Full session',
    'Do your habit for the full {m} minutes and notice how easy starting feels now.',
  ),
  move(
    'Count your marks',
    'See your streak',
    'Count every mark from this month and write down how that feels.',
  ),
  move(
    'Notebook out',
    'Keep or grow it',
    'Decide whether to keep this habit as it is or grow it next season.',
  ),
] as const;

/** Level 2: from one habit to a stacked, measured system that survives busy weeks. */
export const HABITS_DEEP_MOVES = [
  move(
    'Notebook out',
    'Habit check-up',
    'Write how your habit is going and the one thing you want to improve.',
  ),
  move(
    'Set a timer',
    'Habit {m} min',
    'Do your habit for {m} minutes, a little longer than last season.',
  ),
  move(
    'Pick a second habit',
    'Stack a habit',
    'Choose one tiny habit to do right after your main one.',
  ),
  move(
    'Set out your things',
    'Set up both',
    'Put what both habits need in one place you see every day.',
  ),
  move(
    'Wait for your cue',
    'Habit stack',
    'Do your main habit for {m} minutes, then the tiny second one.',
  ),
  move(
    'Grab a calendar',
    'Track both',
    'Mark both habits on your calendar every time you do them.',
  ),
  move(
    'Read your marks',
    'Weekly review',
    "Look at this week's marks and write down what helped you show up.",
  ),
  move(
    'Pick your best time',
    'Habit {m} min',
    'Do your habit stack for {m} minutes at your best time of day.',
  ),
  move(
    'Spot the excuse',
    'Beat one excuse',
    'Write down your most common excuse and a plan to answer it.',
  ),
  move(
    'Wait for your cue',
    'Habit stack',
    'Do both habits today, even if one of them is the tiny version.',
  ),
  move(
    'Pick a measure',
    'Measure progress',
    'Choose one way to measure progress, like pages, minutes, or reps.',
  ),
  move(
    'Set a timer',
    'Habit {m} min',
    "Do your habit for {m} minutes and write down today's measure.",
  ),
  move(
    'Pick a person',
    'Find a partner',
    'Ask someone to check in with you about your habit this week.',
  ),
  move(
    'Read your marks',
    'Count your stack',
    'Count how many days you did both habits this season.',
  ),
  move('Same place', 'Same time and place', 'Do your habit stack at your usual time and place.'),
  move(
    'Notebook out',
    'Busy-week version',
    'Write how your habit works on busy, travel, or sick days.',
  ),
  move(
    'Wait for your cue',
    'Habit stack',
    'Do both habits without negotiating with yourself first.',
  ),
  move('Pick a level-up', 'Raise the bar', 'Raise the bar on your main habit by one small step.'),
  move('Set a timer', 'Habit {m} min', 'Do your habit for {m} minutes at the new level.'),
  move(
    'Prep tonight',
    'Ready for tomorrow',
    'Set up everything both habits need before you go to bed.',
  ),
  move(
    'Read your measures',
    'See your progress',
    "Compare your measure from week one with this week's.",
  ),
  move(
    'Notebook out',
    'Your own system',
    'Write your habit system in one sentence: when, where, and how.',
  ),
  move(
    'Check this week',
    'Never miss twice',
    'If you missed a day this week, do your habits today, however small.',
  ),
  move('Set a timer', 'Habit {m} min', 'Do your habit for {m} minutes and record your measure.'),
  move(
    'Pick a reward',
    'Celebrate progress',
    'Give yourself a small reward for how far your habit has come.',
  ),
  move('Wait for your cue', 'Full stack {m} min', 'Do your full habit stack for {m} minutes.'),
  move(
    'Calendar out',
    'Plan next month',
    'Write down when your habits will happen each week next month.',
  ),
  move('Set a timer', 'Personal best', 'Try for a personal best on your measure today.'),
  move(
    'Count your marks',
    'See the season',
    'Count every mark from this season and write down how that feels.',
  ),
  move(
    'Notebook out',
    'Your habit identity',
    'Finish this sentence in your notebook: I am someone who…',
  ),
] as const;
