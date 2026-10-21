import { FOCUS_AREA_IDS } from '../roadmap/focusAreas';
import { buildDailyList, DAILY_LIST_SIZE, DAY_SLOTS } from './buildDailyList';

let failed = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}`);
}

const obstacles = [
  'overthink',
  'put-off',
  'no-energy',
  'too-much',
  'afraid-wont-stick',
  'distracted',
  undefined,
];
const timings = ['wake-up', 'during-day', 'after-work', 'before-bed', undefined];

let allTen = true;
let noDupes = true;
let mainOnce = true;
let ordered = true;
let everySlot = true;
for (const focusAreaId of FOCUS_AREA_IDS) {
  for (const primaryObstacle of obstacles) {
    for (const supportTiming of timings) {
      for (let day = 1; day <= 30; day += 1) {
        const list = buildDailyList({
          day,
          focusAreaId,
          mainTitle: 'Fix something you’ve put off',
          primaryObstacle,
          supportTiming,
        });
        const ids = list.items.map((entry) => entry.id);
        allTen &&= list.items.length === DAILY_LIST_SIZE;
        noDupes &&= new Set(ids).size === ids.length;
        mainOnce &&= list.items.filter((entry) => entry.main).length === 1;
        const slotOrder = list.items.map((entry) => DAY_SLOTS.indexOf(entry.slot));
        ordered &&= slotOrder.every(
          (value, index) => index === 0 || value >= (slotOrder[index - 1] ?? 0),
        );
        everySlot &&= DAY_SLOTS.every((slot) => list.items.some((entry) => entry.slot === slot));
      }
    }
  }
}
check('every list has exactly ten items', allTen);
check('no item repeats within a day', noDupes);
check('the plan task appears exactly once', mainOnce);
check('items run morning → day → evening', ordered);
check('morning, day and evening all have something', everySlot);

const morning = buildDailyList({
  day: 1,
  focusAreaId: 'energy',
  mainTitle: 'Drink water first.',
  supportTiming: 'wake-up',
});
check('main task goes in their best time', morning.items[0]?.main === true);
check('headline reads naturally', morning.headline === 'Today, make sure you drink water first.');
const evening = buildDailyList({
  day: 1,
  focusAreaId: 'energy',
  mainTitle: 'X',
  supportTiming: 'before-bed',
});
check(
  'before-bed people get the main task in the evening',
  evening.items.find((entry) => entry.main)?.slot === 'evening',
);

const why = buildDailyList({
  day: 1,
  focusAreaId: 'mind',
  mainTitle: 'X',
  recentFeeling: 'overwhelmed',
}).why;
check(
  'why line uses their feeling and area',
  why.startsWith('You said you’ve been feeling overwhelmed, and your mind needs some quiet.'),
);
check(
  'why line works without a feeling',
  buildDailyList({ day: 1, focusAreaId: 'mind', mainTitle: 'X' }).why.startsWith('You told us'),
);

const day1 = buildDailyList({ day: 1, focusAreaId: 'mind', mainTitle: 'X' }).items.map(
  (entry) => entry.id,
);
const day2 = buildDailyList({ day: 2, focusAreaId: 'mind', mainTitle: 'X' }).items.map(
  (entry) => entry.id,
);
check('consecutive days are mostly different', day2.filter((id) => day1.includes(id)).length <= 4);

if (failed > 0) {
  throw new Error(`${failed} daily list check(s) failed`);
}
