import { move } from './move';

/** More energy: water, light, movement, and sleep that protects tomorrow. */
export const ENERGY_MOVES = [
  move(
    'Fill a glass',
    'Water first',
    'Drink a full glass of water before anything else this morning.',
  ),
  move(
    'Find daylight',
    'Morning light {m} min',
    'Get outside or sit by a bright window for {m} minutes before noon.',
  ),
  move(
    'Pick a bedtime',
    'Set a wind-down alarm',
    'Set an alarm for 30 minutes before the time you want to be asleep.',
  ),
  move(
    'Shoes by the door',
    'Easy walk {m} min',
    'Take an easy {m}-minute walk, slow enough that you could talk.',
  ),
  move(
    'Charger across the room',
    'Phone off the bed',
    "Charge your phone away from your bed tonight, out of arm's reach.",
  ),
  move(
    'Plan a real snack',
    'Eat before the dip',
    'Have a real snack or meal before 2pm so the afternoon dip is smaller.',
  ),
  move(
    'Notebook out',
    'Rate your energy',
    "Rate today's energy from 1 to 5 and write what helped or drained it.",
  ),
  move(
    'Pick a wake time',
    'Same wake time',
    'Get up within 30 minutes of the time you got up yesterday.',
  ),
  move(
    'Clear a floor spot',
    'Stretch {m} min',
    'Stretch slowly for {m} minutes, doing whatever feels good.',
  ),
  move(
    'Pick a cut-off',
    'Caffeine cut-off',
    'Have your last coffee, tea, or energy drink before 2pm today.',
  ),
  move(
    'Shoes by the door',
    'Walk {m} min',
    'Walk for {m} minutes, a little longer than your first week.',
  ),
  move(
    'Dim the lights',
    'Screens down early',
    'Dim the lights and put screens away 20 minutes before bed.',
  ),
  move(
    'Fill a bottle',
    'Water all day',
    'Keep a full water bottle in sight and finish it by the evening.',
  ),
  move(
    'Notebook out',
    'Check your week',
    'Look at your energy ratings and circle your best day and what made it good.',
  ),
  move(
    'Same time as before',
    'Morning light {m} min',
    'Get {m} minutes of daylight at the same time as yesterday.',
  ),
  move(
    'Pick a time',
    'Move {m} min',
    'Move your body for {m} minutes in any way: walk, dance, stretch, anything.',
  ),
  move(
    'Plan dinner',
    'Earlier dinner',
    'Finish eating at least two hours before you go to bed tonight.',
  ),
  move(
    'Alarm goes off',
    'Wind-down routine',
    'When your alarm goes off, start the same wind-down: lights low, phone away, something calm.',
  ),
  move(
    'Lay things out',
    'Easy morning setup',
    'Set out water and clothes tonight so tomorrow starts without effort.',
  ),
  move(
    'Shoes on',
    'Walk {m} min',
    'Take a {m}-minute walk and notice how your body feels afterwards.',
  ),
  move(
    'Notebook out',
    'Spot your drain',
    'Write down the one thing that drained you most this week and one way to soften it.',
  ),
  move(
    'Pick your favorite',
    'Your energy move',
    'Choose the move that helped you most and do it for {m} minutes.',
  ),
  move(
    'Plan for tired days',
    'The 2-minute version',
    'On a tired day, do just two minutes of your move instead of skipping it.',
  ),
  move(
    'Find a break spot',
    'Real break {m} min',
    'Take a {m}-minute break away from screens in the middle of your day.',
  ),
  move(
    'Check your bedtime',
    'Protect your sleep',
    "Go to bed at your planned time tonight, even if the show isn't over.",
  ),
  move('Shoes on', 'Longer walk {m} min', 'Walk for the full {m} minutes and let it stay easy.'),
  move(
    'Calendar out',
    'Plan your rhythm',
    'Write your wake time, bedtime, and move time for each day next week.',
  ),
  move(
    'Water and light',
    'Full energy day',
    'Do water, daylight, and your move today, then rate your energy.',
  ),
  move(
    'Read your ratings',
    'Compare the weeks',
    "Compare your first week's energy ratings with this week's.",
  ),
  move(
    'Notebook out',
    'Keep what worked',
    'Write down the one energy habit you are keeping for the next season.',
  ),
] as const;

/** Level 2: from small energy wins to sleep, food, and movement you can rely on. */
export const ENERGY_DEEP_MOVES = [
  move(
    'Notebook out',
    'Energy audit',
    'Write down when you feel most and least energetic during a normal day.',
  ),
  move('Find daylight', 'Light walk {m} min', 'Walk outside in the morning light for {m} minutes.'),
  move(
    'Pick a sleep window',
    'Set your sleep window',
    'Choose a bedtime and wake time that give you eight hours and write them down.',
  ),
  move(
    'Pick a workout',
    'Move {m} min',
    'Do {m} minutes of movement that raises your heart rate a little.',
  ),
  move('Plan a meal', 'Add one vegetable', 'Add one vegetable or piece of fruit to a meal today.'),
  move(
    'Fill a bottle',
    'Two bottles of water',
    'Drink two full bottles of water before the evening.',
  ),
  move(
    'Read your week',
    'Weekly review',
    'Look back at this week and write down what gave you the most energy.',
  ),
  move(
    'Alarm set',
    'Hit your sleep window',
    'Go to bed and wake up inside your sleep window today.',
  ),
  move(
    'Clear a floor spot',
    'Strength {m} min',
    'Do {m} minutes of simple strength moves like squats, push-ups, or lunges.',
  ),
  move('Plan a snack', 'Protein snack', 'Swap one sugary snack for something with protein in it.'),
  move('Shoes on', 'Brisk walk {m} min', 'Walk briskly for {m} minutes, fast enough to feel warm.'),
  move(
    'Dim the lights',
    'Screen-free hour',
    'Keep screens off for the last hour before bed tonight.',
  ),
  move(
    'Find a break spot',
    'Afternoon reset',
    'When the afternoon dip hits, step outside for five minutes instead of reaching for sugar.',
  ),
  move(
    'Read your notes',
    'Check your sleep',
    'Count how many nights this week you went to bed inside your sleep window.',
  ),
  move(
    'Same time as before',
    'Move {m} min',
    'Move for {m} minutes at the same time as yesterday.',
  ),
  move(
    'Pick a stretch',
    'Mobility {m} min',
    'Spend {m} minutes stretching your hips, back, and shoulders.',
  ),
  move('Plan dinner', 'Cook one meal', 'Cook one simple meal at home instead of ordering in.'),
  move(
    'Pick a time',
    'No caffeine after noon',
    'Try having no caffeine after noon today and notice how you sleep.',
  ),
  move(
    'Pack a bag',
    'Ready the night before',
    "Pack tomorrow's bag and set out your clothes before you go to bed.",
  ),
  move('Shoes on', 'Long walk {m} min', 'Take a {m}-minute walk somewhere you enjoy.'),
  move(
    'Read your notes',
    'Find your pattern',
    'Write down the two habits that changed your energy most this season.',
  ),
  move(
    'Choose your move',
    'Your favorite move',
    'Do your favorite kind of movement for {m} minutes.',
  ),
  move(
    'Notebook out',
    'Tired-day plan',
    'Write the minimum version of your energy habits for exhausting days.',
  ),
  move(
    'Find a quiet spot',
    'Real rest {m} min',
    'Rest for {m} minutes with your eyes closed and no screen.',
  ),
  move(
    'Look at your week',
    'Plan a lie-in',
    'Plan one morning this week when you can sleep without an alarm.',
  ),
  move(
    'Clear a floor spot',
    'Strength {m} min',
    'Do {m} minutes of strength moves, a little more than in week two.',
  ),
  move(
    'Calendar out',
    'Plan your week',
    "Put your sleep window and movement into next week's calendar.",
  ),
  move(
    'Water and light',
    'Best energy day',
    'Hit your sleep, water, light, and movement today, then rate your energy.',
  ),
  move(
    'Notebook out',
    'Energy audit again',
    'Write when you feel most and least energetic now and compare it with day one.',
  ),
  move(
    'Notebook out',
    'Your energy rules',
    'Write your three personal energy rules to keep for good.',
  ),
] as const;
