import { move } from './move';

/** A quieter mind: unload, single-task, and let loops close. */
export const MIND_MOVES = [
  move(
    'Find a quiet spot',
    'Brain dump {m} min',
    'Write every thought that keeps looping for {m} minutes, then close the page.',
  ),
  move(
    'Phone face down',
    'Sit still {m} min',
    'Sit with your phone face down for {m} minutes and simply notice what your mind does.',
  ),
  move(
    'Pick one worry',
    'Shrink one worry',
    'Take one worry from your list and write the smallest next step that would help it.',
  ),
  move(
    'Set a timer',
    'Breathe {m} min',
    'Breathe slowly, in for four and out for six, for {m} minutes.',
  ),
  move(
    'Pen by your bed',
    'Night unload',
    "Before bed, write down three things your mind is holding so you don't have to.",
  ),
  move(
    'Pick a short route',
    'Walk with no audio',
    'Walk for {m} minutes with no podcast or music, just the sounds around you.',
  ),
  move(
    'Open your list',
    'Cross one off',
    'Look at your first brain dump and cross off one thing that no longer matters.',
  ),
  move(
    'Choose a worry time',
    'Worry window',
    'Give your worries one {m}-minute window today and park them on paper outside it.',
  ),
  move(
    'Mute one app',
    'Quiet one input',
    'Mute or move one app that keeps your mind loud, then spend {m} minutes without it.',
  ),
  move(
    'Close extra tabs',
    'Single-task {m} min',
    'Do one thing for {m} minutes with nothing else open.',
  ),
  move(
    'Write the thought',
    'Question one thought',
    'Write down one harsh thought and ask whether it is a fact or a feeling.',
  ),
  move(
    'Find a window',
    'Look far away',
    'Spend {m} minutes outside or by a window, letting your eyes rest on something far.',
  ),
  move(
    'Notebook out',
    'Three good things',
    'Write three small things that went okay today, even the tiny ones.',
  ),
  move(
    "Pick tomorrow's one",
    'Close the day',
    "Write tomorrow's single most important thing so your mind can rest tonight.",
  ),
  move(
    'Same spot as before',
    'Same quiet time',
    'Do {m} minutes of quiet at the same time and place as yesterday.',
  ),
  move(
    'Set a timer',
    'Brain dump {m} min',
    'Empty your head onto paper for {m} minutes, since you are building a habit, not a masterpiece.',
  ),
  move(
    'Phone in another room',
    'Screen-free morning',
    'Keep your phone away for the first {m} minutes after you wake up.',
  ),
  move(
    'Set a timer',
    'Breathe {m} min',
    'Breathe in for four and out for six for {m} minutes, steadier than last time.',
  ),
  move(
    'Pick one loop',
    'Decide and drop it',
    'Pick one decision you keep circling, choose good-enough, and stop revisiting it.',
  ),
  move(
    'Shoes on',
    'Walk with no audio',
    'Take a {m}-minute walk with no audio and let your thoughts settle on their own.',
  ),
  move(
    'Read your notes',
    'Spot the pattern',
    'Read your last week of notes and circle the worry that keeps coming back.',
  ),
  move(
    'Choose your favorite',
    'Your own quiet',
    'Pick the quiet practice that helped you most and do it for {m} minutes.',
  ),
  move(
    'Notice the noise',
    'Busy-day version',
    'On a loud day, do a one-minute version of your quiet practice instead of skipping it.',
  ),
  move(
    'Write the thought',
    'Answer it kindly',
    'Answer one anxious thought the way you would answer a good friend.',
  ),
  move(
    'Clear one surface',
    'Quiet your space',
    'Clear one surface near where you think, then sit there for {m} minutes.',
  ),
  move(
    'Close extra tabs',
    'Single-task {m} min',
    'Give {m} minutes to one task with no switching, then notice how your head feels.',
  ),
  move(
    'Calendar out',
    'Plan your quiet week',
    'Write down when your quiet minutes will happen on each day next week.',
  ),
  move(
    'Set a timer',
    'Full quiet session',
    'Do your full quiet practice for {m} minutes and notice what feels easier than day one.',
  ),
  move(
    'Open your first list',
    'Compare the lists',
    'Reread your first brain dump and mark everything that has gotten quieter.',
  ),
  move(
    'Notebook out',
    'Keep what worked',
    'Write down the one quiet habit you are keeping for the next season.',
  ),
] as const;

/** Level 2: from a quieter mind to a calm toolkit that works on hard days. */
export const MIND_DEEP_MOVES = [
  move(
    'Notebook out',
    'Mind check-up',
    'Rate how loud your mind feels from 1 to 10 and write what takes up the most space.',
  ),
  move(
    'Set a timer',
    'Morning pages {m} min',
    'Write whatever comes to mind for {m} minutes first thing in the morning.',
  ),
  move(
    'Pick a trigger',
    'Name a trigger',
    'Write down one situation that reliably makes your mind start racing.',
  ),
  move(
    'Set a timer',
    'Long breaths {m} min',
    'Breathe slowly for {m} minutes, making each out-breath longer than the in-breath.',
  ),
  move(
    'Phone in a drawer',
    'Phone-free hour',
    'Put your phone in a drawer for one full hour this evening.',
  ),
  move(
    'Shoes on',
    'Mindful walk {m} min',
    'Walk for {m} minutes and name five things you can see, hear, and feel.',
  ),
  move(
    'Read your week',
    'Weekly review',
    "Read this week's notes and write down what calmed you the most.",
  ),
  move(
    'Open your list',
    'Close an open loop',
    'Finish or cancel one task that has been sitting in your head for weeks.',
  ),
  move(
    'Pick an app',
    'Delete one app',
    'Delete or log out of one app that feeds your overthinking.',
  ),
  move(
    'Notifications off',
    'Deep focus {m} min',
    'Work on one important thing for {m} minutes with notifications off.',
  ),
  move(
    'Write the worry',
    'Rewrite the story',
    'Write one worry as a story, then write a calmer and truer version of it.',
  ),
  move(
    'Find somewhere green',
    'Nature {m} min',
    'Spend {m} minutes somewhere with trees, water, or open sky.',
  ),
  move(
    'Notebook out',
    'Gratitude list',
    'Write down five specific things you are grateful for today.',
  ),
  move(
    'Plan tomorrow',
    'Evening plan',
    "Write tomorrow's three priorities before bed so you can start the morning calm.",
  ),
  move(
    'Same spot as before',
    'Quiet ritual {m} min',
    'Do {m} minutes of quiet in the same place and at the same time as your ritual.',
  ),
  move(
    'Pick a decision',
    'Decide in five',
    'Make one decision you have been avoiding within five minutes, then move on.',
  ),
  move(
    'Phone in another room',
    'Screen-free start',
    'Keep your phone away for the first {m} minutes of your morning.',
  ),
  move(
    'Lie down',
    'Body scan {m} min',
    'Lie down and slowly notice each part of your body for {m} minutes.',
  ),
  move(
    'Open your feeds',
    'Trim your inputs',
    'Unfollow or mute three accounts that leave you feeling worse.',
  ),
  move(
    'Shoes on',
    'Walk and think {m} min',
    'Walk for {m} minutes and let one problem untangle itself without forcing it.',
  ),
  move(
    'Read your notes',
    'Find your calm',
    'Look back at this season and write down when your mind feels quietest.',
  ),
  move(
    'Choose your practice',
    'Your full practice',
    'Do your favorite quiet practice for the full {m} minutes.',
  ),
  move(
    'Notebook out',
    'Stress plan',
    'Write the two-minute practice you will use the next time stress spikes.',
  ),
  move(
    'Pick someone you trust',
    'Talk it out',
    'Tell someone you trust about one worry instead of carrying it alone.',
  ),
  move(
    'Clear a space',
    'Calm corner',
    'Set up one corner with a few things that help you feel calm.',
  ),
  move(
    'Notifications off',
    'Deep focus {m} min',
    'Give {m} minutes to deep work with nothing else open.',
  ),
  move(
    'Calendar out',
    'Plan your calm week',
    'Put your quiet practice into your calendar for every day next week.',
  ),
  move('Set a timer', 'Longest quiet', 'Do your longest quiet session yet, for {m} minutes.'),
  move(
    'Notebook out',
    'Check-up again',
    'Rate how loud your mind feels from 1 to 10 and compare it with day one.',
  ),
  move(
    'Notebook out',
    'Your calm toolkit',
    'Write the three practices that work best for you, so you can use them anytime.',
  ),
] as const;
