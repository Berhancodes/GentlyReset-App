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
