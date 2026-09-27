import {
  getJourneyChapterDays,
  getJourneyChapterForDay,
  getJourneyChapterIndexForDay,
  getJourneyWeekLabel,
  JOURNEY_CHAPTERS,
} from '../data/journeyChapters';
import { motion } from '../../../design-system/motion';
import { getJourneyQuote, getJourneySignLine } from '../data/journeyCopy';
import {
  getJourneyStageLayout,
  getJourneyVisibleDays,
  JOURNEY_DAY1_ANCHORS,
  JOURNEY_MASCOT_ART,
  splitJourneyTaskTitle,
} from '../layout/journeyStageLayout';
import type { ResetPersonalization, ResetSnapshot } from '../../reset/types';
import { PLAN_DAY_COUNT, getPlanDayTitle } from '../../reset/data/thirtyDayPlan';
import { applyStartToday } from '../../reset/utils/dailyResetActions';
import { getTaskForDay } from '../../reset/utils/getTaskForDay';
import { getCurrentResetTask } from '../../reset/utils/resetSelectors';
import {
  getJourneySkyEntranceStart,
  getJourneySkyPieces,
  getJourneySkyRest,
} from './getJourneySkyEntrance';
import { getJourneyDayState } from './getJourneyDayState';
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
  isJourneyTimelineNodeOffscreen,
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

const homeDay8 = getCurrentResetTask(snapshot({ currentDay: 8 }));
const journeyDay8 = getCurrentResetTask(snapshot({ currentDay: 8 }));
const homeDay30 = getCurrentResetTask(snapshot({ currentDay: 30 }));
const journeyDay30 = getCurrentResetTask(snapshot({ currentDay: 30 }));
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
const day1Visible = getJourneyVisibleDays(1);
const day30Visible = getJourneyVisibleDays(30);
check(
  '17. day 30 does not exceed the 30-day plan',
  overflowTask.day === PLAN_DAY_COUNT &&
    overflowTask.title === getPlanDayTitle(30) &&
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
check(
  'mascot stands on the day line without the line cutting the toes',
  Math.abs(mascotCenterX - stage390.day1X) < 0.5 &&
    bodySitY < stage390.lineY &&
    toeY <= stage390.lineY &&
    stage390.lineY - toeY > 0 &&
    stage390.lineY - toeY <= stage390.nodeSize * 0.4,
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
  idleModel.cta === 'start' && idleModel.ctaLabel === "start today's reset →",
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
const timeline390 = getJourneyTimelineTrack(
  stage390.width,
  stage390.currentX,
  stage390.nodeSize + motion.offset.journeyTimelineEdgePad,
);
const timelineStart = getJourneyTimelinePositions(0, timeline390);
const timelineMid = getJourneyTimelinePositions(0.5, timeline390);
const timelineEnd = getJourneyTimelinePositions(1, timeline390);
const nodeHalf = stage390.nodeSize / 2;
check(
  'side-scroll track keeps the next day offscreen at rest and on the current mark at arrival',
  Math.abs(stage390.travelDistance - stage390.worldTravel) < 1e-9 &&
    Math.abs(stage390.currentX - stage390.day1X) < 1e-9 &&
    isJourneyTimelineNodeOffscreen(timelineStart.incomingX, stage390.width, nodeHalf) &&
    !isJourneyTimelineNodeOffscreen(timelineStart.outgoingX, stage390.width, nodeHalf) &&
    isJourneyTimelineNodeOffscreen(timelineEnd.outgoingX, stage390.width, nodeHalf) &&
    Math.abs(timelineEnd.incomingX - stage390.currentX) < 1e-6 &&
    Math.abs(timelineEnd.mascotLeadX) < 1e-6 &&
    timelineMid.mascotLeadX > 0 &&
    timelineMid.incomingX < timelineStart.incomingX &&
    timelineMid.outgoingX < timelineStart.outgoingX &&
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

check(
  'completing today is not a visual day advance',
  getJourneyProgression({ currentDay: 3, acknowledgedDay: 3 }).kind === 'idle',
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

if (failed > 0) {
  throw new Error(`${failed} journey check(s) failed`);
}

console.log('\nall journey checks passed');
