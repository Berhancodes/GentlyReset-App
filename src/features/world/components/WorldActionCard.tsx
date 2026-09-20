import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';

type WorldActionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconBackground: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function WorldActionCard({
  icon,
  iconBackground,
  iconColor,
  title,
  subtitle,
  onPress,
}: WorldActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={[styles.badge, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={18} color={iconColor} accessibilityElementsHidden />
      </View>
      <View style={styles.copy}>
        <AppText variant="optionTitle">{title}</AppText>
        <AppText variant="caption" color="helper">
          {subtitle}
        </AppText>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.text.helper}
        accessibilityElementsHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.raised,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.88,
  },
  badge: {
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
});
