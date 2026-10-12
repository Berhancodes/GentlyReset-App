import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';

type RoomState = {
  /** The mascot has introduced the room. */
  introSeen: boolean;
  /** Highest room stage whose upgrade card was shown, for the reset that started on `celebratedFor`. */
  celebratedStageIndex: number;
  celebratedFor: string | null;
  finishIntro: () => void;
  markCelebrated: (stageIndex: number, resetStartedOn: string) => void;
};

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      introSeen: false,
      celebratedStageIndex: 0,
      celebratedFor: null,
      finishIntro: () => set({ introSeen: true }),
      markCelebrated: (stageIndex, resetStartedOn) =>
        set({ celebratedStageIndex: stageIndex, celebratedFor: resetStartedOn }),
    }),
    {
      name: 'gently-reset-room',
      version: 1,
      storage: asyncPersistStorage,
      partialize: (state) => ({
        introSeen: state.introSeen,
        celebratedStageIndex: state.celebratedStageIndex,
        celebratedFor: state.celebratedFor,
      }),
    },
  ),
);

/** Celebrations belong to one reset; a new reset starts celebrating from the corner again. */
export function getCelebratedStageIndex(
  state: Pick<RoomState, 'celebratedStageIndex' | 'celebratedFor'>,
  resetStartedOn: string,
): number {
  return state.celebratedFor === resetStartedOn ? state.celebratedStageIndex : 0;
}
