import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

async function play(run: () => Promise<void>): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await run();
  } catch {
    // Haptics are best-effort on simulators and unsupported devices.
  }
}

export function hapticSelection(): Promise<void> {
  return play(() => Haptics.selectionAsync());
}

/** Quieter than selection — used when a choice is turned off. */
export function hapticDeselection(): Promise<void> {
  return play(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft));
}

const TYPEWRITER_TICK_GAP_MS = 100;
let lastTypewriterTickAt = 0;

/** Light typewriter tap. Throttled so iOS does not drop back-to-back ticks. */
export function hapticTypewriterTick(): Promise<void> {
  const now = Date.now();
  if (now - lastTypewriterTickAt < TYPEWRITER_TICK_GAP_MS) {
    return Promise.resolve();
  }
  lastTypewriterTickAt = now;

  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12);
    }
    return Promise.resolve();
  }

  return play(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

const EXCITEMENT_TICK_GAP_MS = 70;
let lastExcitementTickAt = 0;
let excitementTickCount = 0;

/** Stronger typewriter rumble for an excited reply. */
export function hapticTypewriterExcitement(): Promise<void> {
  const now = Date.now();
  if (now - lastExcitementTickAt < EXCITEMENT_TICK_GAP_MS) {
    return Promise.resolve();
  }
  lastExcitementTickAt = now;
  excitementTickCount += 1;

  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([16, 18, 24]);
    }
    return Promise.resolve();
  }

  const style =
    excitementTickCount % 2 === 0
      ? Haptics.ImpactFeedbackStyle.Medium
      : Haptics.ImpactFeedbackStyle.Heavy;

  return play(() => Haptics.impactAsync(style));
}

export function hapticImpact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
): Promise<void> {
  return play(() => Haptics.impactAsync(style));
}

export function hapticSuccess(): Promise<void> {
  return play(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Heavy taps for the day-complete moment: a thump, a rumble as the sticker lands, then one per hop landing. */
const CELEBRATION_PATTERN_MS = [0, 350, 430, 510, 590, 670, 740, 1230, 1720] as const;
const CELEBRATION_LANDING_MS = 350;

/**
 * Plays the strong celebration rumble. Returns a cancel function so it stops
 * if the moment ends early.
 */
export function hapticCelebration(): () => void {
  if (Platform.OS === 'web') {
    return () => {};
  }
  const timers = CELEBRATION_PATTERN_MS.map((at) =>
    setTimeout(() => {
      void play(() =>
        at === CELEBRATION_LANDING_MS
          ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
      );
    }, at),
  );
  return () => timers.forEach(clearTimeout);
}

/** How often the hold rumble taps, and when it steps up from light to medium to heavy. */
const HOLD_TICK_MS = 90;
const HOLD_MEDIUM_FROM = 0.35;
const HOLD_HEAVY_FROM = 0.7;

/**
 * A rumble that builds while something is held: light taps that grow to heavy
 * as `readProgress()` (0–1) climbs. Returns a function that stops it.
 */
export function hapticHoldRumble(readProgress: () => number): () => void {
  if (Platform.OS === 'web') {
    return () => {};
  }
  const timer = setInterval(() => {
    const progress = readProgress();
    const style =
      progress >= HOLD_HEAVY_FROM
        ? Haptics.ImpactFeedbackStyle.Heavy
        : progress >= HOLD_MEDIUM_FROM
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light;
    void play(() => Haptics.impactAsync(style));
  }, HOLD_TICK_MS);
  return () => clearInterval(timer);
}

/** The promise-made burst: a success buzz, then rapid heavy and rigid hits that ease off. */
const PROMISE_BURST_MS = [0, 40, 80, 120, 160, 200, 240, 290, 340, 400, 470, 550] as const;

/** The most intense moment in the app: the promise is made. */
export function hapticPromiseMade(): void {
  if (Platform.OS === 'web') {
    return;
  }
  void play(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  PROMISE_BURST_MS.forEach((at, index) => {
    setTimeout(() => {
      void play(() =>
        Haptics.impactAsync(
          index % 2 === 0 ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Rigid,
        ),
      );
    }, at);
  });
}

/** A step ticked off: a firm pop as the confetti bursts, then light taps as it rains down. */
const CONFETTI_SPRINKLE_MS = [70, 140, 220, 310, 420, 540] as const;

export function hapticConfetti(): void {
  if (Platform.OS === 'web') {
    return;
  }
  void play(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  void play(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
  CONFETTI_SPRINKLE_MS.forEach((at, index) => {
    setTimeout(() => {
      void play(() =>
        Haptics.impactAsync(
          index < 2 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
        ),
      );
    }, at);
  });
}
