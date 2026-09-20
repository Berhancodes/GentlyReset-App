import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

import { ProfileCard } from './ProfileCard';

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type IconTint = 'gold' | 'peach' | 'blue';

type ResetFact = {
  icon: IoniconName;
  tint: IconTint;
  label: string;
  value: string;
  onPress?: () => void;
};

type MyResetCardProps = {
  facts: readonly ResetFact[];
  onOpenType: () => void;
};

const TINT_COLORS: Record<IconTint, { well: string; icon: string }> = {
  gold: { well: colors.tint.gold, icon: colors.accent.gold },
  peach: { well: colors.tint.peach, icon: colors.accent.peach },
  blue: { well: colors.tint.blue, icon: colors.accent.blue },
};

export function MyResetCard({ facts, onOpenType }: MyResetCardProps) {
  return (
    <ProfileCard>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="my reset"
        onPress={onOpenType}
        style={({ pressed }) => [styles.header, pressed ? styles.pressed : null]}
      >
        <AppText variant="optionTitle">my reset</AppText>
        <Ionicons name="chevron-forward" size={18} color={colors.text.helper} />
      </Pressable>
      {facts.map((fact) => (
        <FactRow key={fact.label} fact={fact} />
      ))}
    </ProfileCard>
  );
}

function FactRow({ fact }: { fact: ResetFact }) {
  const tint = TINT_COLORS[fact.tint];
  const content = (
    <>
      <View
        style={[styles.iconWell, { backgroundColor: tint.well }]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <Ionicons name={fact.icon} size={18} color={tint.icon} />
      </View>
      <View style={styles.copy}>
        <AppText variant="label" color="helper">
          {fact.label}
        </AppText>
        <AppText variant="optionTitle">{fact.value}</AppText>
      </View>
    </>
  );

  if (!fact.onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${fact.label}. ${fact.value}`}
      onPress={fact.onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  row: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWell: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  pressed: {
    opacity: 0.88,
  },
});
