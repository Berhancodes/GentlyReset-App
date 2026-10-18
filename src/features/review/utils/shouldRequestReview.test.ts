import { REVIEW_PROMPT_AFTER_CHECK_INS, shouldRequestReview } from './shouldRequestReview';

let failed = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}`);
}

check('asks after the third check-in', REVIEW_PROMPT_AFTER_CHECK_INS === 3);
check('not after day 1', !shouldRequestReview(1, false));
check('not after day 2', !shouldRequestReview(2, false));
check('asks once day 3 is checked in', shouldRequestReview(3, false));
check('still asks later if day 3 was missed', shouldRequestReview(7, false));
check('never asks twice', !shouldRequestReview(3, true) && !shouldRequestReview(20, true));

if (failed > 0) {
  throw new Error(`${failed} review check(s) failed`);
}
