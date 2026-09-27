import type { AuthActionResult, AuthSuccessKind } from '../types';

type AuthFailureShape = {
  code?: string;
  message?: string;
  status?: number;
};

const FALLBACK_MESSAGE = 'something went wrong. try again.';
const NETWORK_MESSAGE = 'we couldn’t reach the server. check your connection.';

export function mapAuthError(error: AuthFailureShape | null | undefined): string {
  const code = error?.code ?? '';
  const message = (error?.message ?? '').toLowerCase();
  const status = error?.status;

  if (code === 'invalid_credentials' || message.includes('invalid login')) {
    return 'email or password doesn’t match.';
  }

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'check your email to confirm this account.';
  }

  if (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    message.includes('already registered')
  ) {
    return 'an account with that email already exists.';
  }

  if (code === 'weak_password' || message.includes('weak password')) {
    return 'choose a stronger password.';
  }

  if (code === 'over_request_rate_limit' || status === 429) {
    return 'too many attempts. wait a moment and try again.';
  }

  if (
    code === 'request_timeout' ||
    message.includes('network') ||
    message.includes('failed to fetch')
  ) {
    return NETWORK_MESSAGE;
  }

  return FALLBACK_MESSAGE;
}

export function mapUnknownAuthFailure(error: unknown): string {
  if (error instanceof TypeError) {
    return NETWORK_MESSAGE;
  }

  if (error && typeof error === 'object') {
    return mapAuthError(error as AuthFailureShape);
  }

  return FALLBACK_MESSAGE;
}

export function getSignUpOutcome(input: {
  session: unknown;
  user: unknown;
}): Extract<AuthActionResult, { ok: true }> {
  if (input.user && !input.session) {
    return { ok: true, kind: 'confirmation_required' };
  }

  return { ok: true, kind: 'signed_in' };
}

export function authSuccess(kind: AuthSuccessKind): AuthActionResult {
  return { ok: true, kind };
}

export function authFailure(error: unknown): AuthActionResult {
  return { ok: false, message: mapUnknownAuthFailure(error) };
}
