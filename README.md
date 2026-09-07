# Gently Reset

Gently Reset is a calm, illustrated iOS self-care app. This repository is the **technical foundation**: design tokens, shared UI primitives, Expo Router navigation, and a data-driven onboarding architecture.

Feature work beyond the sample onboarding flow has not started yet.

## Tech stack

- React Native and Expo SDK 57
- TypeScript (strict)
- Expo Router
- Zustand
- React Native Reanimated
- expo-haptics
- ESLint and Prettier

iOS is the primary target. Android and web exist only because Expo supports them.

## Install

```bash
npm install
```

## Run (iOS)

```bash
npm run ios
```

On a Mac with Xcode, that opens the iOS simulator. You can also run `npm start` and open the project in Expo Go / a development build.

```bash
npm run start
npm run web    # Expo web preview only
```

## Quality commands

```bash
npm run typecheck
npm run lint
npm run format
```

## Architecture

```
app/                         # Expo Router entry points — keep these thin
  (onboarding)/              # Sample onboarding flow
  (app)/(tabs)/              # Home, Journey, Reflect, World, Profile

src/
  design-system/             # Semantic color, space, type, radius, shadow tokens
  components/ui/             # Reusable primitives (Screen, AppText, buttons, …)
  features/                  # Feature modules (screens, data, hooks, store)
  navigation/                # Root destination helper (onboarding vs app)
  utils/

assets/
  images/mascot/             # Illustrated mascot art goes here
  images/onboarding/
  icons/
  fonts/                     # Custom fonts; wire them through typography.ts
```

Route files should re-export a screen from `src/features`. UI implementation and business rules do not belong in `app/`.

`src/app` is intentionally unused. Expo Router lives at the repo root so routes stay a thin shell and feature code stays in `src/`.

## Onboarding architecture

Onboarding is a list of typed steps in `src/features/onboarding/data/onboardingSteps.ts`.

`OnboardingStep` is a discriminated union (`welcome`, `singleChoice`, `multiChoice`, `scale`, `textInput`, `story`, `loading`, `result`). Each type has the fields it actually needs.

`OnboardingRenderer` dispatches the current step to a focused screen. `useOnboardingStore` holds the step index and answers only — no presentation.

Adding a question later means appending to the config, not cloning a screen file.

The launch gate lives in `src/navigation/getRootHref.ts` so it can later become:

- onboarding incomplete → onboarding
- onboarding complete, not subscribed → paywall
- subscribed → main tabs

Subscription logic is not implemented yet.

## Design tokens

All visual constants live in `src/design-system`. Components consume semantic names such as `colors.background.primary` and `spacing.lg`. Do not paste hex values into screens.

## Assets

Place production artwork under:

- `assets/images/mascot/`
- `assets/images/onboarding/`
- `assets/icons/`
- `assets/fonts/`

The mascot on screen today is an obvious placeholder (`MascotPlaceholder`), not final art.

## Conventions

See `AGENTS.md` for the rules Cursor and other agents should follow. In short: strict TypeScript, thin routes, feature folders, tokens instead of magic values, and no extra dependencies without a reason.
