import { getDeviceIanaTimezone } from './getDeviceTimezone';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

const timezone = getDeviceIanaTimezone();

check(
  'device timezone is IANA or null',
  timezone === null || /^[A-Za-z]+(?:\/[A-Za-z_+\-]+)+$/.test(timezone) || timezone === 'UTC',
  timezone ?? 'null',
);

check('device timezone is not a numeric offset', timezone === null || !/^[+-]?\d/.test(timezone));

if (failed > 0) {
  throw new Error(`${failed} timezone check(s) failed`);
}

console.log('\nall timezone checks passed');
