import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  markEncouragementRead,
  removeFriend,
  sendEncouragement,
} from '@/features/friends/api/friendsApi';
import { EncouragementPicker } from '@/features/friends/components/EncouragementPicker';
import { FriendIdentityRow } from '@/features/friends/components/FriendIdentityRow';
import { FriendProgressCard } from '@/features/friends/components/FriendProgressCard';
import type { EncouragementKind } from '@/features/friends/encouragements';
import type { PublicFriendIdentity, ReceivedEncouragement } from '@/features/friends/types';
import type { WorldFriendsPresentation } from '@/features/friends/worldState';
import { WorldActionCard } from '@/features/world/components/WorldActionCard';
import { WorldPostcards } from '@/features/world/components/WorldPostcards';
import { buildInviteShareMessage, inviteFriend } from '@/features/world/utils/inviteFriend';

export type WorldNotice = {
  title: string;
  body: string;
};

type FriendsSectionProps = {
  presentation: WorldFriendsPresentation;
  nowMs: number;
  onChooseUsername: () => void;
  onFindFriend: () => void;
  onInviteFriend: () => void;
  onRefresh: () => void;
  onNotice: (notice: WorldNotice) => void;
  /** The hero already offers username, find and invite, so skip the action cards. */
  hideActionCards?: boolean;
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
  nowMs,
  onChooseUsername,
  onFindFriend,
  onInviteFriend,
  onRefresh,
  onNotice,
  hideActionCards = false,
}: FriendsSectionProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [encourageFriend, setEncourageFriend] = useState<PublicFriendIdentity | null>(null);

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

  const sendKind = (kind: EncouragementKind) => {
    if (!encourageFriend || busyId) {
      return;
    }
    setBusyId(encourageFriend.userId);
    void sendEncouragement(encourageFriend.userId, kind)
      .then((result) => {
        if (!result.ok) {
          onNotice({ title: 'encourage', body: result.message });
          return;
        }
        setEncourageFriend(null);
        onRefresh();
      })
      .finally(() => {
        setBusyId(null);
      });
  };

  const openReceived = (item: ReceivedEncouragement) => {
    if (item.readAt) {
      return;
    }
    void markEncouragementRead(item.id).then((result) => {
      if (!result.ok && result.message) {
        onNotice({ title: 'encouragement', body: result.message });
        return;
      }
      onRefresh();
    });
  };

  return (
    <View style={styles.root}>
      {!hideActionCards && presentation.showChooseUsername ? (
        <WorldActionCard
          glyph="plus"
          title="choose username"
          subtitle="your world starts with a name"
          onPress={onChooseUsername}
        />
      ) : null}
      {!hideActionCards && presentation.showFindFriend ? (
        <WorldActionCard
          glyph="group"
          title="find a friend"
          subtitle="search an exact @username"
          onPress={onFindFriend}
        />
      ) : null}
      {!hideActionCards && presentation.showInviteFriend ? (
        <WorldActionCard
          glyph="plus"
          title="invite a friend"
          subtitle="share a private invite link"
          onPress={onInviteFriend}
        />
      ) : null}

      <WorldPostcards
        items={presentation.receivedEncouragements}
        nowMs={nowMs}
        onOpen={openReceived}
      />

      {presentation.incoming.length > 0 ? (
        <View style={styles.block}>
          <SectionTitle>Friend requests</SectionTitle>
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
          <SectionTitle>Friends</SectionTitle>
          <View style={styles.card}>
            {presentation.friends.map((item, index) => (
              <View key={item.friendshipId}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <FriendProgressCard
                  friend={item}
                  progress={presentation.progressByUserId[item.userId]}
                  busy={busyId === item.friendshipId || busyId === item.userId}
                  tone={index}
                  onEncourage={() => setEncourageFriend(item)}
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
          <SectionTitle>Waiting to hear back</SectionTitle>
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

      <EncouragementPicker
        visible={encourageFriend !== null}
        friend={encourageFriend}
        busy={busyId !== null}
        onSelect={sendKind}
        onClose={() => setEncourageFriend(null)}
      />
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={styles.sectionTitle} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    paddingHorizontal: spacing.xxs,
  },
  root: {
    gap: spacing.md,
  },
  block: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.stage.chip,
    paddingVertical: spacing.xxs,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md + spacing.hitTarget + spacing.sm,
    backgroundColor: colors.stage.chipBorder,
  },
});
