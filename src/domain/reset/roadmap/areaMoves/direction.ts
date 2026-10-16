import { move } from './move';

/** Direction: name what matters, pick one path, and take real steps on it. */
export const DIRECTION_MOVES = [
  move(
    'Notebook out',
    'What matters now',
    'Write down three things that matter to you right now, in any order.',
  ),
  move(
    'Open your list',
    'Choose one direction',
    'Circle the one thing from your list that you most want to move toward.',
  ),
  move(
    'Set a timer',
    'First step {m} min',
    'Spend {m} minutes on the smallest possible step toward your direction.',
  ),
  move(
    'Notebook out',
    'Picture a good day',
    'Write what an ordinary good day would look like a few months from now.',
  ),
  move(
    'Pick a source',
    'Learn {m} min',
    'Spend {m} minutes reading or watching something about your direction.',
  ),
  move(
    'Watch your day',
    'Spot one drift',
    'Notice one thing today that pulled you away from what matters and write it down.',
  ),
  move(
    'Read your notes',
    'Check the week',
    "Read this week's notes and write down one thing you feel sure about.",
  ),
  move('Set a timer', 'One step {m} min', 'Take one real step on your direction for {m} minutes.'),
  move(
    'Pick a person',
    'Ask someone',
    'Ask one person who has done something similar for one piece of advice.',
  ),
  move(
    'Notebook out',
    'Make some room',
    'Write down one commitment you could drop to make room for your direction.',
  ),
  move(
    'Set a timer',
    'One step {m} min',
    'Spend {m} minutes moving your direction forward, even if it is messy.',
  ),
  move(
    'Notebook out',
    'Name a milestone',
    'Write one small milestone you could reach by the end of this month.',
  ),
  move(
    'Calendar out',
    'Protect {m} min',
    'Block {m} minutes in your day for your direction and guard them.',
  ),
  move(
    'Read your notes',
    'Course check',
    'Ask yourself whether this still feels like the right direction, and write down why.',
  ),
  move(
    'Same time as before',
    'One step {m} min',
    'Work on your direction for {m} minutes at the same time as yesterday.',
  ),
  move(
    'Notebook out',
    'Name the fear',
    'Write down the fear that slows you down and one small way around it.',
  ),
  move('Set a timer', 'Milestone step {m} min', 'Take a {m}-minute step toward your milestone.'),
  move('Pick a person', 'Share your plan', 'Tell one person what you are working toward.'),
  move(
    'Set a timer',
    'Make something',
    'Make or finish one small piece of work toward your direction in {m} minutes.',
  ),
  move(
    'Spot the distraction',
    'Say no to drift',
    'Say no to one distraction today to protect your direction time.',
  ),
  move(
    'Read your notes',
    'See your progress',
    'Write down everything you have done toward your direction this month.',
  ),
  move(
    'Choose your step',
    'Your own next step',
    'Decide your next step yourself and spend {m} minutes on it.',
  ),
  move(
    'Check this week',
    'Small is forward',
    'If this week stalled, take a two-minute step today and call it progress.',
  ),
  move(
    'Close extra tabs',
    'Deep step {m} min',
    'Give your direction {m} focused minutes with nothing else open.',
  ),
  move(
    'Open your milestone',
    'Check your milestone',
    'Check how close you are to your milestone and adjust it honestly.',
  ),
  move('Set a timer', 'One step {m} min', 'Spend the full {m} minutes on your direction today.'),
  move(
    'Calendar out',
    'Plan next month',
    'Write down your direction steps for each week of next month.',
  ),
  move(
    'Notebook out',
    'Write your why',
    'Write a few lines about why this direction matters to you.',
  ),
  move(
    'Open your first list',
    'Compare your list',
    'Reread your day-one list and mark what has changed since then.',
  ),
  move(
    'Notebook out',
    'Keep what worked',
    'Write down the direction you are carrying into the next season.',
  ),
] as const;

/** Level 2: from choosing a direction to a season goal with weekly milestones. */
export const DIRECTION_DEEP_MOVES = [
  move(
    'Notebook out',
    'Direction check-up',
    'Write where you are with your direction and what you want next.',
  ),
  move(
    'Pick a goal',
    'Set a season goal',
    'Write one clear goal you want to reach by the end of this season.',
  ),
  move(
    'Set a timer',
    'First step {m} min',
    'Spend {m} minutes on the first step toward your season goal.',
  ),
  move('Notebook out', 'Break it down', 'Split your season goal into four weekly milestones.'),
  move('Pick a source', 'Learn {m} min', 'Spend {m} minutes learning a skill your goal needs.'),
  move('Pick a person', 'Find a guide', 'Reach out to someone further along the path you want.'),
  move(
    'Read your notes',
    'Weekly review',
    "Check this week's milestone and write down what helped you move.",
  ),
  move(
    'Notifications off',
    'Deep step {m} min',
    'Give your goal {m} focused minutes with notifications off.',
  ),
  move(
    'Notebook out',
    'Remove a blocker',
    'Write the biggest thing blocking your goal and one way around it.',
  ),
  move(
    'Calendar out',
    'Block your time',
    "Put three sessions for your goal into this week's calendar.",
  ),
  move(
    'Set a timer',
    'Deep step {m} min',
    'Work on your goal for {m} minutes, even if it is messy.',
  ),
  move(
    'Pick a piece',
    'Ship something small',
    'Finish one small piece of work and show it to someone.',
  ),
  move(
    'Pick a source',
    'Learn {m} min',
    'Spend {m} minutes learning from someone who has done it.',
  ),
  move(
    'Read your milestones',
    'Milestone check',
    'Check your second milestone and adjust the plan honestly.',
  ),
  move(
    'Same time as before',
    'Deep step {m} min',
    'Work on your goal for {m} minutes at your usual time.',
  ),
  move(
    'Notebook out',
    'Face the fear',
    'Write down what scares you about your goal, then do one small part anyway.',
  ),
  move('Set a timer', 'Deep step {m} min', 'Push your goal forward for {m} minutes.'),
  move(
    'Pick a person',
    'Share your progress',
    'Tell someone what you have done toward your goal so far.',
  ),
  move(
    'Set a timer',
    'Make something',
    'Create or finish one real piece of work toward your goal in {m} minutes.',
  ),
  move(
    'Spot the drift',
    'Cut a distraction',
    'Cut one distraction that keeps stealing your goal time.',
  ),
  move(
    'Read your notes',
    'See your progress',
    'List everything you have done toward your goal this season.',
  ),
  move(
    'Pick the hardest part',
    'Hardest part {m} min',
    'Spend {m} minutes on the part of your goal you keep avoiding.',
  ),
  move(
    'Check this week',
    'Restart small',
    'If this week stalled, take a five-minute step and call it momentum.',
  ),
  move('Notifications off', 'Deep step {m} min', 'Give your goal {m} distraction-free minutes.'),
  move(
    'Read your goal',
    'Final push plan',
    'Write what you need to do this week to reach your season goal.',
  ),
  move('Set a timer', 'Deep step {m} min', 'Spend the full {m} minutes on your goal.'),
  move(
    'Calendar out',
    'Plan the next goal',
    'Write down what your next goal could be after this season.',
  ),
  move(
    'Pick a piece',
    'Finish strong',
    'Finish one thing that brings you closer to your season goal.',
  ),
  move('Notebook out', 'Check-up again', 'Compare where you are now with day one of this season.'),
  move(
    'Notebook out',
    'Your next chapter',
    'Write the direction you want to carry into next season.',
  ),
] as const;
