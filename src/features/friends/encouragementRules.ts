import {
  canSendEncouragementKind,
  isEncouragementKind,
  type EncouragementKind,
} from './encouragements';
import { areAcceptedFriends, type FriendshipStore } from './friendshipRules';

export type EncouragementRecord = {
  id: string;
  senderId: string;
  recipientId: string;
  kind: EncouragementKind;
  createdAt: string;
  readAt: string | null;
};

export type EncouragementStore = {
  nextId: number;
  rows: EncouragementRecord[];
};

export function emptyEncouragementStore(): EncouragementStore {
  return { nextId: 1, rows: [] };
}

export function sendEncouragement(
  friendships: FriendshipStore,
  store: EncouragementStore,
  senderId: string,
  recipientId: string,
  kind: string,
  nowIso: string,
): { store: EncouragementStore; code: string; encouragementId?: string } {
  if (senderId === recipientId) {
    return { store, code: 'self' };
  }
  if (!isEncouragementKind(kind)) {
    return { store, code: 'invalid_kind' };
  }
  if (!areAcceptedFriends(friendships, senderId, recipientId)) {
    return { store, code: 'not_friends' };
  }

  const lastSameKind = store.rows
    .filter(
      (row) => row.senderId === senderId && row.recipientId === recipientId && row.kind === kind,
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];

  if (
    !canSendEncouragementKind({
      lastSentAt: lastSameKind?.createdAt ?? null,
      nowMs: Date.parse(nowIso),
    })
  ) {
    return { store, code: 'too_soon' };
  }

  const created: EncouragementRecord = {
    id: `encouragement-${store.nextId}`,
    senderId,
    recipientId,
    kind,
    createdAt: nowIso,
    readAt: null,
  };

  return {
    store: { nextId: store.nextId + 1, rows: [...store.rows, created] },
    code: 'sent',
    encouragementId: created.id,
  };
}

export function listRecentEncouragements(
  store: EncouragementStore,
  recipientId: string,
): EncouragementRecord[] {
  return store.rows
    .filter((row) => row.recipientId === recipientId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 20);
}

export function markEncouragementRead(
  store: EncouragementStore,
  actorId: string,
  encouragementId: string,
  nowIso: string,
): { store: EncouragementStore; code: string } {
  const existing = store.rows.find((row) => row.id === encouragementId);
  if (!existing) {
    return { store, code: 'not_found' };
  }
  if (existing.recipientId !== actorId) {
    return { store, code: 'not_allowed' };
  }
  if (existing.readAt) {
    return { store, code: 'read' };
  }
  return {
    store: {
      ...store,
      rows: store.rows.map((row) =>
        row.id === encouragementId ? { ...row, readAt: nowIso } : row,
      ),
    },
    code: 'read',
  };
}
