import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';

export const JOURNAL_DRAFT_PERSIST_KEY = 'gently-reset-journal-draft';
export const JOURNAL_DRAFT_PERSIST_VERSION = 1;

/** Unsaved journal text for one plan day. A different day starts blank. */
type JournalDraftState = {
  day: number | null;
  text: string;
};

type JournalDraftActions = {
  setDraft: (day: number, text: string) => void;
  clearDraft: () => void;
};

export const useJournalDraftStore = create<JournalDraftState & JournalDraftActions>()(
  persist(
    (set) => ({
      day: null,
      text: '',
      setDraft: (day, text) => set({ day, text }),
      clearDraft: () => set({ day: null, text: '' }),
    }),
    {
      name: JOURNAL_DRAFT_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: JOURNAL_DRAFT_PERSIST_VERSION,
    },
  ),
);
