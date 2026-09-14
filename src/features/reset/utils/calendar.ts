/** Local calendar key (YYYY-MM-DD). Avoid UTC so evening/morning don't skip a day. */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map((part) => Number(part));
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

export function shiftDateKey(key: string, dayDelta: number): string {
  const date = parseLocalDateKey(key);
  date.setDate(date.getDate() + dayDelta);
  return toLocalDateKey(date);
}

export function calendarDaysBetween(fromKey: string, toKey: string): number {
  const from = parseLocalDateKey(fromKey);
  const to = parseLocalDateKey(toKey);
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / 86_400_000);
}
