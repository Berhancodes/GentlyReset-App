import { ROOM_INTRO, ROOM_STAGES, SEASON_ROOMS } from '../data/roomStages';
import {
  fillMascotName,
  getPendingRoomMilestone,
  getRoomLabel,
  getRoomState,
  getSeasonLabel,
} from './getRoomState';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }

  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

const empty = getRoomState(0);
check(
  'day one before a check-in is an empty corner',
  empty.stage.id === 'corner' && empty.itemCount === 0,
);
check('no newest item before any check-in', empty.newestItem === null);

const three = getRoomState(3);
check('each check-in adds one little friend', three.itemCount === 3 && three.newestItem === 3);
check('label counts things', getRoomLabel(three) === 'your corner · 3 things');
check('label is singular for one thing', getRoomLabel(getRoomState(1)) === 'your corner · 1 thing');

check('day 6 is still the corner', getRoomState(6).stage.id === 'corner');
check('day 7 grows into the nook', getRoomState(7).stage.id === 'nook');
check('day 14 is the cozy room', getRoomState(14).stage.id === 'cozy');
check('day 21 is your room', getRoomState(21).stage.id === 'yours');
check('day 30 is home', getRoomState(30).stage.id === 'home');

const later = getRoomState(12);
check('only five friends are drawn', later.itemCount === 5);
check('no sparkle once past the drawn friends', later.newestItem === null);
check('label keeps counting past five', getRoomLabel(later) === 'your nook · 12 things');

check('counts are clamped to one season', getRoomState(45).checkIns === 30);
check('negative counts are clamped', getRoomState(-3).checkIns === 0);
check(
  'season complete only at 30',
  !getRoomState(29).seasonComplete && getRoomState(30).seasonComplete,
);
check(
  'season label',
  getSeasonLabel(three) === 'Season 1' && getSeasonLabel(getRoomState(30)) === 'Season 1 complete',
);

check(
  'no milestone before the first upgrade',
  getPendingRoomMilestone(getRoomState(6), 0) === null,
);
check(
  'reaching day 7 celebrates the nook once',
  getPendingRoomMilestone(getRoomState(7), 0)?.id === 'nook' &&
    getPendingRoomMilestone(getRoomState(7), 1) === null,
);
check(
  'jumping ahead celebrates only the latest stage',
  getPendingRoomMilestone(getRoomState(22), 0)?.id === 'yours',
);

check(
  'stages are in order',
  ROOM_STAGES.every(
    (stage, index) =>
      index === 0 || stage.fromCheckIns > (ROOM_STAGES[index - 1]?.fromCheckIns ?? 0),
  ),
);
check(
  'every stage after the corner has a milestone',
  ROOM_STAGES.slice(1).every((stage) => Boolean(stage.milestone)),
);
check('a year has twelve seasons', SEASON_ROOMS.length === 12);
check('the intro has three beats', ROOM_INTRO.length === 3);

check('name is filled in', fillMascotName('hey {name}! hi', 'Berhan') === 'hey Berhan! hi');
check('name is capitalized', fillMascotName('hey {name}!', 'berhan') === 'hey Berhan!');
check('missing name reads naturally', fillMascotName('hey {name}! hi', undefined) === 'hey! hi');

if (failed > 0) {
  throw new Error(`${failed} room check(s) failed`);
}

console.log('\nall room checks passed');
