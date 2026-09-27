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

function failIfMatches(files, root, patterns) {
  let failed = 0;
  for (const filePath of files) {
    const source = readFileSync(filePath, 'utf8');
    const label = relative(root, filePath);
    for (const [pattern, name] of patterns) {
      if (pattern.test(source)) {
        failed += 1;
        console.error(`fail  ${label} imports ${name}`);
      }
    }
  }
  return failed;
}

const applicationRoot = new URL('../src/application', import.meta.url).pathname;
const domainRoot = new URL('../src/domain', import.meta.url).pathname;
const dataRoot = new URL('../src/data', import.meta.url).pathname;
const storePath = new URL('../src/features/reset/store/useResetStore.ts', import.meta.url)
  .pathname;

const supabaseAndSync = [
  [/from\s+['"]@supabase\//, 'supabase'],
  [/from\s+['"]@\/features\/reset\/sync/, 'reset sync'],
  [/from\s+['"][^'"]*features\/reset\/sync/, 'reset sync'],
];

let failed = 0;
failed += failIfMatches(listTypeScriptFiles(applicationRoot), applicationRoot, supabaseAndSync);
failed += failIfMatches(listTypeScriptFiles(domainRoot), domainRoot, supabaseAndSync);
failed += failIfMatches(listTypeScriptFiles(dataRoot), dataRoot, [
  [/from\s+['"]@supabase\//, 'supabase'],
]);

const storeSource = readFileSync(storePath, 'utf8');
if (/from\s+['"]@supabase\//.test(storeSource) || storeSource.includes('features/reset/sync')) {
  failed += 1;
  console.error('fail  useResetStore imports supabase or reset sync');
} else {
  console.log('ok  useResetStore does not import supabase or reset sync');
}

const engineFiles = [
  new URL('../src/application/reset/startResetDay.ts', import.meta.url).pathname,
  new URL('../src/application/reset/completeResetDay.ts', import.meta.url).pathname,
  new URL('../src/application/reset/processDateRollover.ts', import.meta.url).pathname,
  new URL('../src/application/createResetApplication.ts', import.meta.url).pathname,
];
for (const filePath of engineFiles) {
  const source = readFileSync(filePath, 'utf8');
  if (source.includes('supabase') || source.includes('reset_cycles')) {
    failed += 1;
    console.error(`fail  ${filePath} mentions supabase/reset_cycles`);
  }
}

if (failed > 0) {
  throw new Error(`${failed} reset sync isolation check(s) failed`);
}

console.log('ok  application/domain do not import supabase or ResetSyncService');
console.log('ok  reset engine commands remain local-first');
console.log('\nall reset sync isolation checks passed');
