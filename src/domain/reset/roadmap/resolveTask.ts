import type { ResetPersonalization, TodayTask } from '../types';
import { applyTaskModifiers, minutesForResetDay, resolveContentResetTypeId } from './modifiers';
import { getAreaMoves, type AreaMove } from './areaMoves';
import type { FocusAreaId } from './focusAreas';
import { clampPlanDay } from './phase';
import { resolveSeason } from './seasons';
import { TYPE_PLAYLISTS } from './playlists';
import { getTaskPrimitive } from './primitives';
import type { PlaylistSlot, ResolvedResetTask } from './types';

export function getPlaylistSlot(day: number, resetTypeId?: string): PlaylistSlot {
  const typeId = resolveContentResetTypeId(resetTypeId);
  const playlist = TYPE_PLAYLISTS[typeId];
  const clamped = clampPlanDay(day);
  const slot = playlist[clamped - 1];
  if (!slot) {
    throw new Error(`Missing playlist slot for ${typeId} day ${clamped}`);
  }
  return slot;
}

const CHECK_IN_STEP = 'Check in';

function getAreaMove(day: number, focusAreaId: FocusAreaId, level: number): AreaMove {
  const areaMove = getAreaMoves(focusAreaId, level)[clampPlanDay(day) - 1];
  if (!areaMove) {
    throw new Error(`Missing ${focusAreaId} move for day ${day}`);
  }
  return areaMove;
}

function withMinutes(text: string, minutes: number): string {
  return text.split('{m}').join(String(minutes));
}

/**
 * A day is the reset type's playlist slot (title, approach, reflection) made
 * concrete by the season's focus area and level (what to actually do), sized
 * by the day's ramped minutes. Pure and on-device: same inputs, same plan.
 */
export function resolveTaskForDay(
  day: number,
  personalization: ResetPersonalization,
  resetTypeId?: string,
): ResolvedResetTask {
  const typeId = resolveContentResetTypeId(resetTypeId);
  const clamped = clampPlanDay(day);
  const slot = getPlaylistSlot(clamped, typeId);
  const primitive = getTaskPrimitive(slot.primitiveId);
  const season = resolveSeason(personalization, typeId);
  const minutes = minutesForResetDay(
    clamped,
    typeId,
    personalization.dailyCommitment,
    season.number,
  );
  const focusAreaId = season.focusAreaId;
  const areaMove = getAreaMove(clamped, focusAreaId, season.level);
  const approach = applyTaskModifiers(slot.description, {
    supportStyle: personalization.supportStyle,
    primaryObstacle: personalization.primaryObstacle,
    resetReason: personalization.resetReason,
    day: clamped,
  });

  return {
    id: `day-${clamped}`,
    day: clamped,
    title: slot.title,
    description: `${withMinutes(areaMove.detail, minutes)} ${approach}`,
    minutes,
    category: primitive.category,
    objective: primitive.objective,
    phase: slot.phase,
    reflectionPrompt: slot.reflectionPrompt,
    primitiveId: slot.primitiveId,
    uniqueTaskId: slot.uniqueTaskId,
    focusAreaId,
    steps: [withMinutes(areaMove.prep, minutes), withMinutes(areaMove.act, minutes), CHECK_IN_STEP],
  };
}

export function getTaskForDay(
  day: number,
  personalization: ResetPersonalization,
  resetTypeId?: string,
): TodayTask {
  const resolved = resolveTaskForDay(day, personalization, resetTypeId);
  return {
    id: resolved.id,
    day: resolved.day,
    title: resolved.title,
    description: resolved.description,
    minutes: resolved.minutes,
    steps: resolved.steps,
  };
}

export function getPlanDayTitle(day: number, resetTypeId?: string): string {
  return getPlaylistSlot(day, resetTypeId).title;
}

export function getTaskReflectionPrompt(
  day: number,
  personalization: ResetPersonalization,
  resetTypeId?: string,
): string {
  return resolveTaskForDay(day, personalization, resetTypeId).reflectionPrompt;
}
