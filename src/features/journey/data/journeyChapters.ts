import { PLAN_DAY_COUNT } from '../../reset/data/thirtyDayPlan';

export type JourneyChapterId = 'week-1' | 'week-2' | 'week-3' | 'week-4' | 'finish';

export type JourneyChapterDefinition = {
  id: JourneyChapterId;
  startDay: number;
  endDay: number;
  title: string;
  subtitle: string;
  artWidth: number;
  artHeight: number;
};

/**
 * Season-1 chapters. Later seasons (31–90) can append more entries
 * without changing the renderer.
 */
export const JOURNEY_CHAPTERS: readonly JourneyChapterDefinition[] = [
  {
    id: 'week-1',
    startDay: 1,
    endDay: 7,
    title: 'start smaller',
    subtitle: 'week 1',
    artWidth: 798,
    artHeight: 1972,
  },
  {
    id: 'week-2',
    startDay: 8,
    endDay: 14,
    title: 'make it easier',
    subtitle: 'week 2',
    artWidth: 798,
    artHeight: 1971,
  },
  {
    id: 'week-3',
    startDay: 15,
    endDay: 21,
    title: 'stay with it',
    subtitle: 'week 3',
    artWidth: 798,
    artHeight: 1971,
  },
  {
    id: 'week-4',
    startDay: 22,
    endDay: 28,
    title: 'keep the promise',
    subtitle: 'week 4',
    artWidth: 798,
    artHeight: 1971,
  },
  {
    id: 'finish',
    startDay: 29,
    endDay: 30,
    title: 'keep growing',
    subtitle: 'a new beginning',
    artWidth: 798,
    artHeight: 1971,
  },
] as const;

export function clampJourneyDay(day: number): number {
  return Math.min(PLAN_DAY_COUNT, Math.max(1, day));
}

export function getJourneyChapterForDay(day: number): JourneyChapterDefinition | undefined {
  const clamped = clampJourneyDay(day);
  return JOURNEY_CHAPTERS.find(
    (chapter) => clamped >= chapter.startDay && clamped <= chapter.endDay,
  );
}

export function getJourneyChapterIndexForDay(day: number): number {
  const chapter = getJourneyChapterForDay(day);
  if (!chapter) {
    return 0;
  }
  const index = JOURNEY_CHAPTERS.findIndex((item) => item.id === chapter.id);
  return index < 0 ? 0 : index;
}

export function getJourneyChapterDays(chapter: JourneyChapterDefinition): readonly number[] {
  const days: number[] = [];
  for (let day = chapter.startDay; day <= chapter.endDay; day += 1) {
    days.push(day);
  }
  return days;
}

export function getJourneyWeekLabel(chapter: JourneyChapterDefinition): string {
  return `${chapter.subtitle} · ${chapter.title}`;
}
