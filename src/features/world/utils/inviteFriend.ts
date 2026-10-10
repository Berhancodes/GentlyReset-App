import { Platform, Share } from 'react-native';

export const INVITE_MESSAGE = "I'm doing Gently Reset — one small reset a day. Come reset with me.";

export type InviteResult = 'shared' | 'copied';

export function buildInviteShareMessage(deepLink?: string): string {
  if (!deepLink) {
    return INVITE_MESSAGE;
  }
  return `${INVITE_MESSAGE}\n\n${deepLink}`;
}

export async function inviteFriend(deepLink?: string): Promise<InviteResult> {
  const message = buildInviteShareMessage(deepLink);

  if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
    const canShare =
      typeof navigator.share === 'function' &&
      (typeof navigator.canShare !== 'function' || navigator.canShare({ text: message }));

    if (canShare) {
      await navigator.share({ text: message });
      return 'shared';
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      return 'copied';
    }
  }

  await Share.share({ message });
  return 'shared';
}
