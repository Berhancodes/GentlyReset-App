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

const applicationRoot = new URL('../src/application', import.meta.url).pathname;
const domainRoot = new URL('../src/domain', import.meta.url).pathname;
const storePath = new URL('../src/features/reset/store/useResetStore.ts', import.meta.url).pathname;
const engineFiles = [
  new URL('../src/application/reset/startResetDay.ts', import.meta.url).pathname,
  new URL('../src/application/reset/completeResetDay.ts', import.meta.url).pathname,
  new URL('../src/application/reset/processDateRollover.ts', import.meta.url).pathname,
  new URL('../src/application/journal/saveReflection.ts', import.meta.url).pathname,
];

const forbidden = [
  [/from\s+['"]@supabase\//, 'supabase'],
  [/from\s+['"]@\/features\/reflect\/sync/, 'journal sync'],
  [/from\s+['"][^'"]*features\/reflect\/sync/, 'journal sync'],
];

let failed = 0;
for (const root of [applicationRoot, domainRoot]) {
  for (const filePath of listTypeScriptFiles(root)) {
    const source = readFileSync(filePath, 'utf8');
    const label = relative(root, filePath);
    for (const [pattern, name] of forbidden) {
      if (pattern.test(source)) {
        failed += 1;
        console.error(`fail  ${label} imports ${name}`);
      }
    }
  }
}

const storeSource = readFileSync(storePath, 'utf8');
if (storeSource.includes('features/reflect/sync') || storeSource.includes('journal_entries')) {
  failed += 1;
  console.error('fail  useResetStore imports journal sync');
} else {
  console.log('ok  useResetStore does not import journal sync');
}

for (const filePath of engineFiles) {
  const source = readFileSync(filePath, 'utf8');
  if (source.includes('supabase') || source.includes('journal_entries')) {
    failed += 1;
    console.error(`fail  ${filePath} mentions supabase/journal_entries`);
  }
}

if (failed > 0) {
  throw new Error(`${failed} journal sync isolation check(s) failed`);
}

console.log('ok  application/domain do not import JournalSyncService');
console.log('ok  saveReflection remains local-first');
console.log('\nall journal sync isolation checks passed');
