import {
  getJournalSkyCoverLayout,
  getJournalWritingCardMinHeight,
  JOURNAL_MASCOT_WRITING_ASPECT,
  JOURNAL_MASCOT_WRITING_ART,
  JOURNAL_SKY_ART_ASPECT,
  JOURNAL_WRITING_CARD,
} from './journalLayout';

const VIEWPORTS = [
  { name: 'iphone-small', width: 390, height: 844 },
  { name: 'iphone-standard', width: 393, height: 852 },
  { name: 'iphone-tall', width: 430, height: 932 },
] as const;

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

check(
  'sky cover crop does not stretch (wide viewport keeps art aspect)',
  (() => {
    const layout = getJournalSkyCoverLayout(800, 400);
    const aspect = layout.width / layout.height;
    return Math.abs(aspect - JOURNAL_SKY_ART_ASPECT) < 1e-9;
  })(),
);

for (const viewport of VIEWPORTS) {
  const layout = getJournalSkyCoverLayout(viewport.width, viewport.height);
  const aspect = layout.width / layout.height;
  check(
    `${viewport.name} sky cover keeps art aspect`,
    Math.abs(aspect - JOURNAL_SKY_ART_ASPECT) < 1e-9,
  );
  check(
    `${viewport.name} sky cover fills the view`,
    layout.width >= viewport.width - 0.5 && layout.height >= viewport.height - 0.5,
  );
  check(`${viewport.name} sky cover does not tile`, layout.left <= 0 && layout.top <= 0);
}

check(
  'writing mascot aspect matches the PNG',
  Math.abs(
    JOURNAL_MASCOT_WRITING_ASPECT -
      JOURNAL_MASCOT_WRITING_ART.width / JOURNAL_MASCOT_WRITING_ART.height,
  ) < 1e-12,
);

for (const viewport of VIEWPORTS) {
  const minHeight = getJournalWritingCardMinHeight(viewport.height);
  check(
    `${viewport.name} writing card is at least the floor`,
    minHeight >= JOURNAL_WRITING_CARD.minHeightFloor,
  );
  check(
    `${viewport.name} writing card is not taller than the ceiling`,
    minHeight <= JOURNAL_WRITING_CARD.minHeightCeiling,
  );
}

check(
  'short phones still keep a usable writing card',
  getJournalWritingCardMinHeight(640) === JOURNAL_WRITING_CARD.minHeightFloor,
);

if (failed > 0) {
  throw new Error(`${failed} journal layout check(s) failed`);
}

console.log('\njournal layout checks passed');
