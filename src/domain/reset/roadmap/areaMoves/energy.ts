import { during, fixed, move, upTo } from './move';

/** More energy: daylight, water, easy movement, real meals and calmer evenings. Every day stands alone. */
export const ENERGY_MOVES = [
  move(
    'Get outside before noon',
    'Daylight early in the day helps set your body clock, so evenings feel sleepier.',
    [
      'Step outside within a few hours of waking',
      'Stay out for {m} minutes, phone in your pocket',
      'Notice how awake you feel after',
    ],
    { time: upTo(15), lighter: 'Sit by your brightest window instead.' },
  ),
  move(
    'Water with every meal',
    'Pairing water with meals is an easy way to drink more without tracking anything.',
    [
      'Have a full glass with your next meal',
      'Have another with the meal after',
      "Keep a glass or bottle where you'll see it",
    ],
    { time: during, lighter: 'Just one extra glass today.' },
  ),
  move(
    'A walk at talking pace',
    'An easy walk is one of the simplest ways to feel more awake without wearing yourself out.',
    [
      'Pick a loop you can start from your door',
      'Walk {m} minutes at a pace you could chat at',
      'Take the long way back if you feel good',
    ],
    { time: upTo(20), lighter: 'A slow lap around your home or block.' },
  ),
  move(
    'Start winding down tonight',
    'A short, calm stretch before bed helps many people fall asleep more easily.',
    [
      'Pick a time tonight to start winding down',
      'Dim the lights and plug in your phone then',
      'Do something calm: read, stretch or shower',
    ],
    { time: fixed(10), lighter: 'Put your phone down 10 minutes earlier than usual.' },
  ),
  move(
    'Eat a proper lunch',
    'A lunch with protein and vegetables helps many people avoid a heavy afternoon slump.',
    [
      'Build it around a protein like eggs or beans',
      'Fill half the plate with vegetables or fruit',
      'Eat sitting down, away from your screen',
    ],
    { time: fixed(15), lighter: "If you're out, pick the most balanced option on offer." },
  ),
  move(
    'Let your phone sleep elsewhere',
    'A phone out of reach is less likely to keep you up or wake you in the night.',
    [
      'Choose a charging spot across the room',
      'Set a regular alarm if your phone was it',
      'Plug it in there before you get into bed',
    ],
    { time: fixed(2), lighter: "Keep it face down, on silent, out of arm's reach." },
  ),
  move(
    'Notice what gave you energy',
    'Spotting what lifts you makes it easier to do more of it.',
    [
      'Think back over the past week',
      'Name one thing that lifted you, one that drained you',
      'Plan to repeat the lift tomorrow',
    ],
    { time: fixed(3) },
  ),
  move(
    'Wake up at the same time',
    'A steady wake time is one of the most reliable ways to feel less groggy.',
    [
      'Pick a wake time you can keep all week',
      'Set an alarm for it, even on days off',
      'When it rings, get up and open the curtains',
    ],
    { time: fixed(2), lighter: 'Aim for within 30 minutes of that time.' },
  ),
  move(
    'Stretch after sitting',
    'Moving after long sitting helps shake off that stiff, heavy feeling.',
    [
      'Stand up and reach your arms overhead',
      'Roll your shoulders, neck and hips for {m} min',
      'Finish with three slow breaths',
    ],
    { time: upTo(10), lighter: 'Do the same stretches sitting in your chair.' },
  ),
  move(
    'An earlier last coffee',
    'Caffeine can stay in your system for hours and make it harder to fall asleep.',
    [
      'Have your last caffeine by early afternoon',
      'Switch later drinks to water or herbal tea',
      'Notice how easily you fall asleep tonight',
    ],
    { time: during, lighter: 'Make your last cup a half cup.' },
  ),
  move(
    'A breakfast that lasts',
    'A breakfast with some protein tends to keep you fuller and steadier through the morning.',
    [
      'Add a protein: eggs, yogurt, nuts or beans',
      'Pair it with fruit or wholegrain toast',
      'Eat it sitting down, even for five minutes',
    ],
    { time: fixed(10), lighter: 'Grab a yogurt or a handful of nuts on the way.' },
  ),
  move(
    'A slightly brisker walk',
    'A little more pace gives a bigger lift while still feeling easy to start.',
    [
      'Head out for {m} minutes',
      'Walk a bit faster than a stroll',
      'Slow right down for the last minute',
    ],
    { time: upTo(20), lighter: 'Your usual pace, just a few minutes longer.' },
  ),
  move(
    'A real break, no screen',
    'A break without a screen often recharges you more than scrolling does.',
    [
      'Leave your phone in another room',
      'Step outside, make tea or look out a window',
      'Notice how you feel going back to your day',
    ],
    { time: fixed(10), lighter: 'Three minutes looking out a window.' },
  ),
  move(
    'Make your bedroom restful',
    'A calm, uncluttered bedroom makes winding down easier.',
    [
      'Clear clothes and cups off surfaces',
      'Make the bed and open a window for fresh air',
      'Spend {m} minutes, then stop',
    ],
    { time: upTo(15), lighter: 'Clear just your bedside table.' },
  ),
  move(
    'Plan for a tired day',
    'An easy plan ready in advance makes low-energy days much less of a struggle.',
    [
      'Think of what usually happens on tired days',
      'Pick one meal you can make in five minutes',
      'Make sure you have what it needs at home',
    ],
    { time: fixed(5), lighter: 'Pick a quick meal you could order or grab instead.' },
  ),
  move(
    'Move to music',
    'Music makes movement feel like a treat instead of a chore.',
    [
      'Put on two or three songs you love',
      'Move however feels good for {m} minutes',
      'Dance, stretch or tidy along to the beat',
    ],
    { time: upTo(10), lighter: 'One song, swaying or stretching in place.' },
  ),
  move(
    'In bed a little earlier',
    'Going to bed a bit earlier is one of the simplest ways to have more energy tomorrow.',
    [
      'Pick a bedtime 20 minutes earlier than usual',
      'Start winding down 30 minutes before it',
      'Lights off when it arrives',
    ],
    { time: fixed(5), lighter: 'Ten minutes earlier.' },
  ),
  move(
    'Snack before the slump',
    'A planned snack can stop the afternoon dip turning into a crash.',
    [
      'Think about when your energy usually dips',
      'Pack fruit, nuts or yogurt for that time',
      'Eat it before you get really hungry',
    ],
    { time: fixed(5), lighter: 'Have a glass of water and a short walk at that time.' },
  ),
  move(
    'Strength in your living room',
    'Simple bodyweight moves build strength that makes everyday things feel easier.',
    [
      'Stand up from a chair and sit back down, 10 times',
      'Do 10 push-ups against a wall',
      'Repeat at an easy pace for {m} minutes',
    ],
    { time: upTo(15), lighter: 'One round only. Stop if anything hurts.' },
  ),
  move(
    'Fresh air between tasks',
    'A short reset between tasks can stop your energy draining all day.',
    [
      'Next time you finish a task, step outside',
      'Take ten slow breaths of fresh air',
      'Then start the next thing',
    ],
    { time: fixed(5), lighter: 'Open a window and breathe there.' },
  ),
  move(
    'Your best-energy day',
    'Your own good days hold the best clues about what works for you.',
    [
      'Think of your best-energy day this week',
      'Name what you did differently that day',
      'Repeat one part of it tomorrow',
    ],
    { time: fixed(3) },
  ),
  move(
    'Your own good morning',
    "A short morning you chose yourself is easier to keep than anyone else's routine.",
    [
      'Pick two things that helped your mornings',
      'Do both tomorrow before you check your phone',
      'Notice how the first hour feels',
    ],
    { time: fixed(10), lighter: 'Just one of them.' },
  ),
  move(
    'Cook something simple',
    'Cooking even simple meals gives you more say in how you feel afterwards.',
    [
      'Choose a meal with a protein and vegetables',
      'Cook it yourself, even something basic',
      'Make extra for tomorrow if you can',
    ],
    { time: upTo(30), lighter: 'Assemble one instead: a wrap, salad or bowl.' },
  ),
  move(
    'A walk somewhere nice',
    'Walking somewhere you enjoy makes it feel like time off, not exercise.',
    [
      'Pick a park, street or path you like',
      'Walk there for {m} minutes',
      'Stop once to take in the view',
    ],
    { time: upTo(30), lighter: 'A short walk to the nearest green spot.' },
  ),
  move(
    'Swap one drain for a lift',
    'Replacing a draining habit works better than simply trying to stop it.',
    [
      'Think of a habit that often leaves you flat',
      'Pick something that lifts you instead',
      'Do the lift at that time today',
    ],
    { time: fixed(10), lighter: 'Do the lift once, any time today.' },
  ),
  move(
    'Set up tomorrow tonight',
    "A little prep tonight makes tomorrow's good choices the easy ones.",
    [
      'Lay out clothes and pack your bag',
      "Plan or prep tomorrow's breakfast",
      'Fill a water bottle and put it by the door',
    ],
    { time: fixed(10), lighter: 'Just lay out your clothes.' },
  ),
  move(
    'A screen-free last hour',
    'Putting screens away before bed helps many people sleep more deeply.',
    [
      'Pick the hour before bed for no screens',
      'Read, stretch, tidy or talk instead',
      'Notice how you sleep tonight',
    ],
    { time: during, lighter: 'The last 20 minutes.' },
  ),
  move(
    'A full good-energy day',
    'Putting a few small changes together shows how much they add up.',
    [
      'Get daylight and water in the morning',
      'Eat a proper lunch and take a short walk',
      'Wind down on time tonight',
    ],
    { time: during, lighter: 'Pick any two of the three.' },
  ),
  move(
    "Notice what's changed",
    'Seeing your progress makes it easier to keep going.',
    [
      'Think back to how you felt at the start',
      'Name two things that feel different now',
      'Notice which changes you barely think about',
    ],
    { time: fixed(5) },
  ),
  move(
    'Keep what helped',
    'Choosing what to keep turns a month of effort into how you live.',
    [
      'Pick the three changes that helped most',
      'Decide where each fits in your week',
      'Save them in your journal or tell someone',
    ],
    { time: fixed(5) },
  ),
] as const;

/** Level 2: a sleep window, real training and fuel once the basics stick. */
export const ENERGY_DEEP_MOVES = [
  move('Season check-up', 'Going deeper starts with picking what to push.', [
    'Rate energy, sleep and fitness, 1 to 10 each',
    "Write yesterday's step count if you have it",
    'Pick one area to push this season',
  ]),
  move('Set your sleep window', 'Consistent sleep is the biggest energy lever there is.', [
    'Pick a bedtime and wake time 8 hours apart',
    'Set alarms for both',
    'Start tonight',
  ]),
  move('Steady cardio', 'Steady cardio builds the engine behind daily energy.', [
    'Walk fast, cycle or jog for {m} minutes',
    'Breathe hard, but still able to talk',
    'Write how hard it felt, 1 to 10',
  ]),
  move('First strength session', 'Muscle makes everyday effort feel lighter.', [
    'Do squats, push-ups and a plank',
    'Do 3 rounds within {m} minutes',
    'Write your reps for each',
  ]),
  move('Protein at every meal', 'Protein at each meal keeps blood sugar steady.', [
    'Add a protein to breakfast, lunch and dinner',
    'Write what you ate',
    'Rate your afternoon energy',
  ]),
  move('Add 1,000 steps', 'Small step increases add up to real stamina.', [
    "Check yesterday's step count",
    'Aim for 1,000 more today',
    'Walk after a meal to get there',
  ]),
  move('Week 1 check-up', 'Your sleep window is the base for everything else.', [
    'Re-rate energy, sleep and fitness',
    'Count the nights you hit your sleep window',
    'Write what got in the way',
  ]),
  move('Light and movement first', 'Morning light and movement together wake you up best.', [
    'Get outside within an hour of waking',
    'Walk for {m} minutes',
    'Skip your phone until you are back',
  ]),
  move('Strength, plus 2 reps', 'Doing a little more each time is how you get stronger.', [
    'Repeat the day 4 session',
    'Add 2 reps to each exercise',
    'Write your new numbers',
  ]),
  move('Protect tonight’s sleep', 'Late food and alcohol make sleep lighter.', [
    'Skip alcohol tonight',
    'Finish eating 3 hours before bed',
    'Rate your sleep in the morning',
  ]),
  move('Recover from stress fast', 'Recovering quickly saves energy you would lose to stress.', [
    'After a stressful moment, take 5 slow breaths',
    'Then walk for 2 minutes',
    'Write how quickly you calmed down',
  ]),
  move('Longer cardio', 'Longer sessions build stamina.', [
    'Do steady cardio for {m} minutes',
    'Try a new route',
    'Write the distance or how it felt',
  ]),
  move("Plan tomorrow's meals", 'A plan stops you grabbing whatever is fastest.', [
    "Plan tomorrow's 3 meals tonight",
    'Put protein and vegetables in each',
    'Buy or prep one thing now',
  ]),
  move('Week 2 check-up', 'Your numbers show which habits pay off most.', [
    'Re-rate energy, sleep and fitness',
    'Compare your reps with day 4',
    'Pick one habit to tighten up',
  ]),
  move('Try intervals', 'Short bursts raise fitness quickly.', [
    'Warm up for 2 minutes',
    'Alternate 30 seconds fast and 90 seconds easy',
    'Keep going for {m} minutes total',
  ]),
  move('Hour-by-hour energy', 'Finding your low hour lets you plan around it.', [
    'Rate your energy each hour from 9am to 6pm',
    'Find your lowest hour',
    'Plan a walk or snack before it tomorrow',
  ]),
  move('A harder version', 'A harder version of one move keeps you progressing.', [
    'Make one exercise harder, like elevated push-ups',
    'Do 3 rounds',
    'Write your numbers',
  ]),
  move('Mobility session', 'Loose muscles make moving feel easier all day.', [
    'Stretch hips, back and shoulders for {m} minutes',
    'Hold each stretch for 30 seconds',
    'Write what felt tightest',
  ]),
  move('Pay back sleep debt', 'A slightly earlier bedtime repays sleep debt.', [
    'Go to bed 20 minutes earlier tonight',
    'Keep your usual wake time',
    "Rate tomorrow's energy",
  ]),
  move('Move with someone', 'Moving with someone makes it easier to show up.', [
    'Invite someone for a walk or workout',
    'Move together for {m} minutes',
    'Plan the next one before you leave',
  ]),
  move('Week 3 check-up', 'Three weeks of effort should show in your numbers.', [
    'Re-rate energy, sleep and fitness',
    'Compare with day 1',
    'Write what still drags you down',
  ]),
  move('Fuel before you move', 'A small snack before exercise makes it feel easier.', [
    'Eat a small snack an hour before moving',
    'Do steady cardio for {m} minutes',
    'Compare how hard it felt with day 12',
  ]),
  move('A cold splash wake-up', 'A quick cold splash makes you more alert.', [
    'Splash cold water on your face this morning',
    'Take 10 deep breaths',
    'Rate your alertness, 1 to 5',
  ]),
  move('Strength test', 'Testing again shows how much stronger you are.', [
    'Repeat the day 4 session exactly',
    'Count every rep',
    'Compare with day 4',
  ]),
  move('Your longest session', 'Your longest session yet proves your stamina grew.', [
    'Walk, hike or ride for {m} minutes',
    'Bring water',
    'Write how you felt at the end',
  ]),
  move('A planned recovery day', 'Rest days are where fitness actually builds.', [
    'Keep today gentle: a walk and a stretch',
    'Skip hard exercise',
    'Go to bed on time',
  ]),
  move('Update your energy plan', 'A plan with your own numbers is one you will follow.', [
    'Add your sleep window, workout days and meals',
    "Schedule next week's workouts",
    "Put it where you'll see it",
  ]),
  move('Run your plan for a day', 'One full day on the plan shows what it can do.', [
    'Follow every part of your plan today',
    'Rate energy at 10am, 2pm and 7pm',
    'Write what worked best',
  ]),
  move('Measure your season', 'Comparing with day 1 shows the real change.', [
    'Re-rate energy, sleep and fitness',
    'Compare with day 1',
    'Write your biggest win',
  ]),
  move('Choose what comes next', 'Ending with a plan keeps the progress going.', [
    "Pick the 3 habits you'll keep",
    'Write when each happens in your week',
    'Write what you want to work on next',
  ]),
] as const;
