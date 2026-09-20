import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const domainRoot = new URL('../src/domain', import.meta.url).pathname;
const forbidden = [
  [/from\s+['"]react(?:\/|['"])/, 'react'],
  [/from\s+['"]react-native(?:\/|['"])/, 'react-native'],
  [/from\s+['"]expo(?:-|\/|['"])/, 'expo'],
  [/from\s+['"]expo-router(?:\/|['"])/, 'expo-router'],
  [/from\s+['"]zustand(?:\/|['"])/, 'zustand'],
  [/from\s+['"]@react-native-async-storage\//, 'AsyncStorage'],
  [/from\s+['"][^'"]*features\//, 'features'],
  [/from\s+['"]@\/features\//, '@/features'],
  [/from\s+['"][^'"]*application\//, 'application'],
  [/from\s+['"]@\/application\//, '@/application'],
  [/from\s+['"](?:@\/data\/|(?:\.\.\/)+data\/)/, 'data layer'],
  [/from\s+['"]@\/data\//, '@/data'],
  [/from\s+['"]@\/components\//, '@/components'],
  [/from\s+['"]@\/navigation\//, '@/navigation'],
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

const sourceFiles = listTypeScriptFiles(domainRoot);
if (sourceFiles.length === 0) {
  throw new Error('domain source files not found');
}

let failed = 0;
for (const filePath of sourceFiles) {
  const source = readFileSync(filePath, 'utf8');
  const label = relative(domainRoot, filePath);
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
  throw new Error(`${failed} domain dependency-direction check(s) failed`);
}

console.log('\nall domain dependency-direction checks passed');
