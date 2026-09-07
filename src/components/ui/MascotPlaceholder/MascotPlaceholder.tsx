import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/design-system';
import { AppText } from '@/components/ui/Text';

type MascotPlaceholderProps = {
  label?: string;
};

/**
 * Stand-in until illustrated mascot art lands in assets/images/mascot.
 */
export function MascotPlaceholder({ label = 'Mascot artwork goes here' }: MascotPlaceholderProps) {
  return (
    <View accessibilityLabel={label} accessibilityRole="image" style={styles.frame}>
      <View style={styles.face}>
        <View style={styles.eyeRow}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <View style={styles.blushRow}>
          <View style={styles.blush} />
          <View style={styles.blush} />
        </View>
      </View>
      <AppText variant="label" color="muted" align="center">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  face: {
    width: 72,
    height: 72,
    borderRadius: radius.xxl,
    backgroundColor: colors.accent.peach,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eye: {
    width: 8,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
  blushRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  blush: {
    width: 10,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.raised,
    opacity: 0.7,
  },
});
