import {
  getWorldCoverImageBottom,
  getWorldCoverImageTop,
  getWorldCoverLayout,
  WORLD_COVER_FOCUS,
  WORLD_HERO_ART_ASPECT,
  WORLD_HERO_FLEX,
} from './worldHeroLayout';

const VIEWPORTS = [
  { name: 'iphone-small', width: 390, height: 844 },
  { name: 'iphone-standard', width: 393, height: 852 },
  { name: 'iphone-tall', width: 430, height: 932 },
] as const;

/** Mascot + log band in illustrated scene space (from world-friends-background.png). */
const MASCOT_BAND_TOP = 0.38;
const MASCOT_BAND_BOTTOM = 0.52;

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
  'hero flex stays in the 0.36–0.40 landscape band',
  WORLD_HERO_FLEX >= 0.36 && WORLD_HERO_FLEX <= 0.4,
  `got ${WORLD_HERO_FLEX}`,
);

check(
  'cover crop does not stretch (wide viewport keeps art aspect)',
  (() => {
    const layout = getWorldCoverLayout(800, 400);
    const aspect = layout.width / layout.height;
    return Math.abs(aspect - WORLD_HERO_ART_ASPECT) < 1e-9;
  })(),
);

check(
  'cover crop does not stretch (tall viewport keeps art aspect)',
  (() => {
    const layout = getWorldCoverLayout(390, 844);
    const aspect = layout.width / layout.height;
    return Math.abs(aspect - WORLD_HERO_ART_ASPECT) < 1e-9;
  })(),
);

for (const viewport of VIEWPORTS) {
  const heroHeight = viewport.height * WORLD_HERO_FLEX;
  const cover = getWorldCoverLayout(viewport.width, heroHeight);
  const aspect = cover.width / cover.height;
  const imageTop = getWorldCoverImageTop(viewport.width, heroHeight);
  const imageBottom = getWorldCoverImageBottom(viewport.width, heroHeight);

  check(
    `${viewport.name} hero cover keeps art aspect`,
    Math.abs(aspect - WORLD_HERO_ART_ASPECT) < 1e-9,
    `got ${aspect}`,
  );

  check(
    `${viewport.name} is width-driven (vertical crop) with FOCUS_Y`,
    cover.left === 0 && cover.top <= 0 && cover.width === viewport.width,
  );

  const extra = cover.height - heroHeight;
  if (extra > 0.5) {
    check(
      `${viewport.name} vertical crop uses FOCUS_Y`,
      Math.abs(cover.top + extra * WORLD_COVER_FOCUS.y) < 0.01,
    );
  }

  check(
    `${viewport.name} keeps sky for the header (crop starts above 20%)`,
    imageTop <= 0.2,
    `top=${imageTop.toFixed(3)}`,
  );

  check(
    `${viewport.name} keeps the mascot band in frame`,
    imageTop <= MASCOT_BAND_TOP && imageBottom >= MASCOT_BAND_BOTTOM,
    `window=${imageTop.toFixed(3)}-${imageBottom.toFixed(3)}`,
  );

  check(
    `${viewport.name} includes grass below the log`,
    imageBottom >= 0.53,
    `bottom=${imageBottom.toFixed(3)}`,
  );
}

if (failed > 0) {
  throw new Error(`${failed} world hero layout check(s) failed`);
}

console.log('\nall world hero layout checks passed');
