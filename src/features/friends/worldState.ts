import { formatUsernameHandle } from './username';
import type { FriendListItem, FriendRequestItem, ReceivedEncouragement } from './types';
import { friendProgressCopy, SHARED_CYCLE_LENGTH, type SharedFriendProgress } from './progress';

export type WorldFriendsPresentation = {
  statusTitle: string;
  statusBody: string;
  usernameHandle: string | null;
  ownDayLabel: string | null;
  showChooseUsername: boolean;
  showFindFriend: boolean;
  showInviteFriend: boolean;
  incoming: FriendRequestItem[];
  friends: FriendListItem[];
  outgoing: FriendRequestItem[];
  progressByUserId: Record<string, SharedFriendProgress>;
  receivedEncouragements: ReceivedEncouragement[];
};

export function getWorldFriendsPresentation(input: {
  username: string | null;
  friends: readonly FriendListItem[];
  incoming: readonly FriendRequestItem[];
  outgoing: readonly FriendRequestItem[];
  currentDay?: number;
  progress?: readonly SharedFriendProgress[];
  encouragements?: readonly ReceivedEncouragement[];
}): WorldFriendsPresentation {
  const progressByUserId: Record<string, SharedFriendProgress> = {};
  for (const item of input.progress ?? []) {
    progressByUserId[item.userId] = item;
  }

  if (!input.username) {
    return {
      statusTitle: 'your world starts with a name.',
      statusBody: 'friends can use this to find you.',
      usernameHandle: null,
      ownDayLabel: null,
      showChooseUsername: true,
      showFindFriend: false,
      showInviteFriend: false,
      incoming: [],
      friends: [],
      outgoing: [],
      progressByUserId: {},
      receivedEncouragements: [],
    };
  }

  const quiet = input.friends.length === 0;
  const ownDayLabel =
    input.currentDay == null
      ? null
      : friendProgressCopy({
          currentDay: input.currentDay,
          cycleLength: SHARED_CYCLE_LENGTH,
          completedToday: false,
          streak: 0,
        }).dayLabel;

  return {
    statusTitle: formatUsernameHandle(input.username),
    statusBody:
      ownDayLabel ?? (quiet ? 'your world is quiet for now.' : 'people you chose to reset with.'),
    usernameHandle: formatUsernameHandle(input.username),
    ownDayLabel,
    showChooseUsername: false,
    showFindFriend: true,
    showInviteFriend: true,
    incoming: [...input.incoming],
    friends: [...input.friends],
    outgoing: [...input.outgoing],
    progressByUserId,
    receivedEncouragements: [...(input.encouragements ?? [])],
  };
}
