/**
 * How long a task takes. Tasks are sized to the activity, not stretched to the
 * user's whole commitment:
 * - `fixed`: about this many minutes for everyone (making the bed: 2).
 * - `scales`: the user's ramped minutes, capped at `max` (a walk: up to 20).
 *   `{m}` in a step is replaced with that number.
 * - `during`: done inside something you already do (a meal, a conversation).
 */
export type TaskTime =
  { kind: 'fixed'; minutes: number } | { kind: 'scales'; max: number } | { kind: 'during' };

export function fixed(minutes: number): TaskTime {
  return { kind: 'fixed', minutes };
}

export function upTo(max: number): TaskTime {
  return { kind: 'scales', max };
}

export const during: TaskTime = { kind: 'during' };

/**
 * One concrete day of a focus area.
 *
 * - `title`: the actual task, short enough for the day card heading.
 * - `why`: one sentence on what it helps with, shown under the title.
 * - `steps`: three specific instructions, ticked off one by one. The last one
 *   closes the task.
 * - `time`: see TaskTime.
 * - `lighter`: an easier version that still counts, offered to reset types
 *   that lean gentle (see resolveTask).
 *
 * Every day stands alone: it never depends on something written or decided on
 * another day, so a skipped day never breaks the next one.
 */
export type AreaMove = {
  title: string;
  why: string;
  steps: readonly [string, string, string];
  time: TaskTime;
  lighter?: string;
};

type MoveOptions = { time?: TaskTime; lighter?: string };

/** Level 2 content written before time rules scales with the user, up to 30. */
const DEFAULT_TIME = upTo(30);

export function move(
  title: string,
  why: string,
  steps: readonly [string, string, string],
  options: MoveOptions = {},
): AreaMove {
  return {
    title,
    why,
    steps,
    time: options.time ?? DEFAULT_TIME,
    ...(options.lighter ? { lighter: options.lighter } : {}),
  };
}
