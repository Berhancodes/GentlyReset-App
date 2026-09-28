export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

export type UsernameIssue = 'empty' | 'too_short' | 'too_long' | 'invalid_characters';

export type UsernameNormalization =
  { ok: true; username: string } | { ok: false; code: UsernameIssue };

/**
 * Trim, strip a leading @, and lowercase.
 * Does not store the @. Rejects spaces and other punctuation.
 */
export function normalizeUsername(raw: string): UsernameNormalization {
  const trimmed = raw.trim();
  const withoutAt = trimmed.startsWith('@') ? trimmed.slice(1).trim() : trimmed;
  const username = withoutAt.toLowerCase();

  if (username.length === 0) {
    return { ok: false, code: 'empty' };
  }
  if (username.length < USERNAME_MIN_LENGTH) {
    return { ok: false, code: 'too_short' };
  }
  if (username.length > USERNAME_MAX_LENGTH) {
    return { ok: false, code: 'too_long' };
  }
  if (!USERNAME_PATTERN.test(username)) {
    return { ok: false, code: 'invalid_characters' };
  }

  return { ok: true, username };
}

export function formatUsernameHandle(username: string): string {
  return `@${username}`;
}

export function usernameIssueMessage(code: UsernameIssue): string {
  switch (code) {
    case 'empty':
      return 'choose a username to continue.';
    case 'too_short':
      return 'usernames need at least 3 characters.';
    case 'too_long':
      return 'usernames can be at most 20 characters.';
    case 'invalid_characters':
      return 'use letters, numbers, and underscores only.';
  }
}
