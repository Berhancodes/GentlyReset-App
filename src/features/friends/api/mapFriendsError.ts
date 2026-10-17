import type { FriendActionCode } from '../types';

export function friendsErrorMessage(code: FriendActionCode): string {
  switch (code) {
    case 'self':
      return 'that’s you — try a friend’s username.';
    case 'not_found':
    case 'invalid_token':
      return 'this invite or username isn’t available.';
    case 'already_pending':
      return 'your request is already waiting.';
    case 'already_friends':
      return 'you’re already friends.';
    case 'accepted_existing':
      return 'you’re friends now.';
    case 'not_allowed':
      return 'that request isn’t yours to change.';
    case 'not_pending':
      return 'that request is no longer waiting.';
    case 'not_friends':
      return 'you’re not friends with this person.';
    case 'unauthenticated':
      return 'sign in to use friends.';
    case 'username_required':
      return 'choose a username first.';
    case 'username_taken':
      return 'that username is already taken.';
    case 'invalid_username':
      return 'use 3–20 letters, numbers, or underscores.';
    case 'username_not_allowed':
      return 'that username isn’t available. please choose a different one.';
    case 'invalid_reason':
      return 'choose a reason for the report.';
    case 'revoked':
      return 'this invite is no longer active.';
    case 'expired':
      return 'this invite has expired.';
    case 'conflict':
      return 'couldn’t update that friendship. try again.';
    case 'too_soon':
      return 'you already sent that recently. try another note, or wait until tomorrow.';
    case 'rate_limited':
      return 'you’re going a little fast. take a breath and try again in a few minutes.';
    case 'invalid_kind':
      return 'that note isn’t available.';
    default:
      return 'something got in the way. try again in a moment.';
  }
}

export function searchErrorMessage(code: FriendActionCode | 'invalid_username'): string {
  if (code === 'invalid_username') {
    return 'use 3–20 letters, numbers, or underscores.';
  }
  return friendsErrorMessage(code);
}
