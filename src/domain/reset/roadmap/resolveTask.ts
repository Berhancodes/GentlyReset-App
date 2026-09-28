import type { ResetPersonalization, TodayTask } from '../types';
import { applyTaskModifiers, minutesForResetDay, resolveContentResetTypeId } from './modifiers';
import { clampPlanDay } from './phase';
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

export function resolveTaskForDay(
  day: number,
  personalization: ResetPersonalization,
  resetTypeId?: string,
): ResolvedResetTask {
  const typeId = resolveContentResetTypeId(resetTypeId);
  const clamped = clampPlanDay(day);
  const slot = getPlaylistSlot(clamped, typeId);
  const primitive = getTaskPrimitive(slot.primitiveId);
  const description = applyTaskModifiers(slot.description, {
    supportStyle: personalization.supportStyle,
    primaryObstacle: personalization.primaryObstacle,
    resetReason: personalization.resetReason,
    day: clamped,
  });

  return {
    id: `day-${clamped}`,
    day: clamped,
    title: slot.title,
    description,
    minutes: minutesForResetDay(clamped, typeId, personalization.dailyCommitment),
    category: primitive.category,
    objective: primitive.objective,
    phase: slot.phase,
    reflectionPrompt: slot.reflectionPrompt,
    primitiveId: slot.primitiveId,
    uniqueTaskId: slot.uniqueTaskId,
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
