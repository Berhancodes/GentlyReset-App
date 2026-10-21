# Gently Reset — Launch-Night Audit

**Date:** October 18–19, 2026 · **Scope:** audit only. No code, database, Git history or App Store Connect was changed for this report.
**Legend:** ✅ verified with evidence · ⚠️ partial / needs your confirmation · ❌ not done · 🔍 external, can't be seen from here.

## Verdict: **CONDITIONAL GO**

The code and the build are ready. Submission is gated only by things you do on your phone and in App Store Connect:

1. **Sandbox purchase, restore and delete-account test on build 11** (P0-4, ~40 min). Not done yet, so not production-verified.
2. **App Store Connect listing filled in and Paid Apps agreement Active** (P0-3, ~60–90 min). Can't be seen from this environment.

If both pass tonight, you can click **Submit for Review** tonight. Approval usually takes 1–2 days. That is review time, not something we control.

---

## 1. Current state

| Item | State | Evidence |
|---|---|---|
| Branch | `feature/home-widgets` | `git branch --show-current` |
| Latest commit | `49b7885` Add daily reminders and friend push notifications | `git log` |
| Pushed | ✅ in sync with `origin/feature/home-widgets` (0 ahead / 0 behind) | `git rev-list --left-right --count` |
| Uncommitted | `src/features/subscription/utils/buildPaywallPlans.ts` (development-only placeholder price $79.99 → $59.99; not in any build, not release-relevant) and these two reports + `profit_model.py` | `git status` |
| Release branch | ⚠️ Releases are built from `feature/home-widgets`; `main` is 30 commits behind (stops at `b84dfa9`). Fine for EAS, but merge to `main` after launch (P2). | `git rev-list --count origin/main..HEAD` = 30 |
| Latest EAS builds | **11** FINISHED (`49b7885`, Oct 18 18:24 UTC) · 10 FINISHED (`9525bdb`) · 9 · 8 | `eas build:list` |
| TestFlight | ✅ Build 11 submission scheduled with `--auto-submit`. ✅ A device has installed it and registered a push token (`push_tokens` = 1 row), which proves notifications + sign-in work end to end on a real iPhone. | EAS submission log; Supabase query |
| Release candidate | **Build 11** (has the season rooms, real icon, rating prompt, reminders and friend push) | — |
| Expo config | Gently Reset 1.0.0, `com.gentlyreset.app`, iPhone only, `usesNonExemptEncryption: false`, plugins incl. `expo-notifications`, widgets, Sentry | `app.json` |
| App icon | ✅ `assets/images/app-icon.png` 1024×1024, **no alpha**, referenced by both `expo.icon` and `ios.icon`; in builds 10 and 11 | `sips`, `app.json:7,12` |
| RevenueCat in code | ✅ entitlement `gentlyreset_ios_app_pro`, offering `default`, packages `$rc_monthly` / `$rc_annual`; iOS uses `purchasesClient.native.ts` only | `constants.ts`, file layout |
| Supabase | ✅ project `zpahalcpwhkcgktpsmuv`: 20 migrations live, **0 public tables without RLS** | SQL + `list_migrations` |
| Support page | ✅ **Live**: `www.gentlyreset.com/support` with `gentlyreset@gmail.com`, restore, cancel, delete-account and sign-in help | rendered page text |
| Task content | ✅ Level-1 rewrite (`4f698ce`) and personal plans are in builds 9+ | git history |
| Release-blocking uncommitted changes | ✅ None | — |

## 2. October 17 blockers, rechecked

| # | Blocker | Today | Evidence |
|---|---|---|---|
| P0-1 | Default Expo icon | ✅ **FIXED** | `app-icon.png` 1024², no alpha, in `app.json` (both keys), committed `9525bdb`, built in 10 and 11. Confirm it looks right on your home screen from TestFlight. |
| P0-2 | No public support page | ✅ **FIXED** | `/support` renders full help + contact email. |
| P0-3 | App Store Connect listing | 🔍 **NEEDS EXTERNAL VERIFICATION** | Not visible from here. Screens to check are in §3. New screenshots are ready in `~/Desktop/GentlyReset-AppStore/premium/` (1290×2796). |
| P0-4 | Purchase / restore / delete on device | ❌ **NEEDS DEVICE TESTING** | No record of a sandbox purchase, restore or account deletion on a device. Checklist in §4. |

### Regression check of earlier fixes

| Area | Result | Evidence |
|---|---|---|
| Purchase required to unlock | ✅ | `canEnterApp`: `isPro \|\| (isDevelopmentBuild && hasPreviewAccess)`; release = `isPro` only |
| No production paywall bypass | ✅ | Preview unlock is in `purchasesClient.ts` (web) and behind `__DEV__` in `HardPaywallScreen.tsx:104,118,171`; iOS resolves `purchasesClient.native.ts` |
| Restore Purchases | ✅ code / ❌ device | paywall + You tab; untested on device |
| Localized prices | ✅ | `buildPaywallPlans(packages, { allowPreviewPrices: __DEV__ })`: release shows store prices only. App Store Connect: USD 9.99 / 59.99 (you confirmed); Canada auto-equalized CA$79.99 yearly. |
| Account deletion | ✅ code / ❌ device | `delete_my_account` RPC live; cascades now also remove `push_tokens` |
| Hosted Privacy Policy | ✅ live, updated Oct 16 · ⚠️ **doesn't mention push notifications yet** (the in-app copy does) | rendered `/privacy` |
| Hosted Terms (EULA) | ✅ live, Oct 16, Apple terms included | rendered `/terms` |
| Help & Support | ✅ app → Mail; web `/support` live | — |
| Subscription disclosures | ✅ paywall auto-renew text present (seen in capture) | paywall capture |
| Password reset | ✅ code (6-digit email code) | Oct 17 audit, unchanged |
| Returning-user restore | ✅ code / ❌ device after reinstall | — |
| Journal never silently overwritten | ✅ code (keyed by date, `a3ad29c`) | — |
| Safe sign-out | ✅ confirm dialog; now also releases the push token first | `ProfileScreen.tsx` |
| Sign in with Apple / Google | ✅ code; owner-reported working | — |
| Supabase RLS & migrations | ✅ all live, RLS everywhere · ⚠️ `username_blocklist_narrow_pedo` is live but has no repo file (drift, P2) | `list_migrations` |
| Reporting / moderation | ✅ `report_user` live | migrations |
| Sentry | ✅ enabled in release only (`crashReporting.ts:15`), DSN in EAS env | — |
| EAS build & signing | ✅ certificates and profiles valid to May 2027; push key set up for build 11 | build 10/11 logs |

## 3. Live services

### App Store Connect — 🔍 you must check (I can't see it)

| Screen | What to confirm |
|---|---|
| **Business** (Agreements, Tax, Banking) | **Paid Apps agreement = Active** (was "Processing" Oct 16). Banking and tax forms accepted. *Hard blocker: subscriptions can't be sold otherwise.* |
| **Apps → Gently Reset → App Information** | Name, subtitle "Small daily steps that stick", category Health & Fitness / Lifestyle, age rating questionnaire done, Privacy Policy URL `https://www.gentlyreset.com/privacy` |
| **iOS App 1.0** | Build **11** selected · 6.9" screenshots (use `premium/`) · description (from `store.config.json`, includes the Terms link) · keywords · Support URL `/support` · Marketing URL |
| **App Review Information** | Notes from `GentlyReset-AppStore/app-review-notes.txt`. A demo account isn't required (signing in is optional), but say purchases use sandbox. |
| **Subscriptions** | Both `gentlyreset.monthly` / `gentlyreset.yearly` **Ready to Submit**, a review screenshot each (you have `gentlyreset-*-review.png`), display names, **no introductory offer**, added to version 1.0 |
| **App Privacy** | Data linked to the user: email, user ID, user content (journal), other usage (progress). Crash data (not linked). No tracking. |
| **Export compliance** | Already answered by `usesNonExemptEncryption: false` |

### RevenueCat — ⚠️ code verified, dashboard 🔍

✅ The entitlement, offering and package identifiers in code match what was set up on Oct 16. 🔍 To confirm in the dashboard: the offering `default` is marked **Current**, both products are attached, the **App Store Server Notifications** URL is pasted into App Store Connect, the **In-App Purchase Key** is uploaded, and there's no intro offer. Expiration handling and offline caching are in the SDK. ⚠️ Our provider loads customer info **and** offerings together (`SubscriptionProvider.tsx:92`), so if offerings fail offline a paying user might see the paywall. This is still the open P1-1; QA step 9 tests it.

**Small Business Program:** ❌ **not verified, and not automatic.** Apple's page says you must enroll ("Enroll now", Account Holder), and the 15% starts 15 days after the end of the fiscal month in which you're approved. Until then Apple takes **30%**. Check: Apple Developer account → App Store Small Business Program enrollment status, or the approval email.

### Supabase

| Check | Result |
|---|---|
| Production project connected | ✅ |
| Migrations | ✅ 20 applied (incl. `friend_push_notifications`) |
| RLS | ✅ every public table |
| Auth, reset, deletion RPCs | ✅ present · device-tested: sign-in yes, deletion no |
| Leaked-password protection | ❌ **off** (security advisor WARN). P1. Toggle in Auth → Providers → Email (may need the Pro plan). |
| Advisor warnings | By design: callable SECURITY DEFINER RPCs; RLS-without-policy on server-only tables |

## 4. TestFlight QA status

| # | Scenario | Status |
|---|---|---|
| 1 | Fresh install | PASS (owner, builds 5–8) |
| 2 | Onboarding | PASS (owner) |
| 3 | Buy monthly (sandbox) | **UNTESTED** |
| 4 | Buy annual (sandbox) | **UNTESTED** |
| 5 | Cancel purchase sheet → stays locked | **UNTESTED** |
| 6 | Restore | **UNTESTED** |
| 7 | Reinstall + restore | **UNTESTED** |
| 8 | Sign into existing account | PASS (owner-reported) |
| 9 | Restore cloud progress | **UNTESTED** after reinstall |
| 10 | Offline reopen as subscriber | **UNTESTED** (P1-1 risk) |
| 11 | Daily tasks | PASS (owner) |
| 12 | Streak + room growth | PASS (owner, check-in + nap) · season rooms new in 10/11 |
| 13 | Journal save/restore | UNTESTED on device |
| 14 | Delete account | **UNTESTED** |
| 15 | Access ends after expiry | **UNTESTED** (sandbox monthly renews every 5 min, max 12 times) |
| 16 | Animations | PASS (owner) |
| 17 | No critical crashes | ⚠️ none reported; check Sentry and TestFlight crashes for build 11 |

**Purchase and account deletion are not production-verified.**

### Tonight's iPhone checklist (build 11, ~40 min)

Settings → App Store → **Sandbox Account**: sign in with a sandbox tester (create one in App Store Connect → Users and Access → Sandbox if needed).
1. Delete the app → install build 11 → onboarding → paywall shows **$9.99 / $59.99**.
2. Tap Yearly → **cancel** the Apple sheet → still on the paywall. ✔︎5
3. Buy **Monthly** → Home opens. ✔︎3
4. You → **Restore purchases** → "all set". ✔︎6
5. Check in today's step → nap plays → reminder question appears → Yes. ✔︎11/12
6. Journal: write a line → save → reopen Journal → it's there. ✔︎13
7. **Airplane mode** → force-quit → reopen → still unlocked. ✔︎10
8. Airplane off → You → Save your progress → sign in → delete the app → reinstall → **Sign in** → progress back → paywall → **Restore** → unlocked. ✔︎7/9
9. You → **Delete account** → confirm → back to onboarding. ✔︎14
10. Wait ~1 hour or cancel the sandbox subscription → reopen → paywall returns. ✔︎15
11. Optional: second account sends you encouragement → push arrives.

## 5. Release validation (run Oct 18)

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ PASS |
| `npm run lint` | ✅ PASS (0 warnings) |
| `npm test` | ✅ PASS (all suites) |
| `expo-doctor` | ⚠️ 17/18. Patch mismatches: expo 57.0.28→.30, expo-asset, expo-linking, expo-router, expo-widgets. Not upgraded (launch freeze); P2 |
| Icon references | ✅ |
| Product identifiers | ✅ |
| Development shortcuts | ✅ all behind `__DEV__` (dev commands, step jumper, Journey long-press reset, preview prices/unlock) |
| Unhandled purchase errors | ✅ purchase/restore paths catch and map errors (`mapPurchaseError`) |
| Env vars | ✅ 8 `EXPO_PUBLIC_*` loaded from the EAS production environment (build logs) |
| Unsupported native features | ✅ none found |

## 6. Remaining work

| Task | Pri | Who | Time | Depends on | Blocks submit? |
|---|---|---|---|---|---|
| Confirm Paid Apps agreement Active | P0 | You | 5 min | — | **Yes** |
| iPhone QA checklist (§4) | P0 | You | 40 min | build 11 in TestFlight | **Yes** |
| Fill ASC listing + subscriptions + privacy | P0 | You | 60–90 min | screenshots ✅ | **Yes** |
| Update website privacy policy for push notifications | P1 | Claude drafts, you deploy | 15 min | your OK | Should be done before review (build 11 sends push) |
| Enroll in Small Business Program | P1 | You | 10 min | — | No (affects the 15% vs 30% cut) |
| RevenueCat: Server Notifications + IAP key check | P1 | You | 10 min | — | No, but restore/renewals rely on it |
| Offline entitlement fix (P1-1) if QA step 7 fails | P1 | Claude | 30 min + new build | QA result | Only if step 7 fails |
| Leaked-password protection on | P1 | You | 2 min | — | No |
| Level-2 content (day 31+) | P1 | Claude | days | — | No (needed within 30 days of launch) |
| Sign in with Apple token revocation | P1 | Claude | 2–3 h | — | No |
| Legal operator name (sole proprietor) | P1 | You + Claude | 10 min | — | No |
| Repo: add blocklist migration file; merge to `main`; Expo patches | P2 | Claude | 30 min | — | No |

**In parallel:** QA (your phone) ‖ App Store Connect metadata (laptop) ‖ Claude drafts the privacy-policy update.

## 7. Sequence to "Submit for Review" tonight

1. **Generate build:** ✅ done (EAS build 11).
2. **Upload to TestFlight:** ✅ auto-submitted. Confirm it's "Ready to Test" in TestFlight.
3. Run the §4 checklist on build 11. **Any failure on steps 2–4, 7 or 9 → stop and tell Claude.**
4. Business → confirm the agreement is Active.
5. App Store Connect metadata (§3), select **build 11**, attach both subscriptions.
6. Publish the website privacy update (push notifications).
7. **Submit for Review.** That's submission. Apple then reviews it, usually in 24–48 h (approval). After approval it goes out under the release option you choose (public availability).

**Realistic:** ~2–2.5 hours of your time if QA passes. If the offline test (step 7) fails, the fix plus a new build adds ~1.5 hours.
