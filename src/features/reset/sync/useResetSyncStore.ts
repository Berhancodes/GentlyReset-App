import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';
import { INITIAL_SYNC_OWNERSHIP, type SyncOwnership } from './types';

export const RESET_SYNC_PERSIST_KEY = 'gently-reset-sync';
export const RESET_SYNC_PERSIST_VERSION = 1;

type ResetSyncStore = SyncOwnership & {
  replaceOwnership: (ownership: SyncOwnership) => void;
};

export const useResetSyncStore = create<ResetSyncStore>()(
  persist(
    (set) => ({
      ...INITIAL_SYNC_OWNERSHIP,
      replaceOwnership: (ownership) => set(ownership),
    }),
    {
      name: RESET_SYNC_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: RESET_SYNC_PERSIST_VERSION,
      partialize: (state) => ({
        ownerUserId: state.ownerUserId,
        lastSuccessfulBackupAt: state.lastSuccessfulBackupAt,
        lastSyncAt: state.lastSyncAt,
        status: state.status,
        conflictCode: state.conflictCode,
        conflictMessage: state.conflictMessage,
      }),
    },
  ),
);

export function readSyncOwnership(): SyncOwnership {
  const state = useResetSyncStore.getState();
  return {
    ownerUserId: state.ownerUserId,
    lastSuccessfulBackupAt: state.lastSuccessfulBackupAt,
    lastSyncAt: state.lastSyncAt,
    status: state.status,
    conflictCode: state.conflictCode,
    conflictMessage: state.conflictMessage,
  };
}
