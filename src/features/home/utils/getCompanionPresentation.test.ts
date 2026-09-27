import { getCompanionPresentation } from './getCompanionPresentation';
import type { CompanionPresentationInput } from './getCompanionPresentation';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function input(overrides: Partial<CompanionPresentationInput> = {}): CompanionPresentationInput {
  return {
    resetStartedOn: '2026-09-20',
    currentDay: 1,
    completedDays: [],
    todayStarted: false,
    todayCompleted: false,
    missedYesterday: false,
    resetTypeId: 'soft-restarter',
    now: new Date(2026, 8, 27, 9, 0, 0),
    ...overrides,
  };
}

const newUser = getCompanionPresentation(input({ resetStartedOn: null }));
check(
  'new user presentation',
  newUser.state === 'new_user' &&
    newUser.greeting === 'welcome' &&
    newUser.supportingMessage === 'this is your cozy place to begin.' &&
    newUser.animationId === 'wave' &&
    newUser.primaryCtaLabel === 'begin' &&
    newUser.primaryCtaDestination === 'home',
);

const day1Ready = getCompanionPresentation(input());
check(
  'Day 1 ready uses reset-type support and idle',
  day1Ready.state === 'ready' &&
    day1Ready.greeting === 'good morning' &&
    day1Ready.supportingMessage === "you don't have to start over. just continue." &&
    day1Ready.animationId === 'idle' &&
    day1Ready.primaryCtaLabel === "start today's reset",
);

const started = getCompanionPresentation(input({ todayStarted: true }));
check(
  'task started uses encourage',
  started.state === 'started' &&
    started.animationId === 'encourage' &&
    started.supportingMessage === 'take it slowly. I will be right here.' &&
    started.primaryCtaLabel === "continue today's reset",
);

const completed = getCompanionPresentation(
  input({
    currentDay: 3,
    completedDays: [1, 2, 3],
    todayStarted: true,
    todayCompleted: true,
  }),
);
check(
  'task completed uses celebrate',
  completed.state === 'completed' &&
    completed.animationId === 'celebrate' &&
    completed.supportingMessage === "that's a real day. I'm proud of you.",
);

const missed = getCompanionPresentation(
  input({ missedYesterday: true, resetTypeId: 'soft-restarter' }),
);
check(
  'missed-day return uses the reset-type missed line',
  missed.state === 'returned_after_miss' &&
    missed.animationId === 'welcome_back' &&
    missed.supportingMessage === 'you can continue from here. no restart required.',
);

const almostMissed = getCompanionPresentation(
  input({ missedYesterday: true, resetTypeId: 'almost-starter' }),
);
check(
  'reset type personalizes the missed-day line',
  almostMissed.supportingMessage ===
    'starting small still counts. five minutes is enough to begin again.' &&
    almostMissed.supportingMessage !== missed.supportingMessage,
);

const dreamerReady = getCompanionPresentation(input({ resetTypeId: 'overloaded-dreamer' }));
check(
  'reset type personalizes the ready line',
  dreamerReady.supportingMessage === 'one thing is enough today.' &&
    dreamerReady.supportingMessage !== day1Ready.supportingMessage,
);

const milestone = getCompanionPresentation(
  input({
    currentDay: 7,
    todayCompleted: true,
    completedDays: [1, 2, 3, 4, 5, 6, 7],
  }),
);
check(
  'ordinary milestone copy and animation',
  milestone.state === 'milestone' &&
    milestone.animationId === 'milestone' &&
    milestone.supportingMessage === 'one week of showing up. that counts.',
);

const cycleComplete = getCompanionPresentation(
  input({
    currentDay: 30,
    todayCompleted: true,
    completedDays: Array.from({ length: 30 }, (_, index) => index + 1),
    missedYesterday: true,
  }),
);
check(
  'Day 30 completed presentation',
  cycleComplete.state === 'cycle_complete' &&
    cycleComplete.animationId === 'milestone' &&
    cycleComplete.supportingMessage === 'thirty days. you kept the promise.' &&
    cycleComplete.primaryCtaLabel === "that's enough for today",
);

const named = getCompanionPresentation(input({ firstName: 'Maya' }));
check('first name is added to the greeting', named.greeting === 'good morning, Maya');

const namedWelcome = getCompanionPresentation(input({ resetStartedOn: null, firstName: 'Maya' }));
check('new user greeting uses the first name', namedWelcome.greeting === 'welcome, Maya');

const missingName = getCompanionPresentation(input({ firstName: '   ' }));
check('blank name is treated as missing', missingName.greeting === 'good morning');

const afternoon = getCompanionPresentation(
  input({ now: new Date(2026, 8, 27, 15, 0, 0), firstName: 'Sam' }),
);
check('afternoon greeting stays deterministic', afternoon.greeting === 'good afternoon, Sam');

if (failed > 0) {
  throw new Error(`${failed} companion presentation check(s) failed`);
}

console.log('\nall companion presentation checks passed');
