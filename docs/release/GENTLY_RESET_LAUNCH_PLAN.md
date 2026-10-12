# Gently Reset — Launch Plan

**Prepared:** October 10, 2026
**Original target:** submit October 11
**Realistic target:** submit **October 15–17, 2026**, if your Apple, RevenueCat and Supabase accounts are already set up.

All hours are **estimates**. Payment correctness, data integrity and privacy requirements aren't traded for speed.

## Why not October 11

| Bucket | Size |
|---|---|
| P0 code work | about 12–19 engineering hours |
| P1-1 to P1-3 (data integrity) | another 9–14 h |
| P1-4 to P1-9 (smaller items) | 5–8 h |
| External setup | yours, with possible Apple-side waits |
| Device QA after the fixes | 4–6 h |

**External setup includes:** agreements, subscriptions, RevenueCat, the production Supabase keys and migrations, and legal hosting.

If the Paid Apps agreement or banking isn't already **Active**, subscriptions can't be tested or reviewed until it is. That often takes days.

## Critical path

```
Your accounts ready (Apple agreements + ASC subscriptions + RevenueCat + Supabase prod)
        │
P0-1 real purchase ─┬─ P0-2 restore ─┬─ P0-3 prices
                    │                │
P0-4 delete account ┘   P0-5/6 legal + support
        │
P0-7 eas.json + env  →  TestFlight build  →  Device QA (StoreKit sandbox, returning user)
        │
Metadata + screenshots  →  Submit for review
```

The longest chain is: **your store setup → a working sandbox purchase on TestFlight → QA → submit.**

---

## Stage 1 — Stabilize (day 1, October 11)

| Task | Estimate |
|---|---|
| P0-1 Real purchase flow; remove the `hasLocalAppAccess` gate plus a persist migration | 3–5 h |
| P1-3 Safe sign-out (hide when anonymous, confirm) | 1–2 h |
| P1-1 Journal keyed by calendar date (local + migration + merge + tests) | 4–6 h |
| P1-9 Commit or drop the homepage stars; plan the branch merge | 0.25 h |

- **Needs:** nothing external, except P1-1's migration, which must be applied to production Supabase (you, or with your approval).
- **Parallel:** P1-1 is independent of P0-1.
- **Acceptance:** typecheck, lint and tests pass; new unit tests cover purchase-gate routing and journal date keying.

## Stage 2 — Monetization and compliance (day 2, October 12)

| Task | Estimate |
|---|---|
| P0-2 Restore on paywall and in You; remove the fake onboarding restore label | 1.5–2 h |
| P0-3 Localized prices from the store; unavailable state | 2–3 h |
| P0-4 Account deletion (RPC or Edge Function + UI + local wipe + RevenueCat logOut) | 4–6 h |
| P0-6 Help & support link | 0.5 h |
| P1-6 Manage subscription link | 0.5 h |
| P1-2 Returning-user restore without re-onboarding | 4–6 h |
| P1-4 / P1-5 Password reset; email confirmation decision | 2.5–5 h |

**You, in parallel:**
- **P0-5:** give me the operator name, support email and governing law; publish `/privacy` and `/terms` on gentlyreset.com.
- **P0-8:** in App Store Connect, the subscription group, monthly, annual and no intro offer; agreements active; RevenueCat products, entitlement, offering and the `appl_` key; a sandbox tester.

**Acceptance:** all code P0s are closed; the deletion migration is reviewed by you before it's applied.

## Stage 3 — Production build (day 3, October 13)

| Task | Estimate |
|---|---|
| P1-7 `npx expo install --fix` (with your approval), then full test run | 0.5 h + checks |
| P0-7 `eas init`, `eas.json` (production profile, autoIncrement), EAS env vars, `ITSAppUsesNonExemptEncryption: false` | 1–2 h |
| Merge the release branch into `main` (or tag it) | 0.25 h |
| `eas build -p ios --profile production`, then `eas submit` to TestFlight | build time |

- **Needs:** Apple Developer login, EAS account, production Supabase URL and anon key, RevenueCat `appl_` key.
- **Acceptance:** the build processes in App Store Connect and installs from TestFlight.

## Stage 4 — TestFlight QA (days 3–4, October 13–14)

Run the device QA section of the checklist on at least an **older iPhone (XR or 11)**, a **small iPhone** and a **current iPhone**. These must pass:
- Sandbox purchases (both plans), cancel, failure, restore, expiry relock
- Fresh install plus sign-in restores progress and journal with no re-onboarding
- Account deletion end-to-end
- Missed day plus journal keeps both entries; midnight rollover
- No crashes in the TestFlight logs; videos and GIFs perform on the older iPhone
- VoiceOver through the paywall; largest Dynamic Type keeps the primary buttons usable

Fix only regressions found here (each fix → new build).

## Stage 5 — App Store submission (day 5, October 15, at the earliest)

- **Metadata:** name, subtitle, description, keywords, category, age rating, privacy answers, Privacy/Support/Marketing URLs.
- **Screenshots:** 6.9" iPhone set. Take them from TestFlight on a real device.
- **Subscriptions:** attach both to the version; review screenshot and notes.
- **App Review notes:**
  - It's a hard paywall, so purchase with the sandbox account.
  - Include a demo account (email and password) that has a username and a friend, so World can be reviewed.
- **Export compliance:** exempt. Then **Submit for Review**.

Reminders:
- Review typically takes 1–3 days.
- Approval and release are separate. You can choose manual release.

## What you personally need to do

1. Confirm Apple Developer membership. Get the Paid Apps agreement, tax and banking to **Active** today, since this has the longest lead time.
2. Create the App Store Connect app (`com.gentlyreset.app`) and both subscriptions, with **no introductory offer**.
3. Set up RevenueCat: products, entitlement `gentlyreset_ios_app_pro`, offering `default` with `$rc_monthly`/`$rc_annual`, server notifications, `appl_` key.
4. Gather the production Supabase project URL and anon key. Confirm all 8 migrations are applied, and decide whether email confirmation stays on.
5. Legal: provide the operator name, support email and governing law. Publish the Privacy and Terms pages and a support page or email.
6. Screenshots, description, a demo review account, and device testing time.
7. Approve the specific changes:
   - `expo install --fix`
   - the new journal and deletion migrations
   - the release-branch merge

## Do not touch

- The reset engine and rollover
- The visual design and animations
- RLS beyond deletion support
- Major dependency upgrades
- New features (dark mode, Cycle 2/3, photos, notifications, analytics)

## Decision

- **October 11 submission:** **NO-GO.** The paywall is free-unlock, and restore, account deletion, legal details and the build setup are all missing.
- **Next milestone:** a TestFlight release candidate by about **October 13–14**, then submission about **October 15–17**. That's a **CONDITIONAL GO**, once P0 is complete and the sandbox, restore and returning-user tests pass on device.
