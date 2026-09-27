export type OnboardingShiftDirection = 'forward' | 'back';

type OnboardingShiftHandler = (direction: OnboardingShiftDirection, commit: () => void) => void;

let shiftHandler: OnboardingShiftHandler | null = null;
let shiftBusy = false;

export function registerOnboardingPageShift(handler: OnboardingShiftHandler | null) {
  shiftHandler = handler;
}

export function releaseOnboardingPageShift() {
  shiftBusy = false;
}

export function runOnboardingPageShift(direction: OnboardingShiftDirection, commit: () => void) {
  if (shiftBusy) {
    return;
  }

  if (!shiftHandler) {
    commit();
    return;
  }

  shiftBusy = true;
  shiftHandler(direction, () => {
    commit();
    shiftBusy = false;
  });
}
