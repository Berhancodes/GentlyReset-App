import { unregisterPushToken } from '../api/pushTokensApi';
import { useNotificationStore } from '../store/useNotificationStore';

/**
 * Removes this phone's push token from the server while still signed in, so the
 * next person to use the phone doesn't get someone else's friend notifications.
 * Call before signing out; never throws.
 */
export async function releasePushToken(): Promise<void> {
  const { registeredPush, setRegisteredPush } = useNotificationStore.getState();
  if (!registeredPush) {
    return;
  }
  try {
    await unregisterPushToken(registeredPush.token);
  } catch {
    // Signing out must still work offline; the token is replaced on the next sign-in.
  }
  setRegisteredPush(null);
}
