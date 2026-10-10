import { Share } from 'react-native';

import type { ResetProfile } from '@/features/onboarding/types/onboarding';

/** Opens the system share sheet with the person's reset card text. */
export async function shareReset(profile: ResetProfile): Promise<void> {
  try {
    await Share.share({
      message: `${profile.name}\n\n${profile.shareQuote}\n\nGently Reset`,
    });
  } catch {
    // Dismissing or an unavailable share sheet is not an error for the person.
  }
}
