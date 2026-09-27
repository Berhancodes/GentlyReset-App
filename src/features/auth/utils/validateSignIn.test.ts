import { canSubmitSignIn, validateSignIn } from './validateSignIn';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

const empty = validateSignIn({ email: '', password: '' });
check(
  'empty sign-in asks for email and password',
  empty.email === 'enter your email.' && empty.password === 'enter your password.',
);

check(
  'invalid email is rejected',
  validateSignIn({ email: 'not-an-email', password: 'password1' }).email === 'enter a valid email.',
);

check(
  'short password is rejected',
  validateSignIn({ email: 'maya@example.com', password: 'short' }).password ===
    'use at least 8 characters.',
);

const valid = { email: ' Maya@Example.com ', password: 'password1' };
check(
  'valid sign-in can submit',
  canSubmitSignIn(valid) === true && Object.keys(validateSignIn(valid)).length === 0,
);

if (failed > 0) {
  throw new Error(`${failed} auth check(s) failed`);
}

console.log('\nall auth checks passed');
