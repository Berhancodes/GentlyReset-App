import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, PrimaryButton, Screen } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { searchUserByUsername, sendFriendRequest } from '@/features/friends/api/friendsApi';
import { FriendIdentityRow } from '@/features/friends/components/FriendIdentityRow';
import { UsernameField } from '@/features/friends/components/UsernameField';
import type { PublicFriendIdentity } from '@/features/friends/types';
import { normalizeUsername, usernameIssueMessage } from '@/features/friends/username';
import { BackChevron } from '@/features/onboarding/components/BackChevron';

export function FindFriendScreen() {
  const router = useRouter();
  const userId = useAuth().user?.id ?? null;
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();
  const [identity, setIdentity] = useState<PublicFriendIdentity | null>(null);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);

  const search = () => {
    Keyboard.dismiss();
    if (searching) {
      return;
    }

    const normalized = normalizeUsername(value);
    if (!normalized.ok) {
      setIdentity(null);
      setNotice(undefined);
      setError(usernameIssueMessage(normalized.code));
      return;
    }

    setSearching(true);
    setError(undefined);
    setNotice(undefined);
    void searchUserByUsername(normalized.username)
      .then((result) => {
        if (!result.ok) {
          setIdentity(null);
          setError(result.message);
          return;
        }
        if (!result.identity) {
          setIdentity(null);
          setError('no one uses that username yet.');
          return;
        }
        if (userId && result.identity.userId === userId) {
          setIdentity(null);
          setError('that’s you — try a friend’s username.');
          return;
        }
        setIdentity(result.identity);
      })
      .finally(() => {
        setSearching(false);
      });
  };

  const send = () => {
    if (!identity || sending) {
      return;
    }
    setSending(true);
    void sendFriendRequest(identity.userId)
      .then((result) => {
        if (!result.ok) {
          setError(result.message);
          return;
        }
        if (result.code === 'already_friends' || result.code === 'accepted_existing') {
          setNotice(
            result.code === 'already_friends' ? 'you’re already friends.' : 'you’re friends now.',
          );
          return;
        }
        setNotice('request sent. they can accept when they’re ready.');
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
        onPress={() => router.back()}
        style={styles.back}
      >
        <BackChevron />
      </Pressable>
      <View style={styles.copy}>
        <AppText variant="title">find a friend</AppText>
        <AppText variant="body" color="secondary">
          enter their exact @username.
        </AppText>
      </View>
      <UsernameField
        value={value}
        onChangeText={(next) => {
          setValue(next);
          setError(undefined);
          setNotice(undefined);
        }}
        error={error}
        onSubmitEditing={search}
      />
      <View style={styles.searchAction}>
        <PrimaryButton
          label={searching ? 'looking…' : 'search'}
          onPress={search}
          disabled={searching}
        />
      </View>
      {identity ? (
        <View style={styles.result}>
          <FriendIdentityRow identity={identity} />
          <PrimaryButton
            label={sending ? 'sending…' : 'send request'}
            onPress={send}
            disabled={sending}
          />
        </View>
      ) : null}
      {notice ? (
        <AppText variant="body" color="secondary">
          {notice}
        </AppText>
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
  searchAction: {
    paddingTop: spacing.md,
  },
  result: {
    marginTop: spacing.lg,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.raised,
    overflow: 'hidden',
    paddingBottom: spacing.md,
    gap: spacing.sm,
    ...shadows.soft,
  },
});
