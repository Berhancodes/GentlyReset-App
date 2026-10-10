import { create } from 'zustand';

import type { StagePose } from './stagePoses';

/** A rectangle in window coordinates. */
export type StageFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StageFlight = {
  id: number;
  label: string;
  from: StageFrame;
  delayMs: number;
};

type StageState = {
  pose: StagePose;
  line: string | null;
  /** Changes whenever a line is said, so the bubble pops even for repeated lines. */
  lineId: number;
  /** Changes when the mascot catches a flying answer. */
  catchId: number;
  /** Where the current screen wants the mascot to stand, relative to the stage. */
  slot: StageFrame | null;
  flights: readonly StageFlight[];
};

type StageActions = {
  show: (pose: StagePose, line?: string | null) => void;
  say: (line: string | null) => void;
  setSlot: (slot: StageFrame) => void;
  launch: (flight: Omit<StageFlight, 'id'>) => void;
  land: (id: number) => void;
  reset: () => void;
};

const initialState: StageState = {
  pose: 'idle-listen',
  line: null,
  lineId: 0,
  catchId: 0,
  slot: null,
  flights: [],
};

let nextFlightId = 1;

/**
 * Presentation state for the onboarding mascot stage. Not persisted.
 * Answers live in the onboarding store; this only drives what the mascot does.
 */
export const useStageStore = create<StageState & StageActions>()((set) => ({
  ...initialState,
  show: (pose, line = null) =>
    set((state) => ({
      pose,
      line,
      lineId: line ? state.lineId + 1 : state.lineId,
    })),
  say: (line) => set((state) => ({ line, lineId: line ? state.lineId + 1 : state.lineId })),
  setSlot: (slot) => set({ slot }),
  launch: (flight) =>
    set((state) => ({ flights: [...state.flights, { ...flight, id: nextFlightId++ }] })),
  land: (id) =>
    set((state) => ({
      flights: state.flights.filter((flight) => flight.id !== id),
      catchId: state.catchId + 1,
    })),
  reset: () => set(initialState),
}));
