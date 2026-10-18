import { DAILY_MESSAGES, MISSED_DAY_MESSAGES } from '../data/reminderCopy';
import {
  formatReminderTime,
  planReminders,
  REMINDER_DAYS_AHEAD,
  resolveReminderTime,
  shiftReminderTime,
} from './planReminders';

let failed = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}`);
}

const SIX_PM = { hour: 18, minute: 0 };
const morning = new Date(2026, 9, 18, 9, 0);
const evening = new Date(2026, 9, 18, 20, 0);
const isDaily = (title: string) =>
  DAILY_MESSAGES.some((m) => m.title.replace('{name}', 'Sam') === title || m.title === title);
const missedTitles = (MISSED_DAY_MESSAGES.continue ?? []).map((m) => m.title);

{
  const plan = planReminders({ now: morning, time: SIX_PM, todayCompleted: false });
  check('queues a week of reminders', plan.length === REMINDER_DAYS_AHEAD);
  check(
    'first one is today at 6pm',
    plan[0]?.date.getDate() === 18 && plan[0]?.date.getHours() === 18,
  );
  check(
    'ids are one per day',
    plan[0]?.id === 'daily-reminder-2026-10-18' && plan[1]?.id === 'daily-reminder-2026-10-19',
  );
  check('today is a normal reminder', isDaily(plan[0]?.title ?? ''));
  check(
    'tomorrow assumes today was missed until they check in',
    missedTitles.includes(plan[1]?.title ?? ''),
  );
  check(
    'later days use the missed-day wording',
    plan.slice(2).every((r) => missedTitles.includes(r.title)),
  );
}

{
  const plan = planReminders({ now: morning, time: SIX_PM, todayCompleted: true });
  check('no reminder today once checked in', plan[0]?.date.getDate() === 19);
  check('tomorrow is a normal reminder after a check-in', isDaily(plan[0]?.title ?? ''));
  check('six days queued after a check-in', plan.length === REMINDER_DAYS_AHEAD - 1);
}

{
  const plan = planReminders({ now: evening, time: SIX_PM, todayCompleted: false });
  check('skips today when the time has passed', plan[0]?.date.getDate() === 19);
}

{
  // Only the day after a check-in uses the daily wording, so look across two weeks of check-ins.
  const twoWeeks = Array.from({ length: 14 }, (_, day) => new Date(2026, 9, 18 + day, 9, 0));
  const withName = twoWeeks.flatMap((now) =>
    planReminders({ now, time: SIX_PM, todayCompleted: true, name: 'Sam' }),
  );
  const withoutName = twoWeeks.flatMap((now) =>
    planReminders({ now, time: SIX_PM, todayCompleted: true }),
  );
  check(
    'fills in their name',
    withName.some((r) => r.title.includes('Sam')),
  );
  check(
    'never leaves {name} in the text',
    [...withName, ...withoutName].every(
      (r) => !r.title.includes('{name}') && !r.body.includes('{name}'),
    ),
  );
}

{
  const easier = planReminders({
    now: morning,
    time: SIX_PM,
    todayCompleted: false,
    missedDayStyle: 'easier-day',
  });
  const easierTitles = (MISSED_DAY_MESSAGES['easier-day'] ?? []).map((m) => m.title);
  check(
    'missed-day wording follows their onboarding answer',
    easierTitles.includes(easier[1]?.title ?? ''),
  );
  const unknown = planReminders({
    now: morning,
    time: SIX_PM,
    todayCompleted: false,
    missedDayStyle: 'nope',
  });
  check('unknown style falls back to "continue"', missedTitles.includes(unknown[1]?.title ?? ''));
}

{
  const again = planReminders({ now: morning, time: SIX_PM, todayCompleted: false });
  const first = planReminders({ now: morning, time: SIX_PM, todayCompleted: false });
  check(
    'same day always gets the same message',
    again.every((r, i) => r.title === first[i]?.title),
  );
}

check('saved time wins', resolveReminderTime({ hour: 7, minute: 0 }, 'before-bed').hour === 7);
check('defaults from "before bed"', resolveReminderTime(null, 'before-bed').hour === 21);
check('defaults from "when I wake up"', resolveReminderTime(null, 'wake-up').hour === 8);
check('falls back to 7pm', resolveReminderTime(null, undefined).hour === 19);
check('formats 6pm', formatReminderTime(SIX_PM) === '6:00 pm');
check('formats 12:30pm', formatReminderTime({ hour: 12, minute: 30 }) === '12:30 pm');
check('formats midnight', formatReminderTime({ hour: 0, minute: 0 }) === '12:00 am');
check('steps forward half an hour', formatReminderTime(shiftReminderTime(SIX_PM, 1)) === '6:30 pm');
check(
  'wraps past midnight',
  formatReminderTime(shiftReminderTime({ hour: 23, minute: 30 }, 1)) === '12:00 am',
);
check(
  'wraps back before midnight',
  formatReminderTime(shiftReminderTime({ hour: 0, minute: 0 }, -1)) === '11:30 pm',
);

if (failed > 0) {
  throw new Error(`${failed} reminder check(s) failed`);
}
