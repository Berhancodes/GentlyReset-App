import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, MascotIcon } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

type YourResetCardProps = {
  approach: string;
  onPress: () => void;
};

/** Gold-tinted row naming what this reset is about. */
export function YourResetCard({ approach, onPress }: YourResetCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`your reset. ${approach}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <MascotIcon name="sprout" size={28} />
      <View style={styles.copy}>
        <View style={styles.eyebrow}>
          <AppText variant="label">YOUR RESET</AppText>
        </View>
        <AppText variant="caption">{approach}</AppText>
      </View>
      <MascotIcon name="chevron" size={18} color={colors.text.helper} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.profile.yourResetCard,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.88,
  },
});
