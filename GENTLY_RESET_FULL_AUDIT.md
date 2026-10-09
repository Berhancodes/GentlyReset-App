# Gently Reset — Full Production Readiness Audit

**Date:** 2026-10-07
**Branch:** `main` @ `b84dfa9`, plus a large uncommitted working tree (about 60 modified files and new Journey, Journal and Home work from this session)
**Scope:** read-only audit. The only file created is this report. No code was changed, nothing was installed, nothing was committed.

## How this audit was done

**What was actually run**
- `npm run typecheck`: clean.
- `npm run lint`: clean.
- `npm test`: exit 0, all 20 suites pass, including the dependency-direction and isolation scripts.
- `npx expo config --type public`: resolves.
- Static inspection of `app/`, `src/`, `supabase/migrations/`, `app.json`, `package.json`, `.env.example` and the generated `ios/` folder.
- A filename-reference scan of `assets/`.
- A module-importer scan for dead code.

**What was not done**
- No iOS device or simulator testing happened during this audit.
- Visual notes come from two sources:
  - reading the code, and
  - the Expo **web** preview used earlier in this session while building the Journey, Journal, Home and You screens.
- Anything that depends on StoreKit, haptics, `expo-video` HEVC alpha, `BlurView`, real frame rate, VoiceOver or small-device layout is marked **NEEDS DEVICE TESTING**.

**Confidence labels**
- **CONFIRMED** means it was proven from code (a line-level trace).
- **SUSPECTED** means a plausible risk that needs runtime proof.

---

## A. Executive Summary

**Production readiness score: 52 / 100.** Not shippable to the App Store today.

The product core is strong:
- The deterministic 30-day engine, nine-type classification, date rollover, streaks and cloud-sync decision logic are well layered, tested, and guarded by dependency checks.
- Supabase RLS is tight and every RPC is `security definer` with a pinned `search_path`.
- The visual identity (mascot, seasonal scenes, Duolingo-style celebration) is distinctive and already close to Finch-level charm.

**What blocks release is almost entirely monetisation and compliance plumbing:**

1. **CONFIRMED P0: the hard paywall is bypassed on every platform** in the current working tree.
   - "Unlock My Reset" calls `grantLocalAppAccess()` and routes to Home without any purchase.
   - The flag is persisted, so a free user keeps access forever. See `HardPaywallScreen.tsx:78-86`, `useOnboardingStore.ts:93,111` and `_layout.tsx:36-37`.
   - The committed version (`HEAD`) still has the real purchase flow. The bypass is uncommitted.
2. **There is no Restore Purchases control anywhere.** This is required by App Store guideline 3.1.1.
3. **There is no account deletion.** This is required by guideline 5.1.1(v), because the app offers account creation.
4. **There are no Terms or Privacy links and no auto-renew disclosure on the paywall.** This is required by guideline 3.1.2. `legalUrls.ts` exists but nothing imports it.
5. **There is no `eas.json`,** so TestFlight builds can't be produced with EAS.
6. **Paywall price formatting is wrong outside USD.** It hard-codes `$` and strips commas. A storefront price of "79,99 €" renders a monthly equivalent of "$666.58".

| Area | Score | Notes |
|---|---|---|
| Product logic (roadmap, rollover, streaks) | 8.5/10 | Clean, tested. One journal overwrite defect. |
| Visual design and motion | 8/10 | Strong identity. Heavy assets. One white video rim. |
| Architecture and state | 8/10 | Layered and tested. Some dead code. |
| Backend and security | 7.5/10 | RLS correct. No deletion path, no journal delete. |
| Subscription and auth | 2/10 | Paywall bypass, no restore, no disclosures, no password reset. |
| App Store readiness | 3/10 | Five hard blockers. |
| Accessibility and performance | 6/10 | Reduced motion widely respected. 121 MB of assets. |

---

## B. Feature Inventory

| Feature | Status | Evidence |
|---|---|---|
| Onboarding (25 steps: welcome, mascot intro, name, 13 questions, 4 stories, loading, result, details, share, paywall) | **Functional** | `onboardingSteps.ts`, `OnboardingRenderer.tsx` |
| Classification into nine reset types | **Functional and tested** | `deriveResetType.ts`, `test:reset-type` |
| Deterministic 30-day roadmap and modifiers | **Functional and tested (frozen)** | `src/domain/reset/roadmap/*` (nine playlists), `roadmap.test.ts` |
| Daily task, completion, streak and missed days | **Functional and tested** | `applyDateRollover.ts`, `dailyResetActions.ts` |
| Journey (seasonal scene, mascot video, day sheet, three permanent ticks, celebration) | **Functional** | `JourneyScreen.tsx`, `JourneyDaySheet.tsx`, `JourneyDayCelebration.tsx` |
| Journey stats screen | **Functional** | `JourneyStatsScreen.tsx`, `getJourneyStats.ts` |
| Home (mascot reactions, tips, sky) | **Functional** | `HomeScreen.tsx`, `getHomeMascotReaction.ts` |
| Journal (write, mood, starters, draft, history) | **Functional** (one entry per plan day; see P1-3) | `ReflectScreen.tsx`, `useJournalDraftStore.ts` |
| Journal cloud sync | **Functional (code)**, NEEDS DEVICE TESTING | `requestJournalCloudSync.ts`, `mergeJournal.ts` |
| Reset cloud backup and restore | **Functional (code)**, with a returning-user gap (P1-2) | `decideResetSync.ts` |
| Friends: username, search, requests, invite deep link, encouragements | **Functional (code)**, requires Supabase | `friendsApi.ts`, migrations `2026092802*`–`03*` |
| World tab | **Functional.** Shows real friends; the fake stats were removed | `WorldScreen.tsx`, `worldStats.ts:1-7` |
| Email sign-up and sign-in | **Functional** | `authApi.ts` |
| Password reset | **Missing** | No `resetPasswordForEmail` anywhere |
| RevenueCat purchase | **Wired but currently unreachable** (bypass) | `SubscriptionProvider.tsx`, `HardPaywallScreen.tsx:78` |
| Restore purchases | **Provider method only, no UI** | `SubscriptionProvider.tsx` (`restorePurchases`); no caller in any screen |
| Subscription management link | **Missing** | |
| Account deletion | **Missing** | No RPC, edge function or UI |
| Share reset card | **Visual only (no-op button)** | `shareReset.ts:4` (TODO) |
| Help and support | **Placeholder** ("coming later") | `ProfileScreen.tsx:87-92` |
| Legal URLs | **Helper exists, never used** | `legalUrls.ts` has no importers |
| Notifications and reminders | **Not implemented** | No `expo-notifications` |

---

## C. Screen-by-Screen Audit

Scores are out of 10, in this order:

1. Visual design
2. Typography
3. Spacing
4. Color
5. Assets
6. Animation
7. Touch
8. Navigation
9. Accessibility
10. Small screen
11. Loading, error and empty states
12. Functional completeness

All small-screen and animation scores are provisional and **NEED DEVICE TESTING** on an iPhone SE (3rd generation) and an iPhone 12 mini.

### Onboarding

| Screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Welcome | 9 | 8 | 8 | 9 | 8 | 8 | 8 | 9 | 7 | 7 | 8 | 9 | **8.2** |
| Mascot name and run intro | 8 | 8 | 8 | 9 | 7 | 8 | 8 | 8 | 6 | 7 | 8 | 9 | **7.8** |
| Questionnaires (single, multi, scale, text) | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 7 | 7 | 8 | 9 | **8.0** |
| Stories and mascot GIF scenes | 8 | 8 | 8 | 9 | 6 | 7 | 8 | 8 | 6 | 7 | 7 | 9 | **7.6** |
| Loading and classification | 8 | 8 | 8 | 9 | 7 | 8 | 7 | 8 | 6 | 8 | 8 | 9 | **7.8** |
| Result and reveal details | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 7 | 7 | 8 | 9 | **8.0** |
| Share preview | 8 | 8 | 8 | 9 | 8 | 7 | 4 | 8 | 7 | 7 | 7 | **3** | **7.0** |

**Onboarding findings**
- **Share preview (CONFIRMED):** the share CTA calls `shareReset()`, which is a documented no-op (`shareReset.ts:4-11`). A dead primary button is a likely App Review complaint. Either hide it or implement `Share.share`.
- **Assets:** the onboarding GIFs are heavy, for example `hardest-mascot-hang.gif` (5.7 MB) and `noticing-mascot-boba.gif` (4.7 MB). Decode memory is a crash risk on 3–4 GB devices. NEEDS DEVICE TESTING.
- **Accessibility:** most decorative mascot imagery is hidden from VoiceOver. Story GIFs don't carry descriptive labels; that's acceptable, but check the reading order.
- **Dev tooling:** `DevStepJumper` is double-guarded (`__DEV__ && SHOW_DEV_JUMPER=false`), so it's safe.

### Paywall and auth

| Screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hard paywall (plans and purchase) | 8 | 8 | 8 | 9 | 8 | 7 | 7 | 6 | 6 | 7 | **3** | **1** | **6.5** |
| Sign up | 7 | 7 | 8 | 8 | 7 | 6 | 8 | 7 | 7 | 7 | 6 | 6 | **7.0** |
| Sign in / returning user | 7 | 7 | 8 | 8 | 7 | 6 | 8 | 6 | 7 | 7 | 6 | 5 | **6.7** |

**Paywall (CONFIRMED)**
- **The bypass:** `beginUnlock` at `HardPaywallScreen.tsx:78-86` does no purchase. `useSubscription().purchasePackage` isn't referenced in this file anymore. The purchase-error `message` state and its UI were removed in the diff.
- **No disclosures:** there is no restore button, no Terms or Privacy links, and no "auto-renews, cancel anytime in Settings" text.
- **Hard-coded fallback prices:** when offerings fail to load on device, the plan cards show `$79.99` and `$9.99` (`buildPaywallPlans.ts:16-19`). These aren't StoreKit prices.
- **Wrong currency math:**
  - `monthlyEquivalent` and `savingsFromPrices` format with a hard-coded `$` (`buildPaywallPlans.ts:33-34`).
  - Commas are stripped before parsing (`:22`), so "79,99" parses as 7999.
- **No loading state:** nothing shows while offerings load, and there's no error state if offerings fail.

**Sign-up**
- After authentication, the purchase is fired and forgotten: `void purchasePackage(...)` at `SignUpScreen.tsx:62-64`.
- A failure or `no_entitlement` result is never shown. The user lands back on the paywall with no explanation.
- `isPro` is captured from the render, so it may be stale. SUSPECTED.

**Sign-in**
- There is no "Forgot password?" link, so a user with a forgotten password is permanently locked out.
- A returning user is still sent through all 25 onboarding steps (see P1-2).

**Pending plan choice**
- `pendingPaywallUnlock.ts` is module memory only, so the chosen plan is lost if the app is killed between the paywall and sign-up confirmation. This is low impact.

### Home

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 9 | 8 | 8 | 9 | 8 | 9 | 8 | 9 | 7 | 7 | 8 | 9 | **8.3** |

- Mascot reactions depend on state: "goodbye" only appears after the day is complete. This is tested in `getHomeMascotReaction.test.ts`.
- The sun and cloud slide-in and the speech-bubble swap respect `useReducedMotion`.
- The dev long-press "reset today" is `__DEV__`-guarded.
- The mascot itself has no accessibility label or hint describing that it can be tapped. SUSPECTED, so check with VoiceOver.

### Journey

| Screen | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Journey roadmap and season scene | 9 | 8 | 8 | 9 | 6 | 9 | 8 | 9 | 6 | 7 | 8 | 9 | **8.0** |
| Day sheet (three ticks) | 9 | 9 | 8 | 9 | 8 | 9 | 9 | 8 | 7 | 7 | 8 | 9 | **8.3** |
| Day-complete celebration | 9 | 8 | 8 | 9 | 6 | 9 | 7 | 8 | 7 | 7 | 8 | 9 | **7.9** |
| Journey stats | 8 | 8 | 8 | 9 | 8 | 7 | 8 | 8 | 7 | 7 | 7 | 9 | **7.8** |

**Journey findings**
- **Assets:** the mascot `.mov` clips have a 1–2 px opaque white rim from the source export. The fix needs a re-export with clean alpha; the original MP4s are in `~/Downloads`.
- **Unused images:** the seasonal backgrounds are about 1.5–1.7 MB each. The old `journey-days-*.png` chapter strips (about 11 MB together) appear unreferenced (see P2-6).
- **Celebration:**
  - With reduced motion on, the celebration skips straight to `onDone` (`JourneyDayCelebration.tsx:96-99`). That's correct.
  - The blur needs device verification on older GPUs (iPhone XR/11). NEEDS DEVICE TESTING.
- **Curved banner:** letter widths are estimated (`JourneyCurvedBanner.tsx:17`), so the spacing may look uneven with Dynamic Type or other fonts. Cosmetic.
- **Day 30:** after day 30 is completed, `applyDateRollover` keeps `todayCompleted: true` permanently (`applyDateRollover.ts:36-50`). There is no "start a new reset" path, so the post-day-30 experience is a static completed state. That's a product gap, not a bug.

### Journal (Reflect)

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 9 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 7 | 7 | 8 | **6** | **7.8** |

- **CONFIRMED overwrite:** reflections are keyed by **plan day**, not calendar date (`dailyResetActions.ts:73-79`). If the user misses days, `currentDay` doesn't advance. Journaling on Tuesday and again on Wednesday while still on "Day 5" silently replaces Tuesday's entry. The cloud table enforces the same rule (`unique (cycle_id, local_day)`), so fixing it touches the frozen data shape. See P1-3.
- **No deletion:** there's no way to delete an entry, either locally or in the cloud (there's no DELETE policy on `journal_entries`). That's a privacy expectation for a journaling app.
- **Draft persistence and the "Draft saved" indicator:** these are good.

### World (social)

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 8 | 7 | 7 | 8 | 7 | 6 | 7 | 8 | 6 | 7 | 7 | 7 | **7.1** |

- Real data only; the fake stats were removed.
- The empty, signed-out and not-configured states exist through `getWorldFriendsPresentation`.
- Invites use the custom scheme `gentlyreset://` only, with no universal links, so an invite link opened on a phone without the app installed goes nowhere. This is acceptable for v1.

### You / Profile

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Avg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 8 | 8 | 8 | 9 | 8 | 7 | 8 | 8 | 7 | 8 | 7 | **3** | **7.4** |

- **Missing:** restore purchases, manage subscription, delete account, Terms, Privacy and contact support. "Help & support" says "coming later" (`ProfileScreen.tsx:87-92`).
- **Sign-out wipes the device:** sign-out calls `resetOnboarding()` (`ProfileScreen.tsx:94-98`), which clears the onboarding, reset and journey stores.
  - That is defensible for account switching, but there's no warning.
  - A **signed-out** user (no account) who taps "sign out" loses all progress immediately with no confirmation (`ProfileScreen.tsx:105-107`). CONFIRMED.
- **No session expiry handling:** there's no unauthenticated or expired-session state on Profile.

### Other routes

| Route | Avg | Notes |
|---|---|---|
| `choose-username` | 7.5 | Server canonicalisation and a unique index. Good errors. |
| `find-friend` | 7.3 | Debounced search via RPC. Needs an offline error state. NEEDS DEVICE TESTING. |
| `friend-invite/[token]` | 7.0 | Resolves the token. A user who hasn't paid is redirected by the gate. |
| `(onboarding)/complete` | 7.5 | Hand-off route. |
| `+html` | n/a | Web only. |

---

## D. UI/UX Consistency

- **Strengths:**
  - One design-system source: `src/design-system/*` holds colors, typography, spacing, radius, shadows and motion tokens.
  - No hex literals were found in the screens sampled.
  - Rounded headings, cream background and gold accent are consistent from the paywall through Journey and the Journal.
- **Inconsistencies:**
  - **Casing.** Lowercase UI copy ("sign out", "you", "goals", "couldn't sign out") sits next to Title Case ("Gently Reset Pro", "Restore Purchases", "Sign In", "Day 4"). Pick one rule; Finch uses sentence case.
  - **Paywall implementation.** The paywall uses raw `<Text>` with inline font tokens instead of `AppText`, so its Dynamic Type caps differ from other screens.
  - **Toasts and errors.** Many errors are styled ad hoc instead of using one shared component.
- **Compared with Duolingo and Finch:**
  - Celebration, mascot personality and progression feel are at that level.
  - What's missing compared with them:
    - streak-loss softening (Finch's "it's okay" moment after a missed day is only partly present through `missedYesterday`)
    - reminders or notifications, which are core to retention in both apps
    - a post-completion loop after day 30

---

## E. Animation Audit

- **Reduced motion:**
  - `useReducedMotion` or a `reduceMotion` guard appears in 36 files.
  - No `withRepeat` loop was found without a reduced-motion guard.
- **Thread usage:** everything runs on Reanimated 4 shared values on the UI thread, with no JS-driven `Animated` loops in the main flows.
- **Celebration timing:**
  - The sequence is: blur 300 ms, then the jump video (5.04 s), with a fallback timer at 5.6 s, then blur out over 350 ms.
  - `finish()` schedules `setTimeout(onDone, 350)` without clearing it on unmount (`JourneyDayCelebration.tsx:86`). Leaving Journey mid-fade calls `onDone` after unmount. That's harmless today but fragile. SUSPECTED.
- **Video:**
  - Several `useVideoPlayer` instances (Journey idle, day-done, Home) decode HEVC with alpha at the same time.
  - NEEDS DEVICE TESTING for memory and heat on A12/A13 devices, and for whether the decoders pause off-screen.
- **GIFs:** large GIFs in onboarding decode every frame into memory. Consider animated WebP or video. NEEDS DEVICE TESTING.
- **No Rive or new animation system is recommended.** The current approach is fine.

---

## F. Architecture and State

- **Layering:** domain, application, data and features layers, enforced by `scripts/check-*-deps.mjs`. This is excellent for a v1.
- **Stores:**
  - zustand stores with persist plus explicit `version` and `migrate` (onboarding, reset, journey visual, journal draft).
  - Hydration is gated by `usePersistedStoresHydrated` before the splash hides (`_layout.tsx:38-49`).
- **Single sources of truth:**
  - The access gate has one source (`getAccessDestination`, `getRootHref`) plus `Stack.Protected` guards.
  - **However**, the uncommitted `hasLocalAppAccess` (`useOnboardingStore.ts:26-27`) is a second, persisted gate input that bypasses entitlement.
- **Dead code:** these files have no non-test importers (SUSPECTED; barrel exports were checked by filename):
  - `JourneySkyDecor`, `JourneyCurrentMascot`, `JourneyProgressMascot`, `JourneyDayNode`, `JourneyQuoteCard`
  - `HomeScene`, `TodayResetCard`
  - `JournalBackground`, `JournalNotebook`, `RecentReflectionList`, `WeekMoodRow`
  - `AboutResetTypeCard`, `WorkingTowardCard`
  - `ChoiceGlyph`, `ScaleFace`
  - `companionCopy.ts`, `getWorldStage.ts`, `worldActivity.ts`
  - `InMemoryResetRepository`, `JournalRepository`, `resetDay.ts`, `friends/privacy.ts`, `friends/encouragementRules.ts`
  - `legalUrls.ts` (which should be *used*, not deleted)
- **Debug logging:** `console.log` calls in `JourneyScreen.tsx:225-255` sit inside `__DEV__` helpers. Safe.
- **Error handling:** there is no React error boundary anywhere (`grep ErrorBoundary` finds nothing). One render exception produces a white screen in production.

---

## G. Backend and Security

**Row-level security (CONFIRMED)**

| Table | RLS | Policies |
|---|---|---|
| `profiles` | On | Select and update own |
| `reset_cycles` | On | Own rows only |
| `reset_day_completions` | On | Own rows only |
| `journal_entries` | On | Own rows only |
| `friendships`, `friend_invite_tokens`, `encouragements` | On | Select only; writes go through `security definer` RPCs with `set search_path = public` |

- `anon` and `public` grants are revoked everywhere.
- **Policy gap:** `journal_entries` checks `user_id = auth.uid()` but not that `cycle_id` belongs to the same user. A crafted client could attach an entry to another user's cycle id. The other user can't read it, so this is low impact. Fix it with a `with check (exists (select 1 from reset_cycles c where c.id = cycle_id and c.user_id = auth.uid()))` clause.

**Account deletion**
- Every table cascades from `auth.users`, so deleting the auth user would clean the data.
- But there is no edge function or RPC to do it. Deleting an auth user needs the service role, so this requires a Supabase Edge Function.

**Secrets**
- Only `EXPO_PUBLIC_*` keys are used: the anon key, RevenueCat's public SDK key and the legal URLs. These are public by design.
- No `.env` is tracked.
- A grep for `service_role` in `src`/`app` found nothing.

**Configuration fallbacks**
- If Supabase isn't configured, auth returns "unavailable" and sync no-ops. That's graceful.
- With Supabase unconfigured, the app can't create an account, so the HEAD purchase flow (sign-up first) dead-ends on native. Release builds must have the env vars. Check this in the EAS environment.

**Sync**
- The decision table (`decideResetSync.ts`) covers anonymous, first backup, restore, merge, cross-account and ambiguous cases.
- **Conflicts are silent:** they set state in `useResetSyncStore`, but no UI reads them.
- **Debounce race:** in `ResetSyncController.tsx:43-51`, a reset change followed by a journal change within 2 s cancels the reset sync timer. This is mitigated because the journal sync calls `syncResetWithCloud` first. Low risk.

**Privacy manifest**
- `ios/GentlyReset/PrivacyInfo.xcprivacy` declares the required-reason APIs (UserDefaults, FileTimestamp, SystemBootTime).
- It needs `NSPrivacyCollectedDataTypes` entries for email, user ID and user content (journal), to match the App Store privacy labels.
- `ios/` is gitignored (continuous native generation), so set this through `app.json` → `ios.privacyManifests`.

---

## H. Subscription and Auth (RevenueCat lifecycle)

| Scenario | HEAD (committed) | Working tree (current) |
|---|---|---|
| New user pays (monthly or yearly) | Sign-up, then purchase, then the entitlement listener gives `isPro`, then the gate opens | **Never purchases.** Local flag opens the app. |
| User gets access without paying | Not possible | **Possible on every tap (P0)** |
| User pays without access | `no_entitlement` result exists. On the sign-up path the result is ignored, so it shows no message. | Same |
| Purchase cancelled or failed | Message shown on the paywall | Message UI removed |
| Restore | Provider method only, **no UI** | **No UI** |
| Reinstall | Sign in → `Purchases.logIn(user.id)` → entitlement restored. NEEDS DEVICE TESTING. | Same, but the local flag is wiped by reinstall anyway |
| Expiry | Customer-info listener flips `isPro` off and `Stack.Protected` moves the user to the paywall. NEEDS DEVICE TESTING (sandbox renewals). | **Never re-gated:** `hasLocalAppAccess` stays true |
| Account switching | Sign out → `Purchases.logOut` → empty entitlements | Same. `resetOnboarding` clears the flag. |
| Trial | Packages with intro offers are blocked (`trial_blocked`). Good for "no trial". | Same |
| RevenueCat configure fails | Empty entitlements → paywall. This fails closed, which is correct. | Fails **open** because of the flag |
| Production config | `PRO_ENTITLEMENT_ID='gentlyreset_ios_app_pro'`, offering `default`, `$rc_monthly` and `$rc_annual` | |

The product IDs and entitlement still need to exist in App Store Connect and RevenueCat. NEEDS VERIFICATION outside the repo.

**Requiring an account before purchase.** The HEAD flow sends unauthenticated users to sign-up before StoreKit.
- Apple allows this only when the account is needed for core features. You can argue that here (cloud sync, friends), but reviewers often reject it (guideline 5.1.1).
- Safer: purchase anonymously first, then offer account creation. RevenueCat aliases the anonymous ID when `logIn` runs.

**Auth gaps**
- There is no password reset.
- There is no Sign in with Apple. That's not required, because there's no third-party login.
- Unconfirmed-email handling exists (`confirmation_required`).

---

## I. Performance and Accessibility

**Bundle size**
- `assets/` is **121 MB**.
- About 51 files (**about 32 MB**) don't match any filename referenced in `src`/`app`. SUSPECTED unused; confirm before deleting. The largest are:
  - the `journey-days-*.png` strips (about 11 MB)
  - `welcome-first-screen.png`, `mascot-thinking-world.png`, `my-world-cottage.png`, `friends-together.png`, `home-morning-scene.png`, `journal-mascot-writing.png` and `you-mascot.png`
- Many PNGs used on screen are 1.5–2.3 MB. Resize them to about 3× the display size and convert to WebP.

**Memory**
- Large GIFs plus several HEVC players plus `BlurView` on the same screen is a real risk on iPhone XR, 11 and SE. NEEDS DEVICE TESTING with Instruments (Allocations, Core Animation FPS).

**Accessibility**
- Good:
  - roles and labels on buttons, plan cards (`accessibilityState.selected`), journal starters and the celebration
  - decorative layers hidden from VoiceOver
- Gaps:
  - the Home mascot's tap affordance
  - the curved banner reads as a single label (good), but the confetti and blur layers should stay hidden (they do)
  - text caps of 1.15–1.4× (`maxFontSizeMultiplier`) limit Dynamic Type for low-vision users. That's acceptable for v1, but check the AX5 layout.
- NEEDS DEVICE TESTING with VoiceOver on: onboarding, paywall, day sheet ticks and journal.

**Small screens**
- `supportsTablet: false`. Good.
- The paywall has a compact layout under 720 pt. The Journey scene layout is computed from the size.
- NEEDS DEVICE TESTING on an SE (667 pt tall).

---

## J. App Store Blockers

| # | Blocker | Guideline | Status |
|---|---|---|---|
| 1 | The paywall grants access without purchase (working tree) | 3.1.1 / business | CONFIRMED |
| 2 | No Restore Purchases control | 3.1.1 | CONFIRMED |
| 3 | No in-app account deletion | 5.1.1(v) | CONFIRMED |
| 4 | No Terms of Use (EULA) or Privacy Policy links, and no auto-renew disclosure on the paywall; App Store Connect metadata also needs them | 3.1.2 | CONFIRMED |
| 5 | No `eas.json` (build profiles, credentials, env) | Release process | CONFIRMED |
| 6 | Wrong price display outside USD storefronts | 3.1.2 (misleading pricing) | CONFIRMED by code |
| 7 | Privacy manifest and labels don't declare collected data | 5.1.2 | CONFIRMED (manifest), labels NEED VERIFICATION |

**Not blockers, but likely reviewer friction:**
- the no-op Share button
- "Help & support: coming later"
- requiring an account before purchase

---

## K. Prioritized Action Plan

"Touches frozen architecture" refers to the deterministic roadmap and reset engine.

### P0: must fix before TestFlight or review

**P0-1: Remove the paywall bypass**
- **Problem:** "Unlock My Reset" grants persisted app access without a purchase.
- **Files:**
  - `src/features/subscription/screens/HardPaywallScreen.tsx:63,78-86`
  - `src/features/onboarding/store/useOnboardingStore.ts:26-27,38,46,93,111`
  - `app/_layout.tsx:36-37`
  - `src/navigation/getRootHref.ts:12,19`
  - `app/index.tsx`, `SignInScreen.tsx`, `SignUpScreen.tsx` and `FriendInviteScreen.tsx:25-26`
- **Evidence:** `git diff HEAD` shows `startPurchase` and its error UI were removed and replaced with `grantLocalAppAccess()`.
- **Impact:** 100% revenue loss; every user gets Pro for free, permanently.
- **Severity:** Critical.
- **Fix:** restore the HEAD `beginUnlock`/`startPurchase` logic. If a web preview unlock is still wanted, gate it with `Platform.OS === 'web' && __DEV__` and never persist it. Also add a migration that resets `hasLocalAppAccess` for existing installs.
- **Complexity:** S. **Touches frozen architecture:** no.

**P0-2: Add Restore Purchases**
- **Problem:** there's no way for a paying user to recover access on a new device without an account, which Apple requires.
- **Files:** `HardPaywallScreen.tsx` footer; `ProfileScreen.tsx` link rows.
- **Evidence:** `restorePurchases` has no caller outside the provider and client.
- **Impact:** guaranteed rejection.
- **Severity:** Critical.
- **Fix:** a "Restore" text button on the paywall and a row in You, calling `useSubscription().restorePurchases()`. Show the `{ok, unlocked}` result.
- **Complexity:** S. **Touches frozen architecture:** no.

**P0-3: Add account deletion**
- **Problem:** account creation exists, but deletion doesn't.
- **Files:** a new Supabase Edge Function (`delete-account`, using the service role and `auth.admin.deleteUser`); `ProfileScreen.tsx`.
- **Evidence:** no deletion code; the tables already cascade from `auth.users`.
- **Impact:** guaranteed rejection.
- **Severity:** Critical.
- **Fix:**
  - Add a "Delete account" row with a confirmation dialog.
  - Call the function, then sign out and clear local stores.
  - Tell the user that the subscription has to be cancelled in Apple settings, and link to `https://apps.apple.com/account/subscriptions`.
- **Complexity:** M. **Touches frozen architecture:** no.

**P0-4: Add legal links and subscription disclosures**
- **Problem:** the paywall lacks Terms, Privacy and auto-renew terms.
- **Files:** `HardPaywallScreen.tsx`; `legalUrls.ts` (currently unused); `.env.example`.
- **Evidence:** `getLegalUrls` has no importers; both env values are empty.
- **Impact:** rejection under 3.1.2.
- **Severity:** Critical.
- **Fix:**
  - Publish the two pages.
  - Set `EXPO_PUBLIC_TERMS_URL` and `EXPO_PUBLIC_PRIVACY_URL`.
  - Render the links and one line of text: "Auto-renews at {price}/{period} until cancelled. Cancel anytime in Settings."
  - Mirror the links in You.
- **Complexity:** S. **Touches frozen architecture:** no.

**P0-5: Create the EAS build configuration**
- **Problem:** no `eas.json`.
- **File:** repo root.
- **Evidence:** `ls eas.json` fails.
- **Impact:** EAS can't produce TestFlight builds.
- **Severity:** Critical (process).
- **Fix:**
  - Add `development`, `preview` and `production` profiles, with `autoIncrement` for `buildNumber`.
  - Put the `EXPO_PUBLIC_*` values in the EAS environment.
  - Add `submit.production.ios.ascAppId`.
- **Complexity:** S. **Touches frozen architecture:** no.

**P0-6: Fix price formatting**
- **Problem:** hard-coded `$`, comma stripping and USD fallback prices.
- **File:** `src/features/subscription/utils/buildPaywallPlans.ts:16-19,22-34`.
- **Evidence:** a price string of "79,99 €" gives "$666.58/month".
- **Impact:** misleading prices for non-USD users, which risks a 3.1.2 rejection.
- **Severity:** High.
- **Fix:**
  - Use RevenueCat's `pricePerMonthString` (or `price` with `currencyCode` and `Intl.NumberFormat`).
  - When offerings fail on native, show "Plans unavailable — try again" instead of fake prices.
- **Complexity:** S–M. **Touches frozen architecture:** no.

### P1: fix before public launch

**P1-1: Add password reset**
- **Problem:** there's no "Forgot password".
- **File:** `SignInScreen.tsx`.
- **Evidence:** no `resetPasswordForEmail` call anywhere.
- **Impact:** paying users get locked out.
- **Fix:** add the link, call `supabase.auth.resetPasswordForEmail`, and add a deep-link or redirect page.
- **Complexity:** M. **Touches frozen architecture:** no.

**P1-2: Make returning users first-class**
- **Problems:**
  - A user who completes onboarding and *then* signs in from the paywall hits `ambiguous-ownership` (`decideResetSync.ts:82-84`). Cloud progress is never restored, and the user isn't told.
  - A user who signs in from Welcome is still forced through all 25 onboarding steps (`SignInScreen.tsx:47` → `getRootHref` → onboarding).
- **Impact:** a reinstalling paid user appears to lose their progress.
- **Severity:** High.
- **Fix:**
  - After a sign-in restore succeeds, mark onboarding complete.
  - When the conflict happens, ask "Use your saved progress or this device's?" instead of pausing silently.
- **Complexity:** M. **Touches frozen architecture:** no. It touches sync orchestration only, not the engine.

**P1-3: Stop journal entries overwriting across missed days**
- **Problem:** one reflection per *plan day*, so on repeat days the earlier calendar day's text is replaced.
- **Files:** `dailyResetActions.ts:73-79`; `journal_entries` unique `(cycle_id, local_day)`.
- **Evidence:** the filter is by `day`.
- **Impact:** silent journal data loss for users who miss days, who are the core audience.
- **Severity:** High.
- **Fix:**
  - Least invasive: when an entry exists for the plan day with a different `date`, append to it rather than replace (or prompt first).
  - Full fix: key by date. That needs a migration and changes the data shape.
- **Complexity:** S (append) / L (rekey). **Touches frozen architecture:** the full fix touches the persisted journal shape, so only do it with approval.

**P1-4: Surface sign-up purchase results**
- **Problem:** `void purchasePackage(...)` result is ignored.
- **File:** `SignUpScreen.tsx:62-64`.
- **Impact:** failures look like "nothing happened".
- **Fix:** await the result and route to the paywall with a message on failure.
- **Complexity:** S. **Touches frozen architecture:** no.

**P1-5: Add an error boundary**
- **Problem:** there's no top-level error boundary.
- **File:** `app/_layout.tsx`.
- **Impact:** a white screen with no recovery.
- **Fix:** export an `ErrorBoundary` from the root layout (expo-router supports this). Add crash reporting (Sentry) with approval.
- **Complexity:** S. **Touches frozen architecture:** no.

**P1-6: Fix or hide the dead and placeholder controls**
- **Problem:** the Share CTA is a no-op, and "Help & support" says "coming later".
- **Files:** `shareReset.ts`, `SharePreviewScreen.tsx:32-35`, `ProfileScreen.tsx:87-92`.
- **Fix:** implement `Share.share` with the reset-card text, and replace the help placeholder with a `mailto:` support link (required on App Store Connect anyway).
- **Complexity:** S. **Touches frozen architecture:** no.

**P1-7: Confirm before destructive sign-out**
- **Problem:** for an anonymous user, "sign out" wipes all progress instantly.
- **File:** `ProfileScreen.tsx:101-107`.
- **Fix:** add a confirmation dialog. For anonymous users, relabel it as "Start over".
- **Complexity:** S. **Touches frozen architecture:** no.

**P1-8: Declare collected data in the privacy manifest**
- **File:** `app.json` → `ios.privacyManifests`.
- **Fix:** declare email, user ID and user content, linked to the user, not used for tracking.
- **Complexity:** S. **Touches frozen architecture:** no.

### P2: polish and stability

- **P2-1: Clean the mascot video edge.** The white rim on the Journey and celebration `.mov` clips needs a re-export with clean alpha (an ffmpeg or After Effects step, approval needed). S.
- **P2-2: Clear the celebration timer on unmount.** `JourneyDayCelebration.tsx:86`: store the `setTimeout` id and clear it on unmount. S.
- **P2-3: Show sync conflicts in the UI.** Read `useResetSyncStore` conflicts in You. S.
- **P2-4: Tighten the journal policy.** Add the `cycle_id` ownership check to `journal_entries` insert and update. Add a DELETE policy and a delete-entry UI. S–M.
- **P2-5: Unify UI copy casing.** S.
- **P2-6: Cut the asset weight.**
  - Verify and remove the about 32 MB of unreferenced assets.
  - Convert large PNGs to WebP at 3×, and the onboarding GIFs to video or WebP.
  - M.
- **P2-7: Remove dead modules** (the list in section F). S.
- **P2-8: Show a loading skeleton on the paywall** while offerings load. S.

### P3: after v1

- Daily reminder notifications (opt-in). This is the biggest retention lever compared with Duolingo and Finch.
- A post-day-30 "start a new reset" loop.
- Universal links for friend invites.
- Sign in with Apple, as a convenience.
- Raise the Dynamic Type caps and do an AX5 layout pass.

---

## L. Final Release Checklist

**Code (blockers)**
- [ ] P0-1: paywall bypass removed; `hasLocalAppAccess` migrated to false.
- [ ] P0-2: Restore on the paywall and in You.
- [ ] P0-3: account deletion (edge function plus UI).
- [ ] P0-4: Terms, Privacy and auto-renew disclosure on the paywall and in You.
- [ ] P0-6: localized pricing; no hard-coded prices on native.
- [ ] P1-1 to P1-8 done, or explicitly deferred with a reason.
- [ ] `npm run typecheck`, `npm run lint` and `npm test` all green. (They're green today.)

**Configuration**
- [ ] `eas.json` with a production profile and the `EXPO_PUBLIC_*` secrets in the EAS environment.
- [ ] Bundle ID `com.gentlyreset.app` registered; App Store Connect app created; `ascAppId` set.
- [ ] Icon (`assets/expo.icon`) and splash (`#FFF8EA`) verified on device.
- [ ] Version `1.0.0` with an auto-incremented `buildNumber`.
- [ ] Privacy manifest collected-data types declared.

**RevenueCat and App Store Connect**
- [ ] Products for monthly and yearly created, with no introductory offer.
- [ ] Entitlement `gentlyreset_ios_app_pro` attached to both.
- [ ] Offering `default` with `$rc_monthly` and `$rc_annual`.
- [ ] Production iOS public SDK key in the EAS environment.
- [ ] Paid Applications agreement, tax and banking complete.
- [ ] Privacy policy URL, support URL and EULA set in App Store Connect.

**Supabase**
- [ ] All eight migrations applied to production.
- [ ] Email confirmation and redirect URLs configured.
- [ ] `delete-account` function deployed.

**Device QA (NEEDS DEVICE TESTING)**
- [ ] Sandbox: buy monthly, buy yearly, cancel, failure, restore, reinstall plus restore, expiry (accelerated renewals), account switch.
- [ ] Fresh install, then onboarding, paywall, purchase and Home.
- [ ] Returning user: sign in from Welcome and from the paywall; progress restored.
- [ ] Day rollover across midnight, a missed day, day 30, airplane mode, and kill-and-relaunch.
- [ ] Journey celebration, video alpha, blur and haptics on iPhone SE, 11 and 15/16.
- [ ] VoiceOver pass: onboarding, paywall, day sheet, journal.
- [ ] Reduced Motion on: no blur or confetti; flows still complete.
- [ ] Memory and FPS in Instruments on an A12/A13 device.

**TestFlight**
- [ ] Internal build uploaded, smoke-tested, with no crashes over 48 hours.
- [ ] Review notes include a demo account and mention that the paywall can be restored.
