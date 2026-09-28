import { getResetProfile, RESET_PROFILES } from './resetProfile';
import {
  isResetTypeId,
  LEGACY_FALLBACK_RESET_TYPE_ID,
  RESET_TYPE_IDS,
  RESET_TYPE_NAMES,
} from './types';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

for (const typeId of RESET_TYPE_IDS) {
  const profile = getResetProfile(typeId);
  check(`D lookup ${typeId} keeps that id`, profile.id === typeId);
  check(`D lookup ${typeId} uses stored name`, profile.name === RESET_TYPE_NAMES[typeId]);
  check(`D lookup ${typeId} is the registry record`, profile === RESET_PROFILES[typeId]);
}

check(
  'D valid ids are not reclassified',
  getResetProfile('fading-flame').id === 'fading-flame' &&
    getResetProfile('almost-starter').id === 'almost-starter' &&
    getResetProfile('soft-restarter').id === 'soft-restarter',
);
check(
  'D unknown id falls back without inventing a new type',
  getResetProfile('unknown-old-type').id === LEGACY_FALLBACK_RESET_TYPE_ID,
);
check('D empty id falls back', getResetProfile('').id === LEGACY_FALLBACK_RESET_TYPE_ID);
check('D isResetTypeId accepts stored ids', isResetTypeId('soft-restarter'));
check(
  'D isResetTypeId accepts new ids',
  isResetTypeId('quiet-stranger') && isResetTypeId('all-in-heart'),
);
check('D isResetTypeId rejects unknown ids', isResetTypeId('unknown-old-type') === false);
check(
  'D lookup is not a classifier — same id in, same id out',
  getResetProfile('overloaded-dreamer').id === 'overloaded-dreamer',
);

if (failed > 0) {
  throw new Error(`${failed} domain resetProfile D check(s) failed`);
}

console.log('\nall domain resetProfile D checks passed');
