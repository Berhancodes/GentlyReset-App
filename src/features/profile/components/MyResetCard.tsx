import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, MascotIcon, type MascotIllustrationName } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

import { ProfileCard } from './ProfileCard';

type IconTint = 'gold' | 'peach' | 'blue';

type ResetFact = {
  icon: MascotIllustrationName;
  tint: IconTint;
  label: string;
  value: string;
  onPress?: () => void;
};

type MyResetCardProps = {
  facts: readonly ResetFact[];
  onOpenType: () => void;
};

const TINT_WELLS: Record<IconTint, string> = {
  gold: colors.tint.gold,
  peach: colors.tint.peach,
  blue: colors.tint.blue,
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
        <AppText variant="navTitle">my reset</AppText>
        <MascotIcon name="chevron" size={18} color={colors.text.helper} />
      </Pressable>
      {facts.map((fact) => (
        <FactRow key={fact.label} fact={fact} />
      ))}
    </ProfileCard>
  );
}

function FactRow({ fact }: { fact: ResetFact }) {
  const content = (
    <>
      <View
        style={[styles.iconWell, { backgroundColor: TINT_WELLS[fact.tint] }]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <MascotIcon name={fact.icon} size={24} />
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
