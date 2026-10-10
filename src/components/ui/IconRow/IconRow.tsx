import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/design-system';
import { MascotIcon } from '../MascotIcon';

type IconRowProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  onPress?: () => void;
};

export function IconRow({ icon, title, subtitle, showChevron = false, onPress }: IconRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <View style={styles.icon}>{icon}</View>
      <View style={styles.copy}>
        <AppText variant="optionTitle">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color="helper">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {showChevron ? <MascotIcon name="chevron" size={18} color={colors.text.helper} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.88,
  },
  icon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
});
