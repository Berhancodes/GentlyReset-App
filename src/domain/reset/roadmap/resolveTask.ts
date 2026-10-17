import type { ResetPersonalization, TodayTask } from '../types';
import { applyTaskModifiers, minutesForResetDay, resolveContentResetTypeId } from './modifiers';
import { getAreaMoves, type AreaMove } from './areaMoves';
import type { FocusAreaId } from './focusAreas';
import { minutesForTask, offersLighter } from './lean';
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
 * A day is the season's focus-area move (the actual task, why it matters and
 * three concrete steps) shaped by the reset type's playlist slot (how to
 * approach it, and the reflection prompt). Minutes follow the task's own time
 * rule, and gentler reset types are offered its lighter version.
 * Pure and on-device: same inputs, same plan.
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
  const rampedMinutes = minutesForResetDay(
    clamped,
    typeId,
    personalization.dailyCommitment,
    season.number,
  );
  const focusAreaId = season.focusAreaId;
  const areaMove = getAreaMove(clamped, focusAreaId, season.level);
  const minutes = minutesForTask(areaMove.time, rampedMinutes, typeId, clamped);
  const lighter =
    areaMove.lighter && offersLighter(typeId, focusAreaId, clamped) ? areaMove.lighter : undefined;
  const approach = applyTaskModifiers(slot.description, {
    supportStyle: personalization.supportStyle,
    primaryObstacle: personalization.primaryObstacle,
    resetReason: personalization.resetReason,
    day: clamped,
  });

  return {
    id: `day-${clamped}`,
    day: clamped,
    title: withMinutes(areaMove.title, minutes),
    description: `${areaMove.why} ${approach}`,
    minutes,
    category: primitive.category,
    objective: primitive.objective,
    phase: slot.phase,
    reflectionPrompt: slot.reflectionPrompt,
    primitiveId: slot.primitiveId,
    uniqueTaskId: slot.uniqueTaskId,
    focusAreaId,
    steps: areaMove.steps.map((step) => withMinutes(step, minutes)),
    ...(lighter ? { lighter } : {}),
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
    ...(resolved.lighter ? { lighter: resolved.lighter } : {}),
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
