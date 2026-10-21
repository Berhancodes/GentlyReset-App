import type { FocusAreaId } from '../roadmap/focusAreas';
import {
  AREA_ITEMS,
  AREA_PHRASES,
  BASIC_ITEMS,
  FEELING_PHRASES,
  OBSTACLE_ITEMS,
  type DayItemSeed,
  type DaySlot,
} from './items';

export type { DaySlot } from './items';

export type DailyListItem = { id: string; text: string; slot: DaySlot; main: boolean };

export type DailyList = {
  /** "Today, make sure you fix something you've put off." */
  headline: string;
  /** Why this list is for them, from their onboarding answers. */
  why: string;
  /** Ten small things, morning first. The first `main` item is the day's plan task. */
  items: readonly DailyListItem[];
};

/** Ticking this many items checks the day in. */
export const DAILY_LIST_CHECK_IN_COUNT = 3;
export const DAILY_LIST_SIZE = 10;

export const DAY_SLOTS: readonly DaySlot[] = ['morning', 'day', 'evening'];

export type DailyListInput = {
  day: number;
  focusAreaId: FocusAreaId;
  /** The day's plan task title, e.g. "Fix something you've put off". */
  mainTitle: string;
  primaryObstacle?: string;
  recentFeeling?: string;
  /** Onboarding "when would a reset help you most?" answer. */
  supportTiming?: string;
};

const SLOT_BY_TIMING: Record<string, DaySlot> = {
  'wake-up': 'morning',
  'during-day': 'day',
  'after-work': 'evening',
  'before-bed': 'evening',
};

function lowerFirst(text: string): string {
  return text.length > 0 ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function withoutTrailingPeriod(text: string): string {
  return text.replace(/[.!]+$/, '');
}

/**
 * Takes `count` items from `pool`, starting at a day-based offset so the same
 * person sees a different mix each day, skipping ids already used today.
 */
function pick(
  pool: readonly DayItemSeed[],
  count: number,
  day: number,
  step: number,
  used: Set<string>,
  slot?: DaySlot,
): DayItemSeed[] {
  const candidates = slot ? pool.filter((entry) => entry.slot === slot) : pool;
  const picked: DayItemSeed[] = [];
  if (candidates.length === 0) {
    return picked;
  }
  const start = ((day - 1) * step) % candidates.length;
  for (let offset = 0; offset < candidates.length && picked.length < count; offset += 1) {
    const candidate = candidates[(start + offset) % candidates.length];
    if (candidate && !used.has(candidate.id)) {
      picked.push(candidate);
      used.add(candidate.id);
    }
  }
  return picked;
}

function buildWhy(input: DailyListInput): string {
  const area = AREA_PHRASES[input.focusAreaId];
  const feeling = input.recentFeeling ? FEELING_PHRASES[input.recentFeeling] : undefined;
  const opening = feeling ? `You said ${feeling}, and ${area}.` : `You told us ${area}.`;
  return `${opening} These small things add up. Tick any ${DAILY_LIST_CHECK_IN_COUNT} to check in.`;
}

/**
 * A day as a list of ten small things: the day's plan task, three everyday
 * basics (one per part of the day), and the rest from their focus area and
 * what usually gets in their way. Pure: same inputs, same list.
 */
export function buildDailyList(input: DailyListInput): DailyList {
  const used = new Set<string>();
  const mainSlot = (input.supportTiming && SLOT_BY_TIMING[input.supportTiming]) || 'morning';
  const main: DailyListItem = {
    id: `main-${input.day}`,
    text: input.mainTitle,
    slot: mainSlot,
    main: true,
  };

  const basics = DAY_SLOTS.flatMap((slot) => pick(BASIC_ITEMS, 1, input.day, 1, used, slot));
  const obstacle = pick(OBSTACLE_ITEMS[input.primaryObstacle ?? ''] ?? [], 2, input.day, 1, used);
  const areaPool = AREA_ITEMS[input.focusAreaId];
  const remaining = DAILY_LIST_SIZE - 1 - basics.length - obstacle.length;
  // Spread the focus-area items over the day so no part of it is empty.
  const area = DAY_SLOTS.flatMap((slot, index) =>
    pick(areaPool, Math.ceil((remaining - index) / DAY_SLOTS.length), input.day, 2, used, slot),
  );
  const fill = pick(
    [...areaPool, ...BASIC_ITEMS],
    DAILY_LIST_SIZE - 1 - basics.length - obstacle.length - area.length,
    input.day,
    3,
    used,
  );

  const rest: DailyListItem[] = [...basics, ...area, ...obstacle, ...fill].map((entry) => ({
    ...entry,
    main: false,
  }));
  const items = DAY_SLOTS.flatMap((slot) => [
    ...(slot === mainSlot ? [main] : []),
    ...rest.filter((entry) => entry.slot === slot),
  ]);

  return {
    headline: `Today, make sure you ${lowerFirst(withoutTrailingPeriod(input.mainTitle))}.`,
    why: buildWhy(input),
    items,
  };
}

export const DAY_SLOT_LABELS: Record<DaySlot, string> = {
  morning: 'Morning',
  day: 'During the day',
  evening: 'Evening',
};
