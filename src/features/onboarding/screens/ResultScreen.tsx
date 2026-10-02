import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { AppText, PrimaryButton } from '@/components/ui';
import { MOTION_EASING_STANDARD, motion, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ResultStep } from '@/features/onboarding/types/onboarding';
import { deriveResetApproach } from '@/features/onboarding/utils/deriveResetApproach';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';

type ResultScreenProps = {
  step: ResultStep;
};

const revealEasing = Easing.bezier(
  MOTION_EASING_STANDARD[0],
  MOTION_EASING_STANDARD[1],
  MOTION_EASING_STANDARD[2],
  MOTION_EASING_STANDARD[3],
);

function RevealBlock({ delayMs, children }: { delayMs: number; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }

    progress.value = withDelay(
      delayMs,
      withTiming(1, { duration: motion.duration.revealCopy, easing: revealEasing }),
    );
  }, [delayMs, progress, reduceMotion]);

  const revealStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * motion.offset.question }],
  }));

  return <Animated.View style={revealStyle}>{children}</Animated.View>;
}

export function ResultScreen({ step }: ResultScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfileForAnswers(answers);
  const approach = deriveResetApproach(answers);
  const approachLines = [approach.time, approach.support, approach.length].filter(
    (value): value is string => Boolean(value),
  );

  return (
    <OnboardingScreenLayout
      tone="story"
      eyebrow="your reset type is..."
      title={profile.name}
      illustrationKey={profile.illustrationKey}
      illustrationSize="large"
      illustrationPlacement="afterHero"
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={
        <RevealBlock delayMs={motion.delay.revealFooter}>
          <View style={styles.footer}>
            <PrimaryButton label={step.ctaLabel} haptic="success" onPress={goToNext} />
            {step.secondaryCtaLabel ? (
              <OnboardingTextButton label={step.secondaryCtaLabel} onPress={goToNext} />
            ) : null}
          </View>
        </RevealBlock>
      }
    >
      <RevealBlock delayMs={motion.delay.revealCopy}>
        <View style={styles.copy}>
          <AppText variant="title">{profile.summary}</AppText>
          <AppText variant="body" color="secondary">
            {profile.description}
          </AppText>
          <ProfileSection label="your biggest pattern" value={profile.biggestPattern} />
          <ProfileSection label="what usually helps" value={profile.whatUsuallyHelps} />
          {approachLines.length > 0 ? (
            <View style={styles.section}>
              <AppText variant="label" color="helper">
                your Gently Reset approach
              </AppText>
              {approachLines.map((line) => (
                <AppText key={line} variant="body">
                  {line}
                </AppText>
              ))}
            </View>
          ) : null}
          <AppText variant="body" color="secondary">
            {profile.advice}
          </AppText>
          <AppText variant="title">{profile.emphasized}</AppText>
        </View>
      </RevealBlock>
    </OnboardingScreenLayout>
  );
}

function ProfileSection({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.section}>
      <AppText variant="label" color="helper">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.xxs,
    paddingTop: spacing.xs,
  },
  footer: {
    gap: spacing.xs,
  },
});
