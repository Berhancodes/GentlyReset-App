import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { AuthTextField } from '@/features/auth/components/AuthTextField';
import { useAuth } from '@/features/auth/session/useAuth';
import type { SignInErrors, SignInValues } from '@/features/auth/types';
import { canSubmitSignIn, validateSignIn } from '@/features/auth/utils/validateSignIn';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

const EMPTY_VALUES: SignInValues = {
  email: '',
  password: '',
};

export function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const [values, setValues] = useState<SignInValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [submitting, setSubmitting] = useState(false);

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

  const beginNewReset = () => {
    if (hasCompletedOnboarding) {
      router.replace('/(app)/(tabs)/home');
      return;
    }
    router.replace('/(onboarding)/flow');
  };

  const afterAuthenticated = () => {
    if (hasCompletedOnboarding) {
      router.replace('/(app)/(tabs)/home');
      return;
    }
    router.replace('/(onboarding)/flow');
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
      .then((result) => {
        if (!result.ok) {
          setErrors({ form: result.message });
          return;
        }
        afterAuthenticated();
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
            label={submitting ? 'signing in…' : 'sign in →'}
            disabled={!canSubmitSignIn(values) || submitting}
            onPress={submit}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create an account"
            onPress={() => router.push('/(auth)/sign-up')}
            style={({ pressed }) => [styles.switchRow, pressed ? styles.pressed : null]}
          >
            <AppText variant="caption" color="helper">
              new here?
            </AppText>
            <AppText variant="caption" color="gold">
              create an account
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Begin a new reset"
            onPress={beginNewReset}
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
  pressed: {
    opacity: 0.7,
  },
});
