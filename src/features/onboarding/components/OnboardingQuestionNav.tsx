import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { OnboardingProgress } from '@/features/onboarding/components/OnboardingProgress';

type OnboardingQuestionNavProps = {
  onBack?: () => void;
  hideProgress?: boolean;
};

export function OnboardingQuestionNav({
  onBack,
  hideProgress = false,
}: OnboardingQuestionNavProps) {
  return (
    <View style={styles.questionNav}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={spacing.sm}
          style={styles.navSide}
        >
          <BackChevron />
        </Pressable>
      ) : (
        <View style={styles.navSide} />
      )}
      <View style={styles.navCenter}>{hideProgress ? null : <OnboardingProgress />}</View>
      <View style={styles.navSide} />
    </View>
  );
}

const styles = StyleSheet.create({
  questionNav: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  navSide: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});
