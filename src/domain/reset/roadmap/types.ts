import type { FocusAreaId } from './focusAreas';

export const ROADMAP_PHASES = ['stabilize', 'change', 'pattern', 'independence', 'close'] as const;

export type RoadmapPhase = (typeof ROADMAP_PHASES)[number];

export const TASK_CATEGORIES = [
  'grounding',
  'clarity',
  'action',
  'consistency',
  'recovery',
  'boundaries',
  'structure',
  'direction',
  'identity',
  'confidence',
  'reflection',
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export type TaskPrimitive = {
  id: string;
  category: TaskCategory;
  objective: string;
  defaultTitle: string;
  defaultDescription: string;
  baseMinutes: number;
};

export type PlaylistSlot = {
  day: number;
  phase: RoadmapPhase;
  primitiveId: string;
  title: string;
  description: string;
  reflectionPrompt: string;
  uniqueTaskId?: string;
};

export type ResolvedResetTask = {
  id: string;
  day: number;
  title: string;
  description: string;
  minutes: number;
  category: TaskCategory;
  objective: string;
  phase: RoadmapPhase;
  reflectionPrompt: string;
  primitiveId: string;
  uniqueTaskId?: string;
  focusAreaId: FocusAreaId;
  steps: readonly string[];
  /** An easier version that still counts, for reset types that lean gentle. */
  lighter?: string;
};
