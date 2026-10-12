import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, textVariants } from '@/design-system';
import { PromiseHoldButton } from '@/features/onboarding/components/PromiseHoldButton';
import { UnlockLayout } from '@/features/onboarding/components/UnlockLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import type { PromiseStep } from '@/features/onboarding/types/onboarding';

const DOT = 22;
/** This week, this month, every month, all year: warming up to gold. */
const TIMELINE_DOTS = [
  colors.unlock.dotPeach,
  colors.unlock.iconButter,
  colors.unlock.iconSky,
  colors.unlock.gold,
] as const;

type PromiseScreenProps = {
  step: PromiseStep;
};

/** Unlock 2 of 3: a whole year, season by season, then a promise they hold to make. */
export function PromiseScreen({ step }: PromiseScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const [promised, setPromised] = useState(false);

  return (
    <UnlockLayout
      stepId="promise"
      eyebrow={step.eyebrow}
      title={step.title}
      onBack={canGoBack ? goBack : undefined}
      anchored={
        <PromiseHoldButton
          promise={step.promise}
          kicker={step.kicker}
          hint={step.hint}
          promisedKicker={step.promisedKicker}
          promisedHint={step.promisedHint}
          promised={promised}
          onPromised={() => setPromised(true)}
        />
      }
      footer={
        <StageButton
          label={promised ? step.ctaLabel : step.lockedCtaLabel}
          disabled={!promised}
          onPress={goToNext}
        />
      }
    >
      <View
        style={styles.timeline}
        accessible
        accessibilityLabel={step.timeline
          .map((item) => `${item.when}: ${item.title}. ${item.body}`)
          .join(' ')}
      >
        {step.timeline.map((item, index) => {
          const last = index === step.timeline.length - 1;
          return (
            <View key={item.when} style={styles.item}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: TIMELINE_DOTS[index] ?? colors.unlock.gold },
                  ]}
                />
                {last ? null : <View style={styles.line} />}
              </View>
              <View style={[styles.itemCopy, last ? styles.itemCopyLast : null]}>
                <Text style={styles.when}>{item.when}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.body}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.reassurance}>{step.reassurance}</Text>
    </UnlockLayout>
  );
}

const styles = StyleSheet.create({
  timeline: {
    paddingTop: spacing.xxs,
  },
  item: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rail: {
    width: DOT + spacing.xxs,
    alignItems: 'center',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    borderColor: colors.unlock.ink,
  },
  line: {
    flex: 1,
    width: 2.5,
    minHeight: spacing.sm + 2,
    backgroundColor: colors.unlock.track,
  },
  itemCopy: {
    flex: 1,
    gap: 1,
    paddingBottom: spacing.sm,
  },
  itemCopyLast: {
    paddingBottom: 0,
  },
  when: {
    ...textVariants.unlockLabel,
    color: colors.unlock.muted,
  },
  itemTitle: {
    ...textVariants.unlockValue,
    color: colors.unlock.ink,
  },
  itemBody: {
    ...textVariants.unlockSmall,
    color: colors.unlock.copy,
  },
  reassurance: {
    ...textVariants.unlockSmall,
    fontWeight: textVariants.unlockValue.fontWeight,
    color: colors.unlock.goldInk,
  },
});
