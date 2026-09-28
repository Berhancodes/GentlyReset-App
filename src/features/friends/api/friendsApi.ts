import { isSupabaseConfigured, supabase } from '@/features/auth/supabase/client';

import { friendsErrorMessage } from './mapFriendsError';
import type {
  FriendActionResult,
  FriendListItem,
  FriendRequestItem,
  FriendsHome,
  InviteResolution,
  PublicFriendIdentity,
} from '../types';
import { normalizeUsername } from '../username';

type JsonResult = {
  ok?: boolean;
  code?: string;
  friendship_id?: string;
  status?: 'pending' | 'accepted' | 'declined';
  username?: string;
  token?: string;
  user_id?: string;
  display_name?: string | null;
  avatar_url?: string | null;
};

function unconfigured(): FriendActionResult {
  return {
    ok: false,
    code: 'unauthenticated',
    message: friendsErrorMessage('unauthenticated'),
  };
}

function asAction(result: JsonResult | null): FriendActionResult {
  const code = (result?.code ?? 'conflict') as FriendActionResult['code'];
  if (result?.ok) {
    return {
      ok: true,
      code,
      friendshipId: result.friendship_id,
      status: result.status,
      username: result.username,
      token: result.token,
    };
  }
  return {
    ok: false,
    code,
    message: friendsErrorMessage(code),
  };
}

function identityFromRow(row: {
  user_id?: string;
  friend_user_id?: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
}): PublicFriendIdentity {
  return {
    userId: row.user_id ?? row.friend_user_id ?? '',
    username: row.username ?? null,
    displayName: row.display_name ?? null,
    avatarUrl: row.avatar_url ?? null,
  };
}

export async function fetchOwnSocialProfile(
  userId: string,
): Promise<{ username: string | null; displayName: string | null; avatarUrl: string | null }> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return { username: null, displayName: null, avatarUrl: null };
  }

  const { data } = await client
    .from('profiles')
    .select('username, display_name, avatar_url')
    .eq('id', userId)
    .maybeSingle();

  return {
    username: typeof data?.username === 'string' ? data.username : null,
    displayName: typeof data?.display_name === 'string' ? data.display_name : null,
    avatarUrl: typeof data?.avatar_url === 'string' ? data.avatar_url : null,
  };
}

export async function fetchFriendsHome(userId: string): Promise<FriendsHome> {
  const client = supabase;
  const own = await fetchOwnSocialProfile(userId);
  if (!client || !isSupabaseConfigured) {
    return { ...own, friends: [], incoming: [], outgoing: [] };
  }

  const [friendsResult, incomingResult, outgoingResult] = await Promise.all([
    client.rpc('list_friends'),
    client.rpc('list_incoming_friend_requests'),
    client.rpc('list_outgoing_friend_requests'),
  ]);

  const friends: FriendListItem[] = (friendsResult.data ?? []).map(
    (row: {
      friendship_id: string;
      friend_user_id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
      accepted_at: string | null;
    }) => ({
      friendshipId: row.friendship_id,
      acceptedAt: row.accepted_at,
      ...identityFromRow(row),
      userId: row.friend_user_id,
    }),
  );

  const mapRequest = (row: {
    friendship_id: string;
    user_id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string | null;
  }): FriendRequestItem => ({
    friendshipId: row.friendship_id,
    createdAt: row.created_at,
    ...identityFromRow(row),
  });

  return {
    ...own,
    friends,
    incoming: (incomingResult.data ?? []).map(mapRequest),
    outgoing: (outgoingResult.data ?? []).map(mapRequest),
  };
}

export async function claimUsername(desiredUsername: string): Promise<FriendActionResult> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return unconfigured();
  }

  const normalized = normalizeUsername(desiredUsername);
  if (!normalized.ok) {
    return {
      ok: false,
      code: 'invalid_username',
      message: friendsErrorMessage('invalid_username'),
    };
  }

  const { data, error } = await client.rpc('claim_username', {
    desired_username: normalized.username,
  });
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }
  return asAction((data ?? null) as JsonResult | null);
}

export async function searchUserByUsername(
  rawUsername: string,
): Promise<{ ok: true; identity: PublicFriendIdentity | null } | { ok: false; message: string }> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return { ok: false, message: friendsErrorMessage('unauthenticated') };
  }

  const normalized = normalizeUsername(rawUsername);
  if (!normalized.ok) {
    return { ok: false, message: friendsErrorMessage('invalid_username') };
  }

  const { data, error } = await client.rpc('search_user_by_username', {
    target_username: normalized.username,
  });
  if (error) {
    return { ok: false, message: friendsErrorMessage('conflict') };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return { ok: true, identity: null };
  }

  return {
    ok: true,
    identity: identityFromRow(row as { user_id: string; username: string | null }),
  };
}

export async function sendFriendRequest(targetUserId: string): Promise<FriendActionResult> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return unconfigured();
  }
  const { data, error } = await client.rpc('send_friend_request', {
    target_user_id: targetUserId,
  });
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }
  return asAction((data ?? null) as JsonResult | null);
}

export async function acceptFriendRequest(requestId: string): Promise<FriendActionResult> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return unconfigured();
  }
  const { data, error } = await client.rpc('accept_friend_request', { request_id: requestId });
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }
  return asAction((data ?? null) as JsonResult | null);
}

export async function declineFriendRequest(requestId: string): Promise<FriendActionResult> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return unconfigured();
  }
  const { data, error } = await client.rpc('decline_friend_request', { request_id: requestId });
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }
  return asAction((data ?? null) as JsonResult | null);
}

export async function cancelFriendRequest(requestId: string): Promise<FriendActionResult> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return unconfigured();
  }
  const { data, error } = await client.rpc('cancel_friend_request', { request_id: requestId });
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }
  return asAction((data ?? null) as JsonResult | null);
}

export async function removeFriend(friendshipId: string): Promise<FriendActionResult> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return unconfigured();
  }
  const { data, error } = await client.rpc('remove_friend', { friendship_id: friendshipId });
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }
  return asAction((data ?? null) as JsonResult | null);
}

export async function createFriendInvite(): Promise<FriendActionResult> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return unconfigured();
  }
  const { data, error } = await client.rpc('create_friend_invite');
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }
  return asAction((data ?? null) as JsonResult | null);
}

export async function resolveFriendInvite(token: string): Promise<InviteResolution> {
  const client = supabase;
  if (!client || !isSupabaseConfigured) {
    return { ok: false, code: 'unauthenticated', message: friendsErrorMessage('unauthenticated') };
  }

  const { data, error } = await client.rpc('resolve_friend_invite', {
    invite_token: token,
  });
  if (error) {
    return { ok: false, code: 'conflict', message: friendsErrorMessage('conflict') };
  }

  const result = (data ?? null) as JsonResult | null;
  if (!result?.ok || !result.user_id) {
    const code = (result?.code ?? 'not_found') as FriendActionResult['code'];
    return { ok: false, code, message: friendsErrorMessage(code) };
  }

  return {
    ok: true,
    identity: {
      userId: result.user_id,
      username: result.username ?? null,
      displayName: result.display_name ?? null,
      avatarUrl: result.avatar_url ?? null,
    },
  };
}
