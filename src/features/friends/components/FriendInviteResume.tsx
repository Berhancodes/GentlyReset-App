import { useEffect } from 'react';
import { useRouter, type Href } from 'expo-router';

import {
  buildFriendInvitePath,
  takeFriendInviteToken,
} from '@/features/friends/invite/pendingFriendInvite';

/**
 * After onboarding + Pro, open a preserved invite token.
 * Does not purchase, unlock, or create a friendship.
 */
export function FriendInviteResume() {
  const router = useRouter();

  useEffect(() => {
    const token = takeFriendInviteToken();
    if (!token) {
      return;
    }
    router.push(buildFriendInvitePath(token) as Href);
  }, [router]);

  return null;
}
