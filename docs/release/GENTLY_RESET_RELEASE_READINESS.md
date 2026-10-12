# Gently Reset — Release Readiness Audit

**Date:** October 10, 2026
**Target:** submit to App Review on October 11, 2026
**Branch:** `snapshot/before-appllama` at `9593a69`
**Scope:** read-only audit. The only files created are the three reports in `docs/release/`.
- No source, schema, dependency or Git changes were made.
- Nothing was installed into the project.
- No purchases or submissions were made.

> **Verdict: NO-GO for October 11.** Treat this as a CONDITIONAL GO once the P0 list is closed (target October 15–17).
>
> The product is strong and the code is healthy: typecheck, lint and all tests pass. The blockers are concentrated in four areas:
> - **Payment:** the paywall unlocks the app without charging.
> - **Compliance:** no Restore Purchases, no account deletion, placeholder legal details, a placeholder support button.
> - **Build:** no `eas.json`, no production keys on this machine.
> - **External setup:** App Store Connect, RevenueCat and agreements can't be inspected from here.
>
> None of these are large. Several depend on your accounts.

### How to read the labels

- **CONFIRMED:** proven from code, with file and line references.
- **NEEDS EXTERNAL VERIFICATION:** depends on App Store Connect, RevenueCat, the Supabase dashboard or credentials, none of which this audit can see.
- **NEEDS DEVICE TESTING:** no iPhone or simulator testing was done in this audit. Earlier visual checks used the Expo **web** preview only.

---

## Phase 0 — Verified project state

| Check | Result |
|---|---|
| Working directory | `/Users/abdulrahmanberhan/Desktop/GentlyReset-App` |
| Remote | `origin https://github.com/Berhancodes/GentlyReset-App.git` |
| Active branch | `snapshot/before-appllama`, in sync with `origin/snapshot/before-appllama` |
| Latest commit | `9593a69` "Fit the paywall on one screen without scrolling." |
| `main` | **3 commits behind** this branch (missing `e1cc62d`, `45ee365`, `9593a69`). The newest app is on `snapshot/before-appllama`, not `main`. |
| Uncommitted | `M src/features/home/screens/HomeScreen.tsx`, `?? src/features/home/components/HomeStars.tsx` (homepage twinkling stars). Nothing else. |
| Deleted files | None |
| Recently implemented | Clean cream redesign, garden Journey and celebration, stats page, World, Journal composer and sack mood, You page, Terms/Privacy pages, paywall that fits one screen, homepage drifting clouds/season/warm wash, stars (uncommitted) |
| Expo / RN | Expo SDK `~57.0.20`, React Native `0.86.3`, React `19.2.3`, `react-native-purchases ^10.10.2`, `@supabase/supabase-js ^2.117.2`, React Compiler on, typed routes on |
| Other copies | `~/Desktop/rork-gentlyreset`: an **older, separate prototype** (different repo `Berhancodes/rork-gentlyreset`, last changed June 2026, slug `ui-first-app-idea`). **It is not authoritative.** It uses the **same bundle ID `com.gentlyreset.app`**, so check which App Store Connect record (if any) already owns that ID. |
| Previous reports | `GENTLY_RESET_FULL_AUDIT.md` (October 7, score 52/100) and `GENTLY_RESET_COMPETITIVE_PRODUCT_AUDIT.md`. Every finding below was rechecked against current code. |

**Authoritative repository:** `GentlyReset-App` on branch `snapshot/before-appllama`. Merge it into `main`, or release from this branch, before building. Don't build from `main`.

---

## Phase 1 — Feature inventory

Status key: **Verified-web** means it works in the web preview but is untested on device. There is no "Verified on device" status, because nothing was device-tested.

### A. Onboarding

| Item | Status | Notes / files |
|---|---|---|
| Welcome screen (sack set-down) | Verified-web | `src/features/onboarding/screens/WelcomeScreen.tsx`, `stage/welcomeSackFrames.ts`. Tap to skip; skipped for screen-reader users on native. |
| Mascot intro and name | Verified-web | `MascotRunIntroScreen.tsx`, `MascotNameField.tsx` |
| Questionnaire (data-driven) | Verified-web | `src/features/onboarding/data/onboardingSteps.ts` (25 steps), `OnboardingRenderer` |
| Answer persistence | Implemented and tested | `useOnboardingStore.ts` persisted with migrations (`migrateOnboardingPersist.ts`, unit-tested) |
| Story and intermission screens, loading | Verified-web | `LoadingStageRow.tsx` and stage components |
| Reset-type classification | Implemented and tested | Deterministic engine, 9 types, unit tests pass |
| Reset reveal | Verified-web | Per-type illustrations |
| Plan preview | Verified-web | |
| Paywall handoff | **Broken (payment)** | `finishOnboarding.ts:11` then the access gate sends the user to the paywall. Correct up to there, but the paywall itself doesn't charge (Phase 2). |
| On real iPhone | **NEEDS DEVICE TESTING** | Video (`expo-video`, HEVC alpha), haptics, keyboard on "finish this sentence", small-screen layout |

**Launch risk:** medium. The flow is complete, but it has never been run end-to-end on a device with StoreKit.

### B. Home

| Item | Status | Notes |
|---|---|---|
| Dynamic greeting, day and progress | Verified-web | `HomeScreen.tsx`, `DayProgressHeader.tsx` |
| Mascot idle and tap reactions | Verified-web, **device unverified** | HEVC-alpha `.mov` videos don't render on web (known), so they need device testing |
| Speech bubbles | Verified-web | |
| Background (sun, clouds, season drift, warm wash, stars) | Verified-web | Stars are **uncommitted** |
| Clear next action | Yes | "how was today?" bubble, and the Journey tab carries the CTA |
| Loading and error states | Local-first, so no network loading on Home. Acceptable. | |

**Launch risk:** low to medium (video decoding and performance on older iPhones).

### C. Journey

| Item | Status | Notes |
|---|---|---|
| Personalized 30-day roadmap | Implemented and tested | `src/features/reset/data/thirtyDayPlan.ts`, selectors tested |
| Task presentation and completion | Verified-web | Garden plus `JourneyGardenSheet.tsx` |
| Persistence, day advance, rollover | Implemented and tested | `src/features/reset/utils/applyDateRollover.ts`. The day advances only after a completed day, so users **cannot skip ahead or corrupt progression**. |
| Missed days and streak | Implemented and tested | Streak resets when yesterday was missed (`applyDateRollover.ts:31-33`) |
| Seasonal scenes, mascot, celebration | Verified-web | `JourneyConfetti.tsx`, celebration |
| Milestones and Day 30 | Implemented, **not verified end-to-end** | Day 30 stays on day 30 (`applyDateRollover.ts:35-49`). The Day-30 ending experience wasn't exercised in this audit. |
| Dev-only reset | Safe | Long-press reset is `__DEV__`-gated (`JourneyScreen.tsx:206,271`), so it's stripped from release builds |

**Launch risk:** low.

### D. Journal

| Item | Status | Notes |
|---|---|---|
| Create and save entry | Verified-web | `ReflectScreen.tsx`, `JournalTodayComposer.tsx` |
| Draft persistence | Implemented | `useJournalDraftStore` |
| Mood (sack slider) | Verified-web | `JournalSackMood.tsx` |
| History | Verified-web | `JournalRecentList.tsx` |
| Edit | Today's entry only (re-saving replaces it) | |
| Delete | **Missing** | There's no UI and no RLS delete policy on `journal_entries` |
| Offline | Local-first | |
| Supabase sync and restore | Implemented, **production unverified** | `src/features/reflect/sync/*`. Pulls (`journalCloudApi.ts:76-88`), merges and upserts. |
| **Overwrite across missed days** | **CONFIRMED, still present** | See P1-1 |

**Launch risk:** **high for data integrity** (silent loss of journal text).

### E. World / Friends

| Item | Status | Notes |
|---|---|---|
| Username creation | Implemented | `choose-username` route, `friendsApi.ts` |
| Friend search / requests / invite tokens | Implemented | Request-based, with invite tokens. No contact discovery (by design). |
| Encouragements (preset) | Implemented | `EncouragementPicker.tsx` |
| Privacy | Good by design | Friends see limited progress via the `list_friend_progress` RPC only. Reset and journal RLS are owner-only. |
| Empty states | Verified-web | `WorldStarting` |
| Requires auth | Yes | |
| Against production Supabase | **NEEDS EXTERNAL VERIFICATION** | There's no `.env` on this machine, so it can't be exercised here. Migrations must be applied to the production project. |

**Launch risk:** medium. It's untested against production, and it's a reason App Review will create an account.

### F. You / Profile

| Item | Status | Notes |
|---|---|---|
| Reset type card, progress, answers | Verified-web | `ProfileScreen.tsx`, `ResetTypeCard.tsx`, `ProfileSummaryCards.tsx` |
| Username row | Implemented | |
| **Help & support** | **Placeholder** | `ProfileScreen.tsx:108-113` shows "this part of Gently Reset is coming later." |
| Terms / Privacy | Implemented | In-app pages exist, but the **operator, contact email and governing law are placeholders** (`src/features/legal/data/legalDetails.ts:9,11,13`) |
| **Subscription management** | **Missing** | There's no "Manage subscription" link |
| **Restore purchases** | **Missing** | Nowhere in the app |
| Sign out | **Risky** | `ProfileScreen.tsx:115-143`: always shown, no confirmation, and it **wipes all local progress** (`useOnboardingStore.ts:94-98` → `clearReset()`), even for a user who never signed in |
| **Account deletion** | **Missing** | Nothing in `src/`, `app/` or `supabase/` |

**Launch risk:** **high** (compliance).

---

## Phase 2 — RevenueCat and paywall

### Configuration (from code)

| Item | Value / status |
|---|---|
| SDK init | `SubscriptionProvider.tsx:62-117`: `Purchases.configure({ apiKey })` using `EXPO_PUBLIC_REVENUECAT_API_KEY` |
| Key on this machine | **Not set.** There's no `.env`. `.env.example` says production keys start with `appl_`. |
| Entitlement | `gentlyreset_ios_app_pro` (`src/features/subscription/constants.ts`) |
| Offering | `default` (current offering, then `all.default`) |
| Packages | `$rc_monthly`, `$rc_annual` |
| Identity | `Purchases.logIn(user.id)` on sign-in and `logOut()` on sign-out (`SubscriptionProvider.tsx:119-158`) |
| Trial guard | Blocks purchase if a package has an intro offer (`SubscriptionProvider.tsx:182-189`). The paywall hides plans if one appears (`HardPaywallScreen.tsx:163-166`). |
| Error mapping | `mapPurchaseError.ts` (cancellation is not treated as an error, unit-tested) |

### Critical: paywall bypass — CONFIRMED, now committed

```
src/features/subscription/screens/HardPaywallScreen.tsx:87-95
  const beginUnlock = () => {
    ...
    grantLocalAppAccess();                       // persisted flag
    router.replace('/(app)/(tabs)/home');        // no purchase
  };
```

- `grantLocalAppAccess` sets `hasLocalAppAccess: true`, which is persisted (`useOnboardingStore.ts:93,111`).
- The flag counts as "Pro" in:
  - `app/_layout.tsx:36-37,75-79` (`canEnterApp = isPro || hasLocalAppAccess`)
  - `src/navigation/getRootHref.ts:19`
  - `SignInScreen.tsx:27,48`
  - `SignUpScreen.tsx:32,40,63`
  - `FriendInviteScreen.tsx:25-26`
- **Every user gets the full app free, forever, by tapping "Unlock".**
- This came from commit `b84dfa9` ("Let Unlock My Reset open home in the web preview") and is now committed in `45ee365`/`9593a69`.
- It also violates the repo rule in `AGENTS.md` ("Never add … skip on the paywall").
- The real purchase path still exists (`useSubscription().purchasePackage`), but the paywall doesn't call it.

### Other paywall defects

1. **No Restore Purchases control** anywhere. `restorePurchases` exists in the provider but no screen calls it.
   - A label in `onboardingSteps.ts:687` reads "Restore Purchases", but `ResultScreen.tsx:80-81` wires it to `goToNext`. In other words, it's a fake button.
2. **Fallback prices are made up.**
   - When the offering doesn't load, the paywall shows hard-coded `$79.99` / `$9.99` / "save 33%" (`buildPaywallPlans.ts:16-19,78-81,86,100`).
   - A real user could see prices that aren't their store prices.
3. **Non-USD formatting is wrong.**
   - `formatDollars` hard-codes `$` (`buildPaywallPlans.ts:32-34`).
   - `parseDollarAmount` strips commas (`:22`), so "79,99 €" parses as 7999 and the monthly equivalent shows "$666.58".
4. **Offline at first launch.** If `configure`/`getCustomerInfo` throws, entitlements become empty (`SubscriptionProvider.tsx:101-105`), so a paying user who is offline could be shown the paywall.
   - RevenueCat normally serves cached CustomerInfo offline. **NEEDS DEVICE TESTING.**
5. **No-trial configuration** is enforced in code only. App Store Connect and RevenueCat must also have no introductory offer. **NEEDS EXTERNAL VERIFICATION.**

### Purchase lifecycle matrix

| Scenario | Expected | Current code | Status |
|---|---|---|---|
| Tap Unlock, no purchase | Stay on paywall until a purchase succeeds | Enters app free | **FAIL** |
| Purchase success | Entitlement active, enter app | Path exists (`purchasePackage` → `isProEntitlementActive`) but isn't wired to the button | **FAIL (unwired)** |
| User cancels | Stay, no error | Mapped as non-error | Pass in code, **device unverified** |
| Purchase fails / network | Gentle error, retry | `mapPurchaseError` | Pass in code, **device unverified** |
| Pending / Ask to Buy | Stay, explain pending | Not handled explicitly | **Unverified** |
| Restore | Button restores entitlement | No button | **FAIL** |
| Reinstall, same Apple ID | Restore regains access | No restore button. Anonymous RC ID changes on reinstall. | **FAIL** |
| Returning paid user, signed in | `logIn(userId)` restores entitlement | Implemented | **Unverified** (needs RC key and sandbox) |
| Expiration | `isPro` false → paywall | Gate uses the live entitlement, but the **bypass flag overrides it** | **FAIL** until the bypass is removed |
| Cancellation (still in period) | Access until expiry | Entitlement-driven | Pass in code |
| Account switch | `logOut` then `logIn`. Entitlement follows the RC alias. | Implemented | **Unverified** |
| Offline launch | Cached entitlement | Possible paywall flash or lock | **NEEDS DEVICE TESTING** |
| Price display | Store-localized | Wrong for non-USD, made up when offering missing | **FAIL** |
| Intro offer present | Blocked | Blocked | Pass |

**External checks only you can do:**
- **App Store Connect:** two auto-renewable subscriptions (monthly and annual) in one group, no introductory offers, localized display names, review screenshot, status "Ready to Submit".
- **Agreements:** Paid Apps agreement, tax and banking all **Active**.
- **RevenueCat:** an iOS app with the `appl_` public key; products imported; entitlement `gentlyreset_ios_app_pro` attached to both products; offering `default` marked **Current** with packages `$rc_monthly` and `$rc_annual`; App Store Server Notifications (V2) configured; the App Store Connect API key / in-app purchase key uploaded.
- **Sandbox:** a sandbox tester on the iPhone.

---

## Phase 3 — Backend and data integrity

| Area | Finding | Status |
|---|---|---|
| Env config | There's no `.env`/`.env.local`. Supabase becomes `null` without keys (`src/features/auth/supabase/client.ts:35-39,54`), so the app runs local-only. **Production URL and anon key must be provided at build time.** | NEEDS EXTERNAL VERIFICATION |
| Auth | Email and password sign-up and sign-in only | Implemented |
| Email verification | No in-app handling. Depends on the Supabase "Confirm email" setting. If it's on, the user is stuck without guidance. | **Unverified / gap** |
| Password reset | **Missing** (no `resetPasswordForEmail` anywhere) | **Gap (P1)** |
| Session restore | AsyncStorage-backed Supabase session | Implemented, device unverified |
| RLS | Enabled on all 7 tables. Reset and journal policies are owner-only for select, insert and update. | PASS |
| Migrations | 8 files in `supabase/migrations/`. It's unknown whether they're applied to production. | NEEDS EXTERNAL VERIFICATION |
| RPCs | Security-definer with pinned `search_path` (per the previous audit and spot checks) | PASS (static) |
| Edge Functions | None | n/a |
| Cascade on user delete | Everything cascades from `auth.users` → `profiles` → all tables | PASS. This makes deletion easy to add. |
| Journal delete | There's no delete policy and no UI | Gap (P2) |

### The seven previously reported risks

| # | Risk | Status now | Evidence |
|---|---|---|---|
| 1 | Returning users forced through onboarding | **STILL PRESENT** | `completeOnboarding()` is only called from `finishOnboarding.ts:11`. Sign-in routes with local `hasCompletedOnboarding` (`SignInScreen.tsx:48`). A fresh install or a signed-out user is sent to onboarding even when cloud progress exists. |
| 2 | Cloud progress not restoring | **Partially addressed** | `decideResetSync` has a `restore` branch (`decideResetSync.ts`), but because of #1 the user re-onboards first. Then `seedFromOnboarding` creates fresh local progress, which may conflict ("ambiguous") instead of restoring. **Needs device and production verification.** |
| 3 | Local/cloud ownership conflicts | **Handled defensively** | Cross-account and ambiguous conflicts pause backup with a message (`decideResetSync.ts`), so nothing is overwritten. That's safe, but users may be confused. |
| 4 | Journal overwrite across missed days | **STILL PRESENT** | `dailyResetActions.ts:73-75` replaces any reflection with the same plan day. A missed day keeps `currentDay` the same (`applyDateRollover.ts:69-77`). The cloud key is `unique (cycle_id, local_day)` (`20260928010000_create_journal_entries.sql:18`). |
| 5 | Missing account deletion | **STILL PRESENT** | No code path |
| 6 | Journal cycle ownership | Owner-only RLS, cycle-scoped rows | PASS |
| 7 | Sign-out clears local progress | **STILL PRESENT** | `ProfileScreen.tsx:115-143` → `resetOnboarding()` → `clearReset()`. No confirmation. Also happens for users who never signed in, so it's **unrecoverable** for them. |

The deterministic reset engine is sound and tested. **Don't refactor it.** The fixes for #1, #4 and #7 sit around it, not inside it.

---

## Phase 4 — App Store compliance

Guideline numbers are from the current App Review Guidelines (<https://developer.apple.com/app-store/review/guidelines/>). Re-read the live text before submitting. This audit can't guarantee approval or rejection; it rates risk.

| Item | Result | Risk / note |
|---|---|---|
| In-app account deletion (5.1.1(v)) | **FAIL** | The app offers account creation. <https://developer.apple.com/support/offering-account-deletion-in-your-app/> |
| Privacy Policy reachable in app | PASS (in-app page, and links on paywall, sign-up and You) | |
| Privacy Policy URL in App Store Connect | **NEEDS EXTERNAL VERIFICATION** | A public https URL is required. `EXPO_PUBLIC_PRIVACY_URL` is empty. |
| Legal content complete | **FAIL** | Operator, contact email and governing law are placeholders (`legalDetails.ts:9,11,13`) |
| Terms of Use (EULA) link (3.1.2) | PASS in app (paywall) / needs a URL in App Store Connect or the standard Apple EULA | |
| App Privacy answers ("nutrition label") | **NEEDS EXTERNAL VERIFICATION** | Collects: email, user ID, user content (journal text, mood), usage (progress), purchases (via RevenueCat). Not used for tracking. <https://developer.apple.com/app-store/app-privacy-details/> |
| Privacy manifest | PASS (generated) | `ios/GentlyReset/PrivacyInfo.xcprivacy` declares UserDefaults, FileTimestamp and SystemBootTime reasons; `NSPrivacyTracking` present. Re-generated at build. <https://developer.apple.com/documentation/bundleresources/privacy-manifest-files> |
| Permission strings | N/A | No camera, photos, contacts, location or notification prompts found |
| Auto-renew disclosure on paywall (3.1.2) | PASS | `HardPaywallScreen.tsx:187-190`: "Auto-renews at {price}/{period} until cancelled…" |
| Price and period shown | **FAIL** | Fallback prices are made up, and non-USD formatting is wrong |
| Restore Purchases (3.1.1) | **FAIL** | Missing |
| Subscription management | Recommended, missing | Add a link to the system subscriptions page |
| Correct entitlement behavior (3.1.1, 2.1) | **FAIL** | The bypass unlocks without IAP. This also defeats the purpose of IAP. |
| Subscription metadata in App Store Connect | NEEDS EXTERNAL VERIFICATION | <https://developer.apple.com/app-store/subscriptions/> |
| No broken or placeholder buttons (2.1) | **FAIL** | "Help & support" says "coming later". The onboarding "Restore Purchases" label is fake (not shown in the current paywall, but it exists in data). |
| No dev tools in production | PASS | `DevStepJumper` and the Journey reset are `__DEV__`-gated |
| Support URL (1.5) | NEEDS EXTERNAL VERIFICATION | |
| Demo access for review (2.1) | NEEDS YOUR ACTION | A hard paywall means you must provide a sandbox-purchasable path and a demo account for World |
| Export compliance | NEEDS ACTION | No `ITSAppUsesNonExemptEncryption` in config, so App Store Connect asks on every build. HTTPS-only means it's exempt. Set `ios.infoPlist.ITSAppUsesNonExemptEncryption: false`. |
| Crashes | Unknown | No device runs. NEEDS DEVICE TESTING. |

---

## Phase 5 — Expo, iOS and EAS readiness

| Item | Finding |
|---|---|
| Expo SDK / RN | 57 / 0.86.3, compatible |
| `npx expo install --check` / `expo-doctor` | **9 patch mismatches**: expo 57.0.20→57.0.27, expo-router 57.0.19→57.0.25, expo-linking, expo-asset, expo-constants, expo-font, expo-haptics, expo-splash-screen, expo-system-ui. All other doctor checks pass. |
| `app.json` | name "Gently Reset", slug `gently-reset`, version `1.0.0`, scheme `gentlyreset`, bundle `com.gentlyreset.app`, portrait, `supportsTablet: false`, light only |
| Build number | Not set in config (the generated `Info.plist` has `CFBundleVersion 1`). Use EAS `autoIncrement` or set `ios.buildNumber`. |
| `eas.json` | **Missing.** No EAS build or submit profiles. |
| Icon | `ios.icon: ./assets/expo.icon` (Icon Composer format) plus `assets/images/icon.png`. Device verification needed. |
| Splash | Configured (`expo-splash-screen`, `#FFF8EA`) |
| Deep links | Scheme `gentlyreset`. Invite route `friend-invite/[token]`. No universal links (fine for v1). |
| Native modules | `react-native-purchases`, `expo-video`, Reanimated 4, Gesture Handler, SVG. All prebuild-compatible. |
| `ios/` folder | Present locally but **gitignored**. EAS regenerates it, so don't hand-edit it. |
| Deployment target | From Expo SDK 57 defaults (check `Podfile.properties.json` at build). Supports iPhone XR/11 and later per SDK. **Verify.** |
| Production env | **Not present locally.** Need `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_REVENUECAT_API_KEY` (appl_), and optionally `EXPO_PUBLIC_TERMS_URL`/`EXPO_PUBLIC_PRIVACY_URL`, as **EAS environment variables**. |
| Secrets in repo | Clean. `git grep` found no service-role, `sk_`, `appl_` or JWT strings. |
| Assets | `assets/` is **124 MB**. The largest are GIFs of 3–6 MB (`hardest-mascot-hang.gif` 5.7 MB, `noticing-mascot-boba.gif` 4.7 MB) and Journey PNGs of about 2.3 MB each. Metro bundles only referenced files, but app size and memory need checking. |

**Code readiness vs account readiness:** the code can be built once `eas.json` and the env vars exist. Whether a TestFlight build can be produced depends on accounts this audit can't see:
- an Apple Developer Program membership
- an App Store Connect record for `com.gentlyreset.app`
- an EAS login and project link
- signing credentials, which EAS can create

---

## Phase 6 — Validation results

| Command | Result | Output | Notes |
|---|---|---|---|
| `npm run typecheck` | **PASS** | exit 0 | |
| `npm run lint` | **PASS** | exit 0 | |
| `npm test` (includes architecture and isolation checks) | **PASS** | exit 0; 41 suites report "checks passed"; 3,937 `ok` assertions | |
| `npx expo config --type public` | **PASS** | resolves | |
| `npx expo install --check` | **FAIL** (non-blocking) | 9 patch versions behind | Fix with `npx expo install --fix` (approval needed) |
| `npx expo-doctor@latest` | **1 check failed** | Only the version check | Same fix |
| Secret scan (`git grep`) | **PASS** | No matches | |
| EAS production build | **BLOCKED** | No `eas.json`, no credentials or env | Not attempted (paid / account-bound) |
| Device or simulator run | **BLOCKED / not performed** | | Needs your iPhone or simulator session |

---

## Phase 7 — Device QA

Nothing below has been tested on a device yet. The full checklist with pass boxes is in `GENTLY_RESET_LAUNCH_CHECKLIST.md`, section "Device QA". The areas that need the most attention:

- **StoreKit sandbox:**
  - purchase monthly and annual
  - cancel the sheet
  - fail with airplane mode
  - Ask to Buy
  - restore on a fresh install
  - expiry (sandbox renews quickly)
- **Returning user:** delete the app, reinstall, sign in. Do progress and journal come back without re-onboarding?
- **Midnight rollover, and missed days** (set the device date forward), including the journal on a missed day.
- **HEVC-alpha mascot videos** on an iPhone XR/11 (decoding and memory), plus the large GIFs during onboarding.
- **iPhone SE/mini layout:** the paywall's tight mode and the onboarding stage.
- **Accessibility:** VoiceOver through onboarding, the paywall (radio plans, legal links) and the Journey sheet. Dynamic Type at the largest size. Reduced Motion.

---

## Phase 8 — Product quality (release mode)

- **First impression:** strong. The sack set-down welcome, consistent cream and cocoa styling, and a mascot with real personality.
- **Value proposition:** clear, now framed as a life-long practice ("keep growing") rather than "30 days".
- **Paywall credibility:**
  - Good layout, benefits and disclosure.
  - But it **must charge and restore correctly**, and it **must show real localized prices or a clear "loading prices" state**.
  - A paywall that unlocks for free is also a terrible business outcome: zero revenue.
- **Daily action clarity:** good (Home bubble, then Journey "Check in for today").
- **Journal:** delightful sack mood. Needs the overwrite fix so it can be trusted.
- **Day 30 ending:** not exercised in this audit, so verify it on device by simulating dates.
- **Recommendation:** **no redesigns.** Ship the current look.

**Defer until after launch:** dark mode (it was tried and removed), Cycle 2/3, journal photos, journal delete, more Journey content, extra animations, social expansions, dependency majors, and trimming the asset weight.

---

## Phase 9 — App Store Connect (outside the codebase)

See the checklist file for each item and its status. In short, everything is **NEEDS YOUR ACTION** or **UNVERIFIED** except where code supplies it (in-app legal pages, paywall disclosure).

Note the difference between three separate milestones:
1. **Uploading to TestFlight:** build processing plus beta review for external testers.
2. **Submitting for App Review.**
3. **Releasing publicly** after approval.

---

## Phase 10 — Prioritized findings

### P0 — must fix to submit

| ID | Problem | Evidence | Impact | Fix | Effort (estimate) | Verify |
|---|---|---|---|---|---|---|
| P0-1 | Paywall unlocks without purchase | `HardPaywallScreen.tsx:87-95`; flag honored at `app/_layout.tsx:37`, `getRootHref.ts:19`, `SignInScreen.tsx:48`, `SignUpScreen.tsx:40,63`, `FriendInviteScreen.tsx:26`; persisted at `useOnboardingStore.ts:93,111` | No revenue; IAP bypass; rejection risk | Make "Unlock" call `purchasePackage(selected)` with busy, cancel and error states; enter the app only on an active entitlement. Remove `hasLocalAppAccess` from all gates and add a persist migration that drops the flag. Keep a web-preview unlock only behind `__DEV__` or the web platform if you still need it. | 3–5 h | Sandbox purchase unlocks; cancel stays; relaunch with expired sandbox shows paywall; old persisted flag ignored |
| P0-2 | No Restore Purchases | No caller of `restorePurchases`; fake label `onboardingSteps.ts:687` → `ResultScreen.tsx:80-81` | Guideline 3.1.1; reinstall lockout | Add "Restore purchases" on the paywall (small link) and in You. Show the results "restored" / "nothing to restore" / error. Remove or wire the fake onboarding label. | 1.5–2 h | Fresh install plus restore with the sandbox Apple ID unlocks |
| P0-3 | Paywall prices made up or wrong outside USD | `buildPaywallPlans.ts:16-19,22,32-34,78-81,86,100` | Misleading prices (3.1.2, 2.3) | Use only store `priceString`. Compute the monthly equivalent with RevenueCat's `product.pricePerMonthString`, or hide it. If the offering is missing, show "prices unavailable — try again" and disable the button. Drop the hard-coded savings. | 2–3 h | Sandbox storefront in a € or ¥ country shows correct strings; airplane mode shows the unavailable state |
| P0-4 | No account deletion | No code | 5.1.1(v) | "Delete account" in You, with a confirmation explaining that the Apple subscription must be cancelled separately (link to manage subscriptions). Server side: a security-definer RPC `delete_my_account()` deleting `auth.users` where `id = auth.uid()` (the cascade removes everything), or an Edge Function using the service role (never shipped in the app). Then sign out, run `Purchases.logOut()` and clear local data. | 4–6 h (+ migration review) | Deleted user can't sign in; rows gone in the Supabase table editor |
| P0-5 | Placeholder legal details and no hosted URLs | `legalDetails.ts:9,11,13`; `EXPO_PUBLIC_*_URL` empty | 5.1.1 / 3.1.2 | You provide the operator, email and law. Host the same text at public https URLs (for example on gentlyreset.com, `/privacy` and `/terms`). Set the env vars and the App Store Connect fields. | 1 h code + **your action** | Links open live pages; no brackets remain |
| P0-6 | Placeholder "Help & support" | `ProfileScreen.tsx:108-113` | 2.1 broken feature; 1.5 support | Open `mailto:` the support email, or a support URL (which must exist for App Store Connect anyway) | 0.5 h | Tapping it opens Mail or the page |
| P0-7 | No EAS config or production env | No `eas.json`; no `.env` | Can't build or submit | `eas init`; add `eas.json` with a `production` profile (`autoIncrement`); EAS env vars for Supabase and RevenueCat (`appl_`); `ITSAppUsesNonExemptEncryption: false`. **Your accounts are required.** | 1–2 h + **your action** | `eas build -p ios --profile production` succeeds; build appears in TestFlight |
| P0-8 | External store setup unverified | n/a | Purchases fail in review | App Store Connect subscriptions (no intro offer), agreements, RevenueCat products, entitlement and offering, App Store Server Notifications, sandbox tester | **Your action**, 2–4 h plus Apple processing time | Offering loads real products on TestFlight |

### P1 — strongly recommended before launch

| ID | Problem | Evidence | Fix | Effort | Risk |
|---|---|---|---|---|---|
| P1-1 | Journal text silently overwritten after missed days | `dailyResetActions.ts:73-75`; `applyDateRollover.ts:69-77`; cloud `unique (cycle_id, local_day)` | Key reflections by **calendar date**, not plan day: replace only when `date === today`. Cloud: a new migration changing the unique constraint to `(cycle_id, calendar_date)` and upserting on it. Update merge and tests. **Don't touch rollover.** | 4–6 h | Medium (schema migration; test the merge thoroughly) |
| P1-2 | Returning user re-onboards | `finishOnboarding.ts:11` is the only `completeOnboarding`; `SignInScreen.tsx:48` | After sign-in, fetch the cloud cycle. If it exists, restore the snapshot and mark onboarding complete before routing. Expose "Already have an account? Sign in" at the start of onboarding (it exists on the welcome screen). | 4–6 h | Medium (touches sync flow, not the engine) |
| P1-3 | Sign-out wipes local progress with no confirmation, even when not signed in | `ProfileScreen.tsx:115-143`, `useOnboardingStore.ts:94-98` | Hide "Sign out" when not signed in. Ask for confirmation. Only clear local data after a confirmed cloud backup, or warn that unsynced progress is lost. | 1–2 h | Low |
| P1-4 | No password reset | No `resetPasswordForEmail` | "Forgot password?" on sign-in using Supabase's email reset with an email link to a web page (simplest) | 2–3 h | Low |
| P1-5 | Email-confirmation dead end | No handling | Either disable "Confirm email" in Supabase for v1, or show a "check your inbox" state | 0.5–2 h | Low |
| P1-6 | No "Manage subscription" | n/a | Link to `https://apps.apple.com/account/subscriptions` in You | 0.5 h | Low |
| P1-7 | Expo patch drift (9 packages) | doctor output | `npx expo install --fix` **before** the release-candidate build, then retest | 0.5 h + regression | Low to medium |
| P1-8 | Offline first launch may show paywall to a paying user | `SubscriptionProvider.tsx:101-105` | Verify on device first. If confirmed, fall back to cached CustomerInfo and don't override it with an empty one. | 1–2 h | Low |
| P1-9 | `main` is behind the release branch | Git | Merge `snapshot/before-appllama` into `main` (or release from the branch). Commit or drop the stars. | 0.25 h | Low |

### P2 — safe to defer

- Asset weight (124 MB, large GIFs): convert to video or compressed formats later.
- Journal delete (UI plus RLS policy).
- Pending / Ask-to-Buy messaging.
- Dead code noted in the previous audit.
- Universal links for invites.

### P3 — post-launch

- Dark mode, Cycle 2/3, journal photos, push reminders (currently disallowed by `AGENTS.md`), more Journey content, analytics (disallowed), advanced animation, the social media reels pipeline.

---

## Phase 11 — Launch plan summary

Full plan: `GENTLY_RESET_LAUNCH_PLAN.md`.

| Work | Time |
|---|---|
| P0 code fixes | 12–19 h |
| P1 fixes | 14–22 h |
| External setup (Apple, RevenueCat, Supabase, legal hosting) | Your time, plus Apple-side lead time |
| Agreements (if not already active) | Can take days |
| TestFlight build processing | Usually minutes to an hour |
| Device QA | At least 4–6 h |

**October 11 is not realistic.** The earliest responsible submission is about **October 15–17, 2026**, provided:
- your Apple Developer account, agreements and banking are already active, and
- P0 plus P1-1 to P1-3 are done and pass device QA.

---

## Phase 12 — Go / No-Go

1. **Production-ready share:** about **60%**. The product, design, engine, RLS and tests are ready. Payments, compliance and build plumbing are not.
2. **Valid TestFlight build today?** **No.** There's no `eas.json` and no production env. The code itself compiles cleanly.
3. **Does the paywall charge correctly?** **No.** It unlocks for free (P0-1).
4. **Can a paying user restore access?** **No.** There's no Restore control (P0-2). Signed-in users may recover via `logIn`, but that's unverified.
5. **Can a returning user recover progress?** **Not reliably.** They're forced to re-onboard (P1-2). Cloud restore logic exists but is unverified.
6. **Can users delete their accounts?** **No** (P0-4).
7. **Terms and Privacy satisfied?** **Not yet.** The pages exist, but the details are placeholders and there are no public URLs (P0-5).
8. **Known data-loss bugs?** **Yes.** Journal overwrite on missed days (P1-1), and sign-out wipe without confirmation (P1-3).
9. **Crashes or performance risks?** No crash evidence, but no device testing either. The risks are HEVC-alpha video, large GIFs and memory on older iPhones.
10. **Compliant enough to submit?** **No** (5.1.1(v), 3.1.1, 3.1.2 pricing, 2.1 placeholders).
11. **Exact remaining tasks:** P0-1 to P0-8, then P1-1 to P1-3 (strongly), then device QA, metadata, build and submit.
12. **Estimated engineering hours remaining:** about **26–41 h** (P0 plus P1), **plus** QA and your external setup. This is an estimate.
13. **Your personal actions:**
    - Apple Developer membership and agreements, tax and banking
    - App Store Connect app and subscriptions
    - RevenueCat setup and the `appl_` key
    - production Supabase keys and migrations
    - legal operator, email and law, plus hosting
    - support URL and email
    - screenshots and metadata
    - a demo account for review
    - device testing
14. **Don't touch before launch:**
    - the deterministic reset engine and rollover (`src/features/reset/utils/*`, `src/application/*`)
    - the RLS policies (other than adding deletion support)
    - the visual design and animations
    - dependency majors (patch updates only)
15. **Submit October 11 or delay?** **Delay.** Submitting now would ship a free-unlock paywall with no restore and no account deletion. That's a likely rejection and, if approved, zero revenue.

### Final status: **NO-GO** (for October 11)

This becomes a **CONDITIONAL GO** once P0-1 through P0-8 are complete and a TestFlight build passes the StoreKit sandbox and returning-user tests.
