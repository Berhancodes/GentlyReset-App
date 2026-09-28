export type PublicFriendIdentity = {
  userId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

export type FriendListItem = PublicFriendIdentity & {
  friendshipId: string;
  acceptedAt: string | null;
};

export type FriendRequestItem = PublicFriendIdentity & {
  friendshipId: string;
  createdAt: string | null;
};

export type FriendsHome = {
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  friends: FriendListItem[];
  incoming: FriendRequestItem[];
  outgoing: FriendRequestItem[];
};

export type FriendActionCode =
  | 'sent'
  | 'already_pending'
  | 'already_friends'
  | 'accepted_existing'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'removed'
  | 'self'
  | 'not_found'
  | 'not_allowed'
  | 'not_pending'
  | 'not_friends'
  | 'unauthenticated'
  | 'username_required'
  | 'username_taken'
  | 'invalid_username'
  | 'claimed'
  | 'invalid_token'
  | 'revoked'
  | 'expired'
  | 'resolved'
  | 'created'
  | 'reused'
  | 'conflict';

export type FriendActionResult =
  | {
      ok: true;
      code: FriendActionCode;
      friendshipId?: string;
      status?: 'pending' | 'accepted' | 'declined';
      username?: string;
      token?: string;
    }
  | { ok: false; code: FriendActionCode; message: string };

export type InviteResolution =
  | { ok: true; identity: PublicFriendIdentity }
  | { ok: false; code: FriendActionCode; message: string };

export const PUBLIC_FRIEND_FIELDS = ['userId', 'username', 'displayName', 'avatarUrl'] as const;

export const PRIVATE_PROFILE_FIELDS = [
  'timezone',
  'onboarding_completed_at',
  'email',
  'resetTypeId',
  'personalization',
  'journal',
  'body',
  'mood',
  'prompt',
] as const;
