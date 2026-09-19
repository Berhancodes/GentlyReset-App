import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { IconRow, NoticeDialog } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { INVITE_MESSAGE, inviteFriend } from '@/features/world/utils/inviteFriend';

type Notice = {
  title: string;
  body: string;
};

type FriendsSectionProps = {
  compact?: boolean;
};

export function FriendsSection({ compact = false }: FriendsSectionProps) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const iconSize = compact ? 18 : 20;

  return (
    <View style={[styles.root, compact ? styles.rootCompact : null]}>
      <IconRow
        icon={
          <View style={[styles.badge, styles.inviteBadge]}>
            <Ionicons name="add" size={iconSize} color={colors.action.primaryText} />
          </View>
        }
        title="invite a friend"
        subtitle="reset together is better"
        showChevron
        onPress={() => {
          void inviteFriend()
            .then((result) => {
              if (result === 'copied') {
                setNotice({
                  title: 'invite a friend',
                  body: 'invite text copied. paste it to someone you trust.',
                });
              }
            })
            .catch(() => {
              setNotice({
                title: 'invite a friend',
                body: INVITE_MESSAGE,
              });
            });
        }}
      />
      <IconRow
        icon={
          <View style={[styles.badge, styles.encourageBadge]}>
            <Ionicons name="heart" size={iconSize} color={colors.accent.peach} />
          </View>
        }
        title="send encouragement"
        subtitle="a little support goes a long way"
        showChevron
        onPress={() =>
          setNotice({
            title: 'send encouragement',
            body: 'this will need friends on Gently Reset. coming later.',
          })
        }
      />
      <IconRow
        icon={
          <View style={[styles.badge, styles.progressBadge]}>
            <Ionicons name="people" size={iconSize} color={colors.text.primary} />
          </View>
        }
        title="view shared progress"
        subtitle="see how you're both doing"
        showChevron
        onPress={() =>
          setNotice({
            title: 'shared progress',
            body: 'this will need friends on Gently Reset. coming later.',
          })
        }
      />
      <NoticeDialog
        visible={notice !== null}
        title={notice?.title ?? ''}
        body={notice?.body ?? ''}
        onClose={() => setNotice(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  rootCompact: {
    gap: spacing.xs,
  },
  badge: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteBadge: {
    backgroundColor: colors.action.primaryBackground,
  },
  encourageBadge: {
    backgroundColor: colors.surface.selected,
  },
  progressBadge: {
    backgroundColor: colors.surface.choiceSelected,
  },
});
