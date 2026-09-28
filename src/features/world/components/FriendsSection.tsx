import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '@/features/friends/api/friendsApi';
import { FriendIdentityRow } from '@/features/friends/components/FriendIdentityRow';
import type { WorldFriendsPresentation } from '@/features/friends/worldState';
import { WorldActionCard } from '@/features/world/components/WorldActionCard';
import { buildInviteShareMessage, inviteFriend } from '@/features/world/utils/inviteFriend';

export type WorldNotice = {
  title: string;
  body: string;
};

type FriendsSectionProps = {
  presentation: WorldFriendsPresentation;
  onChooseUsername: () => void;
  onFindFriend: () => void;
  onInviteFriend: () => void;
  onRefresh: () => void;
  onNotice: (notice: WorldNotice) => void;
};

export async function shareWorldInvite(deepLink?: string): Promise<WorldNotice | null> {
  try {
    const result = await inviteFriend(deepLink);
    if (result === 'copied') {
      return {
        title: 'invite a friend',
        body: 'invite text copied. paste it to someone you trust.',
      };
    }
    return null;
  } catch {
    return {
      title: 'invite a friend',
      body: buildInviteShareMessage(deepLink),
    };
  }
}

export function FriendsSection({
  presentation,
  onChooseUsername,
  onFindFriend,
  onInviteFriend,
  onRefresh,
  onNotice,
}: FriendsSectionProps) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = (
    friendshipId: string,
    work: () => Promise<{ ok: boolean; message?: string }>,
    title: string,
  ) => {
    if (busyId) {
      return;
    }
    setBusyId(friendshipId);
    void work()
      .then((result) => {
        if (!result.ok && result.message) {
          onNotice({ title, body: result.message });
          return;
        }
        onRefresh();
      })
      .finally(() => {
        setBusyId(null);
      });
  };

  return (
    <View style={styles.root}>
      {presentation.showChooseUsername ? (
        <WorldActionCard
          glyph="plus"
          title="choose username"
          subtitle="your world starts with a name"
          onPress={onChooseUsername}
        />
      ) : null}
      {presentation.showFindFriend ? (
        <WorldActionCard
          glyph="group"
          title="find a friend"
          subtitle="search an exact @username"
          onPress={onFindFriend}
        />
      ) : null}
      {presentation.showInviteFriend ? (
        <WorldActionCard
          glyph="plus"
          title="invite a friend"
          subtitle="share a private invite link"
          onPress={onInviteFriend}
        />
      ) : null}

      {presentation.incoming.length > 0 ? (
        <View style={styles.block}>
          <AppText variant="optionTitle">requests</AppText>
          <View style={styles.card}>
            {presentation.incoming.map((item, index) => (
              <View key={item.friendshipId}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <FriendIdentityRow
                  identity={item}
                  accessory="acceptDecline"
                  busy={busyId === item.friendshipId}
                  onAccept={() => {
                    run(item.friendshipId, () => acceptFriendRequest(item.friendshipId), 'request');
                  }}
                  onDecline={() => {
                    run(
                      item.friendshipId,
                      () => declineFriendRequest(item.friendshipId),
                      'request',
                    );
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {presentation.friends.length > 0 ? (
        <View style={styles.block}>
          <AppText variant="optionTitle">friends</AppText>
          <View style={styles.card}>
            {presentation.friends.map((item, index) => (
              <View key={item.friendshipId}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <FriendIdentityRow
                  identity={item}
                  accessory="remove"
                  busy={busyId === item.friendshipId}
                  onRemove={() => {
                    run(item.friendshipId, () => removeFriend(item.friendshipId), 'friends');
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {presentation.outgoing.length > 0 ? (
        <View style={styles.block}>
          <AppText variant="optionTitle">waiting</AppText>
          <View style={styles.card}>
            {presentation.outgoing.map((item, index) => (
              <View key={item.friendshipId}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <FriendIdentityRow
                  identity={item}
                  accessory="cancel"
                  busy={busyId === item.friendshipId}
                  onCancel={() => {
                    run(item.friendshipId, () => cancelFriendRequest(item.friendshipId), 'request');
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  block: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.raised,
    overflow: 'hidden',
    ...shadows.soft,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md + spacing.hitTarget + spacing.sm,
    backgroundColor: colors.border.subtle,
  },
});
