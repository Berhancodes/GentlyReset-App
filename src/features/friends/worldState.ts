import { formatUsernameHandle } from './username';
import type { FriendListItem, FriendRequestItem } from './types';

export type WorldFriendsPresentation = {
  statusTitle: string;
  statusBody: string;
  usernameHandle: string | null;
  showChooseUsername: boolean;
  showFindFriend: boolean;
  showInviteFriend: boolean;
  incoming: FriendRequestItem[];
  friends: FriendListItem[];
  outgoing: FriendRequestItem[];
};

export function getWorldFriendsPresentation(input: {
  username: string | null;
  friends: readonly FriendListItem[];
  incoming: readonly FriendRequestItem[];
  outgoing: readonly FriendRequestItem[];
}): WorldFriendsPresentation {
  if (!input.username) {
    return {
      statusTitle: 'your world starts with a name.',
      statusBody: 'friends can use this to find you.',
      usernameHandle: null,
      showChooseUsername: true,
      showFindFriend: false,
      showInviteFriend: false,
      incoming: [],
      friends: [],
      outgoing: [],
    };
  }

  const quiet = input.friends.length === 0;
  return {
    statusTitle: formatUsernameHandle(input.username),
    statusBody: quiet ? 'your world is quiet for now.' : 'people you chose to reset with.',
    usernameHandle: formatUsernameHandle(input.username),
    showChooseUsername: false,
    showFindFriend: true,
    showInviteFriend: true,
    incoming: [...input.incoming],
    friends: [...input.friends],
    outgoing: [...input.outgoing],
  };
}
