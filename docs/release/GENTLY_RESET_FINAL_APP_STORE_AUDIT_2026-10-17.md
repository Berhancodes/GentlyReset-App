# Gently Reset — Final App Store Submission Readiness Audit

**Date:** October 17, 2026 (read-only audit; nothing in code, database, assets, dependencies or Git was changed)
**Repository:** `/Users/abdulrahmanberhan/Desktop/GentlyReset-App`
**Branch:** `feature/home-widgets` @ `79d181a` · remote `origin` = `github.com/Berhancodes/GentlyReset-App` (pushed, in sync)
**Working tree:** clean
**vs `main`:** 26 commits ahead, 0 behind (`main` stops at `e1cc62d`; nothing has been merged since October 10)
**Stack:** Expo SDK 57 (`expo` 57.0.28), React Native 0.86.3, `react-native-purchases` ^10.10.2, `@supabase/supabase-js` ^2.117.2, `@sentry/react-native` ~7.11.0
**Previous audit:** October 10 on `snapshot/before-appllama` (`docs/release/GENTLY_RESET_RELEASE_READINESS.md`, `…_LAUNCH_CHECKLIST.md`, `…_LAUNCH_PLAN.md`)

---

## Executive summary

**The code base is close to submittable. The app itself is not, yet.**

- Every code-level blocker from October 10 is fixed and verified in code:
  - A real purchase is required to unlock.
  - Restore Purchases and Manage subscription are in.
  - Prices come from the store.
  - Account deletion, legal details, Help & support, password reset, safe sign-out, returning-user restore, and journal-by-date are all in.
- TestFlight builds go out through EAS, and the owner reports that builds 7 and 8 work on an iPhone.
- Validation is green: typecheck, lint, 23 test suites, Expo config, and 17 of 18 expo-doctor checks. The one failure is 6 patch-level Expo packages.

**Submission is blocked by four items, all small and none deep engineering:**
1. **The iOS app icon is still Expo's default placeholder** (`app.json:12` → `./assets/expo.icon`, the blue Expo chevron). Apple rejects placeholder icons, and it would be the public face of the app.
2. **No support page with contact information.** `www.gentlyreset.com/support` redirects to the landing page, and the landing page has no contact details.
3. **App Store Connect listing is not verified complete:** screenshots, description, privacy labels, age rating, review notes, and an EULA/Terms link in the metadata.
4. **The sandbox purchase, restore and delete-account flows have not been tested end-to-end on a device.** These are the three things App Review always exercises.

**Content:** the new Level 1 tasks (180 days) meet the quality bar. **Level 2 has not been redesigned.** Customers only reach it on day 31, and only if they choose "go deeper", so it can follow in an update within the first month.

**Verdict: CONDITIONAL GO.** Fix the icon and the support page, fill in the App Store Connect listing, run the 45-minute sandbox QA below, then submit. The fastest realistic submission is **October 20–21, 2026**.

---

## Phase 1 — What changed since the October 10 audit

20 commits after `f7745d4` (the audit commit), in order:

| Area | Commits | Change |
|---|---|---|
| Purchases | `0c02b09` | Charges through the App Store before unlocking; Restore; Help & support |
| Account | `d571046` | Delete account from the You tab (server RPC) |
| Release config | `2179ae5`, `ed1f73a` | EAS profiles; EAS project linked; preview prices matched to the store |
| Legal | `b7873c4` | Operator, contact and governing law filled in |
| Data integrity | `a3ad29c`, `857d0d9` | Journal keyed by calendar date; journal and day rows only on your own cycle |
| Returning users | `f8a198a` | Sign-in on a new phone restores progress and skips onboarding |
| Auth | `d6bee3e` | Forgot password with an emailed 6-digit code |
| Security | `6be3d4c`, `7f7dd78` | Function grants hardened; rate limits on friend actions |
| Dependencies | `739656a` | Expo SDK 57 patch updates (6 more are now available) |
| Crash reporting | `190e318` | Sentry (release builds only, no PII) |
| Product | `bdd4ff7` | Personalised plans plus 12 seasons after day 30 |
| Product | `4f698ce` | **All 180 Level 1 tasks rewritten** (real-life, self-contained), task time rules, lighter versions, no check-in shortcut, armchair nap, season room previews, Sign in with Apple and Google, username filter and reporting, two release-only crash fixes, about 21 MB of images removed |
| World | `7cb2d17`, `79d181a` | "+" offers find-by-username; username field alignment |

The task-content redesign is documented in `GENTLY_RESET_TASK_CONTENT_REDESIGN.md` and implemented for Level 1 (Phase 4).

---

## Phase 2 — Previous blockers, rechecked against today's code

| # | Oct 10 issue | Status today | Evidence |
|---|---|---|---|
| 1 | Paywall unlocked without purchase | **FIXED** (code) · NEEDS DEVICE TESTING (sandbox) | `canEnterApp.ts:13-15` only opens with `isPro` or (`__DEV__` && preview pass). Every gate uses it: `app/_layout.tsx:43-47, 86-91`, `getRootHref.ts:20-24`, `FriendInviteScreen.tsx:27-30`. `isPro` = RevenueCat entitlement `gentlyreset_ios_app_pro` only (`isProEntitlementActive.ts:9-11`). In release, the paywall shows an error when the store is unreachable (`HardPaywallScreen.tsx:116-123`). |
| 2 | No Restore Purchases | **FIXED** · NEEDS DEVICE TESTING | Paywall "Restore" (`HardPaywallScreen.tsx:305-316`); You → "Restore purchases" (`ProfileScreen.tsx:321`), with an "all set" / "nothing to restore" notice (`:140-150`). |
| 3 | Fake or unlocalized prices | **FIXED** · NEEDS DEVICE TESTING (non-USD) | Store `priceString`s from RevenueCat (`purchasesClient.native.ts:28-46`). Preview prices only in `__DEV__` (`HardPaywallScreen.tsx:73`). "Prices couldn't load" plus Try again state (`:245-260`); the button is disabled when not purchasable in release (`:171`). |
| 4 | No in-app account deletion | **FIXED** · NEEDS DEVICE TESTING | You → Delete account (`ProfileScreen.tsx:173-200`): two-step confirm, an explanation that the subscription is separate, RPC `delete_my_account` (`authApi.ts:96-103`) → `delete from auth.users` with cascade (`migrations/20261011120000…:22`), then a device wipe. The migration is applied live. **Gap:** Sign in with Apple tokens aren't revoked (P1-4). |
| 5 | Legal placeholders | **FIXED** (with one P1) | `legalDetails.ts:9-13`: operator "Gentlyreset", `gentlyreset@gmail.com`, Alberta, updated Oct 16. Public pages return HTTP 200: `www.gentlyreset.com/privacy` and `/terms`. **P1-3:** "Gentlyreset" isn't a legal entity; the seller is the sole proprietor. The file comment still says "placeholders" (stale). |
| 6 | Help & Support placeholder | **FIXED** in app · **STILL MISSING** on the web | `openSupport.ts:16-26` opens Mail to the real address; You → Help & support (`ProfileScreen.tsx:118-127, 326`). There's no `/support` page on the website (P0-2). |
| 7 | EAS production config missing | **FIXED** | `eas.json`: production profile, `autoIncrement`, `appVersionSource: remote`; project ID in `app.json`. 8 `EXPO_PUBLIC_*` variables load on EAS (seen in the build-9 log). Builds 2–9 were produced; builds 4–8 were delivered to TestFlight. |
| 8 | ASC and RevenueCat setup unverified | **PARTIALLY VERIFIED** · NEEDS EXTERNAL VERIFICATION | Confirmed in this project's sessions: ASC subscriptions `gentlyreset.monthly` $9.99 and `gentlyreset.yearly` $59.99; RevenueCat entitlement `gentlyreset_ios_app_pro`, offering `default` with `$rc_monthly`/`$rc_annual` attached to both products (set via API Oct 16); TestFlight builds install. **Unverified:** the Paid Apps agreement was "Processing" when last seen; App Store Server Notifications → RevenueCat; no introductory offer on either product. |
| 9 | Journal overwrites across missed days | **FIXED** · NEEDS DEVICE TESTING | Constraint `unique (cycle_id, calendar_date)` (`migrations/20261011130000…:8-11`), applied live. |
| 10 | Returning users forced through onboarding | **FIXED** · NEEDS DEVICE TESTING | `useFinishSignIn.ts:29` marks onboarding complete after a cloud restore (`f8a198a`). |
| 11 | Sign-out destroyed progress silently | **FIXED** · owner-verified on TestFlight | Only shown with an account; confirm dialog (`ProfileScreen.tsx:202-213`). Release-only crash on sign-out fixed in `4f698ce` (`useMascotAnimation.ts`); owner confirmed on build 5 and later. |
| 12 | No password reset | **FIXED** · NEEDS EXTERNAL VERIFICATION | `ForgotPasswordScreen.tsx`, a 6-digit code (`d6bee3e`). The Supabase "Reset password" email template must contain `{{ .Token }}`, which is unverified. |
| 13 | Email verification incomplete | **RESOLVED BY DECISION** · NEEDS EXTERNAL VERIFICATION | Decision: Confirm email **off** in Supabase. Reported done Oct 16; not re-checked today (the dashboard isn't readable from here). |
| 14 | No Manage Subscription | **FIXED** | You → Manage subscription (`ProfileScreen.tsx:155-164, 316`) → `openManageSubscriptions`, with a Settings fallback. |
| 15 | Physical-device testing incomplete | **PARTIALLY DONE** | Owner-tested on TestFlight: onboarding, paywall screen, sign-out, new tasks, check-in, the nap, add friend (builds 5–8). **Not tested:** a sandbox purchase from a clean Apple ID, restore, expiry, delete account, offline reopen, day 30 → season 2 (see Phase 8). |

---

## Phase 3 — The paying-user experience

**Traced flow:**
1. Install
2. Onboarding (`(onboarding)`, guarded by `!hasCompletedOnboarding`)
3. Plan and promise screens
4. Paywall (`(paywall)`, guarded by `hasCompletedOnboarding && !appOpen`)
5. `purchasePackage` → RevenueCat → StoreKit; the app opens only if the returned entitlement is active (`SubscriptionProvider.tsx:191-201`)
6. Optional "Save your progress" (Apple, Google or email; skippable)
7. Home, Journey, Journal (`(app)`, guarded by `appOpen`)
8. Restart: the RevenueCat SDK cache decides `isPro`
9. Next day: date rollover (unit-tested)

**Critical rule — no purchase means no premium access. Verified in code:**
- No persisted flag can open `(app)` in release; `hasLocalAppAccess` only counts under `__DEV__`.
- Dev console commands are compiled out of release (`registerDevCommands.ts:15`).
- Preview prices and the in-memory web store are web or `__DEV__` only (`purchasesClient.ts`, `HardPaywallScreen.tsx:73, 104-122`).
- Trials or intro offers are refused in code (`SubscriptionProvider.tsx:182-189`).

| Scenario | Status | Notes |
|---|---|---|
| Monthly / annual purchase | NEEDS DEVICE TESTING | Code path correct. StoreKit can't be exercised from this environment. |
| Purchase cancelled | Code OK | `mapPurchaseError` → `cancelled`; no message shown; stays on the paywall. |
| Payment failure | Code OK | Generic "didn't go through" message. |
| **Pending (Ask to Buy / SCA)** | **P2** | RevenueCat's "payment pending" error falls through to the generic failure message; the app unlocks later through the customer-info listener. The wording could confuse. |
| Restore | NEEDS DEVICE TESTING | Paywall and You. |
| Expiry | NEEDS DEVICE TESTING | The listener updates `isPro`; the `(app)` guard drops to the paywall. Test with a sandbox monthly (renews every 5 min, 12 times). |
| Reinstall | NEEDS DEVICE TESTING | Anonymous buyer: Restore. Account holder: sign in → restore. |
| Account switching | Code OK | RevenueCat `logIn(userId)` / `logOut()` follow Supabase auth (`SubscriptionProvider.tsx:119-158`). Sign-out wipes the device. |
| **Offline reopen** | **P1 — NEEDS DEVICE TESTING** | `SubscriptionProvider.tsx:92-105` loads customer info **and** offerings with `Promise.all`. If offerings can't load offline, the `catch` sets an empty entitlement, so **a paying user could see the paywall offline.** Entitlement shouldn't depend on offerings. |
| Paid user signing in on a new phone | NEEDS DEVICE TESTING | Sign-in restores progress (#10); RevenueCat `logIn` brings the entitlement if it was bought while signed in. Anonymous buyers need Restore. |
| Real App Store prices | NEEDS DEVICE TESTING | Owner saw $9.99 / $59.99 in TestFlight on a CAD/USD storefront. Not tested in another currency. |

**The owner's earlier "bypass" report (build 5):** after a crash, reopening landed on Home. That's consistent with an active **sandbox** subscription on the tester's Apple ID, which TestFlight honours, rather than a code bypass. The code has no path to `(app)` without `isPro` in release. Confirm with QA step 1 below.

---

## Phase 4 — The daily-task system

**Level 1: implemented and checked by script.** All six areas have 30 days each. They're generated from the approved proposal, and the tests enforce titles ≤34 characters, steps ≤60, three steps each, and no unfilled `{m}`.

| Level 1 area | Days | Refers back to earlier days | 1–10 ratings | "Write…" steps | Duplicate titles | Time rule (fixed / scales / during) | Lighter versions |
|---|---|---|---|---|---|---|---|
| Mind | 30 | 0 | 0 | 1 | 0 | 14 / 11 / 5 | 9 |
| Energy | 30 | 0 | 0 | 0 | 0 | 17 / 9 / 4 | 26 |
| Habits | 30 | 0 | 0 | 1 | 0 | 18 / 11 / 1 | 6 |
| Confidence | 30 | 0 | 0 | 2 | 0 | 15 / 8 / 7 | 7 |
| Relationships | 30 | 0 | 0 | 1 | 0 | 18 / 7 / 5 | 18 |
| Direction | 30 | 1* | 0 | 4 | 0 | 18 / 11 / 1 | 4 |

\*Direction day 29: "Think back to where your goal was on day 1". It's memory-based, so the app doesn't need stored data. Acceptable.

**Level 1 assessment: ready for customers.**
- Concrete, real-world actions; self-contained; sized by time rule (a 30+ minute user is never told to drink water for 30 minutes).
- No jargon or guilt language; safety notes in the lighter versions where needed.
- Shown in Journey with a title, why, time pill, three ticks, an optional lighter line and a progress line.
- Ticking all three steps is the only way to check in. It updates the streak, sprouts and the Home room, then plays the celebration and the nap (owner-verified on TestFlight; unit-tested).

**Level 2 (the "go deeper" season): NOT redesigned. P1, needed before any customer reaches day 31.**

| Level 2 area | Refers back to days | Ratings | "Write…" steps | Duplicate titles | Time rule |
|---|---|---|---|---|---|
| Mind | 2 | 2 | 18 | 0 | all default (scales to 30) |
| Energy | 6 ("repeat the day 4 session", "compare with day 4/12") | 3 | 15 | 0 | all default |
| Habits | 0 | 0 | 21 | 0 | all default |
| Confidence | 1 | 2 | 27 | 2 ("Goal work session" ×3) | all default |
| Relationships | 2 | 1 | 13 | 0 | all default |
| Direction | 2 | 2 | 29 | 7 ("Goal work session" ×6, "Skill session" ×3) | all default |

Level 2 has exactly the problems the redesign fixed: writing and planning instead of doing, references to day numbers, repeated templates, no time rules and no lighter versions. **Only users who finish 30 days and pick "go deeper" see it.** Picking "next area" gets that area's new Level 1. Earliest exposure is about day 31 after launch, so ship Level 2 in a 1.0.x update within the first four weeks.

---

## Phase 5 — App Store compliance

**Definitely in place (code-verified):**
- **Account deletion:** in-app and server-side (Guideline 5.1.1(v)).
- **Restore Purchases:** on the paywall and in You (3.1.1).
- **Auto-renew disclosure:** price/period and cancel wording next to the button (`HardPaywallScreen.tsx:284`); Terms and Privacy links on the paywall (`:339-350`).
- **Public HTTPS legal pages:** `/privacy` and `/terms`, both HTTP 200.
- **Sign in with Apple** offered next to Google (4.8). Login isn't required to buy or use the app (5.1.1).
- **Manage subscription** link.
- **Encryption:** `ITSAppUsesNonExemptEncryption = false` (`app.json:15`).
- **No runtime permission prompts:** no camera, photos, contacts, location, tracking or notifications in the dependencies or the introspected Info.plist.
- **User-generated content:**
  - Profanity and reserved-name filter enforced by the database.
  - Display names locked.
  - Report a friend (`report_user`).
  - Remove a friend; friendships are request-only; no free text between users (preset encouragements only).

**Definite missing requirements (P0):**
- **Placeholder app icon** (`app.json:12`). This falls under Guideline 2.3 (accurate metadata, including app icons), and the icon is also the first thing users see.
- **Support URL with contact information.** The website has no support page (`/support` redirects to `/`) and the landing page has no contact details (Guideline 1.5).
- **Terms of Use (EULA) link in the App Store metadata.** For auto-renewing subscriptions Apple requires a functional Terms of Use link in the App Description or the custom EULA field, plus the Privacy Policy URL field (3.1.2). It's in the app, but the ASC metadata is unverified.

**Review risks (P1):**
- **Sign in with Apple token revocation:** deleting an account created with Apple doesn't revoke the Apple token through Apple's REST API. Apple asks for this; reviewers rarely test it.
- **Reports aren't acted on yet:** `user_reports` has no review process (0 rows; owner-only via the dashboard). Guideline 1.2 expects timely action. Write down a process: check weekly, act within 24 hours.
- **Blocking:** "Remove friend" ends the connection, but nothing stops the same user sending a new request. A reviewer may expect "block".
- **Hard paywall right after onboarding:** this is allowed. The review notes should say how the reviewer can buy (sandbox) and what they'll see.
- **Website claims "Now on the App Store"** and shows a store badge before launch (`gentle-reset-path/src/pages/Landing.tsx:363`). It's harmless unless the review links there; update the link on launch day.
- **Push entitlement:** `aps-environment` appears in the introspected entitlements, but the app doesn't use push. It's usually harmless.

**Privacy manifest:** generated by Expo from the dependencies (verified Oct 10). Sentry ships its own. No tracking SDKs.

**App Privacy labels the owner must declare in ASC** (none are linked to tracking):
- **Contact info — email:** from the optional account.
- **Identifiers — user ID:** Supabase and RevenueCat app user ID.
- **User content — journal entries and username:** only when signed in, for backup.
- **Purchases:** RevenueCat.
- **Diagnostics — crash data and performance data:** Sentry, not linked to identity.

---

## Phase 6 — Production infrastructure

| Item | Status | Notes |
|---|---|---|
| Bundle ID | ✅ `com.gentlyreset.app` (+ `.ExpoWidgetsTarget`) | App group `group.com.gentlyreset.app`; provisioning works (builds succeed). |
| Version / build | ✅ `1.0.0`; build number managed remotely, now 9 | |
| App icon | ❌ **Expo default** (`assets/expo.icon`; `assets/images/icon.png` is also the Expo chevron) | P0-1. Round-2 icon mockups exist; none has been chosen. |
| Splash | ⚠️ `splash-icon.png` is plain white on cream, so the splash looks blank | P2. |
| Deep links | ✅ `gentlyreset://` scheme (friend invites); Google reversed client-ID scheme added by `app.config.js` | No universal links (fine for 1.0). |
| Supabase | ✅ Project `zpahalcpwhkcgktpsmuv`: 19 migrations applied, RLS on all 9 public tables. Advisor warnings are by design (callable SECURITY DEFINER functions; RLS with no policies on `rate_limit_events`/`user_reports`). | ⚠️ Leaked-password protection is off. ⚠️ Migration `username_blocklist_narrow_pedo` was applied live but has no file in the repo (drift; the repo file was edited to match). ⚠️ Google provider has "Skip nonce checks" on. |
| RevenueCat | ✅ Configured Oct 16 (entitlement, offering, packages, App Store app). | Verify Server Notifications and the shared secret / in-app purchase key. |
| ASC subscription IDs | ✅ `gentlyreset.monthly`, `gentlyreset.yearly` | One group; confirm no intro offer. |
| Signing | ✅ EAS-managed remote credentials | Each build asks for the Apple login (interactive). |
| EAS env (production) | ✅ All 8 `EXPO_PUBLIC_*` values present (names only; values not shown). `SENTRY_AUTH_TOKEN` is an EAS secret. | |
| Crash reporting | ✅ Sentry received the build-2 widget crash, so it works. | "Dropped" events in Sentry are expected trace sampling (`tracesSampleRate: 0.1`). |

**Services that need your action:** App Store Connect (listing, privacy, agreement, review info), RevenueCat (verify notifications), Supabase (email template, leaked-password toggle), the website (support page), and an icon decision.

---

## Phase 7 — Validation results (run today)

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ exit 0 |
| `npm run lint` | ✅ exit 0, no warnings |
| `npm test` (23 suites, including architecture and isolation checks: domain, data, application, reset-sync, journal-sync, friends, world, auth, subscription) | ✅ exit 0, 0 failures (about 5,500 passing assertions) |
| `npx expo config` | ✅ resolves |
| `npx expo install --check` | ⚠️ 6 patch updates: expo 57.0.30, expo-asset 57.0.20, expo-constants 57.0.22, expo-linking 57.0.13, expo-router 57.0.28, expo-widgets 57.0.26 |
| `npx expo-doctor` | ⚠️ 17/18 checks pass. The only failure is the same 6 patch versions. |

Nothing was upgraded. **Recommendation:** don't apply the patches before 1.0 unless a TestFlight bug points at one of them. Builds 5–8 were tested on these exact versions.

---

## Phase 8 — What has really been tested on an iPhone

| Area | Status |
|---|---|
| Fresh install + onboarding | ✅ Owner, TestFlight |
| Paywall shows real prices | ✅ Owner (USD/CAD) |
| **StoreKit sandbox purchase from a clean Apple ID** | ❌ Not tested |
| **Restore on a fresh install** | ❌ Not tested |
| Home mascot animations | ✅ Owner (crash on leave fixed in build 5) |
| Journey tasks, ticking, day completion, nap | ✅ Owner (builds 7–8) |
| Room rewards / season preview | ✅ Owner |
| Journal persistence across missed days | ❌ Not tested on device (unit-tested) |
| Offline reopen as a paying user | ❌ Not tested (P1 code risk) |
| Sign in with Apple / Google / email + progress restore after reinstall | ⚠️ Sign-in reported working; restore-after-reinstall not tested |
| **Delete account** | ❌ Not tested on device |
| Day 30 → season 2 on a device | ❌ Not tested (unit-tested; reachable via dev build) |
| Accessibility (VoiceOver, Dynamic Type) | ❌ Not tested |
| Memory and crashes | ⚠️ Sentry shows no crashes since the build-5 fixes; long-session memory not profiled (large animated GIFs, about 150 MB decoded each) |

### Minimum device QA before submitting (about 45 minutes, on the latest TestFlight build)

1. **Settings → App Store → Sandbox Account:** sign in with a **new** sandbox tester. Delete the app and reinstall.
2. Onboard → paywall → **buy Monthly** → app opens → force-quit → reopen: still unlocked.
3. **Turn on Airplane mode** → force-quit → reopen: still unlocked (checks the P1 offline risk).
4. Delete the app → reinstall → onboard → paywall → **Restore** → unlocks.
5. Wait about 1 hour (sandbox monthly expires after its renewals) or cancel in Settings → Subscriptions → after expiry, the app returns to the paywall.
6. Create an account (Apple) → write a journal entry → **Delete account** → back to onboarding; signing in with Apple again creates a fresh account.
7. Buy **Yearly** on a second sandbox tester; tap cancel in the purchase sheet once (stays on the paywall).

---

## Phase 9 — App Store Connect checklist

| Item | Status |
|---|---|
| Apple Developer membership | ✅ (builds reach TestFlight) |
| Paid Apps agreement, banking, tax (W-8BEN, GST/HST) | ⚠️ Forms submitted Oct 16; the agreement was "Processing". **Verify it's Active.** |
| App record | ✅ Reused the existing record |
| Subscription group and products ($9.99 / $59.99) | ✅ Created · ⚠️ confirm "Ready to Submit" with review screenshots attached (made today) and **no intro offer** |
| RevenueCat entitlement and offering | ✅ |
| App screenshots (6.9"/6.7" required) | ❓ Not seen. Needed. |
| Name and subtitle | ❓ Verify |
| Description and keywords | ❓ Must include the **Terms of Use (EULA) link** |
| Category and age rating (new questionnaire) | ❓ Suggested: Health & Fitness or Lifestyle; mind the user-generated-content and journaling answers |
| Privacy labels | ❓ See Phase 5 |
| Privacy Policy URL / Support URL | Privacy ✅ `https://www.gentlyreset.com/privacy` · Support ❌ needs a page |
| App Review notes and demo account | ❓ Recommended: a demo account with a friend already added, plus a note that purchase uses sandbox |
| Export compliance | ✅ Set in the build (no non-exempt encryption) |
| TestFlight build | ✅ Builds 4–8 delivered; build 9 started today (waiting for Apple login) |
| Production release build | ⏳ Build after the P0 fixes (icon), then choose it for 1.0 |
| Submit for review | ⏳ |

---

## Phase 10 — Launch verdict

### P0 — blocks submission

**P0-1 · Real app icon**
- **Problem:** the iOS icon is Expo's default.
- **Evidence:** `app.json:12` → `assets/expo.icon` (Expo symbol); `assets/images/icon.png` is the Expo chevron.
- **Fix:** pick a round-2 mockup, then export a 1024×1024 PNG with no transparency (or an Icon Composer `.icon`) and point `ios.icon` at it.
- **Effort:** 1–2 hours once chosen.
- **Depends on:** the owner's choice.
- **Accept:** the home-screen icon in TestFlight is the Gently Reset mascot.

**P0-2 · Support URL with contact information**
- **Problem:** there's no support page.
- **Evidence:** the website routes are `/`, `/store`, `/login`, `/privacy`, `/terms`; anything else redirects to `/` (`gentle-reset-path/src/App.tsx:38-44`); the landing page has no contact details.
- **Fix:** a `/support` page with a contact email, an FAQ (restore, cancel, delete account) and response times; publish in Lovable.
- **Effort:** 1 hour.
- **Depends on:** the owner publishing.
- **Accept:** `https://www.gentlyreset.com/support` shows the contact email.

**P0-3 · App Store Connect listing complete**
- **Problem:** metadata unverified.
- **Evidence:** not visible from here.
- **Fix:** screenshots, name, subtitle, description **with a Terms of Use link**, keywords, category, age rating, privacy labels, Support/Privacy URLs, review notes and demo account; confirm the agreement is Active and the subscriptions are Ready to Submit with no intro offer.
- **Effort:** 3–5 hours.
- **Depends on:** P0-2 and the owner.
- **Accept:** ASC shows no missing-information warnings on the 1.0 version page.

**P0-4 · Sandbox purchase, restore and delete account verified on device**
- **Problem:** the three flows App Review always uses haven't been run end-to-end.
- **Evidence:** Phase 8.
- **Fix:** run the 45-minute QA.
- **Effort:** 1 hour.
- **Depends on:** a sandbox tester and a TestFlight build.
- **Accept:** all 7 QA steps pass. Any failure becomes a fix before submitting.

### P1 — fix before real customers depend on it

**P1-1 · Offline entitlement depends on offerings loading**
- **Evidence:** `SubscriptionProvider.tsx:92-105`.
- **Fix:** load customer info separately from offerings, so a failed offering fetch keeps the cached entitlement.
- **Effort:** 30 minutes plus a test.
- **Accept:** QA step 3 passes. *If step 3 passes as-is, this can drop to P2.*

**P1-2 · Level 2 content not redesigned**
- **Evidence:** Phase 4 table.
- **Fix:** rewrite 180 Level 2 days with the Level 1 principles, time rules and lighter versions.
- **Effort:** 1 day.
- **Accept:** the same content checks as Level 1 pass.
- **Timing:** within about 4 weeks of launch.

**P1-3 · Legal operator name**
- **Evidence:** `legalDetails.ts:9` "Gentlyreset".
- **Fix:** use the legal seller name, e.g. "Abdulrahman Nesredin Berhan (Gently Reset)", in the app and on the website; drop the stale "placeholders" comment.
- **Effort:** 15 minutes plus a website publish.

**P1-4 · Revoke Sign in with Apple tokens on account deletion**
- **Fix:** a Supabase Edge Function that calls Apple's `/auth/revoke`, using the Services ID key.
- **Effort:** 2–3 hours plus Apple key setup.

**P1-5 · Moderation process and block**
- **Fix:** a written weekly check of `user_reports`; optionally a "block" that stops new requests from that user.
- **Effort:** a process doc now; about 2 hours to build block.

**P1-6 · Supabase hardening**
- Turn on leaked-password protection.
- Confirm the reset-password email template contains `{{ .Token }}`.
- Confirm "Confirm email" is off.
- Add the missing migration file for `username_blocklist_narrow_pedo` to the repo.
- **Effort:** 30 minutes.

### P2 — safe after launch

- 6 Expo patch updates.
- "Payment pending" message wording.
- Blank-looking splash.
- Unused push entitlement.
- Google "Skip nonce checks".
- Merge `feature/home-widgets` to `main`.
- Website "Now on the App Store" wording until live.
- Memory profiling of the large animated GIFs.
- VoiceOver pass.
- Universal links for invites.

### Answers

1. **Can it be submitted today?** No. The icon is a placeholder, there's no support page, the ASC listing isn't complete, and sandbox purchase/restore/delete haven't been run.
2. **Release readiness verified:** about **75%**. Code and infrastructure are about 90% verified; external listing and device-verified store flows are about 40%.
3. **What remains broken:** the app icon (placeholder) and the support URL (missing). In code, possible offline lock-out for paying users (unconfirmed) and Level 2 content quality.
4. **Untested:** sandbox purchase from a clean ID, restore, expiry, offline reopen, delete account, restore-after-reinstall, journal across missed days, day 30 → season 2, accessibility.
5. **Is RevenueCat production-ready?** Configured: yes. Proven: not until QA steps 2–5 pass. Verify Server Notifications.
6. **Is Supabase production-ready?** Yes for 1.0: schema applied, RLS everywhere, rate limits, deletion RPC. Do the P1-6 toggles.
7. **Is the new task content ready?** Level 1 yes. Level 2 no (P1, about 4 weeks of runway).
8. **Can we produce a TestFlight build?** Yes. Build 9 is running now; it only needs your Apple login in the terminal.
9. **What you need to do:**
   - Choose the icon.
   - Publish a support page.
   - Confirm the Paid Apps agreement is Active.
   - Complete the ASC listing, privacy labels and age rating.
   - Create sandbox testers and run the 45-minute QA.
   - Create a review demo account.
   - Toggle the Supabase settings.
10. **Fastest realistic submission date:** **Tuesday, October 20 – Wednesday, October 21, 2026**. That's icon and support page on day 1, the listing and QA on day 2, the final build and submission on day 3. Review usually takes 1–3 days.
11. **Don't change before launch:**
    - The purchase gate (`canEnterApp`, `SubscriptionProvider`), apart from the P1-1 fix.
    - RevenueCat identifiers.
    - Supabase schema and RLS.
    - The progression and day-rollover engine.
    - Level 1 task content.
    - Navigation guards in `app/_layout.tsx`.
    - The Expo SDK version.
12. **Verdict: CONDITIONAL GO.** Submit as soon as P0-1 to P0-4 are done.

---

## Prioritised submission checklist

- [ ] Choose the icon (round-2 mockups) → generate 1024 → set `ios.icon` (P0-1)
- [ ] Publish `www.gentlyreset.com/support` with contact email and FAQ (P0-2)
- [ ] (Optional, 30 min) Separate entitlement loading from offerings (P1-1); fix legal operator name (P1-3)
- [ ] Build N on TestFlight with the new icon
- [ ] Run the 7-step sandbox QA (P0-4)
- [ ] ASC: agreement Active; subscriptions Ready to Submit, no intro offer, review screenshots attached
- [ ] ASC: screenshots, subtitle, description with Terms link, keywords, category, age rating, privacy labels, Support/Privacy URLs
- [ ] ASC: review notes plus a demo account (with a friend added)
- [ ] Supabase: leaked-password protection on; reset template `{{ .Token }}`; Confirm email off (P1-6)
- [ ] RevenueCat: App Store Server Notifications URL set; in-app purchase key uploaded
- [ ] Select the build → Submit for Review
- [ ] Within 4 weeks of launch: Level 2 redesign (P1-2), Apple token revocation (P1-4), block/moderation (P1-5)
