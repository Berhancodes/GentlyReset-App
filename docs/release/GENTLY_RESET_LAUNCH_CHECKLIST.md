# Gently Reset — Launch Checklist

**As of October 10, 2026, branch `snapshot/before-appllama` @ `9593a69`. Updated October 11 on `feature/home-widgets`: code for P0-1–4, P0-6, P0-7, P1-3 and P1-6 is in; each still needs the device check in its Accept line.** Details and evidence are in `GENTLY_RESET_RELEASE_READINESS.md`.

**Status key**
- ✅ Verified
- ❌ Failing or missing
- 🟡 Needs your action or external verification
- 📱 Needs device testing

---

## P0 — must fix to submit

- [ ] 🟡 **P0-1 Paywall charges before unlocking.** *(Code done Oct 11: RevenueCat purchase; local pass only in dev builds. Needs sandbox test.)*
  - Change: "Unlock" calls `purchasePackage`; `hasLocalAppAccess` is removed from every gate, and old persisted flags are ignored.
  - *Accept:* the app opens only after a sandbox purchase; cancelling stays on the paywall; an expired sandbox subscription relocks.
- [ ] 🟡 **P0-2 Restore Purchases** on the paywall and in You. *(Code done Oct 11. Needs sandbox test.)* The fake onboarding "Restore Purchases" label is removed or wired.
  - *Accept:* a fresh install plus Restore with the sandbox Apple ID unlocks; "nothing to restore" is handled.
- [ ] 🟡 **P0-3 Real localized prices only.** *(Code done Oct 11: store strings and numbers, unavailable state with Try again. Needs non-USD and airplane test.)* No hard-coded `$` or preview prices; there's an unavailable state when the offering fails.
  - *Accept:* a non-USD sandbox storefront shows correct strings; airplane mode shows "prices unavailable" and a disabled button.
- [ ] 🟡 **P0-4 In-app account deletion.** *(Code done Oct 11: migration `20261011120000_create_delete_my_account.sql` must be applied to production Supabase.)* Confirmation, a server-side delete (RPC or Edge Function), sign-out, `Purchases.logOut()`, local wipe, and a note about cancelling the Apple subscription.
  - *Accept:* the deleted account can't sign in, and its rows are gone in Supabase.
- [ ] 🟡 **P0-5 Legal details filled** (operator, contact email, governing law) and **hosted** Privacy and Terms URLs.
  - *Accept:* no `[brackets]` remain in the legal pages; public https links work.
- [ ] 🟡 **P0-6 "Help & support" works** (mailto or the support page). *(Code done Oct 11: opens Mail to `LEGAL_DETAILS.contactEmail`, which needs your real address.)*
  - *Accept:* tapping it opens Mail or the page.
- [ ] 🟡 **P0-7 EAS ready.** *(Oct 11: `eas.json` with preview and production profiles and `usesNonExemptEncryption: false` are in. Still needs `eas init` and the EAS env vars.)*
  - Needs: `eas.json` production profile with autoIncrement, EAS env vars (Supabase URL and anon key, RevenueCat `appl_` key, legal URLs), and `ITSAppUsesNonExemptEncryption: false`.
  - *Accept:* `eas build -p ios --profile production` succeeds and the build appears in TestFlight.
- [ ] 🟡 **P0-8 Store setup complete.** App Store Connect subscriptions (monthly and annual, one group, **no intro offer**), Paid Apps agreement, tax and banking active, RevenueCat products, entitlement `gentlyreset_ios_app_pro`, offering `default` (current) with `$rc_monthly`/`$rc_annual`, server notifications, sandbox tester.
  - *Accept:* the offering loads real products in TestFlight.

## P1 — strongly recommended before launch

- [ ] ❌ **P1-1 Journal entries are never overwritten across missed days.** Key by calendar date, with a cloud migration to `(cycle_id, calendar_date)`.
  - *Accept:* write on day N, skip a day, write again: both entries survive, locally and after reinstall plus restore.
- [ ] ❌ **P1-2 A returning user who signs in gets their progress back without re-onboarding.**
  - *Accept:* delete the app, reinstall, sign in: the app lands on Home with the right day, streak and journal.
- [x] ✅ **P1-3 Sign-out is safe.** *(Oct 11: hidden without an account, asks first, wipes the device.)* Hidden when not signed in, confirmation required, no silent loss of unsynced data.
  - *Accept:* tapping it asks first; anonymous users don't see it.
- [ ] ❌ **P1-4 "Forgot password?"** works through Supabase email reset.
- [ ] 🟡 **P1-5 Email confirmation:** either disable it in Supabase or show a "check your inbox" state.
- [x] ✅ **P1-6 "Manage subscription"** link in You. *(Oct 11)*
- [ ] 🟡 **P1-7 `npx expo install --fix`** (9 Expo patch versions), then full retest. Needs your approval.
- [ ] 📱 **P1-8 Offline launch keeps a paying user in.** Verify first; fix only if it fails.
- [ ] 🟡 **P1-9 Release branch merged to `main`**, or the build comes from the branch. Homepage stars are committed or dropped.

## Already passing ✅

- ✅ `npm run typecheck`, `npm run lint`, `npm test` (41 suites, 3,937 assertions), `npx expo config`
- ✅ RLS on all 7 tables; owner-only reset and journal; cascade delete from `auth.users`
- ✅ No secrets committed
- ✅ Auto-renew disclosure text and Terms/Privacy links on the paywall
- ✅ Dev-only tools are `__DEV__`-gated
- ✅ Intro offers and trials are blocked in code
- ✅ The progression engine can't skip days (tested)
- ✅ Privacy manifest generated with required-reason APIs

## App Store Connect (outside the code)

| Item | Status |
|---|---|
| Apple Developer Program membership | 🟡 Confirm active |
| App record for `com.gentlyreset.app` (check the old `rork-gentlyreset` prototype didn't claim it) | 🟡 |
| App name "Gently Reset", subtitle (≤30 chars) | 🟡 |
| Description, keywords, promotional text (optional) | 🟡 |
| Category (Health & Fitness or Lifestyle), age rating questionnaire | 🟡 |
| Privacy Policy URL, Support URL, Marketing URL (gentlyreset.com) | 🟡 |
| App Privacy answers: email, user ID, user content (journal, mood), product interaction (progress), purchases. No tracking. | 🟡 |
| Subscriptions: group, monthly and annual, prices, localized names, review screenshot, no intro offer | 🟡 |
| Paid Apps agreement, tax, banking: **Active** | 🟡 |
| Screenshots: 6.9" iPhone set (the required size). iPad not needed (`supportsTablet: false`). | 🟡 |
| App icon (1024) | 🟡 Verify in build |
| App Review contact (name, phone, email) | 🟡 |
| Review notes: hard paywall explained; demo account for World; sandbox purchase works | 🟡 |
| Export compliance (exempt, HTTPS only) | 🟡 Set in config |
| Pricing and availability (countries) | 🟡 |
| TestFlight build uploaded and processed | 🟡 After P0-7 |
| Submit for review (separate from TestFlight) | 🟡 Last step |

## Device QA (none performed yet) 📱

**Install and onboarding**
- [ ] Fresh install, first launch, splash, Welcome animation
- [ ] Complete onboarding. Force-close midway, then reopen and resume at the same step.
- [ ] Paywall on a small iPhone (SE/mini, tight mode) and a large one
- [ ] Sandbox: purchase annual; purchase monthly; cancel the sheet; failure in airplane mode; Ask to Buy (pending)
- [ ] Restore on a fresh install; restore with nothing to restore
- [ ] Land on Home after purchase

**Daily use**
- [ ] Home mascot videos play and tap reactions work (HEVC alpha)
- [ ] Home → Journey → check in → celebration → week strip updates
- [ ] Journal: save, draft survives a force-close, mood slider, history
- [ ] Progress persists after a force-close and a restart
- [ ] Next day (change device date): the day advances after completion; a missed day keeps the day and resets the streak
- [ ] Missed day plus journal: both entries survive (after P1-1)
- [ ] Day 30 reached: ending screen and behavior

**Account and reliability**
- [ ] Sign up, sign in, sign out (confirmation), password reset, email confirmation path
- [ ] Delete account end-to-end
- [ ] Reinstall plus sign in: progress and journal restore without onboarding (after P1-2)
- [ ] Airplane mode at launch for a paying user
- [ ] Slow network (Network Link Conditioner)
- [ ] Session expiry (sign in, wait or revoke, reopen)
- [ ] Midnight rollover while the app is open
- [ ] Sandbox subscription expiry relocks the app

**Devices and accessibility**
- [ ] iPhone SE / mini
- [ ] iPhone XR or 11 (video decoding, memory, GIFs)
- [ ] Current iPhone
- [ ] Dynamic Type at the largest size: no clipped primary actions
- [ ] VoiceOver: onboarding, paywall (radio plans, links), Journey sheet, Journal
- [ ] Reduce Motion: animations calm down

**Performance**
- [ ] Cold start time is acceptable (under about 2 s to the first screen)
- [ ] No frame drops in the Journey garden or celebration
- [ ] Memory is stable through onboarding GIFs and Home videos
- [ ] No crashes across a full run (check the TestFlight crash logs)

## Do not touch before launch

- The reset engine and rollover (`src/features/reset/utils/*`, `src/application/*`)
- The visual design, animations and artwork
- RLS policies, except for adding deletion support
- Dependency majors (Expo patch updates only)
