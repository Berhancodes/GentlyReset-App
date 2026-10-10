import { StyleSheet, View } from 'react-native';

import { AppText, MascotIcon } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

import { ProfileCard } from './ProfileCard';

type ProgressLinkCardProps = {
  onPress: () => void;
};

/** Opens the Journey stats screen. */
export function ProgressLinkCard({ onPress }: ProgressLinkCardProps) {
  return (
    <ProfileCard
      accessibilityLabel="Your Progress. See your streak, consistency, and milestones."
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={styles.iconWell} accessibilityElementsHidden importantForAccessibility="no">
          <MascotIcon name="chart" size={22} />
        </View>
        <View style={styles.copy}>
          <AppText variant="optionTitle">Your Progress</AppText>
          <AppText variant="label" color="secondary">
            See your streak, consistency, and milestones.
          </AppText>
        </View>
        <MascotIcon name="chevron" size={18} color={colors.text.helper} />
      </View>
    </ProfileCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWell: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.profile.progressIconWell,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
