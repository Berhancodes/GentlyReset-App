import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, PrimaryButton } from '@/components/ui';
import { spacing } from '@/design-system';
import { AuthTextField } from '@/features/auth/components/AuthTextField';
import { useAuth } from '@/features/auth/session/useAuth';
import type { SignUpErrors, SignUpValues } from '@/features/auth/types';
import { canSubmitSignIn, validateSignIn } from '@/features/auth/utils/validateSignIn';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { getRootHref } from '@/navigation/getRootHref';

const EMPTY_VALUES: SignUpValues = {
  email: '',
  password: '',
};

export function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { isPro } = useSubscription();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const [values, setValues] = useState<SignUpValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const updateField = <Field extends keyof SignUpValues>(
    field: Field,
    value: SignUpValues[Field],
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

  const afterAuthenticated = () => {
    router.replace(getRootHref({ hasCompletedOnboarding, isPro }));
  };

  const submit = () => {
    Keyboard.dismiss();
    if (submitting || confirmationRequired) {
      return;
    }

    const nextErrors = validateSignIn(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    void signUp(values.email, values.password)
      .then((result) => {
        if (!result.ok) {
          setErrors({ form: result.message });
          return;
        }
        if (result.kind === 'confirmation_required') {
          setConfirmationRequired(true);
          return;
        }
        afterAuthenticated();
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (confirmationRequired) {
    return (
      <OnboardingScreenLayout
        tone="question"
        hideProgress
        title={'check\nyour email'}
        subtitle="confirm this account, then sign in."
        onBack={() => router.replace('/(auth)/sign-in')}
        footer={
          <PrimaryButton
            label="back to sign in →"
            onPress={() => router.replace('/(auth)/sign-in')}
          />
        }
      >
        <AppText variant="body" color="secondary">
          we sent a confirmation link to {values.email.trim().toLowerCase()}. creating an account
          does not change your local reset.
        </AppText>
      </OnboardingScreenLayout>
    );
  }

  return (
    <OnboardingScreenLayout
      tone="question"
      hideProgress
      title={'create\naccount'}
      subtitle="save your identity. your reset stays on this device for now."
      onBack={() => router.back()}
      avoidKeyboard
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label={submitting ? 'creating account…' : 'create account →'}
            disabled={!canSubmitSignIn(values) || submitting}
            onPress={submit}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={() => router.replace('/(auth)/sign-in')}
            style={({ pressed }) => [styles.switchRow, pressed ? styles.pressed : null]}
          >
            <AppText variant="caption" color="helper">
              already have an account?
            </AppText>
            <AppText variant="caption" color="gold">
              sign in
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
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        {errors.form ? (
          <AppText variant="caption" color="secondary" accessibilityLiveRegion="polite">
            {errors.form}
          </AppText>
        ) : (
          <AppText variant="caption" color="helper">
            an account is not a subscription. your reset stays local.
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
