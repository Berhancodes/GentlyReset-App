import { toLocalDateKey } from '../utils/calendar';

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidCalendarDate(value: string | null | undefined): value is string {
  if (!value) {
    return false;
  }

  const match = CALENDAR_DATE.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));

  return (
    utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day
  );
}

export function laterCalendarDate(left: string | null, right: string | null): string | null {
  const leftValid = isValidCalendarDate(left) ? left : null;
  const rightValid = isValidCalendarDate(right) ? right : null;

  if (leftValid && rightValid) {
    return leftValid >= rightValid ? leftValid : rightValid;
  }

  return leftValid ?? rightValid;
}

export function earlierCalendarDate(left: string | null, right: string | null): string | null {
  const leftValid = isValidCalendarDate(left) ? left : null;
  const rightValid = isValidCalendarDate(right) ? right : null;

  if (leftValid && rightValid) {
    return leftValid <= rightValid ? leftValid : rightValid;
  }

  return leftValid ?? rightValid;
}

/** Profile IANA timezone for sync/date interpretation. Does not change currentDay. */
export function toDateKeyInTimeZone(now: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;
    if (!year || !month || !day) {
      return toLocalDateKey(now);
    }
    const key = `${year}-${month}-${day}`;
    return isValidCalendarDate(key) ? key : toLocalDateKey(now);
  } catch {
    return toLocalDateKey(now);
  }
}
