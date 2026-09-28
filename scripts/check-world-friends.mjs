import { readFileSync } from 'node:fs';

const files = [
  new URL('../src/features/world/screens/WorldScreen.tsx', import.meta.url).pathname,
  new URL('../src/features/world/components/FriendsSection.tsx', import.meta.url).pathname,
  new URL('../src/features/world/data/worldStats.ts', import.meta.url).pathname,
  new URL('../src/features/world/data/worldActivity.ts', import.meta.url).pathname,
  new URL('../src/features/friends/worldState.ts', import.meta.url).pathname,
  new URL('../src/features/friends/components/FriendProgressCard.tsx', import.meta.url).pathname,
];

const banned = [
  '1,200+',
  '50+',
  'people here',
  'a friend completed day 7',
  'someone sent you encouragement',
  'most productive',
  'leaderboard',
  'failed today',
  'missed today',
  '0 tasks',
  'you are ahead',
];

let failed = 0;
for (const filePath of files) {
  const source = readFileSync(filePath, 'utf8');
  for (const phrase of banned) {
    if (source.includes(phrase)) {
      failed += 1;
      console.error(`fail  ${filePath} still contains banned social copy: ${phrase}`);
    }
  }
}

if (failed > 0) {
  throw new Error(`${failed} world fake-data check(s) failed`);
}

console.log('ok  World no longer ships fake social stats, activity, or rankings');
console.log('\nall world friends checks passed');
