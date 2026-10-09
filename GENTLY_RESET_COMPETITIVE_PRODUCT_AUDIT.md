# Gently Reset — Competitive Product and UX Audit

**Date:** 2026-10-07
**Type:** research and strategy only. No code, assets, database or config changed.
**Companion document:** `GENTLY_RESET_FULL_AUDIT.md`. The App Store and technical blockers stay there; they're summarized once in §9 and are kept separate from this audit's product recommendations.

---

## 0. Executive Summary

**The verdict in one paragraph.** Gently Reset has the hardest thing to fake: a warm, distinctive character and a genuinely personalized 30-day plan built from a real classification. What it doesn't have yet is a **daily ritual**.

Today the product is five well-crafted rooms that don't talk to each other:
- **Home** shows the mascot.
- **Journey** is where the day is actually completed.
- **Journal** is a separate tab with its own prompt.
- **World** shows friends.
- **You** shows your type.

The "work" of a day is three generic self-report ticks: "Read today's reset", "Do it", "Check in". They're identical on all 30 days (`journeyCopy.ts:20-24`). The celebration is the same on day 3 as on day 21. Nothing changes after day 30. The mascot says charming lines, but it doesn't **remember** anything about the user, even though onboarding promises it will: "I'll hold onto this for the days you forget" (`onboardingSteps.ts:311`).

The competitors that win this category (Finch, Duolingo, Fabulous) each have one unmistakable daily action, and visible change that accumulates. Gently Reset has the ingredients for both, but they're scattered.

**Recommendation:** stop polishing screens. Build one cohesive loop. The rule is: **one daily moment, owned by the mascot, that ends in your own words, and that the mascot gives back to you at the milestones.**

Concretely:
1. Make Home the single daily ritual: read, do, then a check-in that *is* the journal entry.
2. Give the mascot memory of your reason, your words and your returns.
3. Turn days 7, 14, 21 and 30 into ceremonies built from the user's own reflections.
4. Replace streak anxiety with a "showed up" model and a warm return after a missed day.
5. Make a clear, honest decision about what happens after day 30.

None of this requires replacing the frozen deterministic roadmap. It *uses* data the roadmap already produces: `reflectionPrompt`, `objective`, `phase` and `category` on every resolved task (`src/domain/reset/roadmap/types.ts`).

**Is it worth a subscription today?** Not convincingly. A hard paywall, no trial and 30 days of content with no defined after-state means many buyers will choose monthly, finish, and cancel. That's sustainable only if the after-state is designed (see §6 and §8, item A5).

---

## 1. Research Sources and Evidence Quality

**Method**
- Live web research was available and used: App Store listings, competitor and company blogs, published teardowns and review aggregators.
- **I did not install or personally test any competitor app.** Competitor UX descriptions come from public listings, teardowns and reviews.
- Gently Reset was evaluated from the codebase and from the Expo web preview used during this session. **No iOS device testing was done.**

| Source | What it supports | Quality |
|---|---|---|
| [Finch App Store listing](https://apps.apple.com/us/app/finch-self-care-pet/id1528595748) | Features; 4.9★ from about 761k ratings; Editors' Choice; Finch Plus tiers | **Verified** (primary) |
| [Deconstructor of Fun — Finch widgets](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl) | Core loop (tasks → energy → adventures → growth); widget "appointment" mechanics. Their D1/D7 figures of 54%/37% are **labelled estimates** (Sensor Tower). | Secondary; metrics are estimates |
| [Pratt IxD — Finch design critique (2026)](https://ixd.prattsi.org/2026/02/design-critique-finch-self-care-pet-ios-app/) | Onboarding consistency; quests and settings clutter; a lack of progressive disclosure | Secondary, qualitative |
| [Medium — Finch UX teardown](https://medium.com/@deepthi.aipm/ux-teardown-finch-self-care-app-18122357fae7) and [Sparrow — Finch $30M ARR](https://blog.sparrowapps.io/p/finch-how-a-self-care-app-hit-30m-arr-without-vc-money) | Hatching-egg onboarding; growth stages. The revenue figure is **unverified third-party reporting**. | Secondary |
| [Trustpilot — Finch](https://www.trustpilot.com/review/finchcare.com) | Complaints: trial or upsell before users understand Plus; performance and crashes; long-streak loyalty | User reviews (anecdotal) |
| [Duolingo blog — streaks](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) | Learners with a 7-day streak are 3.6× more likely to complete their course; the streak animation gave +1.7% 7-day retention; raising the streak-freeze cap to 2 gave +0.38% daily active learners | **Verified** (primary, first-party) |
| [Just Another PM](https://www.justanotherpm.com/blog/the-psychology-behind-duolingos-streak-feature), [Trophy](https://trophy.so/blog/the-psychology-of-streaks-how-sylvi-weaponized-duolingos-best-feature-against-them), [Propel](https://www.trypropel.ai/resources/blogs/duolingo-customer-retention-strategy) | The "streak freeze reduced churn 21%" and "600+ streak experiments" claims | Secondary; **not verified against a primary source**. Not relied on here. |
| [Fabulous App Store listing](https://apps.apple.com/us/app/fabulous-daily-routine-planner/id1203637303) | Journeys, routines and coaching; 4.4★ from about 89k ratings; Editors' Choice; $16.99–$59.99 plans | **Verified** (primary) |
| [Trustpilot — Fabulous](https://www.trustpilot.com/review/thefabulous.co?page=9) and [HabitBox review](https://habitbox.app/blog/fabulous-app-review) | Main complaints are billing, cancellation and add-on subscription confusion, not the product | User reviews (anecdotal) |
| [Headspace App Store listing](https://apps.apple.com/us/app/headspace-meditation-sleep/id493145008) | 4.8★ from about 974k ratings; $12.99 a month or $69.99 a year; free trial; large content library | **Verified** (primary) |
| [Stoic App Store listing](https://apps.apple.com/us/app/stoic-journal-mental-health/id1312926037) | Morning and evening journaling, prompts, trends, streaks and badges; 4.8★ from about 36k ratings; $299 lifetime option | **Verified** (primary) |
| [Daylio App Store listing](https://apps.apple.com/us/app/daylio-journal-daily-diary/id1194023242) | Low-friction mood-and-activity logging; "Year in Pixels"; 4.8★ from about 62k ratings | **Verified** (primary) |
| [How We Feel App Store listing](https://apps.apple.com/us/app/how-we-feel/id1562706384) | Free nonprofit emotion check-in (Yale Center for Emotional Intelligence); 4.9★ from about 30k ratings | **Verified** (primary) |

**Additional apps included and why**
- **Daylio:** it proves that a ten-second, no-typing check-in can be a durable daily habit. That's relevant to Gently Reset's journal friction.
- **How We Feel:** it shows that emotion check-ins can feel premium and clinical-grade without gamification. It's also a free benchmark that a paid journal must clearly beat.

**Not claimed.** I don't cite any competitor's conversion rate, revenue or internal retention as fact, except Duolingo's own published experiment results.

---

## 2. What Gently Reset Is Today: the Full User Journey

**Legend**
- ✅ implemented
- ⚠️ partially implemented, or behaves differently from what was intended
- ❌ not implemented

The file references are evidence.

| # | Stage | What the user sees and does | What they feel and receive | Motivation to continue | Status |
|---|---|---|---|---|---|
| 1 | First launch | Welcome scene with the sunset and mascot, a "begin" CTA and a sign-in link (`WelcomeScreen.tsx`) | Warm, illustrated, premium first frame | Curiosity | ✅ |
| 2 | Onboarding | The mascot runs in and asks their name ("Nice to meet you, …"). Then 13 questions (9 single-choice, 4 multi), 4 story screens with animated mascot scenes, 1 free-text "I'm doing this because…" (`onboardingSteps.ts`). 25 steps in total. | Feeling seen; the mascot is present throughout; the progress bar | Investment builds because they're answering about *themselves* | ✅ It's long: about 20 decisions before value |
| 3 | Reset type discovery | Loading or "building" stages, then the reveal of one of nine types, then details (`ResultScreen`, `ResultDetailsScreen`, `deriveResetType.ts`) | An identity moment ("I'm a Soft Restarter") | The strongest emotional peak in the funnel | ✅ |
| 4 | Plan preview | `PlanPreviewList`, plus a share preview whose share button **does nothing** (`shareReset.ts:4`) | Anticipation, then a dead tap | — | ⚠️ |
| 5 | Hard paywall | "Gently Reset Pro", 4 benefits, yearly and monthly plans, "Unlock My Reset". No trial (by design). | A clear ask | Sunk cost of the onboarding | ⚠️ See the technical audit; it's currently bypassed |
| 6 | First experience after unlock | Lands on **Home**: the mascot, a day header, a speech bubble, the seasonal sky. The CTA routes to **Journey** to start the day (`getCompanionPresentation.ts:47-59`). | Pleasant, but there's no "welcome to day 1" ceremony that bridges the paywall to the first action | Moderate | ⚠️ |
| 7 | Home mascot interactions | Tap the mascot for a reaction clip plus a line: nudges, app facts, cute lines; "goodbye" only after the day is complete (`getHomeMascotReaction.ts:41,124`) | Delight, and the character feels alive | Playful, but the lines are **random rather than relational** | ✅ |
| 8 | Completing the first day | On Journey, open the day sheet and tick "Read today's reset", "Do it" and "Check in". Each tick is permanent; the third triggers blur, the jump video, confetti, "WOOOO DAY COMPLETED!" and the day number rolling (`JourneyDaySheet.tsx`, `JourneyDayCelebration.tsx`) | A real "I did it" hit. It's Duolingo-quality. | High on day 1 | ✅ But the "Check in" tick doesn't open or write the journal |
| 9 | Journey progression | Seasonal scene by the real date, a mascot on a path, weekly chapters ("start smaller", "make it easier", …), a stats screen | Sense of place | Moderate. The scene changes with the **calendar season**, not with *their* progress. | ✅ |
| 10 | Journal and reflection | A separate tab. Seasonal hero, a task-derived prompt (`getJournalPrompt` in `ReflectScreen.tsx:67`), starters, five mood faces, draft autosave, history | A calm, nice space | Optional, with no pull from the daily loop | ⚠️ One entry per *plan day*; repeats overwrite (technical audit P1-3) |
| 11 | World and friends | Username, friend requests, invite link, preset encouragements, limited friend progress | Light accountability | Needs friends who also paid | ✅ (requires Supabase) |
| 12 | You | Hero with type and day, "your reset", reset facts (including their *reason*), a progress link, username, help ("coming later"), sign out | Identity mirror | Low; mostly static | ⚠️ |
| 13 | The next day | `applyDateRollover` advances the plan day if yesterday was completed. Home shows the new day. | Continuity | There is **no reminder** (and none is allowed without approval; see AGENTS.md) and **no widget**. The return depends entirely on the user remembering. | ⚠️ |
| 14 | Missing a day | The plan day does **not** advance (gentle). The streak resets to 0. Home's state becomes `returned_after_miss` with the "welcome_back" reaction. | Not punished on the plan, which is good, but the streak count drops and the user's own **reason is never shown back** | Moderate | ⚠️ |
| 15 | Days 7, 14, 21 and 30 | `getCompanionState` marks `milestone` for 7, 14 and 21, and `cycle_complete` for 30 (`companionState.ts:26`). Home shows a "milestone" reaction. Journey plays the **same** celebration as every other day. The stats screen has 7-day and 30-day nodes. | Days 7 and 30 feel almost like day 6 | Weak | ⚠️ |
| 16 | After day 30 | `todayCompleted` stays true forever (`applyDateRollover.ts:36-50`). There's no next step, no summary and no new cycle. AGENTS.md forbids Cycle 2/3 without an explicit request. | Dead end | **None.** This is the subscription's weakest point. | ❌ |

**The one-line diagnosis.** The emotional peaks are in **onboarding** (identity reveal) and **day 1** (first celebration). After that the experience repeats the same shape for 29 days and then stops.

---

## 3. Why the Competitors Work

### Finch: care for something that changes because of you
- **First impression.** Onboarding begins by hatching *your* bird: you choose the egg color, name, pronouns and personality. The investment is in a *being*, before any feature. Source: teardowns.
- **Daily loop.** Tiny self-chosen goals give energy, which sends the bird on an adventure, which brings back a story and discoveries. The adventure is an *appointment* that brings you back. The home-screen widget keeps the pet visible without push notifications. Source: Deconstructor of Fun.
- **Growth.** The bird moves through stages (egg, hatchling, toddler, adult) and accumulates outfits and room decor. That's visible, permanent change.
- **Risks and complaints.**
  - A Plus upsell before users understand it.
  - Performance problems.
  - Clutter on the quests and settings pages (Pratt critique).
  - The currency and cosmetics economy is heavy to build and maintain.
- **Lesson for Gently Reset:** *the companion must visibly respond to, and accumulate, what you did.* Gently Reset doesn't need the economy.

### Duolingo: one obvious next action, and celebrations that escalate
- **One button:** "Start lesson".
- **Progress you can see:** the streak, the path and the units.
- **Celebrations** escalate at meaningful thresholds.
- **Forgiveness is measured to help.** Duolingo's own blog reports that increasing streak-freeze capacity raised daily active learners by +0.38%, and that a new streak animation lifted 7-day retention by +1.7%.
- **Lesson for Gently Reset:** *one primary action per day; make milestones visibly different; build forgiveness in deliberately.* Avoid leagues, gems and guilt notifications. They clash with a "gentle" brand.

### Fabulous: a guided journey with narrative and coaching
- Structured multi-week "journeys" told as a story, with letters and coaching between habits.
- Highly rated as a product (4.4★, about 89k ratings, Editors' Choice), but public reviews concentrate on **billing confusion and add-on subscriptions**.
- **Lesson for Gently Reset:** *narrative between days (a letter, a chapter close) makes a plan feel like a journey. Be scrupulously simple and honest about billing.* That supports Gently Reset's single Pro plan with no trial.

### Headspace: calm premium craft and an enormous library
- Paid value comes from **depth of content** (500+ meditations), plus sleep and coaching.
- **Lesson for Gently Reset:** you can't out-library Headspace. Your premium value has to be *personalization plus relationship*, not volume.

### Stoic: minimalist reflection with insight over time
- Morning and evening structure, prompts, trends over time, and a lifetime purchase option.
- **Lesson for Gently Reset:** *reflection becomes valuable when it's given back* (trends, "a year ago you wrote…"). Gently Reset stores reflections but never gives them back.

### Daylio and How We Feel: a check-in in seconds
- Mood plus a tap, no typing required. Daylio's "Year in Pixels" turns check-ins into a keepsake. How We Feel is free and grounded in research.
- **Lesson for Gently Reset:** *the daily reflection must take ten seconds at minimum, with writing optional.* The journal's current five-face mood row is the right primitive; it's just in the wrong place.

### Dimension summary

| Dimension | What winners do |
|---|---|
| First impression | Invest the user in a *being* or an *identity* within 30 seconds |
| Onboarding | Personalization that's visible ("built for you"), and anticipation before the ask |
| Daily engagement | One obvious action, finishable in under 5 minutes |
| Mascot | Responds to meaningful behavior; changes over time; has an inner life |
| Progression | Visible accumulation; escalating milestones |
| Retention | A reason for tomorrow (appointment, curiosity, a streak with forgiveness, a widget) |
| Monetization | Clear value; honest terms. The best complaints come from opaque billing, so don't do that. |
| Design | Restraint. Clutter is the most common criticism even of the leaders. |

---

## 4. Competitor Comparison Matrix

**Worth it for v1 key:** ✅ yes · 🟡 a lite version · ⏭ later

| Dimension | Competitors | Gently Reset now | GR strengths | GR weaker | What GR could do differently | v1? |
|---|---|---|---|---|---|---|
| **Opening and onboarding** | Finch hatches a pet; Fabulous tells a story | Mascot intro with the user's name; 13 questions; 4 story scenes; a type reveal | The identity reveal is stronger than most competitors'; the art is distinctive | 25 steps is long; the share button is dead | Keep it. Fix or remove share. Consider trimming 2–3 low-signal questions *only* if they don't feed classification. | 🟡 |
| **Paywall value** | Headspace and Fabulous show library or coaching; Finch is freemium | A hard paywall with 4 generic benefits | Honest: no trial tricks, one plan family | The benefits are generic; nothing shows *their* plan | Show the user's type, their day 1 task title and the four chapter names on the paywall: "This is your plan". That's real personalization, not hype. | ✅ |
| **Primary daily action** | Duolingo: one lesson. Finch: goals. Daylio: a check-in. | Three identical generic ticks on Journey | Tick, haptic and celebration feel great | Self-report only; generic; it lives on Journey, not Home | **Today ritual** (§5, item 1) | ✅ |
| **Reflection** | Stoic and Daylio give insight back | A separate tab with a task-derived prompt | The prompt is personalized; good writing UX | Disconnected from completion; overwrites; never resurfaced | Check-in = mood plus an optional line, inside the ritual; resurfaced at milestones | ✅ |
| **Mascot relationship** | Finch: growth, adventures, personality | Rich animation, tap reactions, state-aware lines | Best-in-class charm and animation quality for its size | No memory; no growth; random lines | Memory (your reason, your words, your returns) plus small permanent "keepsakes" per week | ✅ (memory) / 🟡 (keepsakes) |
| **Progress visibility** | Duolingo path; Finch's evolving bird | Journey path; seasonal art by the calendar; stats screen | Beautiful scene | The scene reflects the *season*, not *you* | The Journey path accumulates *your* completed days and keepsakes | 🟡 |
| **Milestones** | Escalating celebrations; Fabulous chapter letters | Same celebration every day; a milestone reaction on Home | The celebration machinery exists | 7, 14 and 21 aren't special; day 30 is anticlimactic | Week-close "letter" from the mascot using their words; a day 30 "Reset Story" | ✅ |
| **Missed days** | Duolingo streak freeze (measured gain); Finch is gentle | The plan doesn't advance; the streak resets; a welcome-back reaction | The plan-pausing behavior is the *right* gentle design | The streak drop contradicts "gentle"; the reason isn't used | "Days you showed up" as the headline metric; a return moment using their reason | ✅ |
| **Return trigger** | Widgets, notifications, appointments | None | — | Nothing brings the user back | Lock-screen or home widget (allowed); one opt-in local reminder (**needs your approval**) | 🟡 |
| **Post-program** | Headspace: library. Fabulous: next journey. Stoic: ongoing journaling. | Nothing after day 30 | — | The subscription's weakest point | Decide this explicitly (§6, item A5) | ✅ (decision) |
| **Social** | Finch "tree town" friends; Duolingo leagues | Private friends, presets, limited progress | Privacy-respecting, low pressure | Needs paying friends; low v1 impact | Keep as is; don't expand | ⏭ |
| **Billing honesty** | Fabulous' complaints show the risk | Hard paywall, no trial, monthly and yearly | Simple | Restore, disclosures and deletion are missing (technical audit) | Fix the compliance items; that's also a trust feature | ✅ |

---

## 5. The Biggest Product Weaknesses (ranked by impact)

### 1. There is no single daily ritual. The day's real work lives in the wrong place and is generic.
- **Evidence**
  - Home's CTA routes to Journey (`getCompanionPresentation.ts:57`).
  - Completion is three ticks that are identical for all 30 days (`journeyCopy.ts:20-24`).
  - "Check in" doesn't capture any check-in.
  - The journal is a separate tab with its own prompt (`ReflectScreen.tsx:67`).
- **Competitors:** Duolingo and Daylio have one obvious action that's finishable in minutes and recorded in the product.
- **Proposed solution:** Home becomes "Today". Tapping the mascot's task card opens one sheet with three steps:
  1. **Read:** the task title, description and objective, plus *why it fits your type*. All of this data already exists.
  2. **Do:** a "done" control. Optionally show a gentle timer for tasks that have `minutes`.
  3. **Check in:** five mood faces plus a one-line answer to the task's own `reflectionPrompt`, with writing optional. Saving this **is** the journal entry and completes the day.

  The celebration then plays. Journey becomes the map you *visit*, and the Journal becomes your *archive*.
- **Before:** Home, then tap, then the Journey tab, then the sheet, then three abstract ticks, then the celebration. The Journal is separate and forgotten.
- **After:** Home, then the Today card, then read, do, and check in (mood plus a line), then the celebration. The entry appears in the Journal automatically.
- **Expected impact (hypothesis):**
  - More days produce a reflection, and reflections are the raw material for the mascot memory and milestones below.
  - Fewer taps to complete a day.
  - Clearer value ("this app knows my day").
- **Difficulty:** M. It reuses `JourneyDaySheet` pieces, `JournalMoodRow` and `saveReflection`.
- **Frozen engine:** untouched. It reads `ResolvedResetTask` fields only.
- **Risks:**
  - Requiring a mood to complete the day adds friction. Mitigation: mood is one tap; text is optional.
  - Duplicate entry points. Mitigation: Journey's sheet opens the same component.
- **Essential before launch:** **Yes.** This is the loop.

### 2. The mascot has charm but no memory or relationship
- **Evidence**
  - Lines are drawn from `NUDGES`, `APP_FACTS` and `CUTE_LINES` (`getHomeMascotReaction.ts:41,124`).
  - The user's reason ("I'll hold onto this for the days you forget", `onboardingSteps.ts:311`) is only shown as a row in You (`ProfileScreen.tsx:165`). The promise is broken.
  - The mascot never references a past reflection, a comeback or a count of days.
- **Competitors:** Finch's bird returns from adventures with *stories* and visibly grows. People bond with things that *respond to them specifically*.
- **Proposed solution:** a deterministic "memory" layer. No AI. It's templated lines fed by the snapshot:
  - **On a return after a miss:** "You told me you're doing this because *{reason}*. Still true? Let's do a small one."
  - **The day after a check-in:** "Yesterday you felt *{mood}* after *{task}*. Today is gentler."
  - **Counts:** "This is the 9th day you've shown up."
  - **A milestone recall** of one of the user's own lines (see weakness 3).
- **Before:** random cute facts.
- **After:** the mascot clearly *knows them*.
- **Expected impact (hypothesis):** stronger emotional attachment and a reason to read the bubble. It also fulfils an explicit onboarding promise, which matters for trust.
- **Difficulty:** S–M (copy plus selectors).
- **Risks:**
  - Echoing sensitive journal text on the Home screen, which other people may see. Mitigation: only echo the *reason* and *mood*, never free-text journal lines on Home. Show those lines only at private milestone moments.
- **Essential:** **Yes**, at least the reason-on-return and the "showed up N days" lines.

### 3. Milestones aren't moments, and day 30 is an anticlimax
- **Evidence**
  - The same `JourneyDayCelebration` plays every day.
  - The milestone state only changes the Home reaction.
  - After day 30 the app freezes in a completed state.
- **Competitors:** Duolingo escalates its celebrations; Fabulous closes chapters with letters; Stoic gives your history back to you.
- **Proposed solution**
  - **Days 7, 14 and 21, "Chapter close":** after the celebration, the mascot hands over a short *letter*:
    - your week in five mood faces
    - one line you wrote that week (the user chooses which, or the most recent)
    - the next chapter's name ("make it easier")
    - a small **keepsake** that permanently appears on the Journey path (for example a lantern, a bench or a flower). This gives the season art *personal* change.
  - **Day 30, "Your Reset Story":** a full-screen sequence showing:
    - your type and your original reason
    - 30 days of moods as a strip (Daylio's "pixels" idea)
    - three lines you wrote
    - "days you showed up"
    - a shareable card. This implements the currently dead share button.
- **Before:** day 7 equals day 6, and day 30 is the end.
- **After:** four genuine peaks that are personal and screenshot-worthy.
- **Expected impact (hypothesis):**
  - These are the moments people screenshot and remember.
  - The Reset Story is organic marketing.
  - The chapter letters bring anticipation ("what's my next letter?").
- **Difficulty:** M.
- **Risks:**
  - Scope creep in art. Mitigation: four keepsakes, reusing the existing illustration style.
- **Essential:** day 7 and day 30, **yes**. Days 14 and 21 can reuse the day 7 template.

### 4. Missed days contradict the brand
- **Evidence**
  - `applyDateRollover` correctly pauses the plan, but resets `streak` to 0.
  - The streak is shown in stats and headers.
  - The return moment doesn't use the user's reason.
  - The audience is self-described "restarters", the people most likely to miss days.
- **Competitors:**
  - Duolingo measured that forgiveness increases engagement (+0.38% daily active learners from the larger freeze cap; first-party).
  - Finch is non-punitive by design.
- **Proposed solution**
  - **Headline metric:** "days you showed up" (completed days). It never decreases.
  - Keep the streak data (the engine is untouched) but de-emphasize it to a secondary stat.
  - **Return moment:** the mascot welcomes you back, shows your reason, and offers "pick up where you left off: Day N".
  - **No guilt copy** anywhere.
- **Before:** "Streak 0".
- **After:** "You've shown up 6 days. Day 7 is waiting, no rush."
- **Expected impact (hypothesis):** less shame-driven churn after the first miss, which is the most common drop-off point for habit apps.
- **Difficulty:** S. It's presentation only; the engine already computes everything.
- **Essential:** **Yes.**

### 5. There's no reason to return tomorrow outside the app, and no defined future after day 30
- **Evidence**
  - No widget.
  - No reminders. AGENTS.md says no push notifications unless explicitly requested.
  - No post-30 state; Cycle 2/3 is explicitly out of scope per AGENTS.md.
- **Competitors:** Finch widgets keep the pet visible; Duolingo widgets and reminders; Fabulous' next journey; Headspace's library.
- **Proposed solution:** two **decisions for you** (I'm not assuming approval):
  1. **Return trigger.** Ship a Home Screen or Lock Screen **widget** showing the mascot and "Day N · today's step". This needs a native widget extension through a config plugin, so it's L effort and probably post-launch. Separately, a **single opt-in local daily reminder** in the mascot's voice. This is a local notification, not server push, but it still falls under the AGENTS.md "push notifications" rule, so it needs your explicit yes.
  2. **After day 30:** see §6, item A5.
- **Essential:** the post-30 decision is essential, because it's what the subscription is selling. The reminder is a strong recommendation pending your approval. The widget is post-launch.

### Also noted (lower impact)
- **The paywall doesn't sell *their* plan.** The benefits are generic (`paywallCopy.ts`). Showing the user's type, day 1 task and chapter names is cheap and honest personalization. S effort. **Do it.**
- **The Journey scene follows the calendar season, not progress.** Keepsakes (weakness 3) fix the meaning without new seasonal art.
- **The You tab is a static mirror.** After weakness 3 it can host the Reset Story and chapter letters. No new dashboards.
- **The World tab** depends on friends who also pay. That's fine as a quiet extra; it's not a growth engine for v1.

---

## 6. The Cohesive Ideal Experience

**The organizing idea:** *"A small companion walks your 30 days with you, and remembers them for you."*

**Roles of the five tabs**

| Tab | Role |
|---|---|
| **Home** | Today: the mascot and the one ritual |
| **Journey** | The map of where you've been, with keepsakes |
| **Journal** | Your words, archived; written mostly through the ritual |
| **World** | Quiet company |
| **You** | Who you're becoming: your type, reason, letters and Reset Story |

**First 60 seconds**
1. The cream welcome scene.
2. The mascot runs in, asks your name, and says "nice to meet you, {name}".
3. Within a minute the user has made two or three easy, *self-describing* choices and seen the mascot react to each one.
4. No feature list. The user should feel "this is about me", which the current onboarding already does well.

**Day 1**
1. Reveal: "You're a Soft Restarter."
2. The paywall shows *their* plan: chapter names and day 1's task.
3. Unlock leads to a short arrival moment: the mascot says "Day 1 is tiny. Let's do it together."
4. The Today card: read, do, then check in (mood plus a line).
5. The celebration.
6. The mascot ends with: "See you tomorrow. I'll keep this for you."
7. The journal now holds entry #1 without the user ever opening the tab.

**What makes tomorrow worth returning for**
- **Curiosity:** a peek ("tomorrow: *make it easier*"). The next title is deterministic, so it can be shown.
- **The relationship:** the mascot references yesterday's mood.
- **Progress:** the path is one step further, and day 7's chapter letter is visibly approaching.
- **Optional:** a widget, and one gentle reminder, if you approve it.

**How the mascot becomes more meaningful over time**

| Week | What the mascot does |
|---|---|
| 1 | Greets you and reacts |
| 2 | Remembers: your reason, your mood, your comebacks |
| 3 | Recalls your words in letters |
| 4 | Narrates your story back to you on day 30 |

- The keepsakes on the path are proof of the shared history.
- **No currency, no shop.** The things the mascot collects are *earned by showing up* and can't be bought.

**What makes the user feel their life is changing**
- **Their own words over time.** Day 1's line next to day 21's line.
- **Mood strips** across the weeks.
- The roadmap's **phase arc** (stabilize, change, pattern, independence, close), told as chapters.
- None of this is invented insight; it's their own data, reflected back.

**After 30 days.** This is your decision: AGENTS.md forbids Cycle 2/3 unless you request it. Honest options:

| Option | What it means | Assessment |
|---|---|---|
| **(a) Keep the practice** *(recommended)* | After the Reset Story, the app enters a "keep going" mode. The daily ritual continues with a *maintenance rotation* drawn deterministically from the user's own 30 tasks: the ones they rated best by post-task mood. Journaling continues, and a monthly letter arrives. | Small engineering cost; reuses the frozen roadmap's output; honestly justifies continued payment |
| (b) A second reset | A new 30 days, reclassifying or continuing the phase arc | Bigger content cost; it's Cycle 2, so it needs your explicit request |
| (c) Complete and graceful | No new content. Tell users before they buy that the program is 30 days, and lean on yearly-plan value framing honestly. | Simplest; weakest renewals |

**Why someone keeps paying.** Because the app holds (1) a daily practice built for them and (2) a growing record of their own words that the companion gives back. That's defensible against Headspace's library and against free How We Feel. **Without option (a) or (b), I'd expect monthly churn right after day 30.** That's a hypothesis to measure, not a finding.

---

## 7. What NOT to Build (rejected or deferred)

| Idea | Why not |
|---|---|
| Currency, a shop, outfits for purchase (Finch-style economy) | Large build and balancing cost; it pulls the brand toward a game; the keepsakes already give accumulation |
| Leagues, leaderboards, XP | Contradicts "gentle"; also out of scope per AGENTS.md |
| Streak wagers or guilt notifications | Shame mechanics are wrong for restarters |
| An AI chat coach or AI-generated plans | The frozen deterministic roadmap is a strength (predictable, testable, private); out of scope per AGENTS.md |
| More dashboards or stats screens | One stats screen exists; the Reset Story replaces the need |
| Expanding the social layer (feeds, DMs, contact discovery) | It distracts from the solo ritual; out of scope per AGENTS.md |
| More seasonal art or scene variants | Cosmetic; it doesn't change the loop. Use keepsakes instead. |
| Rive or a new animation system | The current approach is good; no user problem is solved |
| A free trial | Explicitly disallowed; also unnecessary if the paywall shows their plan |
| More per-screen polish passes | The point of this audit: the loop first, then polish |
| Analytics SDKs | Disallowed unless you request them; see §9 for measurement without an SDK |

---

## 8. The Unified Improvement Plan

### A. Transformational improvements (maximum 5)

#### A1. The Today ritual on Home (read, do, check in = journal)

**Acceptance criteria**
- Home shows one Today card with the resolved task title and minutes, plus a one-line "why this fits you" built from the type and objective.
- The sheet has three steps:
  - "Read" reveals the description and objective.
  - "Do" is a single confirm.
  - "Check in" requires one mood tap; text is optional and prefilled with nothing.
  - The check-in prompt is the task's own `reflectionPrompt`.
- Saving the check-in calls the existing `completeToday` and `saveReflection` in that order, and the celebration plays.
- The entry appears in Journal history immediately. Journey's day sheet opens the **same** component; there's no second completion path.
- Ticks stay permanent once made (the current behavior is preserved).
- Reduced Motion, VoiceOver labels and 44 pt targets are preserved.
- The frozen roadmap and reset engine are unchanged. Tests stay green.

#### A2. Mascot memory

**Acceptance criteria**
- A pure selector `getMascotMemoryLine(snapshot, now)` with unit tests covering:
  - a return after a miss (shows `resetReason`; falls back gracefully if it's empty)
  - the day after a check-in (mood plus task title)
  - "showed up N days" on days 3, 5 and 10
- Memory lines take priority over random lines in the first tap of the day; random lines follow.
- Free-text journal content is **never** shown on Home.

#### A3. Milestone ceremonies: chapter letters for days 7, 14 and 21, and the day 30 Reset Story

**Acceptance criteria**
- On completing day 7, 14 or 21, the normal celebration is followed by a letter sheet containing:
  - the week's moods
  - one of the user's lines from that week (or the reason, if they wrote none)
  - the next chapter's name
  - the keepsake earned
- The keepsake renders permanently on the Journey path.
- Letters can be re-opened from You.
- On day 30, a full-screen Reset Story shows the type, the original reason, a 30-mood strip, three user lines (most recent per chapter), the days shown up, and a share action using the native share sheet. That share replaces the `shareReset` no-op.
- All content comes from local data; nothing is invented.

#### A4. A gentle return and the "showed up" model

**Acceptance criteria**
- The primary progress number everywhere is completed-days count ("days you showed up").
- The streak stays secondary (stats screen only).
- After a miss, the first Home visit shows the welcome-back moment with the reason and "Day N is waiting".
- No copy says "lost", "broken" or "failed". A copy lint is added as a test.

#### A5. A defined after-day-30 (requires your decision on option a, b or c in §6)

**Acceptance criteria (for option a)**
- After the Reset Story, the Today card continues.
- Each day's task is drawn deterministically from the user's own completed day 1–30 tasks, weighted toward the ones with the highest post-task mood. It's seeded by date for stability.
- A monthly letter appears.
- The paywall and App Store copy state plainly what continues after 30 days.
- No new roadmap content and no reclassification.

**Implementation sequence**
1. **A4** (S): presentation only; it de-risks the brand fast.
2. **A1** (M): the backbone; everything else consumes its check-ins.
3. **A2** (S–M): needs A1's mood data.
4. **A3** (M): needs A1's reflections. Do day 7 and day 30 first; days 14 and 21 reuse the template.
5. **A5** (S–M once decided): needs A3's Reset Story as its entry point.

### B. Essential launch improvements (product, not compliance)
- The paywall shows the user's own plan: type, chapter names and the day 1 task. Generic benefits become secondary.
- Fix or remove the dead Share button. A3's Reset Story makes it meaningful.
- An arrival moment after unlock: "Day 1 is tiny".
- A "tomorrow" peek after completion.
- Resolve the journal overwrite on repeated plan days (technical audit P1-3). A1 makes this more visible.
- Replace "Help & support: coming later" with a real contact route.
- Decide on the reminder (approve or reject the single opt-in local reminder).
- Make UI copy casing consistent across the five tabs.

### C. Post-launch experiments (need real user feedback first)
- Home or Lock Screen widget (L effort; likely a strong return lever).
- Trimming onboarding from 25 to about 20 steps. Test whether conversion improves without hurting classification quality.
- Keepsake variety per reset type.
- Option (b), a second reset, if post-30 demand appears.
- Friend nudges tied to milestones ("Sam finished week 1").
- Pricing and plan framing (yearly versus monthly emphasis).
- A morning-and-evening split of the ritual, Stoic-style. Test only if users ask.

---

## 9. Separation From Compliance and Technical Blockers

These remain **must-fix** and are detailed in `GENTLY_RESET_FULL_AUDIT.md`. They are not product strategy:
- the paywall bypass in the working tree
- no Restore Purchases
- no account deletion
- no Terms, Privacy or auto-renew disclosure
- no `eas.json`
- localized pricing bugs
- no password reset
- the returning-user restore gap
- no error boundary

**Fix them in parallel with A4 and A1.** The bypass, restore, deletion, disclosure and EAS items come first, because nothing ships without them.

---

## 10. Final Verdict

1. **Strongest competitive advantage?** A genuinely personalized, deterministic plan (nine types, a phase arc), delivered by a distinctive, beautifully animated character. Very few apps have both the identity reveal and the craft.
2. **Biggest weakness?** There's no single daily ritual that connects the mascot, the action and the reflection, and nothing accumulates. After the day 1 celebration, every day looks the same, and day 30 is a dead end.
3. **Is there a compelling daily engagement loop?** **Not yet.** There's a satisfying *completion moment*, but no loop. Nothing brings the user back, the action is generic self-report, and reflection is optional and disconnected.
4. **Does the mascot have enough meaningful purpose?** **Not yet.** It has personality but no memory or stake. Its purpose should be *keeper of your story*.
5. **Is the 30-day reset enough to justify a subscription?** **Enough to justify a first purchase. Not enough to justify renewal** without a defined after-day-30 (A5) and visible personal accumulation (A3).
6. **What would make it genuinely memorable?** Day 30: the mascot hands you back your own story, in your own words. That's the screenshot, the share and the reason to recommend the app.
7. **Three improvements before any more cosmetic polishing:**
   - **A1** the Today ritual
   - **A4** the "showed up" model and gentle return
   - **A3** milestones (day 7 and the day 30 Reset Story)
8. **What to deliberately avoid:** currency or shop economies, leagues, guilt streak mechanics, AI coaching, more dashboards, more social surface, more seasonal art, and further screen-polish passes.
9. **What I'd ship as v1:**
   - All compliance and technical P0s.
   - A1, A4, A2-lite (reason on return, "showed up" count) and A3 for day 7 and day 30.
   - The personalized paywall.
   - The post-30 decision implemented (option a recommended).
   - Your call on the single opt-in reminder.
   - Defer: the widget, days 14 and 21 keepsake variety, and social expansion.
10. **What to measure after launch.** AGENTS.md disallows analytics SDKs unless requested. Everything below comes from systems you already have:

    | Metric | Source |
    |---|---|
    | Paywall conversion, monthly versus yearly mix, refunds, cancellations | RevenueCat dashboard |
    | Month-2 renewal (it tests the post-day-30 value) | RevenueCat dashboard |
    | Day 1 to day 2 return; share reaching days 7, 14 and 30; days-shown-up distribution | Supabase `reset_day_completions` (aggregate SQL; no new tracking) |
    | Share of completed days that include a reflection (it tests A1) | Supabase `journal_entries` |
    | Comeback rate: users with a miss who complete again within 3 days (it tests A4) | Supabase `reset_day_completions` |
    | Qualitative signal | App Store reviews and an in-app "how's it going?" at day 7 (optional) |

    If you later want event-level funnels (onboarding drop-off by step), that requires approving an analytics tool. I haven't assumed it.

---

*Nothing in this document has been implemented. Approve a direction (A1–A5, plus the A5 option and the reminder decision) and I'll produce an implementation plan before any code changes.*
