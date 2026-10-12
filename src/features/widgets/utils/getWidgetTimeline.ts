/** What the widget shows about today. */
export type WidgetMood = 'todo' | 'done' | 'missed' | 'upgrade';

/** Mascot pictures copied into the shared widgets folder, as file URLs. */
export type WidgetMascots = {
  idle: string;
  happy: string;
  cheer: string;
};

/** Everything the widget draws. Plain values only: the widget runs on its own. */
export type GentlyResetWidgetProps = {
  day: number;
  /** 0–1 through the 30-day season. */
  progress: number;
  streak: number;
  mood: WidgetMood;
  kicker: string;
  headline: string;
  chip: string;
  step: string;
  roomName: string;
  mascot: string;
};

export type WidgetResetState = {
  resetStartedOn: string | null;
  currentDay: number;
  completedCount: number;
  todayCompleted: boolean;
  missedYesterday: boolean;
  streak: number;
  stepTitle: string;
  roomName: string;
  /** The room reached a new stage with today's check-in. */
  roomGrewToday: boolean;
};

const SEASON_DAYS = 30;

function moodProps(
  mood: WidgetMood,
  state: { day: number; streak: number; roomName: string },
  mascots: WidgetMascots,
): Pick<GentlyResetWidgetProps, 'kicker' | 'headline' | 'chip' | 'mascot'> {
  switch (mood) {
    case 'done':
      return {
        kicker: 'SEASON 1',
        headline: 'done today. rest up',
        chip: `streak ${state.streak}`,
        mascot: mascots.happy,
      };
    case 'missed':
      return {
        kicker: 'WELCOME BACK',
        headline: 'no restart needed',
        chip: 'just continue',
        mascot: mascots.idle,
      };
    case 'upgrade':
      return {
        kicker: 'SEASON 1',
        headline: 'our room grew!',
        chip: state.roomName,
        mascot: mascots.cheer,
      };
    default:
      return {
        kicker: 'SEASON 1',
        headline: 'check in today',
        chip: state.streak > 0 ? `streak ${state.streak}` : 'day one energy',
        mascot: mascots.idle,
      };
  }
}

function buildProps(
  input: {
    day: number;
    completedCount: number;
    streak: number;
    mood: WidgetMood;
    step: string;
    roomName: string;
  },
  mascots: WidgetMascots,
): GentlyResetWidgetProps {
  const day = Math.max(1, Math.min(SEASON_DAYS, input.day));
  return {
    day,
    progress: Math.max(0, Math.min(1, input.completedCount / SEASON_DAYS)),
    streak: input.streak,
    mood: input.mood,
    step: input.step,
    roomName: input.roomName,
    ...moodProps(input.mood, { day, streak: input.streak, roomName: input.roomName }, mascots),
  };
}

/** The local midnight after `now`, when the widget's day turns over. */
export function nextLocalMidnight(now: Date): Date {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight;
}

/**
 * Two timeline entries: how today looks right now, and how tomorrow starts at midnight,
 * so the widget is right in the morning even if the app hasn't been opened.
 */
export function getWidgetTimeline(
  state: WidgetResetState,
  mascots: WidgetMascots,
  now: Date,
): { date: Date; props: GentlyResetWidgetProps }[] {
  if (!state.resetStartedOn) {
    return [
      {
        date: now,
        props: buildProps(
          {
            day: 1,
            completedCount: 0,
            streak: 0,
            mood: 'todo',
            step: 'your first step',
            roomName: 'your corner',
          },
          mascots,
        ),
      },
    ];
  }

  const todayMood: WidgetMood = state.todayCompleted
    ? state.roomGrewToday
      ? 'upgrade'
      : 'done'
    : state.missedYesterday
      ? 'missed'
      : 'todo';

  const today = buildProps(
    {
      day: state.currentDay,
      completedCount: state.completedCount,
      streak: state.streak,
      mood: todayMood,
      step: state.stepTitle,
      roomName: state.roomName,
    },
    mascots,
  );

  // At midnight: a done day moves to the next one; an unfinished day is gently "missed".
  const tomorrow = buildProps(
    {
      day: state.todayCompleted ? state.currentDay + 1 : state.currentDay,
      completedCount: state.completedCount,
      streak: state.todayCompleted ? state.streak : 0,
      mood: state.todayCompleted ? 'todo' : 'missed',
      step: state.todayCompleted ? 'a new small step' : state.stepTitle,
      roomName: state.roomName,
    },
    mascots,
  );

  return [
    { date: now, props: today },
    { date: nextLocalMidnight(now), props: tomorrow },
  ];
}
