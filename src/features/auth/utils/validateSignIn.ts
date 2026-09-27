import type { SignInErrors, SignInValues } from '../types';
import { isValidEmail, normalizeEmail } from './normalizeEmail';

export const SIGN_IN_PASSWORD_MIN_LENGTH = 8;

export function validateSignIn(values: SignInValues): SignInErrors {
  const errors: SignInErrors = {};
  const email = normalizeEmail(values.email);
  const password = values.password;

  if (email.length === 0) {
    errors.email = 'enter your email.';
  } else if (!isValidEmail(email)) {
    errors.email = 'enter a valid email.';
  }

  if (password.length === 0) {
    errors.password = 'enter your password.';
  } else if (password.length < SIGN_IN_PASSWORD_MIN_LENGTH) {
    errors.password = `use at least ${SIGN_IN_PASSWORD_MIN_LENGTH} characters.`;
  }

  return errors;
}

export function canSubmitSignIn(values: SignInValues): boolean {
  return Object.keys(validateSignIn(values)).length === 0;
}
