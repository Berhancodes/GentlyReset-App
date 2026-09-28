export const SHARED_PROGRESS_FIELDS = [
  'userId',
  'displayName',
  'username',
  'avatarUrl',
  'currentDay',
  'cycleLength',
  'completedToday',
  'streak',
] as const;

export const SHARED_CYCLE_LENGTH = 30;

export type SharedFriendProgress = {
  userId: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  currentDay: number;
  cycleLength: typeof SHARED_CYCLE_LENGTH;
  completedToday: boolean;
  streak: number;
};

/**
 * Canonical "showed up today" from cloud reset fields.
 * today_completed is only valid on last_seen_on. A leftover true from
 * yesterday must not count as today. last_completed_on = today is the
 * other safe signal. This does not invent a social-only rule.
 */
export function completedTodayFromCloud(input: {
  todayCompleted: boolean;
  lastSeenOn: string | null;
  lastCompletedOn: string | null;
  today: string;
}): boolean {
  if (input.lastSeenOn === input.today) {
    return input.todayCompleted;
  }
  return input.lastCompletedOn === input.today;
}

export function toSharedFriendProgress(input: {
  userId: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  currentDay: number;
  todayCompleted: boolean;
  lastSeenOn: string | null;
  lastCompletedOn: string | null;
  streak: number;
  today: string;
}): SharedFriendProgress {
  const day = Math.min(SHARED_CYCLE_LENGTH, Math.max(1, input.currentDay));
  return {
    userId: input.userId,
    displayName: input.displayName,
    username: input.username,
    avatarUrl: input.avatarUrl,
    currentDay: day,
    cycleLength: SHARED_CYCLE_LENGTH,
    completedToday: completedTodayFromCloud({
      todayCompleted: input.todayCompleted,
      lastSeenOn: input.lastSeenOn,
      lastCompletedOn: input.lastCompletedOn,
      today: input.today,
    }),
    streak: Math.max(0, input.streak),
  };
}

export function hasOnlySharedProgressFields(payload: Record<string, unknown>): boolean {
  const keys = Object.keys(payload);
  return (
    keys.length === SHARED_PROGRESS_FIELDS.length &&
    keys.every((key) => (SHARED_PROGRESS_FIELDS as readonly string[]).includes(key))
  );
}

export function friendProgressCopy(
  progress: Pick<SharedFriendProgress, 'currentDay' | 'cycleLength' | 'completedToday' | 'streak'>,
): {
  dayLabel: string;
  presenceLabel: string | null;
  streakLabel: string | null;
} {
  const day = Math.min(progress.cycleLength, Math.max(1, progress.currentDay));
  return {
    dayLabel: `day ${day} of ${progress.cycleLength}`,
    presenceLabel: progress.completedToday ? 'showed up today' : 'taking today gently',
    streakLabel: progress.streak > 0 ? `${progress.streak} day streak` : null,
  };
}
