import {
  getJourneyChapterDays,
  getJourneyChapterForDay,
  getJourneyChapterIndexForDay,
  getJourneyWeekLabel,
  JOURNEY_CHAPTERS,
} from '../data/journeyChapters';
import { motion } from '../../../design-system/motion';
import { getCompanionState } from '../../../domain/reset/companionState';
import { completeResetDay } from '../../../application/reset/completeResetDay';
import { getJourneyQuote, getJourneySignLine } from '../data/journeyCopy';
import {
  getJourneyMountainRect,
  getJourneyStageLayout,
  getJourneyTreeLeftRect,
  getJourneyTreeRightRect,
  getJourneyVisibleDays,
  JOURNEY_BUSH_ART,
  JOURNEY_DAY1_ANCHORS,
  JOURNEY_MASCOT_ART,
  JOURNEY_MOUNTAIN_ART,
  JOURNEY_MOUNTAIN_LAYOUT,
  JOURNEY_SIGN_ART,
  JOURNEY_TREE_LEFT_ART,
  JOURNEY_TREE_LEFT_LAYOUT,
  JOURNEY_TREE_RIGHT_ART,
  JOURNEY_TREE_RIGHT_LAYOUT,
  splitJourneyTaskTitle,
} from '../layout/journeyStageLayout';
import type { ResetPersonalization, ResetSnapshot } from '../../reset/types';
import { PLAN_DAY_COUNT, getPlanDayTitle } from '../../reset/data/thirtyDayPlan';
import { parseLocalDateKey } from '../../reset/utils/calendar';
import {
  applyCompleteToday,
  applySaveReflection,
  applyStartToday,
} from '../../reset/utils/dailyResetActions';
import { getTaskForDay } from '../../reset/utils/getTaskForDay';
import { getCurrentResetTask } from '../../reset/utils/resetSelectors';
import {
  getJourneySkyEntranceStart,
  getJourneySkyPieces,
  getJourneySkyRest,
} from './getJourneySkyEntrance';
import { getJourneyDayState } from './getJourneyDayState';
import { getJourneySeason } from './getJourneySeason';
import { shortenSheetDescription } from './shortenSheetDescription';
import {
  getJourneyCalendarMonth,
  getJourneyCheckInDates,
  getJourneyHeatmap,
  getJourneyLongestStreak,
  getJourneyMilestoneTrack,
  getJourneySeasonWeeks,
  getJourneyShowUpMessage,
  getJourneyStats,
  getJourneyStreakLine,
} from './getJourneyStats';
import { getJourneyProgression } from './getJourneyProgression';
import {
  getJourneyParallaxOffset,
  getJourneyWalkDirection,
  getJourneyWalkTranslate,
  JOURNEY_WALK_LAYERS,
  sampleJourneyWalkEased,
} from './getJourneyWalkMotion';
import {
  getJourneyIncomingDay,
  getJourneyRestingDays,
  getJourneyTimelinePositions,
  getJourneyTimelineTrack,
} from './getJourneyTimelineMotion';
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

function dateOn(key: string): Date {
  return parseLocalDateKey(key);
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
    todayTask: getTaskForDay(
      currentDay,
      nextPersonalization,
      overrides.resetTypeId ?? 'soft-restarter',
    ),
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
  '8. unseen later days are future and stay in the week data',
  getJourneyDayState(7, 2, [1], false).kind === 'future' &&
    getJourneyChapterDays(JOURNEY_CHAPTERS[0]!).length === 7,
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
    completedModel.completeLabel === '✓ done',
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
  '13. started current CTA is Complete',
  startedModel.cta === 'complete' && startedModel.ctaLabel === 'Check in for today',
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
    completedCurrentModel.completeLabel === '✓ checked in' &&
    completedCurrentModel.cta === 'none' &&
    completedCurrentModel.ctaLabel === null,
);

const homeDay8 = getCurrentResetTask(snapshot({ currentDay: 8 }));
const journeyDay8 = getCurrentResetTask(snapshot({ currentDay: 8 }));
const homeDay30 = getCurrentResetTask(snapshot({ currentDay: 30 }));
const journeyDay30 = getCurrentResetTask(snapshot({ currentDay: 30 }));
check(
  '15. Home and Journey titles are identical for the same day',
  homeDay8.title === journeyDay8.title &&
    homeDay8.title === getPlanDayTitle(8, 'soft-restarter') &&
    homeDay30.title === journeyDay30.title &&
    homeDay30.title === getPlanDayTitle(30, 'soft-restarter') &&
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

const overflowTask = getTaskForDay(31, defaultPersonalization, 'soft-restarter');
const finishDays = getJourneyChapterDays(getJourneyChapterForDay(30) ?? JOURNEY_CHAPTERS[4]!);
const day1Visible = getJourneyVisibleDays(1);
const day30Visible = getJourneyVisibleDays(30);
check(
  '17. day 30 does not exceed the 30-day plan',
  overflowTask.day === PLAN_DAY_COUNT &&
    overflowTask.title === getPlanDayTitle(30, 'soft-restarter') &&
    getJourneyChapterForDay(31)?.endDay === 30 &&
    finishDays.join(',') === '29,30' &&
    day30Visible.join(',') === '30' &&
    day30Visible[0] === PLAN_DAY_COUNT,
);

check(
  'resting path shows only the current day',
  day1Visible.join(',') === '1' &&
    !day1Visible.includes(2) &&
    getJourneyRestingDays(3).join(',') === '3' &&
    getJourneyRestingDays(30).join(',') === '30',
);

check(
  'task title splits to the screenshot two-line copy',
  splitJourneyTaskTitle('Start smaller than usual').join(' / ') === 'start smaller / than usual',
);

const stage390 = getJourneyStageLayout(390, 520);
const stage393 = getJourneyStageLayout(393, 530);
const stage430 = getJourneyStageLayout(430, 600);
check(
  'Day 1 node is at ~44% of stage width; Day 2 at 78–80%',
  Math.abs(stage390.day1X / stage390.width - 0.44) < 1e-9 &&
    Math.abs(stage390.day2X / stage390.width - 0.79) < 1e-9 &&
    stage390.day2X / stage390.width >= 0.78 &&
    stage390.day2X / stage390.width <= 0.8,
);

check(
  'track spans ~9–93% and is not evenly spaced',
  Math.abs(stage390.lineLeft / stage390.width - 0.09) < 1e-9 &&
    Math.abs((stage390.lineLeft + stage390.lineWidth) / stage390.width - 0.93) < 1e-9 &&
    stage390.day2X - stage390.day1X > stage390.width * 0.3,
);

const mascotCenterX = stage390.mascot.left + stage390.mascot.width * JOURNEY_MASCOT_ART.bodyCenterX;
const bodySitY = stage390.mascot.top + stage390.mascot.height * JOURNEY_MASCOT_ART.standingY;
const toeY = stage390.mascot.top + stage390.mascot.height * JOURNEY_MASCOT_ART.feetY;
const signGroundY = stage390.sign.top + stage390.sign.height * JOURNEY_SIGN_ART.visualBottom;
const bushGroundY = stage390.bush.top + stage390.bush.height * JOURNEY_BUSH_ART.visualBottom;
const bushLeftGroundY =
  stage390.bushLeft.top + stage390.bushLeft.height * JOURNEY_BUSH_ART.visualBottom;
check(
  'mascot stands on the day line without the line cutting the toes',
  Math.abs(mascotCenterX - stage390.day1X) < 0.5 &&
    bodySitY < stage390.lineY &&
    toeY <= stage390.lineY &&
    stage390.lineY - toeY > 0 &&
    stage390.lineY - toeY <= stage390.nodeSize * 0.4,
);

check(
  'mascot, sign, and plants share the same ground line',
  Math.abs(signGroundY - toeY) < 0.5 &&
    Math.abs(bushGroundY - toeY) < 0.5 &&
    Math.abs(bushLeftGroundY - toeY) < 0.5,
);

check(
  '390 / 393 / 430 keep the same stage fractions',
  [stage393, stage430].every(
    (stage) =>
      Math.abs(stage.day1X / stage.width - JOURNEY_DAY1_ANCHORS.day1X) < 1e-9 &&
      Math.abs(stage.day2X / stage.width - JOURNEY_DAY1_ANCHORS.day2X) < 1e-9 &&
      Math.abs(stage.lineLeft / stage.width - JOURNEY_DAY1_ANCHORS.lineLeftX) < 1e-9,
  ),
);

const mountains390 = getJourneyMountainRect(390, 500);
const mountains430 = getJourneyMountainRect(430, 560);
const mountainsShort = getJourneyMountainRect(320, 400);
check(
  'mountains stay 14% wider than the environment and keep the art aspect',
  Math.abs(mountains390.width / 390 - JOURNEY_MOUNTAIN_LAYOUT.widthScale) < 1e-9 &&
    Math.abs(mountains390.left - (390 - mountains390.width) / 2) < 1e-9 &&
    Math.abs(
      mountains390.width / mountains390.height -
        JOURNEY_MOUNTAIN_ART.width / JOURNEY_MOUNTAIN_ART.height,
    ) < 1e-9,
);

check(
  'mountains lift into the lower-middle and stay behind the center opening',
  Math.abs(mountains390.bottom / 500 - JOURNEY_MOUNTAIN_LAYOUT.bottom) < 1e-9 &&
    mountains390.bottom > 0 &&
    500 - mountains390.bottom - mountains390.height > 500 * 0.14,
);

check(
  'wide phones crop the mountain sides without changing the composition',
  Math.abs(mountains430.width / 430 - mountains390.width / 390) < 1e-9 &&
    Math.abs(mountains430.left / 430 - mountains390.left / 390) < 1e-9 &&
    mountains430.left < 0 &&
    Math.abs(mountainsShort.width / 320 - mountains390.width / 390) < 1e-9,
);

const treeLeft320 = getJourneyTreeLeftRect(320, 400);
const treeLeft390 = getJourneyTreeLeftRect(390, 500);
const treeLeft430 = getJourneyTreeLeftRect(430, 560);
const treeVisibleRight = (tree: { left: number; width: number }) =>
  tree.left + tree.width * JOURNEY_TREE_LEFT_ART.contentRight;
check(
  'left tree stays 90% of the environment, lifted, and keeps the art aspect',
  Math.abs(treeLeft390.width / 390 - JOURNEY_TREE_LEFT_LAYOUT.widthScale) < 1e-9 &&
    treeLeft390.left < 0 &&
    Math.abs(
      treeLeft390.width / treeLeft390.height -
        JOURNEY_TREE_LEFT_ART.width / JOURNEY_TREE_LEFT_ART.height,
    ) < 1e-9,
);

check(
  'narrow phones crop more of the left tree; wide phones reveal more without shrinking it',
  Math.abs(treeLeft320.width / 320 - treeLeft390.width / 390) < 1e-9 &&
    Math.abs(treeLeft430.width / 430 - treeLeft390.width / 390) < 1e-9 &&
    treeLeft320.left / treeLeft320.width < treeLeft390.left / treeLeft390.width &&
    treeVisibleRight(treeLeft430) / 430 > treeVisibleRight(treeLeft390) / 390 &&
    treeVisibleRight(treeLeft390) / 390 < JOURNEY_DAY1_ANCHORS.day1X,
);

const treeRight320 = getJourneyTreeRightRect(320, 400);
const treeRight390 = getJourneyTreeRightRect(390, 500);
const treeRight430 = getJourneyTreeRightRect(430, 560);
const treeVisibleLeft = (environmentWidth: number, tree: { right: number; width: number }) =>
  environmentWidth - tree.width - tree.right + tree.width * JOURNEY_TREE_RIGHT_ART.contentLeft;
check(
  'right foliage stays 52% of the environment, lifted lower than the left tree, and keeps the art aspect',
  Math.abs(treeRight390.width / 390 - JOURNEY_TREE_RIGHT_LAYOUT.widthScale) < 1e-9 &&
    treeRight390.bottom > 0 &&
    treeRight390.right < 0 &&
    treeRight390.height < treeLeft390.height &&
    500 - treeRight390.bottom - treeRight390.height >
      500 - treeLeft390.bottom - treeLeft390.height &&
    Math.abs(
      treeRight390.width / treeRight390.height -
        JOURNEY_TREE_RIGHT_ART.width / JOURNEY_TREE_RIGHT_ART.height,
    ) < 1e-9,
);

check(
  'narrow phones crop more of the right foliage; wide phones reveal more without shrinking it',
  Math.abs(treeRight320.width / 320 - treeRight390.width / 390) < 1e-9 &&
    Math.abs(treeRight430.width / 430 - treeRight390.width / 390) < 1e-9 &&
    treeRight320.right / treeRight320.width < treeRight390.right / treeRight390.width &&
    treeVisibleLeft(430, treeRight430) / 430 < treeVisibleLeft(390, treeRight390) / 390 &&
    treeVisibleLeft(390, treeRight390) / 390 > JOURNEY_DAY1_ANCHORS.day1X,
);

check(
  'wide phones scale the mascot without changing the composition',
  stage430.mascot.height > stage390.mascot.height &&
    stage430.mascot.height - stage390.mascot.height < 28,
);

check(
  'building a Day 1 stage does not change currentDay',
  getJourneyVisibleDays(1).join(',') === '1' && journeyPressMutates() === false,
);

check(
  'weeks 1–4 each have 7 days; finish has 2',
  getJourneyChapterDays(JOURNEY_CHAPTERS[0]!).length === 7 &&
    getJourneyChapterDays(JOURNEY_CHAPTERS[1]!).length === 7 &&
    getJourneyChapterDays(JOURNEY_CHAPTERS[2]!).length === 7 &&
    getJourneyChapterDays(JOURNEY_CHAPTERS[3]!).length === 7 &&
    getJourneyChapterDays(JOURNEY_CHAPTERS[4]!).length === 2,
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
  idleModel.cta === 'start' && idleModel.ctaLabel === "Start today's reset",
);

check(
  'sheet week label comes from chapter metadata',
  idleModel.weekLabel === 'week 1 · start smaller' &&
    getJourneyWeekLabel(JOURNEY_CHAPTERS[0]!) === 'week 1 · start smaller' &&
    futureModel.weekLabel === 'week 2 · make it easier',
);

check(
  'sign copy is a short native phrase, not a baked Dreamer reminder',
  getJourneySignLine('week-1') === 'you can do this' &&
    getJourneySignLine('week-2') === 'keep going' &&
    getJourneySignLine('week-1') !== DREAMER_LINE &&
    getJourneyQuote('week-1') === 'One small step can change everything.',
);

const sky390 = getJourneySkyEntranceStart(stage390);
const skyPieces390 = getJourneySkyPieces(stage390);
const skyRest = getJourneySkyRest();
const leftCloud390 = skyPieces390.leftCloud;
const rightCloud390 = skyPieces390.rightCloud;
const upperCloud390 = skyPieces390.upperCloud;
const timeline390 = getJourneyTimelineTrack(stage390.currentX, stage390.nextX);
const timelineStart = getJourneyTimelinePositions(0, timeline390);
const timelineMid = getJourneyTimelinePositions(0.5, timeline390);
const timelineEnd = getJourneyTimelinePositions(1, timeline390);
check(
  'mascot walks to a static next-day mark; the nodes do not side-scroll',
  Math.abs(stage390.currentX - stage390.day1X) < 1e-9 &&
    Math.abs(stage390.nextX - stage390.day2X) < 1e-9 &&
    Math.abs(stage390.travelDistance - (stage390.day2X - stage390.day1X)) < 1e-9 &&
    timelineStart.outgoingX === stage390.currentX &&
    timelineEnd.outgoingX === stage390.currentX &&
    timelineStart.incomingX === stage390.nextX &&
    timelineEnd.incomingX === stage390.nextX &&
    timelineStart.mascotX === 0 &&
    Math.abs(timelineEnd.mascotX - stage390.travelDistance) < 1e-9 &&
    Math.abs(timelineMid.mascotX - stage390.travelDistance / 2) < 1e-9 &&
    getJourneyIncomingDay(3, 4) === 4 &&
    getJourneyIncomingDay(30, 31) === undefined,
);

check(
  'first Journey visit bootstraps without walking',
  getJourneyProgression({ currentDay: 4, acknowledgedDay: null }).kind === 'bootstrap',
);

check(
  'acknowledged current day stays idle',
  getJourneyProgression({ currentDay: 4, acknowledgedDay: 4 }).kind === 'idle',
);

const oneDayAdvance = getJourneyProgression({ currentDay: 4, acknowledgedDay: 3 });
check(
  'exactly one unacknowledged day plays 3 → 4',
  oneDayAdvance.kind === 'advance' && oneDayAdvance.fromDay === 3 && oneDayAdvance.toDay === 4,
);

check(
  'multi-day gaps snap instead of chaining walks',
  getJourneyProgression({ currentDay: 5, acknowledgedDay: 1 }).kind === 'snap',
);

const completeWalk = getJourneyProgression({
  currentDay: 3,
  acknowledgedDay: 3,
  todayCompleted: true,
});
check(
  'completing today walks to the next day',
  completeWalk.kind === 'advance' && completeWalk.fromDay === 3 && completeWalk.toDay === 4,
);

check(
  'first Journey visit after completing today walks instead of bootstrapping',
  getJourneyProgression({
    currentDay: 1,
    acknowledgedDay: null,
    todayCompleted: true,
  }).kind === 'advance',
);

check(
  'completing day 30 stays idle',
  getJourneyProgression({
    currentDay: 30,
    acknowledgedDay: 30,
    todayCompleted: true,
  }).kind === 'idle',
);

check(
  'after the completion walk, the mascot rests',
  getJourneyProgression({
    currentDay: 1,
    acknowledgedDay: 2,
    todayCompleted: true,
  }).kind === 'idle',
);

check(
  'next calendar day stays idle after the completion walk',
  getJourneyProgression({
    currentDay: 2,
    acknowledgedDay: 2,
    todayCompleted: false,
  }).kind === 'idle',
);

check(
  'sky entrance parks the sun fully past the right edge',
  leftCloud390 !== undefined &&
    rightCloud390 !== undefined &&
    upperCloud390 !== undefined &&
    sky390.sunX >= stage390.width - stage390.sun.left &&
    sky390.sunY > 0 &&
    sky390.leftX <= -(leftCloud390.left + leftCloud390.width) &&
    sky390.rightX >= stage390.width - rightCloud390.left &&
    sky390.upperX > 0 &&
    sky390.upperY < 0 &&
    sky390.upperOpacity === 0 &&
    skyRest.sunX === 0 &&
    skyRest.sunY === 0 &&
    skyRest.upperOpacity === 1,
);

check(
  'walk easing lands at 0 and 1 and stays near-linear through the middle',
  sampleJourneyWalkEased(0) === 0 &&
    Math.abs(sampleJourneyWalkEased(1) - 1) < 1e-6 &&
    Math.abs(sampleJourneyWalkEased(0.5) - 0.5) < 0.03 &&
    sampleJourneyWalkEased(0.1) < 0.1 &&
    sampleJourneyWalkEased(0.9) > 0.9 &&
    Math.abs(
      sampleJourneyWalkEased(0.65) -
        sampleJourneyWalkEased(0.5) -
        (sampleJourneyWalkEased(0.5) - sampleJourneyWalkEased(0.35)),
    ) < 0.012,
);

check(
  'walk translation uses node travel and the walk curve, not a raw ease-in-out rush',
  Math.abs(getJourneyWalkTranslate(1, stage390.travelDistance) - stage390.travelDistance) < 1e-6 &&
    getJourneyWalkTranslate(0, stage390.travelDistance) === 0 &&
    Math.abs(getJourneyWalkTranslate(0.5, stage390.travelDistance) - stage390.travelDistance / 2) <
      stage390.travelDistance * 0.03,
);

check(
  'environment parallax moves opposite the mascot and stays within the soft ranges',
  getJourneyWalkDirection(3, 4) === 1 &&
    getJourneyWalkDirection(4, 3) === -1 &&
    getJourneyParallaxOffset(1, 1, JOURNEY_WALK_LAYERS.foreground) === -15 &&
    getJourneyParallaxOffset(1, -1, JOURNEY_WALK_LAYERS.foreground) === 15 &&
    getJourneyParallaxOffset(0, 1, JOURNEY_WALK_LAYERS.sign) === 0 &&
    JOURNEY_WALK_LAYERS.foreground >= 12 &&
    JOURNEY_WALK_LAYERS.foreground <= 18 &&
    JOURNEY_WALK_LAYERS.sign >= 8 &&
    JOURNEY_WALK_LAYERS.sign <= 12 &&
    JOURNEY_WALK_LAYERS.bush >= 6 &&
    JOURNEY_WALK_LAYERS.bush <= 10 &&
    JOURNEY_WALK_LAYERS.cloud >= 3 &&
    JOURNEY_WALK_LAYERS.cloud <= 5 &&
    JOURNEY_WALK_LAYERS.sun >= 1 &&
    JOURNEY_WALK_LAYERS.sun <= 3,
);

check(
  'heading waits until the jump; walk duration stays 1800ms',
  motion.duration.journeyProgressWalk === 1800 &&
    motion.duration.journeyProgressHeadingDelay === 420 &&
    motion.duration.journeyArrivalRing === 420 &&
    motion.scale.journeyArrivalFrom === 0.96 &&
    motion.scale.journeyArrivalPeak === 1.04,
);

const readyModel = getJourneySheetModel({
  day: 1,
  currentDay: 1,
  completedDays: [],
  todayStarted: false,
  todayCompleted: false,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  'READY current day exposes Start',
  readyModel.cta === 'start' && readyModel.ctaLabel === "Start today's reset",
);

const startedOnceMore = applyJourneySheetAction(startedBySheet, 'start');
check(
  'duplicate Start stays started and incomplete',
  startedOnceMore.todayStarted === true &&
    startedOnceMore.todayCompleted === false &&
    startedOnceMore.currentDay === 1 &&
    startedOnceMore.completedDays.length === 0,
);

const completedBySheet = applyJourneySheetAction(startedBySheet, 'complete', dateOn('2026-09-19'));
const completedByEngine = completeResetDay(startedBySheet, dateOn('2026-09-19'));
const completedByApply = applyCompleteToday(startedBySheet, dateOn('2026-09-19'));
check(
  'Complete uses the canonical completeResetDay command',
  completedBySheet.todayCompleted === true &&
    completedBySheet.todayStarted === true &&
    completedBySheet.completedDays.join(',') === '1' &&
    completedBySheet.currentDay === 1 &&
    completedBySheet.lastCompletedOn === '2026-09-19' &&
    completedBySheet.streak === 1 &&
    completedBySheet.todayCompleted === completedByEngine.todayCompleted &&
    completedBySheet.completedDays.join(',') === completedByEngine.completedDays.join(',') &&
    completedBySheet.streak === completedByApply.streak &&
    completedBySheet.lastCompletedOn === completedByApply.lastCompletedOn,
);

const completedAgain = applyJourneySheetAction(completedBySheet, 'complete', dateOn('2026-09-19'));
check(
  'duplicate Complete stays complete on the same day',
  completedAgain.todayCompleted === true &&
    completedAgain.currentDay === 1 &&
    completedAgain.completedDays.filter((day) => day === 1).length === 1,
);

const afterCompleteModel = getJourneySheetModel({
  day: 1,
  currentDay: completedBySheet.currentDay,
  completedDays: completedBySheet.completedDays,
  todayStarted: completedBySheet.todayStarted,
  todayCompleted: completedBySheet.todayCompleted,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  'COMPLETED current day has no primary CTA',
  afterCompleteModel.completeLabel === '✓ checked in' &&
    afterCompleteModel.footnote === 'you showed up.' &&
    afterCompleteModel.cta === 'none',
);

check(
  'Journey completion derives Home companion completed',
  getCompanionState(completedBySheet) === 'completed',
);

const afterCompleteWalk = getJourneyProgression({
  currentDay: completedBySheet.currentDay,
  acknowledgedDay: completedBySheet.currentDay,
  todayCompleted: completedBySheet.todayCompleted,
});
const nextDayModel = getJourneySheetModel({
  day: 2,
  currentDay: completedBySheet.currentDay,
  completedDays: completedBySheet.completedDays,
  todayStarted: completedBySheet.todayStarted,
  todayCompleted: completedBySheet.todayCompleted,
  personalization: defaultPersonalization,
  rememberLine: SOFT_RESTARTER_LINE,
});
check(
  'completing today walks the mascot without unlocking tomorrow',
  afterCompleteWalk.kind === 'advance' &&
    afterCompleteWalk.fromDay === 1 &&
    afterCompleteWalk.toDay === 2 &&
    completedBySheet.currentDay === 1 &&
    nextDayModel.kind === 'future' &&
    nextDayModel.cta === 'none',
);

function completeCurrentDay(
  day: number,
  completedBefore: readonly number[],
  lastCompletedOn: string | null,
  streak: number,
) {
  const ready = snapshot({
    currentDay: day,
    completedDays: [...completedBefore],
    lastCompletedOn,
    streak,
    resetStartedOn: '2026-08-21',
    lastSeenOn: '2026-09-19',
  });
  const startedDay = applyJourneySheetAction(ready, 'start');
  return applyJourneySheetAction(startedDay, 'complete', dateOn('2026-09-19'));
}

const day7Completed = completeCurrentDay(7, [1, 2, 3, 4, 5, 6], '2026-09-18', 6);
check(
  'Day 7 Journey completion is a milestone and stays on day 7',
  day7Completed.currentDay === 7 &&
    day7Completed.todayCompleted === true &&
    day7Completed.completedDays.includes(7) &&
    day7Completed.streak === 7 &&
    getCompanionState(day7Completed) === 'milestone',
);

const day14Completed = completeCurrentDay(
  14,
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  '2026-09-18',
  13,
);
check(
  'Day 14 Journey completion is a milestone and stays on day 14',
  day14Completed.currentDay === 14 &&
    day14Completed.todayCompleted === true &&
    day14Completed.completedDays.includes(14) &&
    getCompanionState(day14Completed) === 'milestone',
);

const day21Completed = completeCurrentDay(
  21,
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  '2026-09-18',
  20,
);
check(
  'Day 21 Journey completion is a milestone and stays on day 21',
  day21Completed.currentDay === 21 &&
    day21Completed.todayCompleted === true &&
    day21Completed.completedDays.includes(21) &&
    getCompanionState(day21Completed) === 'milestone',
);

const day30Completed = completeCurrentDay(
  30,
  Array.from({ length: 29 }, (_, index) => index + 1),
  '2026-09-18',
  29,
);
check(
  'Day 30 Journey completion is cycle_complete and stays Day 30',
  day30Completed.currentDay === 30 &&
    day30Completed.todayCompleted === true &&
    day30Completed.completedDays.includes(30) &&
    day30Completed.completedDays.filter((day) => day === 30).length === 1 &&
    getCompanionState(day30Completed) === 'cycle_complete',
);

const afterJournal = applySaveReflection(
  idle,
  { mood: 3, text: 'a quiet note', prompt: 'how did it feel?' },
  dateOn('2026-09-19'),
);
check(
  'journal save remains optional and non-advancing',
  afterJournal.todayStarted === false &&
    afterJournal.todayCompleted === false &&
    afterJournal.currentDay === 1 &&
    afterJournal.completedDays.length === 0 &&
    afterJournal.reflections.length === 1,
);

check(
  'season follows Northern Hemisphere months',
  getJourneySeason(new Date(2026, 2, 1)) === 'spring' &&
    getJourneySeason(new Date(2026, 4, 31)) === 'spring' &&
    getJourneySeason(new Date(2026, 5, 1)) === 'summer' &&
    getJourneySeason(new Date(2026, 7, 31)) === 'summer' &&
    getJourneySeason(new Date(2026, 8, 1)) === 'autumn' &&
    getJourneySeason(new Date(2026, 9, 5)) === 'autumn' &&
    getJourneySeason(new Date(2026, 10, 30)) === 'autumn' &&
    getJourneySeason(new Date(2026, 11, 1)) === 'winter' &&
    getJourneySeason(new Date(2027, 1, 28)) === 'winter',
);

const statsInput = {
  completedDays: [1, 2, 3, 4],
  completionDates: { 2: '2026-10-03', 3: '2026-10-04', 4: '2026-10-05' },
  lastCompletedOn: '2026-10-05',
  streak: 3,
  resetStartedOn: '2026-09-29',
  today: '2026-10-06',
};
const stats = getJourneyStats(statsInput);
check(
  'stats: live streak, check-ins from plan days, consistency over elapsed days',
  stats.streak === 3 && stats.checkIns === 4 && stats.consistency === 50,
);
check(
  'stats: a streak whose last check-in is older than yesterday shows 0',
  getJourneyStats({ ...statsInput, today: '2026-10-08' }).streak === 0,
);
check(
  'stats: no start date means 0% consistency',
  getJourneyStats({ ...statsInput, resetStartedOn: null }).consistency === 0,
);
const heatmap = getJourneyHeatmap(getJourneyCheckInDates(statsInput), '2026-10-06', 6);
const lastWeek = heatmap[heatmap.length - 1];
const filledKeys = heatmap.flatMap((week) =>
  week.cells.flatMap((cell) => (cell.kind === 'day' && cell.checkedIn ? [cell.dateKey] : [])),
);
check(
  'heatmap: columns end on the current week, future days are blank, only real dates fill',
  heatmap.length === 6 &&
    lastWeek?.cells[1]?.kind === 'day' &&
    lastWeek.cells[1].isToday &&
    lastWeek.cells[2]?.kind === 'future' &&
    filledKeys.join(',') === '2026-10-03,2026-10-04,2026-10-05',
);
check(
  'heatmap: month labels mark new months and drop one crowded by the next',
  heatmap[0]?.monthLabel === null &&
    heatmap
      .filter((week) => week.monthLabel !== null)
      .map((week) => week.monthLabel)
      .join(',') === 'Sep,Oct',
);

const twoDays = getJourneyMilestoneTrack(2);
check(
  'milestones: current count, then 7 and 30 days; lines fill toward the next one',
  twoDays.milestones.map((m) => `${m.days}:${m.reached}`).join(',') === '2:true,7:false,30:false' &&
    Math.abs((twoDays.segmentFill[0] ?? 0) - 2 / 7) < 1e-9 &&
    twoDays.segmentFill[1] === 0 &&
    getJourneyMilestoneTrack(0).milestones[0]?.label === 'Start today' &&
    getJourneyMilestoneTrack(30).milestones.every((m) => m.reached),
);
check(
  'show-up message counts once, twice, then numbers',
  getJourneyShowUpMessage(1).title === "You've shown up once." &&
    getJourneyShowUpMessage(2).title === "You've shown up twice." &&
    getJourneyShowUpMessage(5).title === "You've shown up 5 times.",
);

const calendarDates = getJourneyCheckInDates(statsInput);
const october = getJourneyCalendarMonth(calendarDates, '2026-10-06', '2026-09-29', 0);
const octoberDays = october.cells.flatMap((cell) => (cell.kind === 'day' ? [cell] : []));
const stateOf = (date: number) => octoberDays.find((cell) => cell.date === date)?.state;
check(
  'calendar: October 2026 starts on Thursday, weeks are whole, days are labelled by state',
  october.title === 'October' &&
    october.cells.slice(0, 3).every((cell) => cell.kind === 'blank') &&
    october.cells[3]?.kind === 'day' &&
    october.cells.length % 7 === 0 &&
    octoberDays.length === 31 &&
    stateOf(3) === 'checkedIn' &&
    stateOf(2) === 'missed' &&
    stateOf(6) === 'today' &&
    stateOf(7) === 'upcoming',
);
const september = getJourneyCalendarMonth(calendarDates, '2026-10-06', '2026-09-29', -1);
check(
  'calendar: pages back to the start month only, and never past this month',
  october.canGoBack &&
    !october.canGoForward &&
    !september.canGoBack &&
    september.canGoForward &&
    september.cells.some(
      (cell) => cell.kind === 'day' && cell.date === 28 && cell.state === 'beforeStart',
    ),
);
check(
  'longest streak counts back-to-back calendar days',
  getJourneyLongestStreak(
    new Set(['2026-10-01', '2026-10-02', '2026-10-04', '2026-10-05', '2026-10-06']),
  ) === 3 && getJourneyLongestStreak(new Set()) === 0,
);
const seasonWeeks = getJourneySeasonWeeks([1, 2, 3, 4, 5, 6, 7, 9, 10, 11], 12);
check(
  'season weeks: check-ins per week, the last week is two days, the current week is marked',
  seasonWeeks.map((week) => week.checkIns).join(',') === '7,3,0,0,0' &&
    seasonWeeks[4]?.days === 2 &&
    seasonWeeks[4]?.label === 'Last' &&
    seasonWeeks.findIndex((week) => week.current) === 1,
);
check(
  'streak line nudges toward the longest streak, or celebrates a new best',
  getJourneyStreakLine(3, 7) === 'Your longest streak is 7 days. Want to beat it?' &&
    getJourneyStreakLine(7, 7) === '7 days in a row is your best yet.' &&
    getJourneyStreakLine(0, 0) === 'Your first check-in starts the calendar.',
);

check(
  'pop-up description keeps one sentence, or two when the first is very short',
  shortenSheetDescription(
    'Use this reset as-is. Do not start a better version of it today. Showing up once still counts.',
  ) === 'Use this reset as-is. Do not start a better version of it today.' &&
    shortenSheetDescription(
      'Change one thing so coming back tomorrow does not need a fresh start. Keep it small.',
    ) === 'Change one thing so coming back tomorrow does not need a fresh start.' &&
    shortenSheetDescription('No ending punctuation here') === 'No ending punctuation here',
);

if (failed > 0) {
  throw new Error(`${failed} journey check(s) failed`);
}

console.log('\nall journey checks passed');
