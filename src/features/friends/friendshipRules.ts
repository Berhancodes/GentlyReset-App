export type FriendshipStatus = 'pending' | 'accepted' | 'declined';

export type FriendshipRecord = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  acceptedAt: string | null;
};

export type FriendshipStore = {
  nextId: number;
  rows: FriendshipRecord[];
};

export function emptyFriendshipStore(): FriendshipStore {
  return { nextId: 1, rows: [] };
}

export function canonicalPairKey(leftUserId: string, rightUserId: string): string {
  return leftUserId < rightUserId ? `${leftUserId}:${rightUserId}` : `${rightUserId}:${leftUserId}`;
}

function findPair(
  store: FriendshipStore,
  leftUserId: string,
  rightUserId: string,
): FriendshipRecord | undefined {
  const key = canonicalPairKey(leftUserId, rightUserId);
  return store.rows.find((row) => canonicalPairKey(row.requesterId, row.addresseeId) === key);
}

export function sendFriendRequest(
  store: FriendshipStore,
  actorUserId: string,
  targetUserId: string,
): { store: FriendshipStore; code: string; friendshipId?: string } {
  if (actorUserId === targetUserId) {
    return { store, code: 'self' };
  }

  const existing = findPair(store, actorUserId, targetUserId);
  if (!existing) {
    const created: FriendshipRecord = {
      id: `friendship-${store.nextId}`,
      requesterId: actorUserId,
      addresseeId: targetUserId,
      status: 'pending',
      acceptedAt: null,
    };
    return {
      store: { nextId: store.nextId + 1, rows: [...store.rows, created] },
      code: 'sent',
      friendshipId: created.id,
    };
  }

  if (existing.status === 'accepted') {
    return { store, code: 'already_friends', friendshipId: existing.id };
  }

  if (existing.status === 'pending' && existing.requesterId === actorUserId) {
    return { store, code: 'already_pending', friendshipId: existing.id };
  }

  if (existing.status === 'pending' && existing.addresseeId === actorUserId) {
    return {
      store: {
        ...store,
        rows: store.rows.map((row) =>
          row.id === existing.id
            ? { ...row, status: 'accepted', acceptedAt: '2026-09-28T00:00:00.000Z' }
            : row,
        ),
      },
      code: 'accepted_existing',
      friendshipId: existing.id,
    };
  }

  if (existing.status === 'declined') {
    return {
      store: {
        ...store,
        rows: store.rows.map((row) =>
          row.id === existing.id
            ? {
                ...row,
                requesterId: actorUserId,
                addresseeId: targetUserId,
                status: 'pending',
                acceptedAt: null,
              }
            : row,
        ),
      },
      code: 'sent',
      friendshipId: existing.id,
    };
  }

  return { store, code: 'conflict', friendshipId: existing.id };
}

export function acceptFriendRequest(
  store: FriendshipStore,
  actorUserId: string,
  requestId: string,
): { store: FriendshipStore; code: string } {
  const existing = store.rows.find((row) => row.id === requestId);
  if (!existing) {
    return { store, code: 'not_found' };
  }
  if (existing.addresseeId !== actorUserId) {
    return { store, code: 'not_allowed' };
  }
  if (existing.status !== 'pending') {
    return { store, code: 'not_pending' };
  }
  return {
    store: {
      ...store,
      rows: store.rows.map((row) =>
        row.id === requestId
          ? { ...row, status: 'accepted', acceptedAt: '2026-09-28T00:00:00.000Z' }
          : row,
      ),
    },
    code: 'accepted',
  };
}

export function declineFriendRequest(
  store: FriendshipStore,
  actorUserId: string,
  requestId: string,
): { store: FriendshipStore; code: string } {
  const existing = store.rows.find((row) => row.id === requestId);
  if (!existing) {
    return { store, code: 'not_found' };
  }
  if (existing.addresseeId !== actorUserId) {
    return { store, code: 'not_allowed' };
  }
  if (existing.status !== 'pending') {
    return { store, code: 'not_pending' };
  }
  return {
    store: {
      ...store,
      rows: store.rows.map((row) =>
        row.id === requestId ? { ...row, status: 'declined', acceptedAt: null } : row,
      ),
    },
    code: 'declined',
  };
}

export function cancelFriendRequest(
  store: FriendshipStore,
  actorUserId: string,
  requestId: string,
): { store: FriendshipStore; code: string } {
  const existing = store.rows.find((row) => row.id === requestId);
  if (!existing) {
    return { store, code: 'not_found' };
  }
  if (existing.requesterId !== actorUserId) {
    return { store, code: 'not_allowed' };
  }
  if (existing.status !== 'pending') {
    return { store, code: 'not_pending' };
  }
  return {
    store: { ...store, rows: store.rows.filter((row) => row.id !== requestId) },
    code: 'cancelled',
  };
}

export function removeFriend(
  store: FriendshipStore,
  actorUserId: string,
  friendshipId: string,
): { store: FriendshipStore; code: string } {
  const existing = store.rows.find((row) => row.id === friendshipId);
  if (!existing) {
    return { store, code: 'not_found' };
  }
  if (existing.requesterId !== actorUserId && existing.addresseeId !== actorUserId) {
    return { store, code: 'not_allowed' };
  }
  if (existing.status !== 'accepted') {
    return { store, code: 'not_friends' };
  }
  return {
    store: { ...store, rows: store.rows.filter((row) => row.id !== friendshipId) },
    code: 'removed',
  };
}

export function canReadFriendship(row: FriendshipRecord, viewerUserId: string): boolean {
  return row.requesterId === viewerUserId || row.addresseeId === viewerUserId;
}
