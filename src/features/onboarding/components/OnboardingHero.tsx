import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

type OnboardingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  showTitle?: boolean;
  tone?: 'default' | 'question' | 'story';
};

/**
 * Title block shared by question and story screens.
 * Question styles must stay identical to the approved Page 2 treatment.
 */
export function OnboardingHero({
  title,
  subtitle,
  eyebrow,
  showTitle = true,
  tone = 'default',
}: OnboardingHeroProps) {
  const isQuestion = tone === 'question';

  if (!eyebrow && !showTitle && !subtitle) {
    return null;
  }

  return (
    <View style={[styles.copy, isQuestion ? styles.questionCopy : null]}>
      {eyebrow ? (
        <AppText variant="onboardingHelper" color="helper">
          {eyebrow}
        </AppText>
      ) : null}
      {showTitle ? (
        <AppText variant={isQuestion ? 'questionTitle' : 'display'}>
          {capitalizeHeading(title)}
        </AppText>
      ) : null}
      {subtitle ? (
        <AppText
          variant={isQuestion ? 'onboardingHelper' : 'subtitle'}
          color={isQuestion ? 'helper' : 'secondary'}
        >
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    gap: spacing.sm,
  },
  questionCopy: {
    gap: spacing.xs,
  },
});
