import { RESET_TYPE_IDS, type ResetPersonalization, type ResetTypeId } from '../types';
import { PLAN_DAY_COUNT } from '../resetPlanConstants';
import { TASK_PRIMITIVES, getTaskPrimitive } from './primitives';
import { TYPE_PLAYLISTS } from './playlists';
import { getRoadmapPhaseForDay } from './phase';
import { getTaskForDay, resolveTaskForDay } from './resolveTask';
import { AREA_DEEP_MOVES, AREA_MOVES, type AreaMove } from './areaMoves';
import { FOCUS_AREA_IDS } from './focusAreas';
import { minutesForResetDay } from './modifiers';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function personalization(overrides: Partial<ResetPersonalization> = {}): ResetPersonalization {
  return {
    desiredFeelings: [],
    ...overrides,
  };
}

const primitiveIds = new Set(TASK_PRIMITIVES.map((item) => item.id));

check('primitive catalog is non-empty', TASK_PRIMITIVES.length >= 20);

for (const typeId of RESET_TYPE_IDS) {
  const playlist = TYPE_PLAYLISTS[typeId];
  check(`${typeId} has exactly 30 days`, playlist.length === PLAN_DAY_COUNT);

  const days = playlist.map((slot) => slot.day);
  check(
    `${typeId} days are 1–30 in order`,
    days.join(',') === Array.from({ length: 30 }, (_, index) => index + 1).join(','),
  );

  const uniqueDays = playlist.filter((slot) => slot.uniqueTaskId).length;
  check(`${typeId} has 4–8 unique tasks`, uniqueDays >= 4 && uniqueDays <= 8, String(uniqueDays));

  let uniqueCount = 0;
  for (const slot of playlist) {
    check(`${typeId} d${slot.day} has title`, slot.title.trim().length > 0);
    check(`${typeId} d${slot.day} has description`, slot.description.trim().length > 0);
    check(`${typeId} d${slot.day} has reflection prompt`, slot.reflectionPrompt.trim().length > 0);
    check(
      `${typeId} d${slot.day} phase matches day`,
      slot.phase === getRoadmapPhaseForDay(slot.day),
    );
    check(
      `${typeId} d${slot.day} primitive exists`,
      primitiveIds.has(slot.primitiveId),
      slot.primitiveId,
    );
    if (slot.uniqueTaskId) {
      uniqueCount += 1;
    }

    const resolved = resolveTaskForDay(slot.day, personalization(), typeId);
    check(
      `${typeId} d${slot.day} resolves a concrete title`,
      resolved.title.trim().length > 0 && !resolved.title.includes('{m}'),
    );
    check(
      `${typeId} d${slot.day} resolves minutes`,
      resolved.minutes >= 0 && resolved.minutes <= 30,
    );
    check(`${typeId} d${slot.day} id is day-N`, resolved.id === `day-${slot.day}`);
    check(
      `${typeId} d${slot.day} objective comes from primitive`,
      resolved.objective === getTaskPrimitive(slot.primitiveId).objective,
    );
  }
  check(`${typeId} unique count recorded`, uniqueCount === uniqueDays);
}

const mindOne = getTaskForDay(1, personalization({ focusAreas: ['mind'] }), 'soft-restarter');
const energyOne = getTaskForDay(1, personalization({ focusAreas: ['energy'] }), 'soft-restarter');
check(
  'the focus area sets the day 1 task',
  mindOne.title === 'Empty your head onto paper' && energyOne.title === 'Get outside before noon',
  `${mindOne.title} / ${energyOne.title}`,
);

const gentle = getTaskForDay(4, personalization({ supportStyle: 'be-gentle' }), 'almost-starter');
const direct = getTaskForDay(4, personalization({ supportStyle: 'accountable' }), 'almost-starter');
check(
  'supportStyle changes description, not title or objective',
  gentle.title === direct.title &&
    gentle.description !== direct.description &&
    resolveTaskForDay(4, personalization({ supportStyle: 'be-gentle' }), 'almost-starter')
      .objective ===
      resolveTaskForDay(4, personalization({ supportStyle: 'accountable' }), 'almost-starter')
        .objective,
);

const twenty = getTaskForDay(24, personalization({ dailyCommitment: 'twenty' }), 'fading-flame');
const five = getTaskForDay(24, personalization({ dailyCommitment: 'five' }), 'fading-flame');
check('commitment changes minutes for ordinary types', twenty.minutes === 20 && five.minutes === 5);

const rampDays = [1, 8, 15, 22, 29].map((day) => minutesForResetDay(day, 'fading-flame', 'twenty'));
check(
  'minutes grow across the season',
  rampDays.join(',') === '10,12,15,20,20',
  rampDays.join(','),
);
check('week 1 starts below the chosen time', minutesForResetDay(2, 'fading-flame', 'five') === 3);

const MAX_TITLE_LENGTH = 34;
const MAX_STEP_LENGTH = 60;

function checkMoveShape(label: string, areaMove: AreaMove) {
  check(
    `${label} title is short`,
    areaMove.title.length <= MAX_TITLE_LENGTH,
    `${areaMove.title} (${areaMove.title.length})`,
  );
  check(`${label} has a why`, areaMove.why.trim().length > 0);
  check(
    `${label} has three short steps`,
    areaMove.steps.length === 3 &&
      areaMove.steps.every((step) => step.trim().length > 0 && step.length <= MAX_STEP_LENGTH),
    areaMove.steps.filter((step) => step.length > MAX_STEP_LENGTH).join(' | '),
  );
}

for (const areaId of FOCUS_AREA_IDS) {
  const levelTwo = AREA_DEEP_MOVES[areaId];
  check(`${areaId} level 2 has 30 moves`, levelTwo.length === PLAN_DAY_COUNT);
  for (const [index, areaMove] of levelTwo.entries()) {
    checkMoveShape(`${areaId} level 2 d${index + 1}`, areaMove);
    check(
      `${areaId} level 2 d${index + 1} differs from level 1`,
      areaMove.steps.join('|') !== AREA_MOVES[areaId][index]?.steps.join('|'),
    );
  }
  const moves = AREA_MOVES[areaId];
  check(`${areaId} has 30 moves`, moves.length === PLAN_DAY_COUNT);
  for (const [index, areaMove] of moves.entries()) {
    checkMoveShape(`${areaId} d${index + 1}`, areaMove);
  }
  const titles = new Set(moves.map((areaMove) => areaMove.title));
  check(`${areaId} level 1 titles are mostly distinct`, titles.size >= PLAN_DAY_COUNT - 4);
}

const energyDay = resolveTaskForDay(
  3,
  personalization({ dailyCommitment: 'ten', focusAreas: ['energy', 'mind'] }),
  'overloaded-dreamer',
);
check(
  'first focus area drives the concrete action',
  energyDay.focusAreaId === 'energy' &&
    energyDay.title === 'A walk at talking pace' &&
    energyDay.steps[1] === 'Walk 5 minutes at a pace you could chat at' &&
    energyDay.description.startsWith('An easy walk'),
  energyDay.description,
);
check('a day has three concrete steps', energyDay.steps.length === 3);
check(
  'no focus area falls back to the type area',
  resolveTaskForDay(4, personalization(), 'quiet-drain').focusAreaId === 'energy',
);
check(
  'unknown focus areas are skipped',
  resolveTaskForDay(4, personalization({ focusAreas: ['routine', 'mind'] }), 'quiet-drain')
    .focusAreaId === 'mind',
);
check(
  'no unfilled minute placeholders',
  FOCUS_AREA_IDS.every((areaId) =>
    Array.from({ length: PLAN_DAY_COUNT }, (_, index) =>
      resolveTaskForDay(index + 1, personalization({ focusAreas: [areaId] }), 'soft-scatter'),
    ).every(
      (task) =>
        !task.title.includes('{m}') &&
        !task.description.includes('{m}') &&
        !task.steps.join(' ').includes('{m}'),
    ),
  ),
);

check(
  'Quiet Drain week 1 caps 30+ at 10',
  minutesForResetDay(3, 'quiet-drain', 'thirty-plus') === 10,
);
check(
  'Quiet Drain week 3 caps 30+ at 20',
  minutesForResetDay(18, 'quiet-drain', 'thirty-plus') === 20,
);
check('Quiet Drain keeps a 5-minute choice', minutesForResetDay(25, 'quiet-drain', 'five') === 5);
check(
  'All-In Heart week 1 does not reward 30+',
  minutesForResetDay(2, 'all-in-heart', 'thirty-plus') === 10,
);
check(
  'All-In Heart later weeks still cap below hero days',
  minutesForResetDay(20, 'all-in-heart', 'thirty-plus') === 20,
);

// Time rules: tasks take their own time, capped, never stretched to the commitment.
const thirtyPlus = personalization({ dailyCommitment: 'thirty-plus', focusAreas: ['habits'] });
check(
  'a fixed task keeps its own time',
  getTaskForDay(1, thirtyPlus, 'soft-scatter').minutes === 2,
);
check(
  'a scaling task is capped',
  getTaskForDay(2, thirtyPlus, 'soft-scatter').minutes === 15,
  String(getTaskForDay(2, thirtyPlus, 'soft-scatter').minutes),
);
const energyThirty = personalization({ dailyCommitment: 'thirty-plus', focusAreas: ['energy'] });
check(
  'a during-your-day task has no minutes',
  getTaskForDay(2, energyThirty, 'soft-scatter').minutes === 0,
);
check(
  'start-leaning types begin week 1 at half',
  getTaskForDay(3, energyThirty, 'almost-starter').minutes ===
    Math.round(getTaskForDay(3, energyThirty, 'soft-scatter').minutes / 2),
);

// Lighter versions follow the reset type's lean.
const energyDayOne = personalization({ focusAreas: ['energy'] });
check(
  'gentle types are offered the lighter version',
  getTaskForDay(1, energyDayOne, 'quiet-drain').lighter === 'Sit by your brightest window instead.',
);
check(
  'standard types are not',
  getTaskForDay(1, energyDayOne, 'soft-scatter').lighter === undefined,
);
check(
  'Soft Restarter gets it in week 1 only',
  getTaskForDay(1, energyDayOne, 'soft-restarter').lighter !== undefined &&
    getTaskForDay(9, energyDayOne, 'soft-restarter').lighter === undefined,
);
const relationshipsDayOne = personalization({ focusAreas: ['relationships'] });
check(
  'Quiet Stranger gets it on social areas only',
  getTaskForDay(1, relationshipsDayOne, 'quiet-stranger').lighter !== undefined &&
    getTaskForDay(1, energyDayOne, 'quiet-stranger').lighter === undefined,
);

const clamped = getTaskForDay(31, personalization(), 'soft-scatter');
check('day 31 clamps to 30', clamped.day === 30 && clamped.id === 'day-30');
check('day 0 clamps to 1', getTaskForDay(0, personalization(), 'soft-scatter').day === 1);

const first = getTaskForDay(12, personalization({ supportStyle: 'be-gentle' }), 'quiet-stranger');
const second = getTaskForDay(12, personalization({ supportStyle: 'be-gentle' }), 'quiet-stranger');
check(
  'resolver is deterministic',
  first.title === second.title &&
    first.description === second.description &&
    first.minutes === second.minutes,
);

const phases: ResetTypeId = 'overloaded-dreamer';
check('days 1–7 stabilize', resolveTaskForDay(1, personalization(), phases).phase === 'stabilize');
check('days 8–14 change', resolveTaskForDay(8, personalization(), phases).phase === 'change');
check('days 15–21 pattern', resolveTaskForDay(15, personalization(), phases).phase === 'pattern');
check(
  'days 22–28 independence',
  resolveTaskForDay(22, personalization(), phases).phase === 'independence',
);
check('days 29–30 close', resolveTaskForDay(30, personalization(), phases).phase === 'close');

if (failed > 0) {
  throw new Error(`${failed} roadmap check(s) failed`);
}

console.log('\nall roadmap checks passed');
