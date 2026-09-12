import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText, IconRow, MainTabHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';

const PROFILE_MASCOT = require('../../../../assets/images/app/profile-mascot.png');

export function ProfileScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="you" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Image
              source={PROFILE_MASCOT}
              accessibilityLabel="Gently Reset mascot avatar"
              accessibilityIgnoresInvertColors
              resizeMode="cover"
              style={styles.avatarImage}
            />
          </View>
          <AppText variant="title" align="center">
            gently resetter
          </AppText>
          <AppText variant="caption" color="helper" align="center">
            you@email.com
          </AppText>
        </View>
        <View style={styles.rows}>
          <IconRow
            icon={<Ionicons name="people-outline" size={22} color={colors.text.primary} />}
            title="my reset type"
            showChevron
            onPress={() => undefined}
          />
          <IconRow
            icon={<Ionicons name="heart-outline" size={22} color={colors.text.primary} />}
            title="goals"
            showChevron
            onPress={() => undefined}
          />
          <IconRow
            icon={<Ionicons name="options-outline" size={22} color={colors.text.primary} />}
            title="settings"
            showChevron
            onPress={() => undefined}
          />
          <IconRow
            icon={
              <Ionicons name="information-circle-outline" size={22} color={colors.text.primary} />
            }
            title="help & support"
            showChevron
            onPress={() => undefined}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
  },
  identity: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 148,
    height: 148,
    borderRadius: 74,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    backgroundColor: colors.surface.choice,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  rows: {
    gap: spacing.sm,
  },
});
