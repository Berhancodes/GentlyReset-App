import { getRoadmapPhaseForDay } from './phase';
import type { PlaylistSlot } from './types';

export function slot(
  day: number,
  primitiveId: string,
  title: string,
  description: string,
  reflectionPrompt: string,
  uniqueTaskId?: string,
): PlaylistSlot {
  return {
    day,
    phase: getRoadmapPhaseForDay(day),
    primitiveId,
    title,
    description,
    reflectionPrompt,
    ...(uniqueTaskId ? { uniqueTaskId } : {}),
  };
}
