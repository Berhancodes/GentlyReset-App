import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

function listTypeScriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      return listTypeScriptFiles(fullPath);
    }
    if (entry.endsWith('.test.ts') || (!entry.endsWith('.ts') && !entry.endsWith('.tsx'))) {
      return [];
    }
    return [fullPath];
  });
}

const friendsRoot = new URL('../src/features/friends', import.meta.url).pathname;
const forbidden = [
  [/from\s+['"]@\/features\/reset\/store/, 'reset store'],
  [/from\s+['"][^'"]*features\/reset\/store/, 'reset store'],
  [/from\s+['"]@\/application\/reset/, 'reset application'],
  [/from\s+['"][^'"]*application\/reset/, 'reset application'],
  [/from\s+['"]@\/features\/reflect\/sync/, 'journal sync'],
  [/from\s+['"]react-native-purchases/, 'RevenueCat'],
];

const forbiddenMentions = [
  'journal_entries',
  'reset_cycles',
  'reset_day_completions',
  'completedDays',
  'todayTask',
  'ResetSnapshot',
  'gentlyreset_ios_app_pro',
];

let failed = 0;
for (const filePath of listTypeScriptFiles(friendsRoot)) {
  const source = readFileSync(filePath, 'utf8');
  const label = relative(friendsRoot, filePath);
  for (const [pattern, name] of forbidden) {
    if (pattern.test(source)) {
      failed += 1;
      console.error(`fail  ${label} imports ${name}`);
    }
  }
  for (const mention of forbiddenMentions) {
    if (source.includes(mention)) {
      failed += 1;
      console.error(`fail  ${label} mentions ${mention}`);
    }
  }
}

if (failed > 0) {
  throw new Error(`${failed} friends isolation check(s) failed`);
}

console.log('ok  friends layer does not import reset, journal, or RevenueCat');
console.log('\nall friends isolation checks passed');
