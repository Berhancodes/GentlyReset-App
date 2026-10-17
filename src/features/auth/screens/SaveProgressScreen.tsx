import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';
import { SocialSignInButtons } from '@/features/auth/components/SocialSignInButtons';
import { useAuth } from '@/features/auth/session/useAuth';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useFinishSignIn } from '@/navigation/useFinishSignIn';

const HOME = '/(app)/(tabs)/home';

/**
 * Right after paying (and from the You tab): save progress to an account so days,
 * seasons and the journal survive a new phone or a reinstall. Skippable; the app
 * asks again later.
 */
export function SaveProgressScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { restoring, finishSignIn } = useFinishSignIn();

  useEffect(() => {
    if (isAuthenticated && !restoring) {
      router.replace(HOME);
    }
  }, [isAuthenticated, restoring, router]);

  return (
    <OnboardingScreenLayout
      tone="question"
      hideProgress
      title={'save your\nprogress'}
      subtitle="so your days, seasons and journal follow you to any phone."
      footer={
        <View style={styles.footer}>
          <SocialSignInButtons
            onSignedIn={finishSignIn}
            onEmail={() => router.push('/(auth)/sign-up')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Maybe later"
            accessibilityHint="Opens the app without an account. Progress stays on this phone only."
            onPress={() => router.replace(HOME)}
            style={({ pressed }) => [styles.later, pressed ? styles.pressed : null]}
          >
            <AppText variant="caption" color="helper">
              maybe later
            </AppText>
          </Pressable>
        </View>
      }
    >
      <View style={styles.points}>
        <AppText variant="body" color="secondary">
          your Pro plan is active. one tap keeps everything you build safe, even if you lose or
          change your phone.
        </AppText>
        <AppText variant="caption" color="helper">
          without an account, your progress lives only on this phone.
        </AppText>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: spacing.xs,
  },
  points: {
    gap: spacing.sm,
  },
  later: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
