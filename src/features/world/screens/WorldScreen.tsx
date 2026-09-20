import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getTabBarScenePadding, MainTabHeader, NoticeDialog, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import {
  FriendsSection,
  shareWorldInvite,
  type WorldNotice,
} from '@/features/world/components/FriendsSection';
import { WorldActivitySection } from '@/features/world/components/WorldActivitySection';
import { WorldBackground } from '@/features/world/components/WorldBackground';
import { WorldHeroMessage } from '@/features/world/components/WorldHeroMessage';
import { WorldStatsCard } from '@/features/world/components/WorldStatsCard';
import {
  WORLD_COLUMN_MAX_WIDTH,
  WORLD_HERO_FLEX,
  WORLD_STATS_OVERLAP,
} from '@/features/world/layout/worldHeroLayout';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';

export function WorldScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const [notice, setNotice] = useState<WorldNotice | null>(null);

  const openInvite = () => {
    void shareWorldInvite().then((inviteNotice) => {
      if (inviteNotice) {
        setNotice(inviteNotice);
      }
    });
  };

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.background.primary}
    >
      <View style={styles.root}>
        <View style={styles.hero}>
          <WorldBackground accessibilityLabel="Two mascots sitting together on a log by a lake at sunset, with a tree on the left and a cabin on the right." />
          <MainTabHeader
            title="world"
            subtitle="don't reset alone."
            transparent
            rightAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="invite a friend"
                onPress={openInvite}
                style={styles.addFriend}
              >
                <Ionicons
                  name="person-add-outline"
                  size={24}
                  color={colors.text.primary}
                  accessibilityElementsHidden
                />
              </Pressable>
            }
          />
          <WorldHeroMessage />
        </View>
        <ScrollView
          style={styles.sheet}
          contentContainerStyle={[
            styles.sheetContent,
            { paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.sm },
          ]}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.statsAnchor}>
            <WorldStatsCard />
          </View>
          <FriendsSection onNotice={setNotice} />
          <WorldActivitySection onNotice={setNotice} />
        </ScrollView>
      </View>
      <NoticeDialog
        visible={notice !== null}
        title={notice?.title ?? ''}
        body={notice?.body ?? ''}
        onClose={() => setNotice(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  hero: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: `${WORLD_HERO_FLEX * 100}%`,
    overflow: 'hidden',
  },
  addFriend: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  sheetContent: {
    width: '100%',
    maxWidth: WORLD_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  statsAnchor: {
    marginTop: -WORLD_STATS_OVERLAP,
  },
});
