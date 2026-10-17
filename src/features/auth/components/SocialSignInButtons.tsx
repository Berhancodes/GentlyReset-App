import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { colors, radius, spacing, textVariants } from '@/design-system';
import {
  isAppleSignInAvailable,
  isGoogleSignInConfigured,
  signInWithApple,
  signInWithGoogle,
  type SocialSignInResult,
} from '@/features/auth/api/socialAuth';

type SocialSignInButtonsProps = {
  /** Called once Supabase has a session from Apple or Google. */
  onSignedIn: () => void | Promise<void>;
  /** Shows "Continue with email" when given. */
  onEmail?: () => void;
};

const BUTTON_HEIGHT = 52;

function GoogleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 48 48" aria-hidden>
      <Path
        fill={colors.signIn.googleRed}
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"
      />
      <Path
        fill={colors.signIn.googleBlue}
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 7-10.3 7-17.7z"
      />
      <Path
        fill={colors.signIn.googleYellow}
        d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"
      />
      <Path
        fill={colors.signIn.googleGreen}
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"
      />
    </Svg>
  );
}

/**
 * Continue with Apple, Google or email. Apple uses Apple's own button (required by its
 * guidelines); Google only shows once its client IDs are configured.
 */
export function SocialSignInButtons({ onSignedIn, onEmail }: SocialSignInButtonsProps) {
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [busy, setBusy] = useState<'apple' | 'google' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const googleAvailable = isGoogleSignInConfigured();

  useEffect(() => {
    let active = true;
    void isAppleSignInAvailable().then((available) => {
      if (active) {
        setAppleAvailable(available);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const run = async (provider: 'apple' | 'google', signIn: () => Promise<SocialSignInResult>) => {
    if (busy) {
      return;
    }
    setBusy(provider);
    setMessage(null);
    const result = await signIn();
    if (result.ok) {
      await onSignedIn();
    } else if (!('cancelled' in result)) {
      setMessage(result.message);
    }
    setBusy(null);
  };

  return (
    <View style={styles.root}>
      {appleAvailable ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={BUTTON_HEIGHT / 2}
          style={[styles.appleButton, busy ? styles.dimmed : null]}
          onPress={() => void run('apple', signInWithApple)}
        />
      ) : null}

      {googleAvailable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          accessibilityState={{ disabled: busy !== null, busy: busy === 'google' }}
          disabled={busy !== null}
          onPress={() => void run('google', signInWithGoogle)}
          style={({ pressed }) => [
            styles.googleButton,
            pressed ? styles.pressed : null,
            busy && busy !== 'google' ? styles.dimmed : null,
          ]}
        >
          {busy === 'google' ? (
            <ActivityIndicator color={colors.signIn.googleLabel} />
          ) : (
            <>
              <GoogleLogo />
              <Text style={styles.googleLabel} maxFontSizeMultiplier={1.3}>
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>
      ) : null}

      {onEmail ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with email"
          disabled={busy !== null}
          onPress={onEmail}
          style={({ pressed }) => [styles.emailButton, pressed ? styles.pressed : null]}
        >
          <AppText variant="optionTitle">Continue with email</AppText>
        </Pressable>
      ) : null}

      {message ? (
        <AppText variant="caption" color="secondary" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  appleButton: {
    width: '100%',
    height: BUTTON_HEIGHT,
  },
  googleButton: {
    height: BUTTON_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.signIn.googleBorder,
    backgroundColor: colors.signIn.googleSurface,
  },
  googleLabel: {
    ...textVariants.optionTitle,
    color: colors.signIn.googleLabel,
  },
  emailButton: {
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  dimmed: {
    opacity: 0.5,
  },
});
