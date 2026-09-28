import type { TaskPrimitive } from './types';

function primitive(
  fields: Omit<TaskPrimitive, 'baseMinutes'> & { baseMinutes?: number },
): TaskPrimitive {
  return {
    ...fields,
    baseMinutes: fields.baseMinutes ?? 5,
  };
}

export const TASK_PRIMITIVES: readonly TaskPrimitive[] = [
  primitive({
    id: 'reduce-noise',
    category: 'grounding',
    objective: 'Make the field smaller so one next step can exist.',
    defaultTitle: 'Reduce the noise',
    defaultDescription: 'Notice what is taking up space. Put the extra down for today.',
  }),
  primitive({
    id: 'pick-one',
    category: 'clarity',
    objective: 'Choose one thing to keep and let the rest wait.',
    defaultTitle: 'Pick one',
    defaultDescription: 'Circle one small thing. Everything else can wait.',
  }),
  primitive({
    id: 'protect-one',
    category: 'boundaries',
    objective: 'Keep extra goals off the list.',
    defaultTitle: 'Protect the one thing',
    defaultDescription: 'When a new idea arrives, park it. Return to the one thing.',
  }),
  primitive({
    id: 'finish-small-loop',
    category: 'action',
    objective: 'Take one thing from start to done-enough.',
    defaultTitle: 'Finish a small loop',
    defaultDescription: 'Start one tiny thing and close it. Done-enough counts.',
  }),
  primitive({
    id: 'shrink-start',
    category: 'action',
    objective: 'Make the first move small enough to begin.',
    defaultTitle: 'Shrink the first move',
    defaultDescription: 'Cut the first step until it fits five minutes.',
  }),
  primitive({
    id: 'begin-before-ready',
    category: 'action',
    objective: 'Start without waiting to feel ready.',
    defaultTitle: 'Start before you feel ready',
    defaultDescription: 'Begin the smallest version now. Ready can catch up later.',
  }),
  primitive({
    id: 'practice-start',
    category: 'consistency',
    objective: 'Practice beginning until it is ordinary.',
    defaultTitle: 'Practice beginning',
    defaultDescription: 'Start again on purpose, even if yesterday was incomplete.',
  }),
  primitive({
    id: 'ordinary-bar',
    category: 'consistency',
    objective: 'Lower the bar to something repeatable.',
    defaultTitle: 'Make the bar ordinary',
    defaultDescription: 'Choose a version so small it does not need a mood.',
  }),
  primitive({
    id: 'repeat-same',
    category: 'consistency',
    objective: 'Repeat yesterday’s smallest win without adding novelty.',
    defaultTitle: 'Repeat the smallest win',
    defaultDescription: 'Do yesterday’s smallest version again. No upgrades.',
  }),
  primitive({
    id: 'no-new-monday',
    category: 'confidence',
    objective: 'Continue the same plan instead of restarting.',
    defaultTitle: 'No new Monday',
    defaultDescription: 'Use the same plan. Do not redesign it today.',
  }),
  primitive({
    id: 'tiny-return',
    category: 'confidence',
    objective: 'Come back in a tiny way after a slip.',
    defaultTitle: 'Return in a tiny way',
    defaultDescription: 'If you drifted, come back with the smallest possible step.',
  }),
  primitive({
    id: 'messy-counts',
    category: 'confidence',
    objective: 'Let an imperfect day still count.',
    defaultTitle: 'Let a messy day count',
    defaultDescription: 'A smaller, messier version still counts as showing up.',
  }),
  primitive({
    id: 'cap-effort',
    category: 'boundaries',
    objective: 'Stop at enough on purpose.',
    defaultTitle: 'Stop at enough',
    defaultDescription: 'Do the small version, then stop even if you could do more.',
  }),
  primitive({
    id: 'recover',
    category: 'recovery',
    objective: 'Treat restoration as part of the work.',
    defaultTitle: 'Let recovery count',
    defaultDescription: 'Do one restoring thing and treat it as part of the reset.',
  }),
  primitive({
    id: 'medium-effort',
    category: 'consistency',
    objective: 'Practice a medium day instead of a heroic one.',
    defaultTitle: 'Keep it medium',
    defaultDescription: 'Show up at a sustainable size. Impressive can wait.',
  }),
  primitive({
    id: 'name-true',
    category: 'clarity',
    objective: 'Name what is actually true right now.',
    defaultTitle: 'Name what is true now',
    defaultDescription: 'Write one honest sentence about where you are today.',
  }),
  primitive({
    id: 'choose-direction',
    category: 'direction',
    objective: 'Choose one direction small enough to walk.',
    defaultTitle: 'Choose one direction',
    defaultDescription: 'Pick one north for the rest of this reset. Let the rest wait.',
  }),
  primitive({
    id: 'walk-direction',
    category: 'direction',
    objective: 'Take one step on the chosen path.',
    defaultTitle: 'Walk the small path',
    defaultDescription: 'Take one step on the direction you already chose.',
  }),
  primitive({
    id: 'notice-self',
    category: 'identity',
    objective: 'Notice without trying to fix everything.',
    defaultTitle: 'Notice without fixing',
    defaultDescription: 'Spend a few minutes noticing how you actually feel. No repair project.',
  }),
  primitive({
    id: 'one-like-you',
    category: 'identity',
    objective: 'Bring back one thing that feels like you.',
    defaultTitle: 'One thing that feels like you',
    defaultDescription: 'Do one small thing that feels like you, even slightly.',
  }),
  primitive({
    id: 'belong-routine',
    category: 'identity',
    objective: 'Put yourself into an ordinary moment on purpose.',
    defaultTitle: 'Belong in an ordinary moment',
    defaultDescription: 'Be present for one ordinary part of the day as if it is yours.',
  }),
  primitive({
    id: 'one-window',
    category: 'structure',
    objective: 'Give the day one time window.',
    defaultTitle: 'Pick one window',
    defaultDescription: 'Choose one loose time today and keep the reset inside it.',
  }),
  primitive({
    id: 'one-place',
    category: 'structure',
    objective: 'Give the reset one place.',
    defaultTitle: 'Pick one place',
    defaultDescription: 'Choose one spot. Do the small reset only there.',
  }),
  primitive({
    id: 'clear-friction',
    category: 'structure',
    objective: 'Remove one bit of environmental friction.',
    defaultTitle: 'Clear one tiny obstacle',
    defaultDescription: 'Remove one thing that makes showing up harder.',
  }),
  primitive({
    id: 'same-loose-time',
    category: 'structure',
    objective: 'Repeat around the same loose time.',
    defaultTitle: 'Same loose time',
    defaultDescription: 'Show up around the same loose time as before. Close enough counts.',
  }),
  primitive({
    id: 'leave-evidence',
    category: 'action',
    objective: 'Leave proof that you showed up.',
    defaultTitle: 'Leave evidence you showed up',
    defaultDescription: 'Do the small thing and leave a tiny trace that it happened.',
  }),
  primitive({
    id: 'environment-easier',
    category: 'structure',
    objective: 'Make the next start easier in the environment.',
    defaultTitle: 'Make the environment easier',
    defaultDescription: 'Change one thing around you so tomorrow is easier to begin.',
  }),
  primitive({
    id: 'skip-all-or-nothing',
    category: 'confidence',
    objective: 'Refuse the all-or-nothing story.',
    defaultTitle: 'Skip the all-or-nothing story',
    defaultDescription: 'Do not catch up. Do today’s small version only.',
  }),
  primitive({
    id: 'trust-short',
    category: 'recovery',
    objective: 'Trust that a short session is enough.',
    defaultTitle: 'Trust a short session',
    defaultDescription: 'Keep it short on purpose. Then stop.',
  }),
  primitive({
    id: 'one-promise',
    category: 'clarity',
    objective: 'Keep one promise, not ten.',
    defaultTitle: 'Keep one promise',
    defaultDescription: 'Keep one small promise to yourself. Leave the rest.',
  }),
  primitive({
    id: 'kindness-after-slip',
    category: 'confidence',
    objective: 'Respond to a slip with continuation, not a verdict.',
    defaultTitle: 'Choose kindness after a slip',
    defaultDescription: 'If you slipped, skip the speech. Take the next small step.',
  }),
  primitive({
    id: 'gentle-close',
    category: 'reflection',
    objective: 'End the day with a gentle close.',
    defaultTitle: 'End the day on a gentle close',
    defaultDescription: 'Close the day with one kind, small finish.',
  }),
  primitive({
    id: 'honor-days',
    category: 'reflection',
    objective: 'Look back at the days already kept.',
    defaultTitle: 'Honor the days you showed up',
    defaultDescription: 'Look at the days you kept. Let that be enough evidence.',
  }),
  primitive({
    id: 'next-chapter',
    category: 'reflection',
    objective: 'Name the next small way without starting a new life.',
    defaultTitle: 'Name the next small way',
    defaultDescription: 'Name one small thing you will keep after today.',
  }),
  primitive({
    id: 'prepare-tonight',
    category: 'structure',
    objective: 'Prepare one thing so tomorrow is easier.',
    defaultTitle: 'Prepare one thing tonight',
    defaultDescription: 'Set out one reminder or tool for tomorrow. Then stop.',
  }),
  primitive({
    id: 'protect-window',
    category: 'boundaries',
    objective: 'Protect a small window from the rest of the day.',
    defaultTitle: 'Protect a five-minute window',
    defaultDescription: 'Guard a tiny slot. When it comes, use it, then return to the day.',
  }),
];

const PRIMITIVE_BY_ID: Record<string, TaskPrimitive> = Object.fromEntries(
  TASK_PRIMITIVES.map((item) => [item.id, item]),
);

export function getTaskPrimitive(id: string): TaskPrimitive {
  const primitiveItem = PRIMITIVE_BY_ID[id];
  if (!primitiveItem) {
    throw new Error(`Unknown task primitive: ${id}`);
  }
  return primitiveItem;
}
