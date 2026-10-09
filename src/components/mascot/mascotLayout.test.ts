import {
  getMascotClipAlign,
  MASCOT_SOURCE_HEIGHT,
  MASCOT_SOURCE_WIDTH,
  MASCOT_START_BOUNDS,
} from './mascotLayout';
import { MASCOT_ANIMATIONS } from './mascotAnimations';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }

  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function almostEqual(left: number, right: number, tolerance = 0.05) {
  return Math.abs(left - right) <= tolerance;
}

const reference = MASCOT_START_BOUNDS.idle;
const sourceCenterX = MASCOT_SOURCE_WIDTH / 2;
const sourceCenterY = MASCOT_SOURCE_HEIGHT / 2;

const idleAlign = getMascotClipAlign('idle');
check(
  'idle alignment is identity',
  almostEqual(idleAlign.scale, 1) &&
    almostEqual(idleAlign.sourceTranslateX, 0) &&
    almostEqual(idleAlign.sourceTranslateY, 0),
);

for (const animation of MASCOT_ANIMATIONS) {
  const bounds = MASCOT_START_BOUNDS[animation];
  const align = getMascotClipAlign(animation);
  const scaledCenterX = sourceCenterX + (bounds.centerX - sourceCenterX) * align.scale;
  const scaledFeetY = sourceCenterY + (bounds.feetY - sourceCenterY) * align.scale;
  const alignedCenterX = scaledCenterX + align.sourceTranslateX;
  const alignedFeetY = scaledFeetY + align.sourceTranslateY;

  check(
    `${animation} plants on idle feet and center`,
    almostEqual(alignedCenterX, reference.centerX) && almostEqual(alignedFeetY, reference.feetY),
    `center=${alignedCenterX} feet=${alignedFeetY}`,
  );
}

check(
  'jump is zoomed in to match idle size',
  getMascotClipAlign('jump').scale > 1.1 && getMascotClipAlign('jump').sourceTranslateY > 80,
);

if (failed > 0) {
  throw new Error(`${failed} mascot layout check(s) failed`);
}

console.log('\nall mascot layout checks passed');
