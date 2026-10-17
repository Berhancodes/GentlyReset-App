import type { FocusAreaId } from '../focusAreas';
import { CONFIDENCE_DEEP_MOVES, CONFIDENCE_MOVES } from './confidence';
import { DIRECTION_DEEP_MOVES, DIRECTION_MOVES } from './direction';
import { ENERGY_DEEP_MOVES, ENERGY_MOVES } from './energy';
import { HABITS_DEEP_MOVES, HABITS_MOVES } from './habits';
import { MIND_DEEP_MOVES, MIND_MOVES } from './mind';
import type { AreaMove } from './move';
import { RELATIONSHIPS_DEEP_MOVES, RELATIONSHIPS_MOVES } from './relationships';

export type { AreaMove, TaskTime } from './move';

/** Thirty concrete days per focus area, in plan order. Level 1: the first season in an area. */
export const AREA_MOVES: Record<FocusAreaId, readonly AreaMove[]> = {
  mind: MIND_MOVES,
  energy: ENERGY_MOVES,
  habits: HABITS_MOVES,
  confidence: CONFIDENCE_MOVES,
  relationships: RELATIONSHIPS_MOVES,
  direction: DIRECTION_MOVES,
};

/** Level 2 and up: returning to an area goes deeper instead of repeating it. */
export const AREA_DEEP_MOVES: Record<FocusAreaId, readonly AreaMove[]> = {
  mind: MIND_DEEP_MOVES,
  energy: ENERGY_DEEP_MOVES,
  habits: HABITS_DEEP_MOVES,
  confidence: CONFIDENCE_DEEP_MOVES,
  relationships: RELATIONSHIPS_DEEP_MOVES,
  direction: DIRECTION_DEEP_MOVES,
};

export function getAreaMoves(focusAreaId: FocusAreaId, level: number): readonly AreaMove[] {
  return level >= 2 ? AREA_DEEP_MOVES[focusAreaId] : AREA_MOVES[focusAreaId];
}
