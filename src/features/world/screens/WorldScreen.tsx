import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getTabBarScenePadding, MainTabHeader, NoticeDialog, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { createFriendInvite, fetchFriendsHome } from '@/features/friends/api/friendsApi';
import { buildFriendInviteDeepLink } from '@/features/friends/invite/pendingFriendInvite';
import type { FriendsHome } from '@/features/friends/types';
import { getWorldFriendsPresentation } from '@/features/friends/worldState';
import {
  FriendsSection,
  shareWorldInvite,
  type WorldNotice,
} from '@/features/world/components/FriendsSection';
import { WorldBackground } from '@/features/world/components/WorldBackground';
import { WorldHeroMessage } from '@/features/world/components/WorldHeroMessage';
import { WorldStatusCard } from '@/features/world/components/WorldStatusCard';
import {
  WORLD_COLUMN_MAX_WIDTH,
  WORLD_STATS_OVERLAP,
  getWorldHeroHeight,
} from '@/features/world/layout/worldHeroLayout';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';

const EMPTY_HOME: FriendsHome = {
  username: null,
  displayName: null,
  avatarUrl: null,
  friends: [],
  incoming: [],
  outgoing: [],
};

export function WorldScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { height: windowHeight } = useWindowDimensions();
  const heroHeight = getWorldHeroHeight(windowHeight);
  const userId = useAuth().user?.id ?? null;
  const [notice, setNotice] = useState<WorldNotice | null>(null);
  const [home, setHome] = useState<FriendsHome>(EMPTY_HOME);

  const refresh = useCallback(() => {
    if (!userId) {
      return;
    }
    void fetchFriendsHome(userId).then(setHome);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const socialHome = userId ? home : EMPTY_HOME;
  const presentation = getWorldFriendsPresentation(socialHome);

  const openUsername = () => {
    router.push('/choose-username');
  };

  const openFindFriend = () => {
    if (!socialHome.username) {
      openUsername();
      return;
    }
    router.push('/find-friend');
  };

  const openInvite = () => {
    if (!socialHome.username) {
      openUsername();
      return;
    }
    void createFriendInvite().then((result) => {
      if (!result.ok || !result.token) {
        setNotice({
          title: 'invite a friend',
          body: result.ok ? 'couldn’t create an invite right now.' : result.message,
        });
        return;
      }
      void shareWorldInvite(buildFriendInviteDeepLink(result.token)).then((inviteNotice) => {
        if (inviteNotice) {
          setNotice(inviteNotice);
        }
      });
    });
  };

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.background.primary}
    >
      <ScrollView
        testID="world-scroll"
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={[styles.hero, { height: heroHeight }]}>
          <WorldBackground accessibilityLabel="Two mascots sitting together on a log by a lake at sunset, with a tree on the left and a cabin on the right." />
          <MainTabHeader
            title="world"
            subtitle="don't reset alone."
            transparent
            contentSpacing="roomy"
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
          <View style={styles.messageWell} pointerEvents="none">
            <WorldHeroMessage />
          </View>
        </View>
        <View style={styles.sheet}>
          <View style={styles.statsAnchor}>
            <WorldStatusCard title={presentation.statusTitle} body={presentation.statusBody} />
          </View>
          <FriendsSection
            presentation={presentation}
            onChooseUsername={openUsername}
            onFindFriend={openFindFriend}
            onInviteFriend={openInvite}
            onRefresh={refresh}
            onNotice={setNotice}
          />
        </View>
      </ScrollView>
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
  scroll: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    overflow: 'visible',
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
  },
  addFriend: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageWell: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  sheet: {
    width: '100%',
    maxWidth: WORLD_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: WORLD_STATS_OVERLAP,
    gap: spacing.md,
    overflow: 'visible',
  },
  statsAnchor: {
    marginTop: -(WORLD_STATS_OVERLAP + WORLD_STATS_OVERLAP),
    zIndex: 3,
    elevation: 6,
    overflow: 'visible',
  },
});
