import {
  acceptFriendRequest,
  cancelFriendRequest,
  canReadFriendship,
  canonicalPairKey,
  declineFriendRequest,
  emptyFriendshipStore,
  removeFriend,
  sendFriendRequest,
} from './friendshipRules';
import {
  buildFriendInviteDeepLink,
  buildFriendInvitePath,
  classifyInviteToken,
  clearFriendInviteToken,
  isOpaqueInviteToken,
  peekFriendInviteToken,
  rememberFriendInviteToken,
  takeFriendInviteToken,
} from './invite/pendingFriendInvite';
import {
  exposesPrivateSocialField,
  hasOnlyPublicIdentityFields,
  inviteResolutionCreatesFriendship,
} from './privacy';
import { normalizeUsername, usernameIssueMessage } from './username';
import { getWorldFriendsPresentation } from './worldState';
import { getAccessDestination } from '../subscription/access/getAccessDestination';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

const lowered = normalizeUsername('Berhan_23');
check('username normalizes to lowercase', lowered.ok && lowered.username === 'berhan_23');
const withAt = normalizeUsername('@Calm_Day');
check('leading @ is not stored', withAt.ok && withAt.username === 'calm_day');
check('valid username is accepted', normalizeUsername('ok_name').ok);
check('spaces are rejected', !normalizeUsername('berhan 23').ok);
check('symbols are rejected', !normalizeUsername('berhan-23').ok);
check('empty is rejected', !normalizeUsername('   ').ok && !normalizeUsername('@').ok);
check('under 3 is rejected', !normalizeUsername('ab').ok);
check('over 20 is rejected', !normalizeUsername('a'.repeat(21)).ok);
const sameA = normalizeUsername('BERHAN_23');
const sameB = normalizeUsername('berhan_23');
check(
  'case-insensitive duplicate uses the same stored value',
  sameA.ok && sameB.ok && sameA.username === sameB.username,
);
check(
  'invalid username has friendly copy',
  usernameIssueMessage('invalid_characters').includes('letters'),
);

const publicSearch = {
  userId: 'user-b',
  username: 'berhan_23',
  displayName: 'Berhan',
  avatarUrl: null,
};
check('search payload stays on public identity fields', hasOnlyPublicIdentityFields(publicSearch));
check('search payload does not include private fields', !exposesPrivateSocialField(publicSearch));
check(
  'timezone is treated as private',
  exposesPrivateSocialField({ userId: 'x', timezone: 'America/Los_Angeles' }),
);
check(
  'journal body is treated as private',
  exposesPrivateSocialField({ userId: 'x', body: 'secret journal' }),
);
check(
  'personalization is treated as private',
  exposesPrivateSocialField({ userId: 'x', personalization: { desiredFeelings: ['calm'] } }),
);

let store = emptyFriendshipStore();
const first = sendFriendRequest(store, 'user-a', 'user-b');
store = first.store;
check('A → B creates one pending relationship', first.code === 'sent' && store.rows.length === 1);
check(
  'pair identity is canonical',
  canonicalPairKey('user-a', 'user-b') === canonicalPairKey('user-b', 'user-a'),
);

const self = sendFriendRequest(store, 'user-a', 'user-a');
check('A → A is rejected', self.code === 'self' && self.store.rows.length === 1);

const duplicate = sendFriendRequest(store, 'user-a', 'user-b');
check(
  'duplicate A → B is idempotent',
  duplicate.code === 'already_pending' && duplicate.store.rows.length === 1,
);

store = emptyFriendshipStore();
store = sendFriendRequest(store, 'user-b', 'user-a').store;
const crossed = sendFriendRequest(store, 'user-a', 'user-b');
store = crossed.store;
check('crossed A → B while B → A pending accepts the pair', crossed.code === 'accepted_existing');
check('crossed requests do not create a second row', store.rows.length === 1);
check('crossed pair is accepted', store.rows[0]?.status === 'accepted');

store = emptyFriendshipStore();
store = sendFriendRequest(store, 'user-a', 'user-b').store;
const requestId = store.rows[0]?.id ?? '';
const wrongAccept = acceptFriendRequest(store, 'user-a', requestId);
check(
  'wrong user cannot accept',
  wrongAccept.code === 'not_allowed' && wrongAccept.store.rows[0]?.status === 'pending',
);

const accepted = acceptFriendRequest(store, 'user-b', requestId);
store = accepted.store;
check(
  'addressee accept becomes accepted',
  accepted.code === 'accepted' && store.rows[0]?.status === 'accepted',
);

store = emptyFriendshipStore();
store = sendFriendRequest(store, 'user-a', 'user-b').store;
const declineId = store.rows[0]?.id ?? '';
const declined = declineFriendRequest(store, 'user-b', declineId);
store = declined.store;
check(
  'addressee can decline',
  declined.code === 'declined' && store.rows[0]?.status === 'declined',
);

store = emptyFriendshipStore();
store = sendFriendRequest(store, 'user-a', 'user-b').store;
const cancelId = store.rows[0]?.id ?? '';
const cancelledByAddressee = cancelFriendRequest(store, 'user-b', cancelId);
check('addressee cannot cancel', cancelledByAddressee.code === 'not_allowed');
const cancelled = cancelFriendRequest(store, 'user-a', cancelId);
store = cancelled.store;
check('requester can cancel pending', cancelled.code === 'cancelled' && store.rows.length === 0);

store = emptyFriendshipStore();
store = sendFriendRequest(store, 'user-a', 'user-b').store;
store = acceptFriendRequest(store, 'user-b', store.rows[0]?.id ?? '').store;
const removedByA = removeFriend(store, 'user-a', store.rows[0]?.id ?? '');
check(
  'either accepted participant can remove',
  removedByA.code === 'removed' && removedByA.store.rows.length === 0,
);
store = emptyFriendshipStore();
store = sendFriendRequest(store, 'user-a', 'user-b').store;
store = acceptFriendRequest(store, 'user-b', store.rows[0]?.id ?? '').store;
const removedByB = removeFriend(store, 'user-b', store.rows[0]?.id ?? '');
check('addressee can also remove an accepted friend', removedByB.code === 'removed');

const privateRow = {
  id: 'friendship-1',
  requesterId: 'user-a',
  addresseeId: 'user-b',
  status: 'accepted' as const,
  acceptedAt: '2026-09-28T00:00:00.000Z',
};
check('participant can read their friendship', canReadFriendship(privateRow, 'user-a'));
check('unrelated User C cannot read A/B friendship', !canReadFriendship(privateRow, 'user-c'));

const resolvedInvite = {
  userId: 'user-a',
  username: 'berhan_23',
  displayName: null,
  avatarUrl: null,
};
check('resolved invite returns only identity', hasOnlyPublicIdentityFields(resolvedInvite));
check(
  'opening an invite does not create a friendship',
  !inviteResolutionCreatesFriendship(resolvedInvite),
);
check('opaque invite tokens are 32-byte hex', isOpaqueInviteToken('ab'.repeat(32)));
check(
  'revoked invite is rejected',
  classifyInviteToken({
    token: 'ab'.repeat(32),
    revokedAt: '2026-09-28T00:00:00.000Z',
    expiresAt: null,
    nowMs: Date.parse('2026-09-28T12:00:00.000Z'),
  }) === 'revoked',
);
check(
  'expired invite is rejected',
  classifyInviteToken({
    token: 'ab'.repeat(32),
    revokedAt: null,
    expiresAt: '2026-09-01T00:00:00.000Z',
    nowMs: Date.parse('2026-09-28T12:00:00.000Z'),
  }) === 'expired',
);

const opaqueToken = 'a'.repeat(64);
check(
  'invite path keeps the token opaque',
  buildFriendInvitePath(opaqueToken).includes(opaqueToken),
);
check(
  'invite deep link uses the app scheme',
  buildFriendInviteDeepLink(opaqueToken).startsWith('gentlyreset://friend-invite/'),
);

rememberFriendInviteToken('  token-1  ');
check(
  'invite token is preserved through later account flow',
  peekFriendInviteToken() === 'token-1',
);
check(
  'taking the token does not auto-friend',
  takeFriendInviteToken() === 'token-1' && peekFriendInviteToken() === null,
);
clearFriendInviteToken();

const noUsername = getWorldFriendsPresentation({
  username: null,
  friends: [],
  incoming: [],
  outgoing: [],
});
check(
  'no username state asks the person to choose one',
  noUsername.showChooseUsername && !noUsername.showFindFriend,
);
check('invite waits for a username', !noUsername.showInviteFriend);

const quiet = getWorldFriendsPresentation({
  username: 'berhan_23',
  friends: [],
  incoming: [],
  outgoing: [],
});
check(
  'username without friends is quiet',
  quiet.statusBody.includes('quiet') && quiet.showFindFriend && quiet.showInviteFriend,
);

const incoming = getWorldFriendsPresentation({
  username: 'berhan_23',
  friends: [],
  incoming: [
    {
      friendshipId: 'req-1',
      userId: 'user-b',
      username: 'calm_day',
      displayName: 'Calm',
      avatarUrl: null,
      createdAt: null,
    },
  ],
  outgoing: [],
});
check(
  'incoming requests are surfaced',
  incoming.incoming.length === 1 && incoming.incoming[0]?.username === 'calm_day',
);

const friends = getWorldFriendsPresentation({
  username: 'berhan_23',
  friends: [
    {
      friendshipId: 'f-1',
      userId: 'user-b',
      username: 'calm_day',
      displayName: 'Calm',
      avatarUrl: null,
      acceptedAt: '2026-09-28T00:00:00.000Z',
    },
  ],
  incoming: [],
  outgoing: [],
});
check('accepted friends render identity only', friends.friends[0]?.username === 'calm_day');
check('friend presentation has no reset fields', !('currentDay' in friends.friends[0]!));

check(
  'invite does not bypass onboarding',
  getAccessDestination({
    hasCompletedOnboarding: false,
    subscriptionInitializing: false,
    isPro: true,
  }) === 'onboarding',
);
check(
  'invite does not bypass RevenueCat',
  getAccessDestination({
    hasCompletedOnboarding: true,
    subscriptionInitializing: false,
    isPro: false,
  }) === 'paywall',
);

if (failed > 0) {
  throw new Error(`${failed} friends check(s) failed`);
}

console.log('\nall friends checks passed');
