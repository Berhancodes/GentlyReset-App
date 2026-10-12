import { Linking } from 'react-native';

/** Apple's own page for the user's subscriptions: change plan or cancel. */
const APPLE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

export async function openManageSubscriptions(): Promise<boolean> {
  try {
    await Linking.openURL(APPLE_SUBSCRIPTIONS_URL);
    return true;
  } catch {
    return false;
  }
}
