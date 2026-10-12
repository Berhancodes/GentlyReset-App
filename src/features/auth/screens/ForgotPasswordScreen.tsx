import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { requestPasswordResetCode, resetPasswordWithCode } from '@/features/auth/api/authApi';
import { AuthTextField } from '@/features/auth/components/AuthTextField';
import { isValidEmail, normalizeEmail } from '@/features/auth/utils/normalizeEmail';
import { SIGN_IN_PASSWORD_MIN_LENGTH } from '@/features/auth/utils/validateSignIn';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useFinishSignIn } from '@/navigation/useFinishSignIn';

const RESET_CODE_LENGTH = 6;

type Step = { kind: 'email' } | { kind: 'code'; email: string };

/**
 * Forgot password: email a 6-digit code, then enter it with a new password.
 * Everything happens in the app; no link or web page is involved.
 */
export function ForgotPasswordScreen() {
  const router = useRouter();
  const { restoring, finishSignIn } = useFinishSignIn();
  const [step, setStep] = useState<Step>({ kind: 'email' });
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const emailValid = isValidEmail(normalizeEmail(email));
  const codeValid = code.trim().length === RESET_CODE_LENGTH;
  const passwordValid = password.length >= SIGN_IN_PASSWORD_MIN_LENGTH;

  const sendCode = (toEmail: string) => {
    Keyboard.dismiss();
    if (busy) {
      return;
    }
    setBusy(true);
    setError(null);
    void requestPasswordResetCode(toEmail)
      .then((result) => {
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setStep({ kind: 'code', email: normalizeEmail(toEmail) });
      })
      .finally(() => setBusy(false));
  };

  const resetPassword = (forEmail: string) => {
    Keyboard.dismiss();
    if (busy || !codeValid || !passwordValid) {
      return;
    }
    setBusy(true);
    setError(null);
    void resetPasswordWithCode(forEmail, code, password)
      .then(async (result) => {
        if (!result.ok) {
          setError(result.message);
          return;
        }
        await finishSignIn();
      })
      .finally(() => setBusy(false));
  };

  if (step.kind === 'email') {
    return (
      <OnboardingScreenLayout
        tone="question"
        hideProgress
        title={'forgot your\npassword?'}
        subtitle="we’ll email you a 6-digit code to set a new one."
        onBack={() => router.back()}
        avoidKeyboard
        footer={
          <PrimaryButton
            label={busy ? 'sending…' : 'send code →'}
            disabled={!emailValid || busy}
            onPress={() => sendCode(email)}
          />
        }
      >
        <View style={styles.form}>
          <AuthTextField
            label="email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError(null);
            }}
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={() => (emailValid ? sendCode(email) : undefined)}
          />
          {error ? (
            <AppText variant="caption" color="secondary" accessibilityLiveRegion="polite">
              {error}
            </AppText>
          ) : null}
        </View>
      </OnboardingScreenLayout>
    );
  }

  return (
    <OnboardingScreenLayout
      tone="question"
      hideProgress
      title={'check your\nemail'}
      subtitle={`if ${step.email} has an account, a 6-digit code is on its way.`}
      onBack={() => setStep({ kind: 'email' })}
      avoidKeyboard
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label={
              restoring ? 'bringing back your reset…' : busy ? 'saving…' : 'set new password →'
            }
            disabled={!codeValid || !passwordValid || busy || restoring}
            onPress={() => resetPassword(step.email)}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send a new code"
            onPress={() => sendCode(step.email)}
            hitSlop={spacing.xs}
            style={({ pressed }) => [styles.linkRow, pressed ? styles.pressed : null]}
          >
            <AppText variant="caption" color="gold">
              send a new code
            </AppText>
          </Pressable>
        </View>
      }
    >
      <View style={styles.form}>
        <AuthTextField
          label="6-digit code"
          value={code}
          onChangeText={(value) => {
            setCode(value.replace(/\D/g, '').slice(0, RESET_CODE_LENGTH));
            setError(null);
          }}
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          keyboardType="number-pad"
          returnKeyType="next"
        />
        <AuthTextField
          label="new password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setError(null);
          }}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={() => resetPassword(step.email)}
        />
        {error ? (
          <AppText variant="caption" color="secondary" accessibilityLiveRegion="polite">
            {error}
          </AppText>
        ) : (
          <AppText variant="caption" color="helper">
            {`use at least ${SIGN_IN_PASSWORD_MIN_LENGTH} characters.`}
          </AppText>
        )}
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  footer: {
    gap: spacing.xs,
  },
  linkRow: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
