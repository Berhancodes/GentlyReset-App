import { RESET_TYPE_IDS, type ResetPersonalization, type ResetTypeId } from '../types';
import { PLAN_DAY_COUNT } from '../resetPlanConstants';
import { TASK_PRIMITIVES, getTaskPrimitive } from './primitives';
import { TYPE_PLAYLISTS } from './playlists';
import { getRoadmapPhaseForDay } from './phase';
import { getTaskForDay, resolveTaskForDay } from './resolveTask';
import { AREA_DEEP_MOVES, AREA_MOVES } from './areaMoves';
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
    check(`${typeId} d${slot.day} resolves title`, resolved.title === slot.title);
    check(
      `${typeId} d${slot.day} resolves minutes`,
      resolved.minutes >= 3 && resolved.minutes <= 30,
    );
    check(`${typeId} d${slot.day} id is day-N`, resolved.id === `day-${slot.day}`);
    check(
      `${typeId} d${slot.day} objective comes from primitive`,
      resolved.objective === getTaskPrimitive(slot.primitiveId).objective,
    );
  }
  check(`${typeId} unique count recorded`, uniqueCount === uniqueDays);
}

const restarterOne = getTaskForDay(1, personalization(), 'soft-restarter');
const dreamerOne = getTaskForDay(1, personalization(), 'overloaded-dreamer');
check(
  'type-specific day 1 titles differ',
  restarterOne.title !== dreamerOne.title &&
    restarterOne.title === 'Keep the same plan' &&
    dreamerOne.title === 'Shrink the pile',
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

const rampDays = [1, 8, 15, 22, 29].map(
  (day) =>
    getTaskForDay(day, personalization({ dailyCommitment: 'twenty' }), 'fading-flame').minutes,
);
check(
  'minutes grow across the season',
  rampDays.join(',') === '10,12,15,20,20',
  rampDays.join(','),
);
check(
  'week 1 starts below the chosen time',
  getTaskForDay(2, personalization({ dailyCommitment: 'five' }), 'fading-flame').minutes === 3,
);

for (const areaId of FOCUS_AREA_IDS) {
  const levelTwo = AREA_DEEP_MOVES[areaId];
  check(`${areaId} level 2 has 30 moves`, levelTwo.length === PLAN_DAY_COUNT);
  for (const [index, areaMove] of levelTwo.entries()) {
    check(
      `${areaId} level 2 d${index + 1} labels are short`,
      areaMove.prep.length <= 24 && areaMove.act.length <= 24,
      `${areaMove.prep} / ${areaMove.act}`,
    );
    check(
      `${areaId} level 2 d${index + 1} differs from level 1`,
      areaMove.detail !== AREA_MOVES[areaId][index]?.detail,
    );
  }
  const moves = AREA_MOVES[areaId];
  check(`${areaId} has 30 moves`, moves.length === PLAN_DAY_COUNT);
  for (const [index, areaMove] of moves.entries()) {
    check(
      `${areaId} d${index + 1} labels are short`,
      areaMove.prep.length <= 24 && areaMove.act.length <= 24,
      `${areaMove.prep} / ${areaMove.act}`,
    );
  }
}

const energyDay = resolveTaskForDay(
  4,
  personalization({ dailyCommitment: 'ten', focusAreas: ['energy', 'mind'] }),
  'overloaded-dreamer',
);
check(
  'first focus area drives the concrete action',
  energyDay.focusAreaId === 'energy' &&
    energyDay.steps[1] === 'Easy walk 5 min' &&
    energyDay.description.startsWith('Take an easy 5-minute walk'),
  energyDay.description,
);
check('steps end with check in', energyDay.steps.length === 3 && energyDay.steps[2] === 'Check in');
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
    ).every((task) => !task.description.includes('{m}') && !task.steps.join(' ').includes('{m}')),
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
