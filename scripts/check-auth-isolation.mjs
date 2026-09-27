import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const authRoot = new URL('../src/features/auth', import.meta.url).pathname;

const forbiddenEverywhere = [
  [/from\s+['"]@\/features\/reset\/store/, 'reset store'],
  [/from\s+['"][^'"]*features\/reset\/store/, 'reset store'],
  [/from\s+['"]@\/data\/reset/, 'local reset repository'],
  [/from\s+['"][^'"]*data\/reset/, 'local reset repository'],
  [/from\s+['"]@\/application\/reset\/ResetRepository/, 'ResetRepository'],
  [/from\s+['"]@\/features\/journey\/store/, 'journey visual store'],
  [/from\s+['"][^'"]*journey\/store/, 'journey visual store'],
];

const forbiddenOutsideScreens = [
  ...forbiddenEverywhere,
  [/from\s+['"]@\/features\/onboarding\/store/, 'onboarding store'],
  [/from\s+['"][^'"]*onboarding\/store/, 'onboarding store'],
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

const sourceFiles = listTypeScriptFiles(authRoot);
if (sourceFiles.length === 0) {
  throw new Error('auth source files not found');
}

let failed = 0;
for (const filePath of sourceFiles) {
  const source = readFileSync(filePath, 'utf8');
  const label = relative(authRoot, filePath);
  const isScreen = label.startsWith('screens/');
  const rules = isScreen ? forbiddenEverywhere : forbiddenOutsideScreens;
  for (const [pattern, name] of rules) {
    if (pattern.test(source)) {
      failed += 1;
      console.error(`fail  ${label} imports ${name}`);
    }
  }
}

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
  'onboarding_completed_at',
];

for (const filePath of sourceFiles) {
  const source = readFileSync(filePath, 'utf8');
  const label = relative(authRoot, filePath);
  if (label.startsWith('screens/')) {
    continue;
  }
  for (const field of resetFields) {
    if (source.includes(field)) {
      failed += 1;
      console.error(`fail  ${label} mentions ${field}`);
    }
  }
}

if (failed > 0) {
  throw new Error(`${failed} auth isolation check(s) failed`);
}

console.log('ok  auth api/session/supabase/utils do not import reset or onboarding stores');
console.log('ok  auth screens do not import reset, repository, or journey stores');
console.log('\nall auth isolation checks passed');
