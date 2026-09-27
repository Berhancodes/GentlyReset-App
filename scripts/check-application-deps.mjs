import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const applicationRoot = new URL('../src/application', import.meta.url).pathname;
const forbidden = [
  [/from\s+['"]react(?:\/|['"])/, 'react'],
  [/from\s+['"]react-native(?:\/|['"])/, 'react-native'],
  [/from\s+['"]expo(?:-|\/|['"])/, 'expo'],
  [/from\s+['"]expo-router(?:\/|['"])/, 'expo-router'],
  [/from\s+['"]zustand(?:\/|['"])/, 'zustand'],
  [/from\s+['"]@react-native-async-storage\//, 'AsyncStorage'],
  [/from\s+['"][^'"]*features\/reset\/store/, 'reset store'],
  [/from\s+['"]@\/features\/reset\/store/, 'reset store'],
  [/from\s+['"](?:@\/data\/|(?:\.\.\/)+data\/)/, 'data layer'],
  [/from\s+['"]@\/data\//, '@/data'],
  [/from\s+['"]@\/components\//, '@/components'],
  [/from\s+['"][^'"]*components\//, 'components'],
  [/from\s+['"]@\/navigation\//, '@/navigation'],
  [/from\s+['"]@supabase\//, 'supabase'],
  [/from\s+['"]@\/features\/reset\/sync/, 'reset sync'],
  [/from\s+['"][^'"]*features\/reset\/sync/, 'reset sync'],
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

const sourceFiles = listTypeScriptFiles(applicationRoot);
if (sourceFiles.length === 0) {
  throw new Error('application source files not found');
}

let failed = 0;
for (const filePath of sourceFiles) {
  const source = readFileSync(filePath, 'utf8');
  const label = relative(applicationRoot, filePath);
  for (const [pattern, name] of forbidden) {
    if (pattern.test(source)) {
      failed += 1;
      console.error(`fail  ${label} imports ${name}`);
    } else {
      console.log(`ok  ${label} does not import ${name}`);
    }
  }
}

if (failed > 0) {
  throw new Error(`${failed} application dependency-direction check(s) failed`);
}

console.log('\nall application dependency-direction checks passed');
