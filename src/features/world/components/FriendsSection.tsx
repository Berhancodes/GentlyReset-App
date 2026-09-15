import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText, IconRow, NoticeDialog, SceneHero } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { INVITE_MESSAGE, inviteFriend } from '@/features/world/utils/inviteFriend';

const FRIENDS_TOGETHER = require('../../../../assets/images/app/friends-together.png');

type Notice = {
  title: string;
  body: string;
};

export function FriendsSection() {
  const [notice, setNotice] = useState<Notice | null>(null);

  return (
    <View style={styles.root}>
      <AppText variant="label" color="helper">
        friends
      </AppText>
      <SceneHero
        source={FRIENDS_TOGETHER}
        accessibilityLabel="Two mascots sitting together in a meadow"
        aspectRatio={2.4}
        borderRadius={radius.card}
      />
      <View style={styles.actions}>
        <IconRow
          icon={<Ionicons name="add-circle" size={28} color={colors.accent.sage} />}
          title="invite a friend"
          subtitle="reset together is better"
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
          icon={<Ionicons name="heart" size={26} color={colors.accent.peach} />}
          title="send encouragement"
          subtitle="coming later"
          onPress={() =>
            setNotice({
              title: 'send encouragement',
              body: 'this will need friends on Gently Reset. coming later.',
            })
          }
        />
        <IconRow
          icon={<Ionicons name="people" size={26} color={colors.text.primary} />}
          title="view shared progress"
          subtitle="coming later"
          onPress={() =>
            setNotice({
              title: 'shared progress',
              body: 'this will need friends on Gently Reset. coming later.',
            })
          }
        />
      </View>
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
  actions: {
    gap: spacing.sm,
  },
});
