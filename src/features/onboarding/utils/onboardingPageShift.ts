import { waitForOnboardingStepAssets } from '@/features/onboarding/utils/preloadOnboardingAssets';

export type OnboardingShiftDirection = 'forward' | 'back';

type OnboardingShiftHandler = (
  direction: OnboardingShiftDirection,
  commit: () => void,
  toIndex?: number,
) => void;

let shiftHandler: OnboardingShiftHandler | null = null;
let shiftBusy = false;

export function registerOnboardingPageShift(handler: OnboardingShiftHandler | null) {
  shiftHandler = handler;
}

export function releaseOnboardingPageShift() {
  shiftBusy = false;
}

function startShift(direction: OnboardingShiftDirection, commit: () => void, toIndex?: number) {
  if (!shiftHandler) {
    commit();
    shiftBusy = false;
    return;
  }

  shiftHandler(direction, commit, toIndex);
}

export function runOnboardingPageShift(
  direction: OnboardingShiftDirection,
  commit: () => void,
  toIndex?: number,
) {
  if (shiftBusy) {
    return;
  }

  shiftBusy = true;

  if (toIndex === undefined) {
    startShift(direction, commit, toIndex);
    return;
  }

  void waitForOnboardingStepAssets(toIndex).then(
    () => {
      startShift(direction, commit, toIndex);
    },
    () => {
      startShift(direction, commit, toIndex);
    },
  );
}
