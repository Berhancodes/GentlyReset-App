import type { FocusAreaId, NextSeasonOption } from '../../../domain/reset/roadmap';

/** How each focus area is named when picking a season. */
export const FOCUS_AREA_NAMES: Record<FocusAreaId, string> = {
  mind: 'a quieter mind',
  energy: 'more energy',
  habits: 'steady habits',
  confidence: 'confidence',
  relationships: 'your people',
  direction: 'your direction',
};

export function getSeasonCompleteKicker(seasonNumber: number): string {
  return `SEASON ${seasonNumber} COMPLETE`;
}

export function getSeasonCompleteLine(seasonNumber: number): string {
  return `30 days kept. Pick what season ${seasonNumber + 1} is about.`;
}

export function getDeeperLabel(option: NextSeasonOption): string {
  return `Go deeper: ${FOCUS_AREA_NAMES[option.focusAreaId]}`;
}

export function getNextFocusLabel(option: NextSeasonOption): string {
  return `New focus: ${FOCUS_AREA_NAMES[option.focusAreaId]}`;
}
