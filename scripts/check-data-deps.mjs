import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dataRoot = new URL('../src/data', import.meta.url).pathname;
const forbiddenEverywhere = [
  [/from\s+['"]react(?:\/|['"])/, 'react'],
  [/from\s+['"]react-native(?:\/|['"])/, 'react-native'],
  [/from\s+['"]expo(?:-|\/|['"])/, 'expo'],
  [/from\s+['"]expo-router(?:\/|['"])/, 'expo-router'],
  [/from\s+['"]@react-native-async-storage\//, 'AsyncStorage'],
  [/from\s+['"]@\/components\//, '@/components'],
  [/from\s+['"]@\/navigation\//, '@/navigation'],
];

const forbiddenOutsideLocalAdapter = [
  [/from\s+['"]zustand(?:\/|['"])/, 'zustand'],
  [/from\s+['"][^'"]*features\/reset\/store/, 'reset store'],
  [/from\s+['"]@\/features\/reset\/store/, 'reset store'],
];

function listTypeScriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      return listTypeScriptFiles(fullPath);
    }
    if (entry.endsWith('.test.ts') || !entry.endsWith('.ts')) {
      return [];
    }
    return [fullPath];
  });
}

const sourceFiles = listTypeScriptFiles(dataRoot);
if (sourceFiles.length === 0) {
  throw new Error('data source files not found');
}

let failed = 0;
for (const filePath of sourceFiles) {
  const source = readFileSync(filePath, 'utf8');
  const label = relative(dataRoot, filePath);
  const isLocalAdapter =
    label === 'reset/localResetRepository.ts' || label === 'reset/LocalResetRepository.ts';

  for (const [pattern, name] of forbiddenEverywhere) {
    if (pattern.test(source)) {
      failed += 1;
      console.error(`fail  ${label} imports ${name}`);
    } else {
      console.log(`ok  ${label} does not import ${name}`);
    }
  }

  if (!isLocalAdapter) {
    for (const [pattern, name] of forbiddenOutsideLocalAdapter) {
      if (pattern.test(source)) {
        failed += 1;
        console.error(`fail  ${label} imports ${name}`);
      } else {
        console.log(`ok  ${label} does not import ${name}`);
      }
    }
  } else {
    console.log(`ok  ${label} may import Zustand store (local adapter)`);
  }

  if (source.includes('gently-reset-daily-v2')) {
    failed += 1;
    console.error(`fail  ${label} mentions gently-reset-daily-v2`);
  } else {
    console.log(`ok  ${label} does not mention gently-reset-daily-v2`);
  }
}

if (failed > 0) {
  throw new Error(`${failed} data dependency-direction check(s) failed`);
}

console.log('\nall data dependency-direction checks passed');
