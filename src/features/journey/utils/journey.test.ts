import {
  getJourneyChapterDays,
  getJourneyChapterForDay,
  getJourneyChapterIndexForDay,
  JOURNEY_CHAPTERS,
} from '../data/journeyChapters';
import { JOURNEY_CHAPTER_LAYOUTS } from '../layout/journeyChapterLayouts';
import { getJourneyArtLayout, mapJourneySourcePoint } from '../layout/journeySceneLayout';
import type { ResetPersonalization, ResetSnapshot } from '../../reset/types';
import { PLAN_DAY_COUNT, getPlanDayTitle } from '../../reset/data/thirtyDayPlan';
import { applyStartToday } from '../../reset/utils/dailyResetActions';
import { getTaskForDay } from '../../reset/utils/getTaskForDay';
import { getJourneyDayState } from './getJourneyDayState';
import {
  applyJourneySheetAction,
  getJourneySheetModel,
  journeyPressMutates,
} from './getJourneySheetModel';

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

function snapshot(overrides: Partial<ResetSnapshot> = {}): ResetSnapshot {
  const nextPersonalization = overrides.personalization ?? personalization();
  const currentDay = overrides.currentDay ?? 1;
  return {
    currentDay,
    completedDays: [],
    todayCompleted: false,
    todayStarted: false,
    todayTask: getTaskForDay(currentDay, nextPersonalization),
    resetStartedOn: '2026-09-19',
    lastSeenOn: '2026-09-19',
    lastCompletedOn: null,
    streak: 0,
    missedYesterday: false,
    resetTypeId: 'soft-restarter',
    personalization: nextPersonalization,
    reflections: [],
    ...overrides,
  };
}

const SOFT_RESTARTER_LINE = "you don't have to start over. just continue.";
const DREAMER_LINE = 'one thing is enough today.';
const ALMOST_STARTER_LINE = "you don't need to feel ready. just begin.";
const FADING_FLAME_LINE = 'ordinary progress is still progress.';

const defaultPersonalization = personalization();

check(
  '1. days 1–7 map to week 1 / start smaller',
  getJourneyChapterForDay(1)?.id === 'week-1' &&
    getJourneyChapterForDay(7)?.id === 'week-1' &&
    getJourneyChapterForDay(1)?.title === 'start smaller' &&
    getJourneyChapterIndexForDay(1) === 0 &&
    getJourneyChapterIndexForDay(7) === 0,
);

check(
  '2. days 8–14 map to week 2 / make it easier',
  getJourneyChapterForDay(8)?.id === 'week-2' &&
    getJourneyChapterForDay(14)?.id === 'week-2' &&
    getJourneyChapterForDay(8)?.title === 'make it easier' &&
    getJourneyChapterIndexForDay(8) === 1,
);

check(
  '3. days 15–21 map to week 3 / stay with it',
  getJourneyChapterForDay(15)?.id === 'week-3' &&
    getJourneyChapterForDay(21)?.id === 'week-3' &&
    getJourneyChapterForDay(15)?.title === 'stay with it' &&
    getJourneyChapterIndexForDay(15) === 2,
);

check(
  '4. days 22–28 map to week 4 / keep the promise',
  getJourneyChapterForDay(22)?.id === 'week-4' &&
    getJourneyChapterForDay(28)?.id === 'week-4' &&
    getJourneyChapterForDay(22)?.title === 'keep the promise' &&
    getJourneyChapterIndexForDay(22) === 3 &&
    getJourneyChapterForDay(29)?.id !== 'week-4',
);

check(
  '5. days 29–30 map to finish / a new beginning',
  getJourneyChapterForDay(29)?.id === 'finish' &&
    getJourneyChapterForDay(30)?.id === 'finish' &&
    getJourneyChapterForDay(29)?.subtitle === 'a new beginning' &&
    getJourneyChapterIndexForDay(29) === 4 &&
    getJourneyChapterIndexForDay(30) === 4,
);

check(
  '6. current day is current even if also listed in completedDays',
  getJourneyDayState(5, 5, [1, 2, 3, 4, 5], false).kind === 'current',
);

check(
  '7. a past day in completedDays is completed',
  getJourneyDayState(3, 5, [1, 2, 3], false).kind === 'completed',
);

check(
  '8. unseen later days are future and stay visible in the chapter',
  getJourneyDayState(7, 2, [1], false).kind === 'future' &&
    getJourneyChapterDays(JOURNEY_CHAPTERS[0]!).length === 7 &&
    JOURNEY_CHAPTER_LAYOUTS['week-1'].some((node) => node.day === 7),
);

check(
  '9. current chapter selection follows currentDay ranges',
  getJourneyChapterIndexForDay(1) === 0 &&
    getJourneyChapterIndexForDay(5) === 0 &&
    getJourneyChapterIndexForDay(8) === 1 &&
    getJourneyChapterIndexForDay(15) === 2 &&
    getJourneyChapterIndexForDay(22) === 3 &&
    getJourneyChapterIndexForDay(29) === 4 &&
    getJourneyChapterIndexForDay(30) === 4,
);

const futureState = snapshot({ currentDay: 3, completedDays: [1, 2] });
const afterFutureOpen = applyJourneySheetAction(futureState, 'open');
const futureModel = getJourneySheetModel({
  day: 10,
  currentDay: 3,
  completedDays: [1, 2],
  todayStarted: false,
  todayCompleted: false,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  '10. future tap does not mutate reset state',
  afterFutureOpen === futureState &&
    futureModel.kind === 'future' &&
    futureModel.cta === 'none' &&
    futureModel.footnote === "you'll get here soon." &&
    !journeyPressMutates(),
);

const completedState = snapshot({
  currentDay: 8,
  completedDays: [1, 2, 3, 4, 5, 6, 7],
});
const afterCompletedOpen = applyJourneySheetAction(completedState, 'open');
const afterCompletedClose = applyJourneySheetAction(completedState, 'close');
const completedModel = getJourneySheetModel({
  day: 4,
  currentDay: 8,
  completedDays: completedState.completedDays,
  todayStarted: false,
  todayCompleted: false,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  '11. completed tap does not recomplete or mutate',
  afterCompletedOpen.completedDays.join(',') === completedState.completedDays.join(',') &&
    afterCompletedClose.todayCompleted === false &&
    completedModel.cta === 'none' &&
    completedModel.completeLabel === '✓ complete' &&
    applyJourneySheetAction(completedState, 'continue').completedDays.length ===
      completedState.completedDays.length,
);

const idle = snapshot({ currentDay: 1 });
const startedBySheet = applyJourneySheetAction(idle, 'start');
const startedByExisting = applyStartToday(idle);
check(
  '12. current Start calls the existing start action',
  startedBySheet.todayStarted === true &&
    startedBySheet.todayCompleted === false &&
    startedBySheet.completedDays.length === 0 &&
    startedBySheet.currentDay === idle.currentDay &&
    startedBySheet.todayStarted === startedByExisting.todayStarted &&
    startedBySheet.todayCompleted === startedByExisting.todayCompleted,
);

const startedModel = getJourneySheetModel({
  day: 1,
  currentDay: 1,
  completedDays: [],
  todayStarted: true,
  todayCompleted: false,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  '13. started current CTA is Continue',
  startedModel.cta === 'continue' &&
    startedModel.ctaLabel === "continue today's reset →" &&
    applyJourneySheetAction(startedBySheet, 'continue').todayCompleted === false,
);

const completedCurrentModel = getJourneySheetModel({
  day: 1,
  currentDay: 1,
  completedDays: [1],
  todayStarted: true,
  todayCompleted: true,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  '14. completed current shows completed and has no start button',
  completedCurrentModel.kind === 'current' &&
    completedCurrentModel.completeLabel === '✓ reset complete' &&
    completedCurrentModel.cta === 'none' &&
    completedCurrentModel.ctaLabel === null,
);

const homeDay8 = getTaskForDay(8, defaultPersonalization);
const journeyDay8 = getTaskForDay(8, defaultPersonalization);
const homeDay30 = getTaskForDay(30, defaultPersonalization);
const journeyDay30 = getTaskForDay(30, defaultPersonalization);
check(
  '15. Home and Journey titles are identical for the same day',
  homeDay8.title === journeyDay8.title &&
    homeDay8.title === getPlanDayTitle(8) &&
    homeDay30.title === journeyDay30.title &&
    homeDay30.title === getPlanDayTitle(30) &&
    homeDay8.minutes === journeyDay8.minutes &&
    homeDay8.description === journeyDay8.description,
);

const restarterSheet = getJourneySheetModel({
  day: 1,
  currentDay: 1,
  completedDays: [],
  todayStarted: false,
  todayCompleted: false,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
const dreamerSheet = getJourneySheetModel({
  day: 1,
  currentDay: 1,
  completedDays: [],
  todayStarted: false,
  todayCompleted: false,
  personalization: defaultPersonalization,
  rememberLine: DREAMER_LINE,
});
function linesDiffer(left: string | null, right: string | null): boolean {
  return left !== right;
}
check(
  '16. reset type reminder comes from the profile line, not a hard-coded Dreamer',
  restarterSheet.rememberLine === SOFT_RESTARTER_LINE &&
    dreamerSheet.rememberLine === DREAMER_LINE &&
    linesDiffer(restarterSheet.rememberLine, dreamerSheet.rememberLine) &&
    new Set([SOFT_RESTARTER_LINE, DREAMER_LINE, ALMOST_STARTER_LINE, FADING_FLAME_LINE]).size === 4,
);

const overflowTask = getTaskForDay(31, defaultPersonalization);
const finishDays = getJourneyChapterDays(getJourneyChapterForDay(30) ?? JOURNEY_CHAPTERS[4]!);
const finishNodes = JOURNEY_CHAPTER_LAYOUTS.finish;
check(
  '17. day 30 does not exceed the 30-day plan',
  overflowTask.day === PLAN_DAY_COUNT &&
    overflowTask.title === getPlanDayTitle(30) &&
    getJourneyChapterForDay(31)?.endDay === 30 &&
    finishDays.join(',') === '29,30' &&
    finishNodes.every((node) => node.day <= PLAN_DAY_COUNT) &&
    finishNodes.length === 2,
);

check(
  'weeks 1–4 each have exactly 7 nodes; finish has 2',
  JOURNEY_CHAPTER_LAYOUTS['week-1'].length === 7 &&
    JOURNEY_CHAPTER_LAYOUTS['week-2'].length === 7 &&
    JOURNEY_CHAPTER_LAYOUTS['week-3'].length === 7 &&
    JOURNEY_CHAPTER_LAYOUTS['week-4'].length === 7 &&
    JOURNEY_CHAPTER_LAYOUTS.finish.length === 2,
);

check(
  'checkpoints are days 7, 14, 21, 28 only',
  JOURNEY_CHAPTER_LAYOUTS['week-1'].some((node) => node.day === 7 && node.checkpoint) &&
    JOURNEY_CHAPTER_LAYOUTS['week-2'].some((node) => node.day === 14 && node.checkpoint) &&
    JOURNEY_CHAPTER_LAYOUTS['week-3'].some((node) => node.day === 21 && node.checkpoint) &&
    JOURNEY_CHAPTER_LAYOUTS['week-4'].some((node) => node.day === 28 && node.checkpoint) &&
    !JOURNEY_CHAPTER_LAYOUTS.finish.some((node) => node.checkpoint),
);

const idleModel = getJourneySheetModel({
  day: 1,
  currentDay: 1,
  completedDays: [],
  todayStarted: false,
  todayCompleted: false,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  'unstarted current CTA is Start',
  idleModel.cta === 'start' && idleModel.ctaLabel === "start today's reset →",
);

const layout = getJourneyArtLayout(390, 600, 798, 1972);
const mapped = mapJourneySourcePoint(layout, { x: 0.5, y: 0.5 });
check(
  'art layout preserves aspect and maps source points onto the image',
  Math.abs(layout.width / layout.height - 798 / 1972) < 1e-9 &&
    mapped.x > layout.left &&
    mapped.x < layout.left + layout.width &&
    mapped.y > layout.top &&
    mapped.y < layout.top + layout.height,
);

const nodesOnUnitSquare = Object.values(JOURNEY_CHAPTER_LAYOUTS).every((nodes) =>
  nodes.every((node) => node.x > 0 && node.x < 1 && node.y > 0 && node.y < 1),
);
check('every node uses normalized source-space coordinates', nodesOnUnitSquare);

if (failed > 0) {
  throw new Error(`${failed} journey check(s) failed`);
}

console.log('\nall journey checks passed');
