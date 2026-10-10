import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MascotIcon } from '@/components/ui';
import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';

type ProfileLink = {
  icon: ReactNode;
  title: string;
  onPress: () => void;
};

type ProfileLinkRowsProps = {
  links: readonly ProfileLink[];
};

export function ProfileLinkRows({ links }: ProfileLinkRowsProps) {
  return (
    <View style={styles.card}>
      {links.map((link, index) => (
        <View key={link.title}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={link.title}
            onPress={link.onPress}
            style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
          >
            <View style={styles.icon}>{link.icon}</View>
            <View style={styles.copy}>
              <Text style={styles.title} maxFontSizeMultiplier={1.3}>
                {link.title}
              </Text>
            </View>
            <MascotIcon name="chevron" size={18} color={colors.stage.copySoft} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radius.card,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  row: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  icon: {
    width: spacing.xl,
    height: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.stage.chipBorder,
  },
  pressed: {
    opacity: 0.88,
  },
});
