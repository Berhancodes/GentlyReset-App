import { Linking } from 'react-native';

import { LEGAL_DETAILS } from '@/features/legal/data/legalDetails';

/** True once a real support address has replaced the placeholder. */
export function hasSupportEmail(): boolean {
  return !LEGAL_DETAILS.contactEmail.startsWith('[');
}

/**
 * Opens a new email to support. Resolves false when there's no mail app to
 * open, so the screen can show the address instead.
 */
export async function openSupportEmail(): Promise<boolean> {
  if (!hasSupportEmail()) {
    return false;
  }
  const subject = encodeURIComponent(`${LEGAL_DETAILS.appName} help`);
  try {
    await Linking.openURL(`mailto:${LEGAL_DETAILS.contactEmail}?subject=${subject}`);
    return true;
  } catch {
    return false;
  }
}
