import { getWidgetTimeline, nextLocalMidnight, type WidgetResetState } from './getWidgetTimeline';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }

  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

const mascots = {
  idle: 'file:///idle.png',
  happy: 'file:///happy.png',
  cheer: 'file:///cheer.png',
};
const now = new Date(2026, 9, 11, 9, 41);
const base: WidgetResetState = {
  resetStartedOn: '2026-10-01',
  currentDay: 12,
  completedCount: 11,
  todayCompleted: false,
  missedYesterday: false,
  streak: 5,
  stepTitle: 'a 10-minute walk outside',
  roomName: 'your nook',
  roomGrewToday: false,
};

const morning = getWidgetTimeline(base, mascots, now);
const today = morning[0]?.props;
check('two entries: now and midnight', morning.length === 2);
check('morning asks to check in', today?.mood === 'todo' && today.headline === 'check in today');
check('shows the plan day and streak', today?.day === 12 && today.chip === 'streak 5');
check('shows today’s step', today?.step === 'a 10-minute walk outside');
check('uses the idle mascot', today?.mascot === mascots.idle);
check('progress is a fraction of the season', Math.abs((today?.progress ?? 0) - 11 / 30) < 1e-9);

const unfinishedMidnight = morning[1]?.props;
check(
  'an unfinished day turns gentle at midnight',
  unfinishedMidnight?.mood === 'missed' && unfinishedMidnight.headline === 'no restart needed',
);
check('the day does not advance without a check-in', unfinishedMidnight?.day === 12);

const done = getWidgetTimeline(
  { ...base, todayCompleted: true, completedCount: 12, streak: 6 },
  mascots,
  now,
);
check(
  'after checking in it is golden and happy',
  done[0]?.props.mood === 'done' && done[0]?.props.mascot === mascots.happy,
);
check('streak shows after checking in', done[0]?.props.chip === 'streak 6');
check(
  'a done day moves on at midnight',
  done[1]?.props.day === 13 && done[1]?.props.mood === 'todo',
);

const grew = getWidgetTimeline(
  { ...base, todayCompleted: true, roomGrewToday: true },
  mascots,
  now,
);
check(
  'a room upgrade day celebrates',
  grew[0]?.props.mood === 'upgrade' &&
    grew[0]?.props.mascot === mascots.cheer &&
    grew[0]?.props.chip === 'your nook',
);

const missed = getWidgetTimeline({ ...base, missedYesterday: true, streak: 0 }, mascots, now);
check(
  'after a missed day it never guilts',
  missed[0]?.props.mood === 'missed' && missed[0]?.props.chip === 'just continue',
);

const fresh = getWidgetTimeline({ ...base, resetStartedOn: null }, mascots, now);
check('before the reset starts it shows day one', fresh.length === 1 && fresh[0]?.props.day === 1);

check(
  'day is clamped to the season',
  getWidgetTimeline({ ...base, currentDay: 44 }, mascots, now)[0]?.props.day === 30,
);

const midnight = nextLocalMidnight(now);
check(
  'midnight is the start of tomorrow',
  midnight.getDate() === 12 && midnight.getHours() === 0 && midnight.getMinutes() === 0,
);

if (failed > 0) {
  throw new Error(`${failed} widget check(s) failed`);
}

console.log('\nall widget checks passed');
