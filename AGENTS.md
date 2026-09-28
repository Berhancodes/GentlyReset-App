# Gently Reset — agent conventions

Gently Reset is an iOS-first Expo app. Follow these rules when changing this repository.

## TypeScript

1. Use TypeScript strictly. Keep `strict` and `noUncheckedIndexedAccess` enabled.
2. Never introduce `any` without a documented, exceptional reason next to the usage.
3. Prefer discriminated unions over optional fields on a wide interface.
4. Use descriptive names. Do not abbreviate (`btn`, `idx`, `tmp`).

## Architecture

5. Keep Expo Router files in `app/` thin. Routes re-export screens or wire navigation only.
6. Put feature-specific code in `src/features/<feature>/`.
7. Shared generic UI belongs in `src/components/ui/`.
8. Do not put API, backend, or persistence logic inside UI components.
9. Keep onboarding **data** (`src/features/onboarding/data`) separate from **presentation** (`screens`, `components`).
10. Prefer composition over giant configurable components. Keep components focused.
11. Do not create abstractions until there is a real reuse case.
12. Do not refactor unrelated working code while implementing a feature.

## Design

13. Never hardcode colors, spacing, radii, type sizes, or shadows if a token exists in `src/design-system`.
14. Add new tokens instead of scattering new raw values through components.
15. Preserve accessibility: roles, labels, selected/disabled state, Dynamic Type, and 44pt hit targets.

## Dependencies and quality

16. Do not introduce dependencies without a clear reason. Use `npx expo install` for Expo-compatible versions.
17. Run `npm run typecheck` and `npm run lint` after meaningful changes.
18. Supabase Auth, `profiles`, local-first reset backup (`reset_cycles` / `reset_day_completions`), local-first journal backup (`journal_entries`), private request-based friendships (`friendships` / `friend_invite_tokens`), and RevenueCat Pro (`gentlyreset_ios_app_pro`) exist. The hard paywall is the app gate. Do not add shared reset progress, encouragements, DMs, contacts, followers, Cycle 2/3, OpenAI, or analytics unless explicitly requested. Never commit service-role or RevenueCat secret keys. Never add a free trial or skip on the paywall.

## Onboarding

Onboarding is data-driven. Add questions to `ONBOARDING_STEPS`. Do not duplicate screen files per question. If a new step type is needed, extend the `OnboardingStep` union, add a focused screen, and dispatch it from `OnboardingRenderer`.
