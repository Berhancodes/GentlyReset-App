import { PRIVATE_PROFILE_FIELDS, PUBLIC_FRIEND_FIELDS } from './types';

export function publicIdentityKeys(): readonly string[] {
  return PUBLIC_FRIEND_FIELDS;
}

export function exposesPrivateSocialField(payload: Record<string, unknown>): boolean {
  return PRIVATE_PROFILE_FIELDS.some((field) => field in payload);
}

export function hasOnlyPublicIdentityFields(payload: Record<string, unknown>): boolean {
  return Object.keys(payload).every((key) =>
    (PUBLIC_FRIEND_FIELDS as readonly string[]).includes(key),
  );
}

/**
 * Resolve returns identity only. It must never emit a friendship row.
 */
export function inviteResolutionCreatesFriendship(payload: Record<string, unknown>): boolean {
  return 'friendshipId' in payload || payload.status === 'accepted' || payload.status === 'pending';
}
