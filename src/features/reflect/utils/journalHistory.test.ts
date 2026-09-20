import type { JournalEntry } from '../../reset/types';
import {
  formatRecentEntryDate,
  latestReflection,
  recentReflections,
  reflectionPreview,
  reflectionTitle,
  sortedReflections,
} from './journalHistory';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function entry(overrides: Partial<JournalEntry>): JournalEntry {
  return {
    day: 1,
    date: '2024-04-24',
    mood: 4,
    prompt: 'how did it feel?',
    text: 'Today felt a little lighter.',
    savedAt: '2024-04-24T12:00:00.000Z',
    ...overrides,
  };
}

check(
  'recent card date matches mock style',
  formatRecentEntryDate('2024-04-24') === 'Apr 24, 2024',
);

check(
  'title uses the first sentence',
  reflectionTitle('Today felt a little lighter. I’m proud of myself.') ===
    'Today felt a little lighter',
);

check(
  'title truncates long first lines on a word',
  reflectionTitle('This is a much longer journal sentence than the card can hold') ===
    'This is a much longer…',
);

check(
  'preview collapses extra whitespace',
  reflectionPreview('Today felt\n a little   lighter.') === 'Today felt a little lighter.',
);

const older = entry({
  day: 1,
  savedAt: '2024-04-23T12:00:00.000Z',
  text: 'older',
});
const newer = entry({
  day: 2,
  date: '2024-04-24',
  savedAt: '2024-04-24T18:00:00.000Z',
  text: 'newer',
});

check(
  'sorted reflections put newest first',
  sortedReflections([older, newer])[0]?.text === 'newer',
);
check('latest reflection is the newest', latestReflection([older, newer])?.text === 'newer');
check('recent reflections default to three', recentReflections([older, newer]).length === 2);

if (failed > 0) {
  throw new Error(`${failed} journal history check(s) failed`);
}

console.log('\njournal history checks passed');
