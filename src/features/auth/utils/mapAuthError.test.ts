import { getSignUpOutcome, mapAuthError, mapUnknownAuthFailure } from './mapAuthError';

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
  'invalid credentials stay gentle',
  mapAuthError({ code: 'invalid_credentials', message: 'Invalid login credentials' }) ===
    'email or password doesn’t match.',
);

check(
  'existing email stays gentle',
  mapAuthError({ code: 'email_exists', message: 'User already registered' }) ===
    'an account with that email already exists.',
);

check(
  'unconfirmed email stays gentle',
  mapAuthError({ code: 'email_not_confirmed' }) === 'check your email to confirm this account.',
);

check(
  'unknown backend text is not dumped',
  mapAuthError({ message: 'JWT kid header was not found in JWKS (kid=abc123)' }) ===
    'something went wrong. try again.',
);

check(
  'network TypeError stays gentle',
  mapUnknownAuthFailure(new TypeError('Failed to fetch')) ===
    'we couldn’t reach the server. check your connection.',
);

check(
  'sign-up without session asks for confirmation',
  getSignUpOutcome({ user: { id: 'user-1' }, session: null }).kind === 'confirmation_required',
);

check(
  'sign-up with session is signed in',
  getSignUpOutcome({ user: { id: 'user-1' }, session: { access_token: 'token' } }).kind ===
    'signed_in',
);

if (failed > 0) {
  throw new Error(`${failed} auth error-mapping check(s) failed`);
}

console.log('\nall auth error-mapping checks passed');
