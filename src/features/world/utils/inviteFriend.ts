import { Platform, Share } from 'react-native';

export const INVITE_MESSAGE =
  "I'm doing a 30-day Gently Reset — one small reset a day. Come reset with me.";

export type InviteResult = 'shared' | 'copied';

export async function inviteFriend(): Promise<InviteResult> {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
    const canShare =
      typeof navigator.share === 'function' &&
      (typeof navigator.canShare !== 'function' || navigator.canShare({ text: INVITE_MESSAGE }));

    if (canShare) {
      await navigator.share({ text: INVITE_MESSAGE });
      return 'shared';
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(INVITE_MESSAGE);
      return 'copied';
    }
  }

  await Share.share({ message: INVITE_MESSAGE });
  return 'shared';
}
