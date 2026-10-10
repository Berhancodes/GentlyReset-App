import { StyleSheet, View } from 'react-native';

import { AppText, MascotIcon, type MascotIllustrationName } from '@/components/ui';
import { colors, spacing } from '@/design-system';

import { ProfileCard } from './ProfileCard';

type Insight = {
  icon: MascotIllustrationName;
  label: string;
  value: string;
};

type AboutResetTypeCardProps = {
  strength: string;
  pattern: string;
  approach: string;
  onPress: () => void;
};

export function AboutResetTypeCard({
  strength,
  pattern,
  approach,
  onPress,
}: AboutResetTypeCardProps) {
  const insights: readonly Insight[] = [
    { icon: 'star', label: 'STRENGTH', value: strength },
    { icon: 'chart', label: 'PATTERN', value: pattern },
    { icon: 'leaf', label: 'APPROACH', value: approach },
  ];

  return (
    <ProfileCard
      onPress={onPress}
      accessibilityLabel={`about my reset type. strength ${strength}. pattern ${pattern}. approach ${approach}`}
    >
      <View style={styles.header}>
        <AppText variant="optionTitle">about my reset type</AppText>
        <MascotIcon name="chevron" size={18} color={colors.text.helper} />
      </View>
      <View style={styles.columns}>
        {insights.map((insight) => (
          <View key={insight.label} style={styles.column}>
            <MascotIcon name={insight.icon} size={20} />
            <AppText variant="label" color="helper" align="center">
              {insight.label}
            </AppText>
            <AppText variant="caption" color="primary" align="center">
              {insight.value}
            </AppText>
          </View>
        ))}
      </View>
    </ProfileCard>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
});
