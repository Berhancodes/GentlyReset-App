import { calendarDaysBetween, parseLocalDateKey, shiftDateKey } from '../../reset/utils/calendar';

export type JourneyStatsInput = {
  completedDays: readonly number[];
  completionDates?: Partial<Record<number, string>>;
  lastCompletedOn: string | null;
  streak: number;
  resetStartedOn: string | null;
  /** Local YYYY-MM-DD. */
  today: string;
};

export type JourneyStats = {
  streak: number;
  /** Whole percent, 0–100. */
  consistency: number;
  checkIns: number;
};

export type JourneyHeatmapCell =
  { kind: 'day'; dateKey: string; checkedIn: boolean; isToday: boolean } | { kind: 'future' };

export type JourneyHeatmapWeek = {
  /** Short month name when this column starts a new month, else null. */
  monthLabel: string | null;
  /** Monday through Sunday. */
  cells: readonly JourneyHeatmapCell[];
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function getJourneyStats(input: JourneyStatsInput): JourneyStats {
  const checkIns = new Set(input.completedDays).size;
  // A streak only counts while it is still alive: checked in today or yesterday.
  const alive =
    input.lastCompletedOn === input.today ||
    input.lastCompletedOn === shiftDateKey(input.today, -1);
  const elapsedDays = input.resetStartedOn
    ? calendarDaysBetween(input.resetStartedOn, input.today) + 1
    : 0;
  const consistency =
    elapsedDays > 0 ? Math.min(100, Math.round((checkIns / elapsedDays) * 100)) : 0;

  return {
    streak: alive ? Math.max(0, input.streak) : 0,
    consistency,
    checkIns,
  };
}

/** Every real calendar date with a recorded check-in. */
export function getJourneyCheckInDates(input: JourneyStatsInput): ReadonlySet<string> {
  const dates = new Set<string>();
  for (const date of Object.values(input.completionDates ?? {})) {
    if (date) {
      dates.add(date);
    }
  }
  if (input.lastCompletedOn) {
    dates.add(input.lastCompletedOn);
  }
  return dates;
}

/**
 * GitHub-style grid: `weekCount` columns ending with the current week, rows
 * Monday–Sunday. Days after today are `future` so the last column ends cleanly.
 */
export function getJourneyHeatmap(
  checkInDates: ReadonlySet<string>,
  today: string,
  weekCount: number,
): readonly JourneyHeatmapWeek[] {
  // getDay() is Sunday-first; shift so Monday is 0.
  const todayWeekday = (parseLocalDateKey(today).getDay() + 6) % 7;
  const firstMonday = shiftDateKey(today, -todayWeekday - (weekCount - 1) * 7);
  const weeks: JourneyHeatmapWeek[] = [];
  let previousMonth: number | null = null;

  for (let week = 0; week < weekCount; week += 1) {
    const weekStart = shiftDateKey(firstMonday, week * 7);
    const month = parseLocalDateKey(weekStart).getMonth();
    const cells: JourneyHeatmapCell[] = [];

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const dateKey = shiftDateKey(weekStart, weekday);
      if (calendarDaysBetween(today, dateKey) > 0) {
        cells.push({ kind: 'future' });
        continue;
      }
      cells.push({
        kind: 'day',
        dateKey,
        checkedIn: checkInDates.has(dateKey),
        isToday: dateKey === today,
      });
    }

    weeks.push({
      monthLabel: month !== previousMonth ? (MONTHS[month] ?? null) : null,
      cells,
    });
    previousMonth = month;
  }

  // Drop a label when the next one starts within two columns so names never collide.
  return weeks.map((week, index) => {
    const nextLabelled = weeks.findIndex(
      (candidate, candidateIndex) => candidateIndex > index && candidate.monthLabel !== null,
    );
    const crowded = nextLabelled !== -1 && nextLabelled - index <= 2;
    return crowded && week.monthLabel ? { ...week, monthLabel: null } : week;
  });
}

export type JourneyMilestone = {
  days: number;
  label: string;
  reached: boolean;
};

export type JourneyMilestoneTrack = {
  milestones: readonly JourneyMilestone[];
  /** Fill of each line between milestones, 0–1, left to right. */
  segmentFill: readonly number[];
};

const NEXT_MILESTONES = [
  { days: 7, label: 'Build momentum' },
  { days: 30, label: 'A stronger you' },
] as const;

/** Where you are now, then the 7- and 30-day milestones. */
export function getJourneyMilestoneTrack(checkIns: number): JourneyMilestoneTrack {
  const now = Math.max(0, checkIns);
  const [week, month] = NEXT_MILESTONES;
  return {
    milestones: [
      { days: now, label: now === 0 ? 'Start today' : 'Keep going', reached: now > 0 },
      { ...week, reached: now >= week.days },
      { ...month, reached: now >= month.days },
    ],
    segmentFill: [
      Math.min(1, now / week.days),
      Math.min(1, Math.max(0, (now - week.days) / (month.days - week.days))),
    ],
  };
}

/** Two-line note from the mascot about how often you showed up. */
export function getJourneyShowUpMessage(checkIns: number): { title: string; body: string } {
  if (checkIns <= 0) {
    return { title: 'Your first day is waiting.', body: 'Small steps still count.' };
  }
  const times = checkIns === 1 ? 'once' : checkIns === 2 ? 'twice' : `${checkIns} times`;
  return { title: `You've shown up ${times}.`, body: 'Small steps still count.' };
}
