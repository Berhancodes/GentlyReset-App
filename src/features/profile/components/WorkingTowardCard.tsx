import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

import { ProfileCard } from './ProfileCard';

const CHIP_TINTS = [colors.tint.sage, colors.tint.blue, colors.tint.peach] as const;

type WorkingTowardCardProps = {
  goalLabels: readonly string[];
  identityQuote?: string;
  onEdit: () => void;
};

export function WorkingTowardCard({ goalLabels, identityQuote, onEdit }: WorkingTowardCardProps) {
  const hasGoals = goalLabels.length > 0;

  return (
    <ProfileCard>
      <View style={styles.header}>
        <View style={styles.title}>
          <AppText variant="optionTitle">{"what I'm working toward"}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="edit goals"
          onPress={onEdit}
          style={({ pressed }) => [styles.edit, pressed ? styles.pressed : null]}
        >
          <AppText variant="caption" color="helper">
            Edit
          </AppText>
        </Pressable>
      </View>
      {hasGoals ? (
        <View style={styles.chips}>
          {goalLabels.map((label, index) => (
            <View
              key={label}
              style={[
                styles.chip,
                { backgroundColor: CHIP_TINTS[index % CHIP_TINTS.length] ?? colors.tint.sage },
              ]}
            >
              <AppText variant="optionLabel" color="primary">
                {label}
              </AppText>
            </View>
          ))}
        </View>
      ) : (
        <AppText variant="caption" color="helper">
          no goals were saved from onboarding.
        </AppText>
      )}
      {identityQuote ? (
        <AppText variant="caption" color="secondary" align="center">
          {`“${identityQuote}”`}
        </AppText>
      ) : null}
    </ProfileCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
  edit: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pressed: {
    opacity: 0.72,
  },
});
