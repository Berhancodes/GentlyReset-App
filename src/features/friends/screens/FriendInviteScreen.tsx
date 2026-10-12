import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { AppText, PrimaryButton, Screen } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { resolveFriendInvite, sendFriendRequest } from '@/features/friends/api/friendsApi';
import { FriendIdentityRow } from '@/features/friends/components/FriendIdentityRow';
import { rememberFriendInviteToken } from '@/features/friends/invite/pendingFriendInvite';
import type { PublicFriendIdentity } from '@/features/friends/types';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { canEnterApp } from '@/features/subscription/access/canEnterApp';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { getRootHref } from '@/navigation/getRootHref';

export function FriendInviteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const rawToken = Array.isArray(params.token) ? params.token[0] : params.token;
  const token = rawToken?.trim() ?? '';
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const hasLocalAppAccess = useOnboardingStore((state) => state.hasLocalAppAccess);
  const appOpen = canEnterApp({
    isPro,
    hasPreviewAccess: hasLocalAppAccess,
    isDevelopmentBuild: __DEV__,
  });
  const [identity, setIdentity] = useState<PublicFriendIdentity | null>(null);
  const [message, setMessage] = useState('opening invite…');
  const [sending, setSending] = useState(false);
  const canOpenInvite = hasCompletedOnboarding && appOpen;

  useEffect(() => {
    if (token) {
      rememberFriendInviteToken(token);
    }
    if (!canOpenInvite || !token) {
      return;
    }

    void resolveFriendInvite(token).then((result) => {
      if (!result.ok) {
        setIdentity(null);
        setMessage(result.message);
        return;
      }
      if (user?.id && result.identity.userId === user.id) {
        setIdentity(null);
        setMessage('this is your invite. share it with a friend.');
        return;
      }
      setIdentity(result.identity);
      setMessage('want to connect? they still have to accept.');
    });
  }, [canOpenInvite, token, user?.id]);

  if (!canOpenInvite) {
    return <Redirect href={getRootHref({ hasCompletedOnboarding, isPro, hasLocalAppAccess })} />;
  }

  const connect = () => {
    if (!identity || sending) {
      return;
    }
    setSending(true);
    void sendFriendRequest(identity.userId)
      .then((result) => {
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        if (result.code === 'already_friends' || result.code === 'accepted_existing') {
          setMessage('you’re already friends.');
          return;
        }
        setMessage('request sent. friendship is not automatic — they still accept.');
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <Screen>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="back"
        onPress={() => router.replace('/(app)/(tabs)/world')}
        style={styles.back}
      >
        <BackChevron />
      </Pressable>
      <View style={styles.copy}>
        <AppText variant="title">friend invite</AppText>
        <AppText variant="body" color="secondary">
          {token ? message : 'this invite isn’t available.'}
        </AppText>
      </View>
      {identity ? (
        <View style={styles.card}>
          <FriendIdentityRow identity={identity} />
          <View style={styles.cta}>
            <PrimaryButton
              label={sending ? 'sending…' : 'send a friend request'}
              onPress={connect}
              disabled={sending}
            />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    justifyContent: 'center',
    marginLeft: -spacing.xs,
  },
  copy: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.raised,
    overflow: 'hidden',
    ...shadows.soft,
  },
  cta: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
