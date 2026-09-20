import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { colors, spacing } from '@/design-system';

import { ProfileCard } from './ProfileCard';

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
    <ProfileCard style={styles.card}>
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
              <AppText variant="optionTitle">{link.title}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.helper} />
          </Pressable>
        </View>
      ))}
    </ProfileCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.xs,
    gap: 0,
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
    backgroundColor: colors.border.subtle,
  },
  pressed: {
    opacity: 0.88,
  },
});
