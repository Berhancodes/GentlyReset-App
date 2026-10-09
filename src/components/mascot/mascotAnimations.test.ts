import {
  getMascotReactionPool,
  getVisibleMascotAnimation,
  MASCOT_REACTIONS,
  pickMascotReaction,
} from './mascotAnimations';

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
  'reaction pool has four clips and no idle',
  MASCOT_REACTIONS.length === 4 && !MASCOT_REACTIONS.includes('idle' as never),
);

const afterWave = getMascotReactionPool('wave');
check(
  'previous reaction is excluded from the next pool',
  afterWave.length === 3 && !afterWave.includes('wave'),
);

check(
  'pick never repeats the previous reaction',
  pickMascotReaction('wiggle', () => 0) !== 'wiggle' &&
    pickMascotReaction('wiggle', () => 0.99) !== 'wiggle',
);

check(
  'visible clip follows the explicit state',
  getVisibleMascotAnimation({ type: 'idle' }) === 'idle' &&
    getVisibleMascotAnimation({ type: 'reaction', animation: 'hug' }) === 'hug',
);

if (failed > 0) {
  throw new Error(`${failed} mascot animation check(s) failed`);
}

console.log('\nall mascot animation checks passed');
