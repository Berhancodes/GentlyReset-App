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

export function hapticImpact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
): Promise<void> {
  return play(() => Haptics.impactAsync(style));
}

export function hapticSuccess(): Promise<void> {
  return play(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}
