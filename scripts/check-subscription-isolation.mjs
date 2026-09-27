import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const subscriptionRoot = new URL('../src/features/subscription', import.meta.url).pathname;

const forbidden = [
  [/from\s+['"]@\/features\/reset\/store/, 'reset store'],
  [/from\s+['"][^'"]*features\/reset\/store/, 'reset store'],
  [/from\s+['"]@\/data\/reset/, 'local reset repository'],
  [/from\s+['"]@\/application\/reset\/ResetRepository/, 'ResetRepository'],
  [/from\s+['"]@\/features\/journey\/store/, 'journey visual store'],
];

const resetFields = [
  'currentDay',
  'completedDays',
  'ResetSnapshot',
  'resetStartedOn',
  'todayStarted',
  'todayCompleted',
  'resetTypeId',
  'personalization',
  'clearReset',
  'seedFromOnboarding',
];

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

const sourceFiles = listTypeScriptFiles(subscriptionRoot);
if (sourceFiles.length === 0) {
  throw new Error('subscription source files not found');
}

let failed = 0;
for (const filePath of sourceFiles) {
  const source = readFileSync(filePath, 'utf8');
  const label = relative(subscriptionRoot, filePath);
  for (const [pattern, name] of forbidden) {
    if (pattern.test(source)) {
      failed += 1;
      console.error(`fail  ${label} imports ${name}`);
    }
  }
  for (const field of resetFields) {
    if (source.includes(field)) {
      failed += 1;
      console.error(`fail  ${label} mentions ${field}`);
    }
  }
}

if (failed > 0) {
  throw new Error(`${failed} subscription isolation check(s) failed`);
}

console.log('ok  subscription layer does not import or mention reset data');
console.log('\nall subscription isolation checks passed');
