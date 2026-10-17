import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { AuthTextField } from '@/features/auth/components/AuthTextField';
import { SocialSignInButtons } from '@/features/auth/components/SocialSignInButtons';
import { useAuth } from '@/features/auth/session/useAuth';
import type { SignInErrors, SignInValues } from '@/features/auth/types';
import { canSubmitSignIn, validateSignIn } from '@/features/auth/utils/validateSignIn';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { getRootHref } from '@/navigation/getRootHref';
import { useFinishSignIn } from '@/navigation/useFinishSignIn';

const EMPTY_VALUES: SignInValues = {
  email: '',
  password: '',
};

export function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { isPro } = useSubscription();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const hasLocalAppAccess = useOnboardingStore((state) => state.hasLocalAppAccess);
  const [values, setValues] = useState<SignInValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { restoring, finishSignIn } = useFinishSignIn();

  const updateField = <Field extends keyof SignInValues>(
    field: Field,
    value: SignInValues[Field],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field] || errors.form) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        delete next.form;
        return next;
      });
    }
  };

  const goToAccessDestination = () => {
    router.replace(getRootHref({ hasCompletedOnboarding, isPro, hasLocalAppAccess }));
  };

  const submit = () => {
    Keyboard.dismiss();
    if (submitting) {
      return;
    }

    const nextErrors = validateSignIn(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    void signIn(values.email, values.password)
      .then(async (result) => {
        if (!result.ok) {
          setErrors({ form: result.message });
          return;
        }
        await finishSignIn();
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <OnboardingScreenLayout
      tone="question"
      hideProgress
      title={'welcome\nback'}
      subtitle="sign in to pick up your reset."
      onBack={() => router.back()}
      avoidKeyboard
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label={
              restoring ? 'bringing back your reset…' : submitting ? 'signing in…' : 'sign in →'
            }
            disabled={!canSubmitSignIn(values) || submitting}
            onPress={submit}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Begin a new reset"
            onPress={goToAccessDestination}
            style={({ pressed }) => [styles.switchRow, pressed ? styles.pressed : null]}
          >
            <AppText variant="caption" color="helper">
              skip for now?
            </AppText>
            <AppText variant="caption" color="gold">
              begin a new reset
            </AppText>
          </Pressable>
        </View>
      }
    >
      <View style={styles.form}>
        <SocialSignInButtons onSignedIn={finishSignIn} />
        <AppText variant="caption" color="helper" align="center">
          or sign in with email
        </AppText>
        <AuthTextField
          label="email"
          value={values.email}
          onChangeText={(value) => updateField('email', value)}
          error={errors.email}
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          returnKeyType="next"
        />
        <AuthTextField
          label="password"
          value={values.password}
          onChangeText={(value) => updateField('password', value)}
          error={errors.password}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        {errors.form ? (
          <AppText variant="caption" color="secondary" accessibilityLiveRegion="polite">
            {errors.form}
          </AppText>
        ) : (
          <AppText variant="caption" color="helper">
            signing in does not change your local reset.
          </AppText>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
          onPress={() => router.push('/(auth)/forgot-password')}
          hitSlop={spacing.xs}
          style={({ pressed }) => [styles.forgot, pressed ? styles.pressed : null]}
        >
          <AppText variant="caption" color="gold">
            forgot password?
          </AppText>
        </Pressable>
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
  switchRow: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  forgot: {
    alignSelf: 'flex-start',
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
