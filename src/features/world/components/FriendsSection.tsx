import { Alert, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText, IconRow, SceneHero } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { inviteFriend } from '@/features/world/utils/inviteFriend';

const FRIENDS_TOGETHER = require('../../../../assets/images/app/friends-together.png');

function comingLater(title: string) {
  Alert.alert(title, 'this will need friends on Gently Reset. coming later.');
}

export function FriendsSection() {
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
            void inviteFriend().catch(() => {
              Alert.alert(
                'invite a friend',
                "I'm doing a 30-day Gently Reset — one small reset a day. Come reset with me.",
              );
            });
          }}
        />
        <IconRow
          icon={<Ionicons name="heart" size={26} color={colors.accent.peach} />}
          title="send encouragement"
          subtitle="coming later"
          onPress={() => comingLater('send encouragement')}
        />
        <IconRow
          icon={<Ionicons name="people" size={26} color={colors.text.primary} />}
          title="view shared progress"
          subtitle="coming later"
          onPress={() => comingLater('shared progress')}
        />
      </View>
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
