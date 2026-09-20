import {
  getWorldCoverImageBottom,
  getWorldCoverImageTop,
  getWorldCoverLayout,
  getWorldHeroHeight,
  WORLD_COVER_BOTTOM,
  WORLD_COVER_FOCUS,
  WORLD_HERO_ART_ASPECT,
  WORLD_HERO_FLEX,
  WORLD_HERO_MIN_HEIGHT,
  WORLD_STATS_OVERLAP,
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
  'hero flex stays in the 0.48–0.55 tall-phone band',
  WORLD_HERO_FLEX >= 0.48 && WORLD_HERO_FLEX <= 0.55,
  `got ${WORLD_HERO_FLEX}`,
);

check(
  'hero min height stays a large landscape band',
  WORLD_HERO_MIN_HEIGHT >= 400 && WORLD_HERO_MIN_HEIGHT <= 480,
  `got ${WORLD_HERO_MIN_HEIGHT}`,
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
  const heroHeight = getWorldHeroHeight(viewport.height);
  const cover = getWorldCoverLayout(viewport.width, heroHeight);
  const aspect = cover.width / cover.height;
  const imageTop = getWorldCoverImageTop(viewport.width, heroHeight);
  const imageBottom = getWorldCoverImageBottom(viewport.width, heroHeight);

  check(
    `${viewport.name} hero is at least 48% of the phone`,
    heroHeight / viewport.height >= 0.48,
    `got ${(heroHeight / viewport.height).toFixed(3)} (${heroHeight}px)`,
  );

  check(
    `${viewport.name} hero cover keeps art aspect`,
    Math.abs(aspect - WORLD_HERO_ART_ASPECT) < 1e-9,
    `got ${aspect}`,
  );

  check(
    `${viewport.name} is width-driven (vertical crop)`,
    cover.left === 0 && cover.top <= 0 && cover.width === viewport.width,
  );

  check(
    `${viewport.name} crop bottom sits on the grass under the log`,
    Math.abs(imageBottom - WORLD_COVER_BOTTOM) < 0.015,
    `bottom=${imageBottom.toFixed(3)} target=${WORLD_COVER_BOTTOM}`,
  );

  check(
    `${viewport.name} keeps sky for the header (crop starts above 12%)`,
    imageTop <= 0.12,
    `top=${imageTop.toFixed(3)}`,
  );

  check(
    `${viewport.name} keeps the mascot band in frame`,
    imageTop <= MASCOT_BAND_TOP && imageBottom >= MASCOT_BAND_BOTTOM,
    `window=${imageTop.toFixed(3)}-${imageBottom.toFixed(3)}`,
  );

  check(
    `${viewport.name} includes grass below the log`,
    imageBottom >= 0.55,
    `bottom=${imageBottom.toFixed(3)}`,
  );

  const mascotBottomInView = (MASCOT_BAND_BOTTOM - imageTop) * cover.height;
  const overlapStart = heroHeight - WORLD_STATS_OVERLAP;
  check(
    `${viewport.name} stats overlap stays on grass (below the log)`,
    overlapStart >= mascotBottomInView - 1,
    `overlapStart=${overlapStart.toFixed(1)} mascotBottom=${mascotBottomInView.toFixed(1)}`,
  );
}

check(
  'horizontal crop still uses FOCUS_X on a narrow frame',
  (() => {
    const layout = getWorldCoverLayout(200, 800);
    const extra = layout.width - 200;
    return extra > 0 && Math.abs(layout.left + extra * WORLD_COVER_FOCUS.x) < 0.01;
  })(),
);

if (failed > 0) {
  throw new Error(`${failed} world hero layout check(s) failed`);
}

console.log('\nall world hero layout checks passed');
