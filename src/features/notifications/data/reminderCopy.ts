/**
 * Daily reminder wording and default times. Local notifications only; friend
 * notifications are written by the server (supabase/migrations/*_friend_push_notifications.sql).
 *
 * Reminders show on the lock screen, so they never mention anything personal
 * from onboarding or the journal. `{name}` is the name the person gave in
 * onboarding; messages that use it have a fallback without it.
 */

export type ReminderTime = { hour: number; minute: number };

export type ReminderMessage = { title: string; body: string };

/** Answer ids of the onboarding question "when would a reset help you most?". */
export type SupportTimingId = 'wake-up' | 'during-day' | 'after-work' | 'before-bed';

export const DEFAULT_REMINDER_TIMES: Record<SupportTimingId, ReminderTime> = {
  'wake-up': { hour: 8, minute: 30 },
  'during-day': { hour: 12, minute: 30 },
  'after-work': { hour: 18, minute: 0 },
  'before-bed': { hour: 21, minute: 0 },
};

/** Used when the onboarding answer is missing. */
export const FALLBACK_REMINDER_TIME: ReminderTime = { hour: 19, minute: 0 };

export const NAME_PLACEHOLDER = '{name}';

/** A normal day: today's step is waiting. Rotated by date so they don't repeat. */
export const DAILY_MESSAGES: readonly ReminderMessage[] = [
  { title: 'one small step today?', body: 'it only takes a few minutes. I saved you a spot 🤍' },
  { title: `hey ${NAME_PLACEHOLDER} 👋`, body: 'today’s little step is ready when you are.' },
  { title: 'your room is waiting 🌱', body: 'check in and something new moves in.' },
  { title: 'a tiny reset?', body: 'three small ticks. that’s the whole thing.' },
  { title: 'just checking on you', body: 'whenever you’re ready, today’s step is here.' },
  { title: `${NAME_PLACEHOLDER}, it’s reset time`, body: 'small and gentle, like always.' },
  { title: 'a little lighter, every day', body: 'today’s step is ready. it’s a small one.' },
];

/** After a missed day, in the tone they chose for "what should happen if you miss a day?". */
export const MISSED_DAY_MESSAGES: Record<string, readonly ReminderMessage[]> = {
  continue: [
    { title: 'no restart needed', body: 'missed a day? that’s okay. just continue 🤍' },
    { title: 'pick up where you left off', body: 'nothing is lost. today’s step is tiny.' },
  ],
  'easier-day': [
    { title: 'an easy one today', body: 'missed a day? today can be the lighter version.' },
    { title: 'go gently today', body: 'the low-energy version still counts.' },
  ],
  'remind-why': [
    {
      title: 'remember why you started 🤍',
      body: 'it’s still there. one small step brings it back.',
    },
    { title: 'your reason hasn’t gone anywhere', body: 'come say hi and pick it back up.' },
  ],
  'ask-what-happened': [
    { title: 'how have you been?', body: 'no pressure. come tell me how today feels.' },
    { title: 'I missed you 🤍', body: 'everything okay? today’s step is small.' },
  ],
};

export const DEFAULT_MISSED_DAY_STYLE = 'continue';
