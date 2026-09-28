import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, PrimaryButton, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { claimUsername } from '@/features/friends/api/friendsApi';
import { UsernameField } from '@/features/friends/components/UsernameField';
import { normalizeUsername, usernameIssueMessage } from '@/features/friends/username';
import { BackChevron } from '@/features/onboarding/components/BackChevron';

export function ChooseUsernameScreen() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    Keyboard.dismiss();
    if (submitting) {
      return;
    }

    const normalized = normalizeUsername(value);
    if (!normalized.ok) {
      setError(usernameIssueMessage(normalized.code));
      return;
    }

    setSubmitting(true);
    void claimUsername(normalized.username)
      .then((result) => {
        if (!result.ok) {
          setError(result.message);
          return;
        }
        router.back();
      })
      .finally(() => {
        setSubmitting(false);
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
        <AppText variant="title">choose your username</AppText>
        <AppText variant="body" color="secondary">
          friends can use this to find you.
        </AppText>
      </View>
      <UsernameField
        value={value}
        onChangeText={(next) => {
          setValue(next);
          if (error) {
            setError(undefined);
          }
        }}
        error={error}
        onSubmitEditing={submit}
      />
      <View style={styles.footer}>
        <PrimaryButton
          label={submitting ? 'saving…' : 'continue'}
          onPress={submit}
          disabled={submitting}
        />
      </View>
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
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
  },
});
