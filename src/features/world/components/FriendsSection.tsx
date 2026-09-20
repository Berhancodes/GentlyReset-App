import { StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';
import { WorldActionCard } from '@/features/world/components/WorldActionCard';
import { INVITE_MESSAGE, inviteFriend } from '@/features/world/utils/inviteFriend';

export type WorldNotice = {
  title: string;
  body: string;
};

type FriendsSectionProps = {
  onNotice: (notice: WorldNotice) => void;
};

export async function shareWorldInvite(): Promise<WorldNotice | null> {
  try {
    const result = await inviteFriend();
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
      body: INVITE_MESSAGE,
    };
  }
}

export function FriendsSection({ onNotice }: FriendsSectionProps) {
  return (
    <View style={styles.root}>
      <WorldActionCard
        glyph="plus"
        title="invite a friend"
        subtitle="reset together is better"
        onPress={() => {
          void shareWorldInvite().then((notice) => {
            if (notice) {
              onNotice(notice);
            }
          });
        }}
      />
      <WorldActionCard
        glyph="heart"
        title="send encouragement"
        subtitle="a little support goes a long way"
        onPress={() =>
          onNotice({
            title: 'send encouragement',
            body: 'this will need friends on Gently Reset. coming later.',
          })
        }
      />
      <WorldActionCard
        glyph="group"
        title="view shared progress"
        subtitle="see how you're both doing"
        onPress={() =>
          onNotice({
            title: 'shared progress',
            body: 'this will need friends on Gently Reset. coming later.',
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
});
