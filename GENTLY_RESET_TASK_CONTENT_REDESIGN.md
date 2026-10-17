# Gently Reset — Daily Task Content Redesign

Status: **proposal only. Nothing implemented.** Approved direction (October 17, 2026):

1. Real-life actions, self-contained days, light reflection.
2. Tasks sized by a per-task time rule.
3. One optional "lighter version" per day, matched to reset type.
4. Habits becomes everyday routines rather than one unnamed habit.

---

## 1. Diagnosis of the current content

**What works**

- **Energy and Relationships** are mostly concrete: daylight, walks, water, calling someone, saying thanks. They are the model for everything else.
- **The 30-day arc** works and stays: baseline → build → use it in real life → make it yours → look back.
- **The three-step card** works: a title, why it matters, and three ticks.

**What doesn't**

| Problem | Where | Example |
|---|---|---|
| About technique, not life | Habits (almost all), parts of Confidence | "Tie it to something you already do", "Make a tracker", "Pair it with something you like" |
| Depends on information the app never stored | Habits, Confidence, Mind, Direction | "Wait for your cue from day 3", "Climb rung 2", "Beat your drift count from day 11", "Open your list from day 1" |
| Same template in every area | All six | "Week 1/2/3 check-in", "Measure your month", "Carry it forward" — 30 of 180 days are the same meta-task |
| Repeated filler | Direction, Confidence L2 | "Goal work session" ×4–6 |
| Rating and writing with nowhere to keep it | All six | "Rate 1 to 10", "Compare with day 2", "List 10 situations" |
| Habit-psychology vocabulary | Habits, Mind | "cue", "friction", "if-then", "loops" |
| Same task for every personality | All six | Reset type only changes a closing tone line |
| Time stretched to fill the commitment | Several | A 30-minute user is told to do a 30-minute version of anything with `{m}` |

**Effect on the user:** the plan reads like a course *about* self-improvement. Users want a coach telling them what to do today.

---

## 2. Task-quality principles

Every day must pass all eight:

1. **Specific.** Understood in one read. No jargon (cue, friction, loop, if-then, baseline).
2. **Actionable today.** Doable at most hours. If it must be evening or morning, the step says so ("tonight", "when you wake").
3. **Sized to the activity.** Uses the time rule (section 5), never padded to the user's full commitment.
4. **On-topic.** Clearly about the chosen focus area.
5. **A realistic benefit.** The why says what it helps with, softly ("helps many people…"). No health guarantees.
6. **Self-contained.** Never needs something written or decided on another day. Progression comes from the activity growing, not from callbacks.
7. **Warm, never patronising or guilt-inducing.** No "don't break the chain", no "you should".
8. **Flexible.** Social, physical or outdoor days have a lighter version that still counts.

**Format limits (unchanged UI):**
- Title ≤ 34 characters.
- Why: one sentence.
- Exactly three steps, each ≤ 60 characters.
- The third step closes the task: a moment of noticing, or a finishing action.

**Weekly rhythm (each area words it differently):**

| Days | Purpose |
|---|---|
| 1–7 | Approachable, low-pressure wins |
| 8–14 | Useful everyday behaviours |
| 15–21 | Using them in real, slightly harder situations |
| 22–28 | Doing it your own way, more independently |
| 29–30 | Recognising progress, choosing what to keep |

Days 7, 14 and 21 are short **real-life look-backs**: noticing what helped, then doing one thing tomorrow. They are not ratings.

---

## 3. All 180 Level 1 tasks

**How to read each day**

- `⏱ fixed N min`: the task takes about N minutes, whatever the commitment.
- `⏱ up to N min`: `{m}` = the user's ramped minutes for that day, capped at N (see section 5).
- `⏱ during your day`: done inside something the user already does (a meal, a conversation).
- **Lighter** is the optional easier version (see section 6).

---

### ENERGY — feel more awake, sleep better, move a little more

#### Week 1

**Day 1 · Get outside before noon** · ⏱ up to 15 min
**Why:** Daylight early in the day helps set your body clock, so evenings feel sleepier.
1. Step outside within a few hours of waking
2. Stay out for {m} minutes, phone in your pocket
3. Notice how awake you feel after

*Lighter:* Sit by your brightest window instead.

**Day 2 · Water with every meal** · ⏱ during your day
**Why:** Pairing water with meals is an easy way to drink more without tracking anything.
1. Have a full glass with your next meal
2. Have another with the meal after
3. Keep a glass or bottle where you'll see it

*Lighter:* Just one extra glass today.

**Day 3 · A walk at talking pace** · ⏱ up to 20 min
**Why:** An easy walk is one of the simplest ways to feel more awake without wearing yourself out.
1. Pick a loop you can start from your door
2. Walk {m} minutes at a pace you could chat at
3. Take the long way back if you feel good

*Lighter:* A slow lap around your home or block.

**Day 4 · Start winding down tonight** · ⏱ fixed 10 min
**Why:** A short, calm stretch before bed helps many people fall asleep more easily.
1. Pick a time tonight to start winding down
2. Dim the lights and plug in your phone then
3. Do something calm: read, stretch or shower

*Lighter:* Put your phone down 10 minutes earlier than usual.

**Day 5 · Eat a proper lunch** · ⏱ fixed 15 min
**Why:** A lunch with protein and vegetables helps many people avoid a heavy afternoon slump.
1. Build it around a protein like eggs or beans
2. Fill half the plate with vegetables or fruit
3. Eat sitting down, away from your screen

*Lighter:* If you're out, pick the most balanced option on offer.

**Day 6 · Let your phone sleep elsewhere** · ⏱ fixed 2 min
**Why:** A phone out of reach is less likely to keep you up or wake you in the night.
1. Choose a charging spot across the room
2. Set a regular alarm if your phone was it
3. Plug it in there before you get into bed

*Lighter:* Keep it face down, on silent, out of arm's reach.

**Day 7 · Notice what gave you energy** · ⏱ fixed 3 min
**Why:** Spotting what lifts you makes it easier to do more of it.
1. Think back over the past week
2. Name one thing that lifted you, one that drained you
3. Plan to repeat the lift tomorrow

#### Week 2

**Day 8 · Wake up at the same time** · ⏱ fixed 2 min
**Why:** A steady wake time is one of the most reliable ways to feel less groggy.
1. Pick a wake time you can keep all week
2. Set an alarm for it, even on days off
3. When it rings, get up and open the curtains

*Lighter:* Aim for within 30 minutes of that time.

**Day 9 · Stretch after sitting** · ⏱ up to 10 min
**Why:** Moving after long sitting helps shake off that stiff, heavy feeling.
1. Stand up and reach your arms overhead
2. Roll your shoulders, neck and hips for {m} min
3. Finish with three slow breaths

*Lighter:* Do the same stretches sitting in your chair.

**Day 10 · An earlier last coffee** · ⏱ during your day
**Why:** Caffeine can stay in your system for hours and make it harder to fall asleep.
1. Have your last caffeine by early afternoon
2. Switch later drinks to water or herbal tea
3. Notice how easily you fall asleep tonight

*Lighter:* Make your last cup a half cup.

**Day 11 · A breakfast that lasts** · ⏱ fixed 10 min
**Why:** A breakfast with some protein tends to keep you fuller and steadier through the morning.
1. Add a protein: eggs, yogurt, nuts or beans
2. Pair it with fruit or wholegrain toast
3. Eat it sitting down, even for five minutes

*Lighter:* Grab a yogurt or a handful of nuts on the way.

**Day 12 · A slightly brisker walk** · ⏱ up to 20 min
**Why:** A little more pace gives a bigger lift while still feeling easy to start.
1. Head out for {m} minutes
2. Walk a bit faster than a stroll
3. Slow right down for the last minute

*Lighter:* Your usual pace, just a few minutes longer.

**Day 13 · A real break, no screen** · ⏱ fixed 10 min
**Why:** A break without a screen often recharges you more than scrolling does.
1. Leave your phone in another room
2. Step outside, make tea or look out a window
3. Notice how you feel going back to your day

*Lighter:* Three minutes looking out a window.

**Day 14 · Make your bedroom restful** · ⏱ up to 15 min
**Why:** A calm, uncluttered bedroom makes winding down easier.
1. Clear clothes and cups off surfaces
2. Make the bed and open a window for fresh air
3. Spend {m} minutes, then stop

*Lighter:* Clear just your bedside table.

#### Week 3

**Day 15 · Plan for a tired day** · ⏱ fixed 5 min
**Why:** An easy plan ready in advance makes low-energy days much less of a struggle.
1. Think of what usually happens on tired days
2. Pick one meal you can make in five minutes
3. Make sure you have what it needs at home

*Lighter:* Pick a quick meal you could order or grab instead.

**Day 16 · Move to music** · ⏱ up to 10 min
**Why:** Music makes movement feel like a treat instead of a chore.
1. Put on two or three songs you love
2. Move however feels good for {m} minutes
3. Dance, stretch or tidy along to the beat

*Lighter:* One song, swaying or stretching in place.

**Day 17 · In bed a little earlier** · ⏱ fixed 5 min
**Why:** Going to bed a bit earlier is one of the simplest ways to have more energy tomorrow.
1. Pick a bedtime 20 minutes earlier than usual
2. Start winding down 30 minutes before it
3. Lights off when it arrives

*Lighter:* Ten minutes earlier.

**Day 18 · Snack before the slump** · ⏱ fixed 5 min
**Why:** A planned snack can stop the afternoon dip turning into a crash.
1. Think about when your energy usually dips
2. Pack fruit, nuts or yogurt for that time
3. Eat it before you get really hungry

*Lighter:* Have a glass of water and a short walk at that time.

**Day 19 · Strength in your living room** · ⏱ up to 15 min
**Why:** Simple bodyweight moves build strength that makes everyday things feel easier.
1. Stand up from a chair and sit back down, 10 times
2. Do 10 push-ups against a wall
3. Repeat at an easy pace for {m} minutes

*Lighter:* One round only. Stop if anything hurts.

**Day 20 · Fresh air between tasks** · ⏱ fixed 5 min
**Why:** A short reset between tasks can stop your energy draining all day.
1. Next time you finish a task, step outside
2. Take ten slow breaths of fresh air
3. Then start the next thing

*Lighter:* Open a window and breathe there.

**Day 21 · Your best-energy day** · ⏱ fixed 3 min
**Why:** Your own good days hold the best clues about what works for you.
1. Think of your best-energy day this week
2. Name what you did differently that day
3. Repeat one part of it tomorrow

#### Week 4

**Day 22 · Your own good morning** · ⏱ fixed 10 min
**Why:** A short morning you chose yourself is easier to keep than anyone else's routine.
1. Pick two things that helped your mornings
2. Do both tomorrow before you check your phone
3. Notice how the first hour feels

*Lighter:* Just one of them.

**Day 23 · Cook something simple** · ⏱ up to 30 min
**Why:** Cooking even simple meals gives you more say in how you feel afterwards.
1. Choose a meal with a protein and vegetables
2. Cook it yourself, even something basic
3. Make extra for tomorrow if you can

*Lighter:* Assemble one instead: a wrap, salad or bowl.

**Day 24 · A walk somewhere nice** · ⏱ up to 30 min
**Why:** Walking somewhere you enjoy makes it feel like time off, not exercise.
1. Pick a park, street or path you like
2. Walk there for {m} minutes
3. Stop once to take in the view

*Lighter:* A short walk to the nearest green spot.

**Day 25 · Swap one drain for a lift** · ⏱ fixed 10 min
**Why:** Replacing a draining habit works better than simply trying to stop it.
1. Think of a habit that often leaves you flat
2. Pick something that lifts you instead
3. Do the lift at that time today

*Lighter:* Do the lift once, any time today.

**Day 26 · Set up tomorrow tonight** · ⏱ fixed 10 min
**Why:** A little prep tonight makes tomorrow's good choices the easy ones.
1. Lay out clothes and pack your bag
2. Plan or prep tomorrow's breakfast
3. Fill a water bottle and put it by the door

*Lighter:* Just lay out your clothes.

**Day 27 · A screen-free last hour** · ⏱ during your evening
**Why:** Putting screens away before bed helps many people sleep more deeply.
1. Pick the hour before bed for no screens
2. Read, stretch, tidy or talk instead
3. Notice how you sleep tonight

*Lighter:* The last 20 minutes.

**Day 28 · A full good-energy day** · ⏱ during your day
**Why:** Putting a few small changes together shows how much they add up.
1. Get daylight and water in the morning
2. Eat a proper lunch and take a short walk
3. Wind down on time tonight

*Lighter:* Pick any two of the three.

#### Days 29–30

**Day 29 · Notice what's changed** · ⏱ fixed 5 min
**Why:** Seeing your progress makes it easier to keep going.
1. Think back to how you felt at the start
2. Name two things that feel different now
3. Notice which changes you barely think about

**Day 30 · Keep what helped** · ⏱ fixed 5 min
**Why:** Choosing what to keep turns a month of effort into how you live.
1. Pick the three changes that helped most
2. Decide where each fits in your week
3. Save them in your journal or tell someone

---

### RELATIONSHIPS — feel closer to the people who matter

#### Week 1

**Day 1 · Send a "thinking of you"** · ⏱ fixed 3 min
**Why:** A short, specific message is one of the easiest ways to keep a connection warm.
1. Think of someone you've meant to message
2. Mention a memory or what reminded you of them
3. Send it, with no need for a reply

*Lighter:* React to or comment on something they shared.

**Day 2 · Give someone your full attention** · ⏱ during a conversation
**Why:** Feeling properly listened to is something people remember.
1. In your next real chat, put your phone away
2. Ask one follow-up question about what they said
3. Let them finish before you share yours

**Day 3 · Say a specific thank-you** · ⏱ fixed 3 min
**Why:** Thanks for something specific lands far deeper than a general "thanks".
1. Think of someone who made your week easier
2. Tell them exactly what they did
3. Say what difference it made to you

*Lighter:* Write it in a text instead of saying it.

**Day 4 · Turn "we should" into a plan** · ⏱ fixed 5 min
**Why:** A date on the calendar is what turns "we should hang out" into seeing each other.
1. Pick someone you'd genuinely like to see
2. Suggest a day, a time and a simple idea
3. Put it in your calendar if they're in

*Lighter:* Suggest a video call instead.

**Day 5 · Ask a better question** · ⏱ during a conversation
**Why:** A better question gets past small talk without making things heavy.
1. Swap "how are you?" for "what's been good lately?"
2. Listen for one thing to ask about later
3. Share one real thing about your day too

**Day 6 · Make someone's day easier** · ⏱ up to 15 min
**Why:** Small practical help builds trust faster than words do.
1. Notice something small someone could use help with
2. Offer it, or just do it if it's welcome
3. Keep it simple: a coffee, a lift, a dish

*Lighter:* Send a link, tip or recipe they'd like.

**Day 7 · Notice who lifts you up** · ⏱ fixed 3 min
**Why:** Knowing who leaves you feeling lighter shows where to spend your time.
1. Think about who you talked with this week
2. Notice who left you feeling lighter
3. Plan to reach out to them again soon

#### Week 2

**Day 8 · Call instead of text** · ⏱ up to 15 min
**Why:** Hearing someone's voice connects you in a way text can't.
1. Pick someone you usually only text
2. Call for {m} minutes, or send a voice note
3. Ask about something real in their life

*Lighter:* A one-minute voice note.

**Day 9 · Follow up on something** · ⏱ fixed 3 min
**Why:** Following up shows people you were really listening.
1. Think of something a friend mentioned lately
2. Message to ask how it went
3. Keep it short and warm

**Day 10 · Share how you really are** · ⏱ during a conversation
**Why:** Opening up a little invites other people to do the same.
1. In a chat today, share how you've actually been
2. Keep it honest; it doesn't have to be heavy
3. Notice how they respond

*Lighter:* Share one small true thing about your day.

**Day 11 · Share a meal or a coffee** · ⏱ during a meal
**Why:** Eating together is one of the oldest ways people feel close.
1. Have a meal or coffee with someone today
2. Keep phones off the table
3. Ask about their week, then listen

*Lighter:* A coffee together over video.

**Day 12 · Reach out to someone you miss** · ⏱ fixed 5 min
**Why:** A warm, low-pressure message can quietly reopen a door.
1. Think of someone you drifted away from
2. Mention one thing you remember about them
3. Send it with no pressure to reply

**Day 13 · Ask for what you'd like** · ⏱ fixed 3 min
**Why:** Asking kindly and clearly is easier on everyone than hoping people guess.
1. Think of something small you'd like from someone
2. Ask clearly: "Would you be up for…?"
3. Accept the answer either way

*Lighter:* Ask for something tiny, like a recommendation.

**Day 14 · Your most real conversation** · ⏱ fixed 3 min
**Why:** Noticing what made a conversation feel real helps you have more of them.
1. Think about this week's conversations
2. Pick the one that felt most real
3. Notice what made it different

#### Week 3

**Day 15 · Celebrate someone's win** · ⏱ fixed 3 min
**Why:** Being genuinely happy for others brings you closer.
1. Notice good news from someone you know
2. Congratulate them on it specifically
3. Ask how it feels

**Day 16 · Do something together** · ⏱ up to 30 min
**Why:** Shared activities build connection without needing big conversations.
1. Invite someone for a walk, game or errand
2. Pick a time this week
3. Keep it simple and low-cost

*Lighter:* An online game or watching the same show.

**Day 17 · Learn someone's name** · ⏱ fixed 2 min
**Why:** Small friendly moments with familiar faces make daily life feel warmer.
1. Pick someone you see often, like a neighbour
2. Say something friendly and ask one easy question
3. Learn their name and use it next time

*Lighter:* A warm hello and a thank-you.

**Day 18 · Check in with family** · ⏱ up to 15 min
**Why:** Small regular contact keeps family ties from fading.
1. Message or call a family member
2. Ask about something in their life
3. Share a small update about yours

*Lighter:* Send a photo with a line. If family is hard, pick anyone who feels like family.

**Day 19 · Write a note of thanks** · ⏱ up to 15 min
**Why:** Written appreciation is often kept and re-read for years.
1. Think of someone who has mattered to you
2. Write a few lines about what they mean to you
3. Send it, or give it by hand

*Lighter:* Three sentences in a text.

**Day 20 · Clear the air** · ⏱ fixed 5 min
**Why:** Small repairs stop distance from quietly building up.
1. Think of a recent small awkward moment
2. Say "I've been thinking about…" to them
3. Own your part in one sentence

*Lighter:* Send a friendly message to break the ice. Skip anything that doesn't feel safe.

**Day 21 · Where you felt most yourself** · ⏱ fixed 3 min
**Why:** The people you can be yourself with are worth more of your time.
1. Think about time with people this week
2. Notice when you felt most like yourself
3. Plan more time with that person

#### Week 4

**Day 22 · Be the one who organises** · ⏱ fixed 10 min
**Why:** Friendships often fade simply because nobody makes the plan.
1. Invite two or more people to something small
2. Suggest two possible times
3. Confirm one and add it to your calendar

*Lighter:* Invite one person.

**Day 23 · Listen without fixing** · ⏱ during a conversation
**Why:** Sometimes people need to be heard more than helped.
1. When someone shares a problem, just listen
2. Ask: "Do you want ideas or just to vent?"
3. Go with their answer

**Day 24 · Start a small ritual** · ⏱ fixed 5 min
**Why:** A regular ritual keeps people close without needing to plan each time.
1. Pick one person to stay in touch with
2. Suggest a ritual, like a weekly call or walk
3. Set the date for the first one

*Lighter:* A monthly message on a set day.

**Day 25 · Say a kind no** · ⏱ fixed 3 min
**Why:** Healthy limits protect the relationships you care about.
1. Notice a request you'd rather not take on
2. Say no warmly, in one or two sentences
3. Offer something smaller if you'd like to

**Day 26 · Introduce two people** · ⏱ fixed 5 min
**Why:** Connecting people who'd get along makes your circle stronger.
1. Think of two people who'd get along
2. Introduce them by message or in person
3. Say why you think they'd click

*Lighter:* Mention one to the other in conversation.

**Day 27 · Show up for someone** · ⏱ up to 30 min
**Why:** Being there in a hard moment builds the deepest trust.
1. Think of someone going through a hard time
2. Offer something specific, like a meal or walk
3. Follow through on it

*Lighter:* Send a message saying you're thinking of them.

**Day 28 · Time with your people** · ⏱ up to 30 min
**Why:** Time with people who lift you up is one of the best things for wellbeing.
1. Spend time with someone who lifts you up
2. Keep phones away while you're together
3. Tell them you're glad you did this

*Lighter:* A call instead of meeting up.

#### Days 29–30

**Day 29 · Notice who's closer now** · ⏱ fixed 5 min
**Why:** Seeing how your connections grew shows the effort was worth it.
1. Think back to who you talked with at the start
2. Notice who you feel closer to now
3. Name one moment you're glad happened

**Day 30 · Choose who to stay close to** · ⏱ fixed 5 min
**Why:** A little intention keeps the people who matter close.
1. Pick three people you want to stay close to
2. Decide how often you'll reach out to each
3. Set a reminder for the first one

---

### MIND — a calmer, clearer head

#### Week 1

**Day 1 · Empty your head onto paper** · ⏱ up to 10 min
**Why:** Getting thoughts out of your head and onto paper can make them feel more manageable.
1. Grab paper or open your notes app
2. Write every worry and to-do for {m} minutes
3. Circle the one that most needs sorting

**Day 2 · Breathe out longer than in** · ⏱ up to 10 min
**Why:** Slower breathing with longer exhales helps many people feel calmer.
1. Sit comfortably and set a {m}-minute timer
2. Breathe in for 4, out for 6
3. Notice your shoulders drop

*Lighter:* Five slow breaths, wherever you are.

**Day 3 · Do one thing at a time** · ⏱ up to 20 min
**Why:** Juggling tasks is a big part of what makes a mind feel crowded.
1. Pick one task you need to do today
2. Close everything else for {m} minutes
3. Gently come back each time you drift

**Day 4 · A walk without headphones** · ⏱ up to 20 min
**Why:** Quiet time without input gives your mind room to settle.
1. Leave your headphones at home
2. Walk for {m} minutes
3. Notice three things you hear or see

*Lighter:* Sit by an open window without audio.

**Day 5 · Put tomorrow on paper** · ⏱ fixed 5 min
**Why:** Writing tomorrow's tasks before bed helps many people switch off.
1. Tonight, write tomorrow's top three tasks
2. Add any worry, with one next step
3. Close the notebook until morning

**Day 6 · Mute one noisy app** · ⏱ fixed 3 min
**Why:** Fewer interruptions means fewer things pulling at your attention.
1. Pick the app that interrupts you most
2. Turn its notifications off
3. Notice how the day feels with it quiet

*Lighter:* Mute it just for today.

**Day 7 · Notice what calmed you** · ⏱ fixed 3 min
**Why:** Knowing what calms you means you can reach for it on purpose.
1. Think back over the past week
2. Name the moment you felt calmest
3. Plan to do that again tomorrow

#### Week 2

**Day 8 · Sort one worry** · ⏱ fixed 5 min
**Why:** Asking whether a worry is in your hands helps you act on it or let it rest.
1. Pick one worry on your mind today
2. Ask: can I do anything about this?
3. If yes, take one small step. If not, let it rest

**Day 9 · Tidy one small space** · ⏱ up to 15 min
**Why:** A clearer space often helps a busy mind feel a little clearer too.
1. Pick a desk, drawer or bedside table
2. Clear and tidy it for {m} minutes
3. Notice how it feels to look at now

**Day 10 · Check messages twice** · ⏱ during your day
**Why:** Checking at set times stops messages breaking up your whole day.
1. Pick two times today to check messages
2. Keep the apps closed in between
3. Notice how many urges pass on their own

*Lighter:* Pick three or four times instead.

**Day 11 · Fact or story?** · ⏱ fixed 5 min
**Why:** Separating what you know from what you fear takes the sting out of a thought.
1. Notice a thought that's bothering you
2. Ask: what do I actually know for sure?
3. Say the facts-only version to yourself

**Day 12 · A screen-free hour** · ⏱ during your day
**Why:** Time away from screens gives your mind a real break.
1. Pick an hour today for no screens
2. Read, walk, cook or make something instead
3. Notice how your mind feels after

*Lighter:* 20 minutes.

**Day 13 · Finish three small things** · ⏱ up to 20 min
**Why:** Small unfinished jobs quietly take up space in your head.
1. Pick three tiny jobs you keep putting off
2. Do them one after another
3. Enjoy crossing them off

*Lighter:* Just one.

**Day 14 · What cleared your head** · ⏱ fixed 3 min
**Why:** Your own experience is the best guide to what helps you think clearly.
1. Think about the past week
2. Name what helped your head feel clearer
3. Do more of it tomorrow

#### Week 3

**Day 15 · Catch a spiral early** · ⏱ during your day
**Why:** Noticing racing thoughts early makes them much easier to slow down.
1. Notice when your thoughts start racing today
2. Name it: "I'm spiralling about…"
3. Take five slow breaths, then do one small thing

**Day 16 · Relax from toes to head** · ⏱ up to 15 min
**Why:** Relaxing your body one part at a time helps quiet a busy mind before sleep.
1. Lie down in bed with the lights off
2. Notice your feet, legs, belly, shoulders, face
3. Soften each part as you go, for {m} minutes

**Day 17 · Do something with your hands** · ⏱ up to 30 min
**Why:** Absorbing, hands-on activities give your mind a rest from overthinking.
1. Cook, draw, garden, build or fix something
2. Give it your full attention for {m} minutes
3. Notice when your mind goes quiet

**Day 18 · Be kind to yourself once** · ⏱ fixed 2 min
**Why:** Talking to yourself kindly lowers stress more than self-criticism does.
1. Notice one harsh thought about yourself
2. Ask what you'd say to a friend instead
3. Say that to yourself

**Day 19 · Decide and move on** · ⏱ fixed 5 min
**Why:** Making a small decision frees up the energy spent going back and forth.
1. Pick a small decision you keep revisiting
2. Give yourself five minutes to decide
3. Decide, and let yourself move on

**Day 20 · Time in nature** · ⏱ up to 30 min
**Why:** Time around trees, water or green space helps many people feel calmer.
1. Find a park, trees, water or a garden
2. Spend {m} minutes there
3. Leave your phone in your pocket

*Lighter:* Look after a plant, or sit by a window with a view.

**Day 21 · What's still on your mind** · ⏱ fixed 3 min
**Why:** Naming what's still weighing on you is the first step to easing it.
1. Think about the past week
2. Name one thing still on your mind
3. Pick one small step or person to talk to

#### Week 4

**Day 22 · A slow first ten minutes** · ⏱ fixed 10 min
**Why:** A calm start makes the rest of the day feel less rushed.
1. Keep your phone away for 10 minutes after waking
2. Have water, stretch or look outside
3. Then choose today's one priority

*Lighter:* Three minutes before the phone.

**Day 23 · Talk it through** · ⏱ up to 30 min
**Why:** Saying a worry out loud often makes it feel smaller.
1. Pick someone you trust
2. Share something that's on your mind
3. Ask them to just listen

*Lighter:* Write it as a message, or in your journal.

**Day 24 · Let it be good enough** · ⏱ during your day
**Why:** Aiming for perfect keeps your mind running long after a task is done.
1. Pick a task you'd usually over-polish
2. Finish it at "good enough"
3. Notice that nothing bad happens

**Day 25 · Focus on what matters** · ⏱ up to 30 min
**Why:** Giving your full attention to one important thing is calming in itself.
1. Pick the task that matters most today
2. Phone in another room for {m} minutes
3. Notice what you got done

**Day 26 · Three good things** · ⏱ fixed 5 min
**Why:** Noticing what went well, and why, helps balance a mind that scans for problems.
1. Tonight, write three good things from today
2. Add why each one happened
3. Read them back before sleep

**Day 27 · Your calm list** · ⏱ fixed 5 min
**Why:** Having your calming tools written down makes them easier to reach for when stressed.
1. Pick three things that calmed you this month
2. Save them in your notes or journal
3. Use one next time you feel tense

**Day 28 · Calm in a real moment** · ⏱ during your day
**Why:** Using a calming tool in a real moment is how it becomes second nature.
1. Notice the next tense moment today
2. Use one of your calm tools
3. Notice whether it helped

#### Days 29–30

**Day 29 · Notice what's quieter** · ⏱ fixed 5 min
**Why:** Seeing how far you've come makes the calm easier to protect.
1. Think back to how your mind felt at the start
2. Name two things that feel quieter now
3. Notice which ones now come naturally

**Day 30 · Keep what calms you** · ⏱ fixed 5 min
**Why:** Choosing what to keep makes a calmer mind part of your everyday life.
1. Pick the three practices that helped most
2. Decide when each one fits in your day
3. Save them in your journal or tell someone

---

### HABITS — everyday routines that make life run smoother

Habits no longer asks the user to invent one habit. It builds the small daily routines that help almost anyone: a tidy space, prepared mornings, a set bedtime and a weekly reset.

#### Week 1

**Day 1 · Make your bed** · ⏱ fixed 2 min
**Why:** A small finished task first thing can make the rest of the day feel more doable.
1. Straighten the sheets and the duvet
2. Plump up the pillows
3. Take a second to enjoy it

*Lighter:* Just pull the covers up.

**Day 2 · A quick tidy** · ⏱ up to 15 min
**Why:** A short, timed tidy keeps mess from piling up into a big job.
1. Set a timer for {m} minutes
2. Put things back where they belong
3. Stop when the timer ends

**Day 3 · Lay out tomorrow** · ⏱ fixed 5 min
**Why:** Getting ready the night before makes mornings calmer.
1. Pick tomorrow's clothes tonight
2. Put keys, bag and essentials together
3. Leave them by the door

**Day 4 · Clear the sink** · ⏱ up to 15 min
**Why:** A clean kitchen at night makes the next morning smoother.
1. Wash or load every dish
2. Wipe down the counter
3. Enjoy waking up to a clear kitchen

*Lighter:* Wash just the dishes you used today.

**Day 5 · A set time for bed** · ⏱ fixed 2 min
**Why:** A regular bedtime is the base of most good routines.
1. Choose a bedtime you can keep this week
2. Set a reminder 30 minutes before it
3. Start winding down when it goes off

**Day 6 · Do the two-minute jobs** · ⏱ up to 15 min
**Why:** Lots of tiny jobs feel heavy until you knock them out in one go.
1. Spot jobs that take under two minutes
2. Do as many as fit in {m} minutes
3. Bin, reply, hang up, put away. Done

**Day 7 · What made days easier** · ⏱ fixed 3 min
**Why:** Noticing which routines helped tells you which ones to keep.
1. Think back over the past week
2. Name the routine that made days easier
3. Do it again tomorrow

#### Week 2

**Day 8 · Look at the week ahead** · ⏱ fixed 10 min
**Why:** A quick look ahead means fewer surprises and less last-minute stress.
1. Open your calendar for the coming week
2. Spot the busy days and the free ones
3. Prepare one thing for the busiest day

**Day 9 · Prep one meal ahead** · ⏱ up to 30 min
**Why:** A meal ready to go makes busy days easier and healthier.
1. Pick something easy: oats, a salad, a batch
2. Make it for tomorrow
3. Store it ready to grab

*Lighter:* Chop or prep one ingredient.

**Day 10 · Tidy your phone screen** · ⏱ fixed 10 min
**Why:** A calmer home screen means fewer apps opened on autopilot.
1. Move distracting apps off your first screen
2. Put useful ones there instead
3. Notice how often you open it out of habit

**Day 11 · Clear your inbox a bit** · ⏱ up to 20 min
**Why:** A lighter inbox stops small tasks nagging at you.
1. Open your email or messages
2. Delete, archive or reply for {m} minutes
3. Stop at the timer, not when it's perfect

**Day 12 · Water and light first** · ⏱ fixed 5 min
**Why:** Starting with water and daylight beats starting with your phone.
1. Drink a glass of water when you get up
2. Open the curtains or step outside
3. Then check your phone

**Day 13 · Reset your main room** · ⏱ fixed 5 min
**Why:** A five-minute reset each day keeps a room from ever getting out of hand.
1. Pick the room you use the most
2. Straighten cushions, clear surfaces, tidy floor
3. Do the same thing at the same time tomorrow

**Day 14 · Which routine helped most** · ⏱ fixed 3 min
**Why:** The routine that helped most is the one worth protecting.
1. Think back over this week
2. Name the routine that helped the most
3. Pick a regular time for it

#### Week 3

**Day 15 · Sort one pile** · ⏱ up to 20 min
**Why:** Piles take up space in your home and in your head.
1. Pick a pile: mail, clothes or papers
2. Sort it into keep, bin, deal with later
3. Deal with the bin pile today

**Day 16 · A list for the week's food** · ⏱ fixed 10 min
**Why:** Planning a few meals ahead saves time, money and decisions.
1. Check what you already have at home
2. Plan three or four easy meals around it
3. Write a shopping list for the rest

**Day 17 · The busy-day version** · ⏱ fixed 2 min
**Why:** Doing a tiny version on busy days keeps routines alive.
1. On a busy day, pick your smallest routine
2. Make the bed, or wash one dish
3. Count it. Small still counts

**Day 18 · Plan a weekly reset** · ⏱ fixed 5 min
**Why:** One set time a week for chores stops them spilling into every day.
1. Pick a time each week for a home reset
2. Add it to your calendar, repeating
3. Choose what it covers: laundry, tidy, plan

**Day 19 · Clean a forgotten spot** · ⏱ up to 20 min
**Why:** The spots you always skip are often the ones that bother you most.
1. Pick a spot you skip: fridge, car or a drawer
2. Clean it for {m} minutes
3. Notice how good it looks

**Day 20 · Do a weekly reset** · ⏱ up to 30 min
**Why:** A short weekly reset makes the whole week feel more under control.
1. Put a load of laundry on
2. Clear surfaces and plan the week ahead
3. Stop when {m} minutes are up

*Lighter:* Do just one of the three.

**Day 21 · Routines that stuck** · ⏱ fixed 3 min
**Why:** The routines you kept without trying are the ones that fit your life.
1. Think about the past week
2. Name the routines you did without thinking
3. Notice what made them easy

#### Week 4

**Day 22 · Your morning order** · ⏱ fixed 10 min
**Why:** Doing a few things in the same order each morning means less to think about.
1. Pick three morning routines that work for you
2. Do them in the same order tomorrow
3. Notice how little you have to think

**Day 23 · Your evening order** · ⏱ fixed 15 min
**Why:** A set evening routine leads naturally into rest.
1. Pick three: dishes, prep, wind-down
2. Do them in the same order tonight
3. Lights out at your bedtime

**Day 24 · Fix something you've put off** · ⏱ up to 30 min
**Why:** Finishing a long-avoided job is a relief out of all proportion to its size.
1. Pick a small repair or chore you keep avoiding
2. Spend {m} minutes on it
3. Finish it, or book the next step

**Day 25 · Fill one bag to give away** · ⏱ up to 20 min
**Why:** Less stuff means less to tidy, clean and think about.
1. Pick a cupboard, drawer or wardrobe
2. Fill one bag to donate or bin
3. Get it out of the house this week

*Lighter:* Five things instead of a bag.

**Day 26 · A chore for someone else** · ⏱ up to 15 min
**Why:** Small acts of help make a shared home feel lighter for everyone.
1. Pick a chore you don't usually do
2. Do it without being asked
3. Notice how it lands

*Lighter:* Living alone? Do a chore that helps future you.

**Day 27 · A full routine day** · ⏱ during your day
**Why:** Seeing your routines work together shows how much easier they make a day.
1. Follow your morning order
2. Do one quick tidy during the day
3. Follow your evening order tonight

**Day 28 · Routines that travel** · ⏱ fixed 5 min
**Why:** Knowing your essentials means a change of plans doesn't undo everything.
1. Think of a day away from home or a busy week
2. Pick the two routines you'd keep anywhere
3. Plan what they need

#### Days 29–30

**Day 29 · Look around your space** · ⏱ fixed 5 min
**Why:** Your home shows the difference small routines make.
1. Look around your home
2. Notice what's calmer or easier than before
3. Name the routine that made it happen

**Day 30 · Choose your daily few** · ⏱ fixed 5 min
**Why:** A short list of routines you keep beats a long list you don't.
1. Pick the three routines you want to keep
2. Decide when each one happens
3. Save them in your journal or tell someone

---

### CONFIDENCE — trust yourself and take up a little more space

#### Week 1

**Day 1 · Three things you did well** · ⏱ fixed 5 min
**Why:** Noticing what you already do well is a fairer starting point than focusing on gaps.
1. Think back over the last week
2. Write three things you handled well
3. Include small ones. They count

**Day 2 · Keep one small promise** · ⏱ during your day
**Why:** Every promise you keep to yourself builds trust in yourself.
1. Promise yourself one small thing for today
2. Make it something you can do by tonight
3. Do it, and notice that you did

**Day 3 · Stand tall, speak slow** · ⏱ fixed 2 min
**Why:** A steadier posture and pace can help you feel more settled.
1. Before a conversation or task, stand tall
2. Shoulders back, one slow breath
3. Speak a little slower than usual

**Day 4 · Wear what feels like you** · ⏱ during your day
**Why:** Feeling like yourself on the outside often helps you act like yourself.
1. Pick an outfit you feel good in
2. Wear it today, even if nothing is planned
3. Notice how you carry yourself

**Day 5 · Finish one avoided task** · ⏱ up to 20 min
**Why:** Finishing something you've been avoiding is quick proof you can follow through.
1. Pick a small task you've been dodging
2. Work on it for {m} minutes
3. Finish it if you can

**Day 6 · Share one opinion** · ⏱ during a conversation
**Why:** Your voice gets steadier every time you use it.
1. In a chat, meeting or class, share a view
2. Keep it to one or two sentences
3. Let it stand. No need to apologise

*Lighter:* Share it in a group chat or comment.

**Day 7 · Your brave moments** · ⏱ fixed 3 min
**Why:** Noticing small brave moments helps you believe in bigger ones.
1. Think back over the past week
2. Name one moment you were braver than usual
3. Notice what helped you do it

#### Week 2

**Day 8 · Answer your inner critic** · ⏱ fixed 3 min
**Why:** A harsh inner voice loses power when you answer it fairly.
1. Notice one harsh thought about yourself
2. Ask: would I say this to a friend?
3. Replace it with something fair and true

**Day 9 · Practise a skill you love** · ⏱ up to 30 min
**Why:** Getting better at something real builds confidence that lasts.
1. Pick a skill: cooking, drawing, a language
2. Practise it for {m} minutes
3. Notice one small improvement

**Day 10 · Ask for something small** · ⏱ fixed 3 min
**Why:** Asking clearly, without apologising, builds self-respect.
1. Ask for help, advice or a small favour
2. Ask clearly, without saying sorry first
3. Notice that asking was okay

**Day 11 · Take a compliment** · ⏱ during your day
**Why:** Letting kind words land helps you see what others see in you.
1. When someone says something kind, pause
2. Just say "thank you"
3. Let it land. No brushing it off

*Lighter:* No compliments today? Give yourself one, out loud.

**Day 12 · Start before you feel ready** · ⏱ up to 15 min
**Why:** Confidence often comes after you act, not before.
1. Pick something you're waiting to feel ready for
2. Spend {m} minutes starting it anyway
3. Notice how it feels to have begun

**Day 13 · Make the call you've avoided** · ⏱ fixed 10 min
**Why:** Ticking off a dreaded call frees up a surprising amount of headspace.
1. Pick a call you've put off: doctor, bank, booking
2. Jot down what you need to say
3. Make the call

*Lighter:* Book or message online instead.

**Day 14 · What felt easier** · ⏱ fixed 3 min
**Why:** Noticing what's getting easier shows your confidence is growing.
1. Think about the past two weeks
2. Name one thing that feels easier now
3. Do a slightly bigger version tomorrow

#### Week 3

**Day 15 · Hold your ground kindly** · ⏱ during a conversation
**Why:** Sharing your preference calmly shows you that your needs count too.
1. Notice when you'd usually just go along
2. Share your preference calmly
3. You don't need to win, just be heard

**Day 16 · Go somewhere on your own** · ⏱ up to 30 min
**Why:** Being comfortable on your own is a quiet kind of confidence.
1. Go to a café, park, gallery or class alone
2. Stay for {m} minutes
3. Notice that you're fine on your own

*Lighter:* A short walk somewhere new.

**Day 17 · Share something you made** · ⏱ fixed 5 min
**Why:** Letting your work be seen gets easier every time.
1. Pick something you made or did
2. Show it to one person
3. Notice their reaction

**Day 18 · Try something new** · ⏱ up to 30 min
**Why:** New experiences remind you that you can handle the unfamiliar.
1. Pick something you've never tried
2. A recipe, a route, a class or a hobby
3. Give it {m} minutes and see how it goes

**Day 19 · Speak first** · ⏱ during your day
**Why:** Going first gets easier with practice, and nerves fade fast.
1. In a group or meeting, speak early
2. Say hello, or share the first idea
3. Notice how quickly the nerves pass

*Lighter:* Be first to reply in a group chat.

**Day 20 · Back to your skill** · ⏱ up to 30 min
**Why:** Coming back to a skill is how real progress happens.
1. Pick a skill you'd like to be better at
2. Practise it for {m} minutes
3. Notice what feels easier than before

**Day 21 · What felt braver** · ⏱ fixed 3 min
**Why:** Seeing how far you've stretched makes the next stretch feel possible.
1. Think about the past week
2. Name the bravest thing you did
3. Notice that you got through it

#### Week 4

**Day 22 · Take the lead once** · ⏱ during your day
**Why:** Leading small things helps you trust your own judgement.
1. Offer to plan, decide or organise something
2. Make the call without asking everyone
3. Notice that people follow

**Day 23 · Ask for honest feedback** · ⏱ fixed 5 min
**Why:** Feedback you asked for is easier to hear and more useful.
1. Pick someone you trust
2. Ask: "What's one thing I do well?"
3. Then: "What's one thing I could try?"

**Day 24 · Lift someone else up** · ⏱ fixed 3 min
**Why:** Encouraging others reminds you of your own worth too.
1. Notice someone working hard
2. Tell them exactly what you see
3. Notice how it feels to lift someone up

**Day 25 · Do the slightly scary thing** · ⏱ up to 30 min
**Why:** Growth lives just outside what feels comfortable.
1. Pick something a little outside your comfort zone
2. Do the first step today
3. Notice that you got through it

*Lighter:* Plan exactly when you'll do it.

**Day 26 · Look after yourself on purpose** · ⏱ up to 30 min
**Why:** Treating yourself with care tells you that you matter.
1. Do one thing that helps you feel good
2. A walk, a good meal, a long shower, an early night
3. Treat it as respect, not a reward

**Day 27 · A letter to future you** · ⏱ fixed 10 min
**Why:** Picturing who you're becoming makes it easier to act like them.
1. Write a few lines to you, one year from now
2. Describe who you're becoming
3. Save it somewhere you'll find it

**Day 28 · Say yes to something** · ⏱ fixed 5 min
**Why:** Saying yes to things you'd usually skip widens what feels possible.
1. Look for an invite or chance you'd usually skip
2. Say yes to it
3. Plan your first step

*Lighter:* Say "maybe" and find out more.

#### Days 29–30

**Day 29 · Notice how you've grown** · ⏱ fixed 5 min
**Why:** Seeing your own growth is the strongest evidence you can trust yourself.
1. Think back to how you felt at the start
2. Name two things you do now that felt hard
3. Notice how you handled them

**Day 30 · Keep what made you braver** · ⏱ fixed 5 min
**Why:** Choosing what to keep helps confidence keep growing.
1. Pick the three things that helped you most
2. Decide where each fits in your weeks
3. Save them in your journal or tell someone

---

### DIRECTION — make progress on what matters to you

#### Week 1

**Day 1 · What matters to you** · ⏱ fixed 10 min
**Why:** Direction starts with knowing what you actually care about.
1. Write the five things that matter most to you
2. Circle the two that get the least time
3. Give one of them a little time this week

**Day 2 · Picture a good year** · ⏱ up to 15 min
**Why:** A clear picture of where you want to be helps you choose what to do next.
1. Imagine your life a year from now, going well
2. Write where you are, what you do, who's around
3. Underline the part that excites you most

**Day 3 · Choose one thing to work on** · ⏱ fixed 10 min
**Why:** One clear goal is easier to move forward than five vague ones.
1. Pick one goal for the next 30 days
2. Make it something you can see progress on
3. Write why it matters to you

**Day 4 · Take the first step** · ⏱ up to 30 min
**Why:** The first step is the hardest, and it makes everything else feel real.
1. Pick the smallest first step toward your goal
2. Spend {m} minutes on it
3. Note what the next step is

**Day 5 · Find time in your week** · ⏱ fixed 10 min
**Why:** Goals with a time in the calendar actually get done.
1. Look at your week in your calendar
2. Book three short slots for your goal
3. Treat them like appointments

*Lighter:* Book one slot.

**Day 6 · Learn from someone ahead** · ⏱ up to 20 min
**Why:** Learning from someone who's done it saves a lot of guessing.
1. Find an article, video or person on your goal
2. Spend {m} minutes learning
3. Pick one idea to try

**Day 7 · What moved this week** · ⏱ fixed 3 min
**Why:** Noticing progress, however small, keeps you going.
1. Think about your goal this week
2. Name one thing that moved forward
3. Pick your next step

#### Week 2

**Day 8 · Work on it, phone away** · ⏱ up to 30 min
**Why:** Focused time, even short, moves goals further than scattered effort.
1. Put your phone in another room
2. Work on your goal for {m} minutes
3. Note where you got to

**Day 9 · Swap a scroll for a step** · ⏱ during your day
**Why:** Small pockets of time add up to real progress.
1. Notice the next time you reach to scroll
2. Use that time for your goal instead
3. Even five minutes counts

**Day 10 · Ask one question** · ⏱ fixed 5 min
**Why:** One good question to the right person can save weeks.
1. Think of someone who knows about your goal
2. Ask them one specific question
3. Thank them, and note their answer

*Lighter:* Ask in an online community instead.

**Day 11 · Clear one obstacle** · ⏱ up to 20 min
**Why:** Removing one obstacle can unlock a lot of progress.
1. Name what's slowing you down
2. Find one way around it
3. Spend {m} minutes on that fix

**Day 12 · The part you've avoided** · ⏱ up to 30 min
**Why:** The part you avoid is often smaller than it looks once you start.
1. Pick the part of your goal you keep avoiding
2. Do just {m} minutes of it
3. Notice it was smaller than it looked

**Day 13 · Tell someone your plan** · ⏱ fixed 5 min
**Why:** Saying your goal out loud makes you more likely to follow through.
1. Tell one person your goal and your timeline
2. Ask them to check in with you
3. Notice how it feels to say it out loud

*Lighter:* Write it in your journal instead.

**Day 14 · Halfway look** · ⏱ fixed 5 min
**Why:** A quick check halfway keeps your goal realistic.
1. Look at how far your goal has come
2. Make it smaller or bigger if needed
3. Book your next three sessions

#### Week 3

**Day 15 · Make something you can see** · ⏱ up to 30 min
**Why:** Something you can see or hold makes progress feel real.
1. Make a draft, list, sketch or sample
2. Work on it for {m} minutes
3. Save it so you can look back on it

**Day 16 · Say no to make room** · ⏱ fixed 5 min
**Why:** Making room for your goal matters as much as working on it.
1. Spot one thing competing with your goal
2. Skip it, shorten it or move it
3. Use the time you freed up

**Day 17 · Work somewhere new** · ⏱ up to 30 min
**Why:** A change of scene can make focus easier.
1. Take your goal to a café, library or park
2. Work there for {m} minutes
3. Notice whether a new place helps

*Lighter:* A different room at home.

**Day 18 · Plan your busy-day step** · ⏱ fixed 5 min
**Why:** A tiny step ready for busy days keeps momentum going.
1. Decide the smallest step for a busy day
2. Keep it under five minutes
3. Use it whenever a full session won't fit

**Day 19 · Your biggest step yet** · ⏱ up to 30 min
**Why:** Taking on a bigger step shows you how far you've come.
1. Pick the biggest step left
2. Give it {m} focused minutes
3. Note how far you got

**Day 20 · Check your balance** · ⏱ fixed 5 min
**Why:** Progress lasts longer when the rest of life isn't neglected.
1. Think about work, health, people, money, fun
2. Notice which one needs a little care
3. Do one small thing for it today

**Day 21 · What's working** · ⏱ fixed 3 min
**Why:** Knowing what works for you lets you do more of it on purpose.
1. Think about your goal this week
2. Name what helped you make progress
3. Plan more of it next week

#### Week 4

**Day 22 · Show your progress** · ⏱ fixed 10 min
**Why:** Sharing your work brings feedback and encouragement.
1. Show someone what you've done so far
2. Ask what they find most interesting
3. Use one bit of their feedback

**Day 23 · A longer focus block** · ⏱ up to 30 min
**Why:** A longer block lets you get into the hard, important parts.
1. Book {m} minutes in your calendar
2. Work on the most important part
3. Notice how much you got done

**Day 24 · Remember your why** · ⏱ fixed 5 min
**Why:** Reconnecting with why it matters refuels your motivation.
1. Remember why this goal matters to you
2. Picture how finishing it would feel
3. Take one small step while you feel it

**Day 25 · Finish one piece** · ⏱ up to 30 min
**Why:** Finishing one complete piece is more motivating than starting many.
1. Pick one part you can complete
2. Work on it for {m} minutes
3. Finish it, even if it's not perfect

**Day 26 · Something for future you** · ⏱ fixed 10 min
**Why:** Small steps for future you add up to a different life.
1. Pick something that helps you a year from now
2. Save, learn, apply, sign up or book
3. Do the first part today

**Day 27 · Celebrate your progress** · ⏱ fixed 10 min
**Why:** Celebrating effort makes you want to keep going.
1. List what you've done toward your goal
2. Celebrate in a small, real way
3. Tell someone what you're proud of

**Day 28 · Pick your next goal** · ⏱ fixed 10 min
**Why:** Knowing what's next keeps your direction going.
1. Decide what comes after this goal
2. Make it something you can see progress on
3. Book the first step in your calendar

#### Days 29–30

**Day 29 · See how far you've come** · ⏱ fixed 5 min
**Why:** Looking back honestly helps you set better goals next time.
1. Think back to where your goal was on day 1
2. Name what you got done
3. Name what you'd do differently

**Day 30 · Keep your momentum** · ⏱ fixed 5 min
**Why:** Choosing what to keep turns one goal into a direction.
1. Pick the habits that helped you progress
2. Decide when each fits in your week
3. Save them in your journal or tell someone

---

## 4. Rationale summary

- **Each day stands alone.** It can be skipped, missed or done out of order and still make sense. No day says "your list from day 1".
- **Progression is real.** Walks get longer and further away, conversations go deeper, routines join up into a day, and goals move from picking to finishing.
- **Look-backs are short and lived-in.** Days 7, 14 and 21 ask what helped and then do it again tomorrow. There are no ratings to remember.
- **Writing is light.** About 15 days involve writing, and each says where ("paper or your notes app", "your journal").

---

## 5. Time-commitment adaptation

**Data change (small):** each task gets a `time` field.

```ts
type TaskTime =
  | { kind: 'fixed'; minutes: number }   // takes about this long, whatever the commitment
  | { kind: 'scales'; max: number }      // {m} = min(user's ramped minutes, max)
  | { kind: 'during' };                  // done inside something you already do
```

- **`scales`:** the user's existing ramp still applies (5-min users: 3, 4, 5…; 20-min users: 10, 12, 15, 20…). It is then **capped** at the task's `max`, so a 30+ user isn't told to walk 30 minutes if the cap is 20.
- A `scales` task doesn't have to put `{m}` in a step. Tasks like "Clear the sink" or "Show up for someone" show the scaled time in the pill only, because naming minutes in the steps would feel forced.
- **`fixed`:** shows its own time in the card's time pill, e.g. "2 min" for making the bed, regardless of commitment.
- **`during`:** shows a "during your day" pill instead of minutes.

What each commitment gets from a `scales` task:

| Cap | 5-min user | 10-min user | 20-min user | 30+ user |
|---|---|---|---|---|
| up to 10 | 3–5 | 5–10 | 10 | 10 |
| up to 15 | 3–5 | 5–10 | 10–15 | 15 |
| up to 20 | 3–5 | 5–10 | 10–20 | 15–20 |
| up to 30 | 3–5 | 5–10 | 10–20 | 15–30 |

**Effect on the season:** a higher commitment means more scaling days reach their cap, so longer walks, bigger tidies and longer focus blocks. Short tasks stay short for everyone. The Quiet Drain / All-In Heart caps (10 min in weeks 1–2, 20 after) still apply on top.

---

## 6. Reset-type personalization

**Data change (small):** each task may have one `lighter` line (written above where useful, about 120 of 180 days). Each reset type gets a `lean`:

| Reset type | Lean | What changes |
|---|---|---|
| Quiet Drain | lighter | Shows the lighter version as a gentle option under the steps. Caps stay. |
| All-In Heart | lighter | Same, framed as "this counts as enough". Stops overdoing. |
| Soft Restarter | lighter | Lighter version offered in week 1 only, then standard. |
| Almost Starter | start | Standard steps. On `scales` days the first step's minutes are halved in week 1 ("just start"). |
| Fading Flame | start | Same as Almost Starter. |
| Quiet Stranger | lighter on social days | Relationships and Confidence social days default to the lighter version (message, not call). |
| Overloaded Dreamer | standard | Standard. The tone line already says "Then stop." |
| Soft Scatter | standard | Standard. |
| Drifting Compass | standard | Standard. |

**How it shows in the existing UI:** one optional line under the steps, e.g. *"Low on energy? Sit by your brightest window instead."* The three steps stay the same, so tick-tracking, streaks and rewards don't change. Ticking the steps still completes the day, and the lighter line is a permission, not a different task.

**What it doesn't do:** no separate libraries per reset type, no AI, no new onboarding questions. One extra line per day at most, plus a nine-row lookup table.

---

## 7. Suggested treatment of Level 2

Same principles, harder and broader activities. No callbacks to Level 1. Proposed themes (to be written after Level 1 is approved):

- **Energy L2:** a regular sleep window, two short strength sessions a week, a weekly longer walk or ride, cooking more meals from scratch, a recovery day.
- **Relationships L2:** deeper conversations (hopes, worries), a hard conversation handled well, joining a group or class, hosting something small, a repair with someone you drifted from.
- **Mind L2:** a longer daily quiet practice, a weekly digital day off, facing an avoided worry with a plan, journaling prompts, a calm plan for stressful weeks.
- **Habits L2:** a full weekly reset, a decluttered room, a set weekly food plan, admin day (bills, forms), a "home that runs itself" system.
- **Confidence L2:** a stretch goal with weekly steps, speaking up in a group setting, feedback from several people, setting a boundary, sharing your work more publicly.
- **Direction L2:** a 90-day goal with monthly milestones, learning a skill properly, talking to people in the field, a weekly review habit, finishing and showing a real piece of work.

Remove the current Level 2 days that rely on stored data ("compare with day 4", "repeat the day 4 session") and the repeated "Goal work session" days.

---

## 8. Existing tasks worth keeping (reworded above)

- **Energy:** morning daylight, water, easy walk, wind-down alarm, phone off the bed, protein breakfast, fixed wake time, caffeine cutoff, strength snack, screen cutoff, sleep-ready room, prep tomorrow.
- **Relationships:** specific message, listen fully, specific thank-you, plan a catch-up, call instead of text, deeper question, reconnect, celebrate a win, appreciation note, kind limit, start a ritual, introduce two people.
- **Mind:** brain dump, long-exhale breathing, single-tasking, walk with no audio, bedtime unload, mute an app, fact or story, batching messages, body scan, quiet morning, talk to yourself like a friend, three good things.
- **Confidence:** keep one promise, stand tall, catch the inner critic, practise a skill, speak up once, ask for something, kind no, share something you made, take the lead, letter to future you.
- **Direction:** what matters, picture a good year, pick one goal, first step, book time, learn one thing, ask someone ahead, do the avoided step, share your goal, say no for your goal, celebrate progress.

## 9. Existing tasks being replaced

- **All of Habits Level 1.** The technique days go: choose a habit, 2-minute version, tie to a cue, tracker, pair with a treat, if-then obstacles, bad-day version, never miss twice, identity line, add-on, no reminders. They are replaced by real routines.
- **Every day that depends on stored information:**
  - "Wait for your cue from day 3"
  - "Open your list from day 1"
  - "Climb rung 1–7" / "Build your courage ladder"
  - "Compare with day 2/4/9/11"
  - "Beat your drift count"
  - "Repeat the day 4 session"
- **Ratings:** "Rate your noise / energy / confidence 1–10".
- **Identical templates across areas:** "Week 1/2/3 check-in", "Measure your month", "Carry it forward". Each area now has its own lived-in look-back.
- **Repeated filler:** "Goal work session" (×4 in Direction L1). Each is now a different kind of session: phone-away, avoided part, new place, longer block, finish one piece.

---

## 10. Content QA checklist (run on every task)

- [ ] Title ≤ 34 characters, a clear action ("Clear the sink", not "Reset your environment")
- [ ] Why is one sentence, no guarantee words (cures, fixes, will make you)
- [ ] Exactly three steps, each ≤ 60 characters
- [ ] Step 3 closes the task (noticing, finishing or saving)
- [ ] Makes sense if the previous days were skipped
- [ ] No jargon: cue, friction, loop, if-then, baseline, dopamine
- [ ] Time rule set (`fixed` / `scales` with a cap / `during`); `{m}` only appears in `scales` tasks
- [ ] Realistic at 5 minutes and at 30+ minutes
- [ ] Doable at most times of day, or says "tonight" / "when you wake"
- [ ] Social or physical days have a lighter version, and nothing forces contact with a specific person
- [ ] Nothing unsafe: no fasting, cold exposure, extreme exercise or confronting someone unsafe
- [ ] No guilt language: no "don't break", "you should", "no excuses"
- [ ] Not a near-duplicate of another day in the same area
- [ ] Reads well aloud in the mascot's warm voice
