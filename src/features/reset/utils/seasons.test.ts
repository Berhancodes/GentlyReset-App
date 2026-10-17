import {
  getNextSeasonOptions,
  personalizationForNextSeason,
  resolveSeason,
  resolveTaskForDay,
} from '../../../domain/reset/roadmap';
import { minutesForResetDay } from '../../../domain/reset/roadmap/modifiers';
import { mapSnapshotToCycleWrite } from '../sync/mapSnapshotToCloud';
import { mergeResetProgress } from '../sync/mergeResetProgress';
import type { CloudCycleRecord } from '../sync/types';
import type { ResetPersonalization, ResetSnapshot } from '../types';
import { parseLocalDateKey } from './calendar';
import { applyCompleteToday, applyStartNextSeason, isSeasonFinished } from './dailyResetActions';
import { getTaskForDay } from './getTaskForDay';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

const TYPE = 'fading-flame';
const ALL_DAYS = Array.from({ length: 30 }, (_, index) => index + 1);

function personalization(overrides: Partial<ResetPersonalization> = {}): ResetPersonalization {
  return {
    desiredFeelings: [],
    dailyCommitment: 'ten',
    focusAreas: ['energy', 'mind'],
    ...overrides,
  };
}

function snapshot(overrides: Partial<ResetSnapshot> = {}): ResetSnapshot {
  const nextPersonalization = overrides.personalization ?? personalization();
  const currentDay = overrides.currentDay ?? 1;
  return {
    currentDay,
    completedDays: [],
    todayCompleted: false,
    todayStarted: false,
    todayTask: getTaskForDay(currentDay, nextPersonalization, TYPE),
    resetStartedOn: '2026-09-01',
    lastSeenOn: '2026-09-30',
    lastCompletedOn: '2026-09-30',
    streak: 30,
    missedYesterday: false,
    resetTypeId: TYPE,
    personalization: nextPersonalization,
    reflections: [],
    ...overrides,
  };
}

const finished = snapshot({
  currentDay: 30,
  completedDays: ALL_DAYS,
  todayStarted: true,
  todayCompleted: true,
});

// Season resolution and choices.
const firstSeason = resolveSeason(personalization(), TYPE);
check(
  'snapshots without a season are season 1 in their first area',
  firstSeason.number === 1 && firstSeason.focusAreaId === 'energy' && firstSeason.level === 1,
);

const options = getNextSeasonOptions(personalization(), TYPE);
check(
  'next season offers the next preferred area or going deeper',
  options.next.focusAreaId === 'mind' &&
    options.next.level === 1 &&
    options.deeper.focusAreaId === 'energy' &&
    options.deeper.level === 2,
);

let walking = personalization({ focusAreas: ['energy'] });
const visited: string[] = [];
for (let season = 1; season <= 12; season += 1) {
  const current = resolveSeason(walking, TYPE);
  visited.push(`${current.focusAreaId}${current.level}`);
  walking = personalizationForNextSeason(
    walking,
    getNextSeasonOptions(walking, TYPE).next.focusAreaId,
    TYPE,
  );
}
check(
  'always taking the next area covers all 6 areas, then goes deeper in each',
  new Set(visited).size === 12 && visited.slice(6).every((entry) => entry.endsWith('2')),
  visited.join(','),
);
check('the season number keeps counting', resolveSeason(walking, TYPE).number === 13);

// Tasks change with the season.
const seasonTwo = personalizationForNextSeason(personalization(), 'energy', TYPE);
const levelOneDay = resolveTaskForDay(1, personalization(), TYPE);
const levelTwoDay = resolveTaskForDay(1, seasonTwo, TYPE);
check(
  'going deeper uses level 2 content, not a repeat',
  levelTwoDay.focusAreaId === 'energy' && levelTwoDay.steps[1] !== levelOneDay.steps[1],
  `${levelOneDay.steps[1]} / ${levelTwoDay.steps[1]}`,
);
const seasonOneRamp = minutesForResetDay(1, TYPE, 'ten', 1);
const seasonTwoRamp = minutesForResetDay(1, TYPE, 'ten', 2);
check(
  'later seasons skip the warm-up minutes',
  seasonOneRamp === 5 && seasonTwoRamp === 8,
  `${seasonOneRamp} / ${seasonTwoRamp}`,
);

// Starting the next season.
const now = parseLocalDateKey('2026-10-01');
check('a season with day 30 checked in is finished', isSeasonFinished(finished));
check(
  'an unfinished season cannot start the next one',
  applyStartNextSeason(snapshot({ currentDay: 12 }), 'mind', now).currentDay === 12,
);
const started = applyStartNextSeason(finished, 'mind', now);
check(
  'next season starts at day 1 today, in the chosen area',
  started.currentDay === 1 &&
    started.completedDays.length === 0 &&
    !started.todayCompleted &&
    started.resetStartedOn === '2026-10-01' &&
    resolveSeason(started.personalization, TYPE).number === 2 &&
    resolveSeason(started.personalization, TYPE).focusAreaId === 'mind',
);
check(
  'the streak and type carry into the new season',
  started.streak === 30 && started.resetTypeId === TYPE,
);
check(
  'finished areas are remembered',
  started.personalization.pastFocusAreas?.join(',') === 'energy',
);
const dayOne = applyCompleteToday(started, now);
check(
  'checking in day 1 of season 2 keeps the streak growing past 30',
  dayOne.completedDays.join(',') === '1' && dayOne.streak === 31,
  String(dayOne.streak),
);

// Cloud: each season is its own cycle, and the newer season wins a merge.
check('cloud cycle sequence follows the season', mapSnapshotToCycleWrite(started).sequence === 2);

function cloudOf(source: ResetSnapshot, sequence: number): CloudCycleRecord {
  const write = mapSnapshotToCycleWrite(source);
  return {
    cycle: { ...write, sequence, id: `cycle-${sequence}`, userId: 'user-a' },
    completions: source.completedDays.map((localDay) => ({
      id: `completion-${localDay}`,
      userId: 'user-a',
      cycleId: `cycle-${sequence}`,
      localDay,
      completedOn: null,
    })),
  };
}

const localAhead = mergeResetProgress(dayOne, cloudOf(finished, 1), '2026-10-01');
check(
  'a newer local season replaces the older cloud season',
  localAhead.kind === 'merged' &&
    localAhead.snapshot.completedDays.join(',') === '1' &&
    resolveSeason(localAhead.snapshot.personalization, TYPE).number === 2 &&
    localAhead.completions.length === 1,
);

const cloudAhead = mergeResetProgress(finished, cloudOf(dayOne, 2), '2026-10-01');
check(
  'a newer cloud season replaces the older local season',
  cloudAhead.kind === 'merged' &&
    resolveSeason(cloudAhead.snapshot.personalization, TYPE).number === 2 &&
    cloudAhead.snapshot.completedDays.join(',') === '1',
);

const oldCloud = cloudOf(snapshot({ currentDay: 3, completedDays: [1, 2] }), 1);
const withoutAreas = {
  ...oldCloud,
  cycle: {
    ...oldCloud.cycle,
    personalization: { desiredFeelings: [], dailyCommitment: 'ten' },
  },
};
const sameSeason = mergeResetProgress(
  snapshot({ currentDay: 3, completedDays: [1, 2] }),
  withoutAreas,
  '2026-09-30',
);
check(
  'an old cloud backup learns focus areas from this device',
  sameSeason.kind === 'merged' &&
    sameSeason.snapshot.personalization.focusAreas?.join(',') === 'energy,mind',
);

if (failed > 0) {
  throw new Error(`${failed} season check(s) failed`);
}

console.log('\nall season checks passed');
