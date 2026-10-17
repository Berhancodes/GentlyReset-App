import { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, spacing, textVariants } from '@/design-system';
import { AuthTextField } from '@/features/auth/components/AuthTextField';
import { useAuth } from '@/features/auth/session/useAuth';
import { openLegalDocument } from '@/features/legal/utils/openLegalDocument';
import type { SignUpErrors, SignUpValues } from '@/features/auth/types';
import { canSubmitSignIn, validateSignIn } from '@/features/auth/utils/validateSignIn';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { requestResetCloudSyncForCurrentUser } from '@/features/reset/sync/requestResetCloudSync';
import {
  markPaywallPurchaseReady,
  peekPaywallUnlock,
} from '@/features/subscription/access/pendingPaywallUnlock';
import { getRootHref } from '@/navigation/getRootHref';

const EMPTY_VALUES: SignUpValues = {
  email: '',
  password: '',
};

export function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { isPro, purchasePackage } = useSubscription();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const hasLocalAppAccess = useOnboardingStore((state) => state.hasLocalAppAccess);
  const [values, setValues] = useState<SignUpValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      router.replace(getRootHref({ hasCompletedOnboarding, isPro, hasLocalAppAccess }));
    }
  }, [hasCompletedOnboarding, hasLocalAppAccess, isPro, router]);

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
    markPaywallPurchaseReady();
    const packageIdentifier = peekPaywallUnlock()?.packageIdentifier;
    requestResetCloudSyncForCurrentUser();
    router.replace(getRootHref({ hasCompletedOnboarding, isPro, hasLocalAppAccess }));
    if (packageIdentifier && !isPro) {
      void purchasePackage(packageIdentifier);
    }
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

  if (!hasCompletedOnboarding) {
    return null;
  }

  if (confirmationRequired) {
    return (
      <OnboardingScreenLayout
        tone="question"
        hideProgress
        title={'check\nyour email'}
        subtitle="confirm this account, then come back to unlock."
        onBack={() => router.replace('/(auth)/sign-in')}
        footer={
          <PrimaryButton
            label="back to sign in →"
            onPress={() => router.replace('/(auth)/sign-in')}
          />
        }
      >
        <AppText variant="body" color="secondary">
          we sent a confirmation link to {values.email.trim().toLowerCase()}. after you confirm,
          return here to unlock Gently Reset Pro.
        </AppText>
      </OnboardingScreenLayout>
    );
  }

  return (
    <OnboardingScreenLayout
      tone="question"
      hideProgress
      title={'create\naccount'}
      subtitle="so your progress follows you to any phone."
      onBack={() => router.back()}
      avoidKeyboard
      footer={
        <View style={styles.footer}>
          <Text style={styles.agree} maxFontSizeMultiplier={1.3}>
            {'By creating an account, you agree to the '}
            <Text
              accessibilityRole="link"
              style={styles.agreeLink}
              onPress={() => openLegalDocument('terms')}
            >
              Terms of Service
            </Text>
            {' and '}
            <Text
              accessibilityRole="link"
              style={styles.agreeLink}
              onPress={() => openLegalDocument('privacy')}
            >
              Privacy Policy
            </Text>
            .
          </Text>
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
            create this now so your purchase and reset backup have a home.
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
  agree: {
    ...textVariants.caption,
    color: colors.text.helper,
    textAlign: 'center',
  },
  agreeLink: {
    color: colors.text.primary,
    textDecorationLine: 'underline',
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
