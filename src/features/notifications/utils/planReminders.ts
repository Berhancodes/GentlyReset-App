import {
  DAILY_MESSAGES,
  DEFAULT_MISSED_DAY_STYLE,
  DEFAULT_REMINDER_TIMES,
  FALLBACK_REMINDER_TIME,
  MISSED_DAY_MESSAGES,
  NAME_PLACEHOLDER,
  type ReminderMessage,
  type ReminderTime,
  type SupportTimingId,
} from '../data/reminderCopy';

/** How far ahead reminders are queued. If the app isn't opened for a week, they stop. */
export const REMINDER_DAYS_AHEAD = 7;

export const REMINDER_ID_PREFIX = 'daily-reminder-';

export type PlannedReminder = {
  /** Stable per day, e.g. `daily-reminder-2026-10-18`. */
  id: string;
  date: Date;
  title: string;
  body: string;
};

export type PlanRemindersInput = {
  now: Date;
  time: ReminderTime;
  /** Today's step is already checked in, so today needs no reminder. */
  todayCompleted: boolean;
  /** The name from onboarding, if any. */
  name?: string;
  /** Answer id of "what should happen if you miss a day?". */
  missedDayStyle?: string;
  daysAhead?: number;
};

function isSupportTimingId(value: string): value is SupportTimingId {
  return value in DEFAULT_REMINDER_TIMES;
}

/** The saved time if they picked one, else the time that matches their onboarding answer. */
export function resolveReminderTime(
  saved: ReminderTime | null,
  supportTimingId: string | undefined,
): ReminderTime {
  if (saved) {
    return saved;
  }
  if (supportTimingId && isSupportTimingId(supportTimingId)) {
    return DEFAULT_REMINDER_TIMES[supportTimingId];
  }
  return FALLBACK_REMINDER_TIME;
}

function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Whole local days since 1970, so each date picks the same message every time. */
function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / (24 * 60 * 60 * 1000),
  );
}

function pickMessage(
  messages: readonly ReminderMessage[],
  date: Date,
  name: string | undefined,
): ReminderMessage {
  const usable = name
    ? messages
    : messages.filter(
        (message) =>
          !message.title.includes(NAME_PLACEHOLDER) && !message.body.includes(NAME_PLACEHOLDER),
      );
  const message = usable[dayNumber(date) % usable.length] ?? usable[0] ?? messages[0]!;
  if (!name) {
    return message;
  }
  return {
    title: message.title.split(NAME_PLACEHOLDER).join(name),
    body: message.body.split(NAME_PLACEHOLDER).join(name),
  };
}

/**
 * The reminders to queue from `now` on: one per day at their time, none today if
 * they've already checked in or the time has passed.
 *
 * A day counts as "after a missed day" when we already know the day before won't
 * be checked in: tomorrow, if today isn't done yet (checking in today re-plans
 * this), and every day after that, since the app wasn't opened to check in.
 */
export function planReminders(input: PlanRemindersInput): PlannedReminder[] {
  const daysAhead = input.daysAhead ?? REMINDER_DAYS_AHEAD;
  const name = input.name?.trim() || undefined;
  const missedMessages =
    MISSED_DAY_MESSAGES[input.missedDayStyle ?? DEFAULT_MISSED_DAY_STYLE] ??
    MISSED_DAY_MESSAGES[DEFAULT_MISSED_DAY_STYLE] ??
    DAILY_MESSAGES;

  const reminders: PlannedReminder[] = [];
  for (let offset = 0; offset < daysAhead; offset += 1) {
    const date = new Date(
      input.now.getFullYear(),
      input.now.getMonth(),
      input.now.getDate() + offset,
      input.time.hour,
      input.time.minute,
    );
    if (date.getTime() <= input.now.getTime()) {
      continue;
    }
    if (offset === 0 && input.todayCompleted) {
      continue;
    }
    const afterMissedDay = offset >= 2 || (offset === 1 && !input.todayCompleted);
    const message = pickMessage(afterMissedDay ? missedMessages : DAILY_MESSAGES, date, name);
    reminders.push({ id: `${REMINDER_ID_PREFIX}${localDateKey(date)}`, date, ...message });
  }
  return reminders;
}

/** "6:00 pm" */
export function formatReminderTime(time: ReminderTime): string {
  const suffix = time.hour < 12 ? 'am' : 'pm';
  const hour = time.hour % 12 === 0 ? 12 : time.hour % 12;
  return `${hour}:${String(time.minute).padStart(2, '0')} ${suffix}`;
}

const STEP_MINUTES = 30;

/** Moves the time by half an hour, wrapping around midnight. */
export function shiftReminderTime(time: ReminderTime, direction: 1 | -1): ReminderTime {
  const total = (time.hour * 60 + time.minute + direction * STEP_MINUTES + 24 * 60) % (24 * 60);
  return { hour: Math.floor(total / 60), minute: total % 60 };
}
