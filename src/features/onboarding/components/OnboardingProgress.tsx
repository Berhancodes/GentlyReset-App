import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import {
  ONBOARDING_CHAPTERS,
  type OnboardingChapterId,
} from '@/features/onboarding/types/onboarding';

type OnboardingProgressProps = {
  chapterId: OnboardingChapterId;
};

export function OnboardingProgress({ chapterId }: OnboardingProgressProps) {
  const currentIndex = ONBOARDING_CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
  const currentChapter = ONBOARDING_CHAPTERS[currentIndex] ?? ONBOARDING_CHAPTERS[0];

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`${currentChapter?.label ?? 'onboarding'}, chapter ${currentIndex + 1} of ${ONBOARDING_CHAPTERS.length}`}
      accessibilityValue={{
        min: 1,
        max: ONBOARDING_CHAPTERS.length,
        now: Math.max(1, currentIndex + 1),
      }}
      style={styles.root}
    >
      <View style={styles.track}>
        {ONBOARDING_CHAPTERS.map((chapter, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === ONBOARDING_CHAPTERS.length - 1;

          return (
            <View key={chapter.id} style={[styles.segment, !isLast && styles.segmentGrow]}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isCurrent && styles.dotCurrent,
                ]}
              />
              {isLast ? null : (
                <View style={[styles.line, isCompleted || isCurrent ? styles.lineFilled : null]} />
              )}
            </View>
          );
        })}
      </View>
      <AppText variant="label" color="muted">
        {currentChapter?.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentGrow: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.progress.track,
    marginHorizontal: spacing.xs,
  },
  lineFilled: {
    backgroundColor: colors.accent.gold,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.progress.track,
    backgroundColor: colors.background.primary,
  },
  dotCurrent: {
    borderColor: colors.text.primary,
    backgroundColor: colors.text.primary,
  },
  dotCompleted: {
    borderColor: colors.accent.sage,
    backgroundColor: colors.accent.sage,
  },
});
