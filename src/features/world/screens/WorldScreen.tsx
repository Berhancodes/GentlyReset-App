import { useCallback, useEffect, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarScenePadding, MascotIcon, NoticeDialog, Screen } from '@/components/ui';
import { colors, spacing, textVariants } from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { createFriendInvite, fetchFriendsHome } from '@/features/friends/api/friendsApi';
import { buildFriendInviteDeepLink } from '@/features/friends/invite/pendingFriendInvite';
import { friendDisplayLabel } from '@/features/friends/components/FriendIdentityRow';
import type { FriendsHome } from '@/features/friends/types';
import { getWorldFriendsPresentation } from '@/features/friends/worldState';
import {
  FriendsSection,
  shareWorldInvite,
  type WorldNotice,
} from '@/features/world/components/FriendsSection';
import { AddFriendDialog } from '@/features/world/components/AddFriendDialog';
import { WorldFriendCircle } from '@/features/world/components/WorldFriendCircle';
import { WorldStarting } from '@/features/world/components/WorldStarting';
import { WORLD_COLUMN_MAX_WIDTH } from '@/features/world/layout/worldHeroLayout';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';

const EMPTY_HOME: FriendsHome = {
  username: null,
  displayName: null,
  avatarUrl: null,
  friends: [],
  incoming: [],
  outgoing: [],
  progress: [],
  encouragements: [],
};

export function WorldScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userId = useAuth().user?.id ?? null;
  const currentDay = useResetStore((state) => state.currentDay);
  const [notice, setNotice] = useState<WorldNotice | null>(null);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [home, setHome] = useState<FriendsHome>(EMPTY_HOME);
  const [nowMs, setNowMs] = useState(0);

  const refresh = useCallback(() => {
    if (!userId) {
      return;
    }
    void fetchFriendsHome(userId).then((nextHome) => {
      setHome(nextHome);
      setNowMs(Date.now());
    });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        refresh();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [refresh]);

  const socialHome = userId ? home : EMPTY_HOME;
  const presentation = getWorldFriendsPresentation({
    ...socialHome,
    currentDay,
  });

  // Before you have friends, World explains itself; after, your friends sit around him.
  const starting = !socialHome.username || presentation.friends.length === 0;
  const circleFriends = presentation.friends.map((friend) => ({
    id: friend.userId,
    letter: friendDisplayLabel(friend).replace(/^@/, '').slice(0, 1).toUpperCase(),
    name: friendDisplayLabel(friend).split(' ')[0] ?? '',
    showedUpToday: presentation.progressByUserId[friend.userId]?.completedToday ?? false,
  }));
  const showedUp = circleFriends.filter((friend) => friend.showedUpToday).length;
  const friendCount = circleFriends.length;
  const circleTitle =
    friendCount === 1
      ? `${circleFriends[0]?.name ?? 'Your friend'} ${showedUp ? 'showed up today' : 'is taking today gently'}`
      : `${showedUp} of ${friendCount} friends showed up today`;
  const circleSubtitle = [
    presentation.usernameHandle ? `You’re ${presentation.usernameHandle}` : null,
    presentation.ownDayLabel ? capitalizeHeading(presentation.ownDayLabel) : null,
  ]
    .filter(Boolean)
    .join(' · ');

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

  /** With friends, "+" asks how: search by @username or share an invite. */
  const openAddFriend = () => {
    if (!socialHome.username) {
      openUsername();
      return;
    }
    setAddFriendOpen(true);
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
      backgroundColor={colors.stage.floor}
    >
      <StageBackdrop />
      <ScrollView
        testID="world-scroll"
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.xs,
            paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.md,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={styles.column}>
          <View style={styles.topBar}>
            {socialHome.username ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Find a friend"
                onPress={openFindFriend}
                style={styles.topButton}
              >
                <MascotIcon name="people" size={24} />
              </Pressable>
            ) : (
              <View style={styles.topButton} />
            )}
            <Text style={styles.eyebrow} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
              your world
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={starting ? 'Invite a friend' : 'Add a friend'}
              accessibilityHint={
                starting ? undefined : 'Find someone by username or share an invite link'
              }
              onPress={starting ? openInvite : openAddFriend}
              style={styles.topButton}
            >
              <MascotIcon name="personAdd" size={24} />
            </Pressable>
          </View>

          {starting ? (
            <WorldStarting
              hasUsername={Boolean(socialHome.username)}
              onChooseUsername={openUsername}
              onInvite={openInvite}
              onFindFriend={openFindFriend}
            />
          ) : (
            <View style={styles.circleBlock}>
              <WorldFriendCircle friends={circleFriends} onInvite={openAddFriend} />
              <View style={styles.circleCopy} accessibilityRole="header">
                <Text style={styles.title} maxFontSizeMultiplier={1.25}>
                  {circleTitle}
                </Text>
                {circleSubtitle ? (
                  <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
                    {circleSubtitle}
                  </Text>
                ) : null}
              </View>
            </View>
          )}

          <FriendsSection
            presentation={presentation}
            nowMs={nowMs}
            onChooseUsername={openUsername}
            onFindFriend={openFindFriend}
            onInviteFriend={openInvite}
            onRefresh={refresh}
            onNotice={setNotice}
            hideActionCards
          />
        </View>
      </ScrollView>
      <AddFriendDialog
        visible={addFriendOpen}
        onFindFriend={openFindFriend}
        onInviteFriend={openInvite}
        onClose={() => setAddFriendOpen(false)}
      />
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
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  column: {
    width: '100%',
    maxWidth: WORLD_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.xs,
  },
  topButton: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
  },
  circleBlock: {
    gap: spacing.xs,
  },
  circleCopy: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
});
