import { mapJournalEntriesToReflections, mapJournalEntryToReflection } from './reflection';
import type { JournalEntry, Reflection } from './types';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

const entry: JournalEntry = {
  day: 7,
  date: '2026-09-20',
  mood: 4,
  prompt: 'What felt lighter?',
  text: 'I stopped at enough.',
  savedAt: '2026-09-20T18:04:00.000Z',
};

const reflection = mapJournalEntryToReflection(entry);

check('E day is preserved', reflection.day === entry.day);
check('E date is preserved', reflection.date === entry.date);
check('E mood is preserved', reflection.mood === entry.mood);
check('E prompt is preserved', reflection.prompt === entry.prompt);
check('E text is preserved', reflection.text === entry.text);
check('E savedAt is preserved', reflection.savedAt === entry.savedAt);
check(
  'E mapping does not invent a cycle id',
  !Object.prototype.hasOwnProperty.call(reflection, 'cycleId') &&
    !Object.prototype.hasOwnProperty.call(reflection, 'cycleSequence'),
);
check(
  'E mapped keys match JournalEntry keys',
  Object.keys(reflection).sort().join(',') === Object.keys(entry).sort().join(','),
);

const copied: Reflection = mapJournalEntryToReflection(entry);
copied.text = 'mutated';
check(
  'E mapper does not share a live reference that rewrites the entry',
  entry.text === 'I stopped at enough.',
);

const empty: JournalEntry = {
  day: 1,
  date: '2026-09-01',
  mood: 1,
  prompt: '',
  text: '',
  savedAt: '2026-09-01T08:00:00.000Z',
};
const emptyReflection = mapJournalEntryToReflection(empty);
check(
  'E empty prompt/text are kept, not filled in',
  emptyReflection.prompt === '' && emptyReflection.text === '',
);

const list = mapJournalEntriesToReflections([entry, empty]);
check(
  'E list map keeps order and length',
  list.length === 2 && list[0]?.day === 7 && list[1]?.day === 1,
);

if (failed > 0) {
  throw new Error(`${failed} domain reflection E check(s) failed`);
}

console.log('\nall domain reflection E checks passed');
