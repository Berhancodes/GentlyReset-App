import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import {
  WorldActionIcon,
  type WorldActionGlyph,
} from '@/features/world/components/WorldIcons';

type WorldActionCardProps = {
  glyph: WorldActionGlyph;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function WorldActionCard({ glyph, title, subtitle, onPress }: WorldActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <WorldActionIcon glyph={glyph} />
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
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.raised,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.88,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  chevron: {
    flexShrink: 0,
  },
});
