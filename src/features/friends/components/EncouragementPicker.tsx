import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { friendDisplayLabel } from '@/features/friends/components/FriendIdentityRow';
import {
  ENCOURAGEMENT_COPY,
  ENCOURAGEMENT_KINDS,
  type EncouragementKind,
} from '@/features/friends/encouragements';
import type { PublicFriendIdentity } from '@/features/friends/types';

type EncouragementPickerProps = {
  visible: boolean;
  friend: PublicFriendIdentity | null;
  busy: boolean;
  onSelect: (kind: EncouragementKind) => void;
  onClose: () => void;
};

export function EncouragementPicker({
  visible,
  friend,
  busy,
  onSelect,
  onClose,
}: EncouragementPickerProps) {
  const name = friend ? friendDisplayLabel(friend) : 'a friend';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={styles.backdrop}>
        {/* A sibling behind the card, so the card's buttons aren't nested in another button. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.card}>
          <View style={styles.copy} accessibilityRole="header">
            <Text style={styles.title} maxFontSizeMultiplier={1.25}>
              {`Send ${name} a postcard`}
            </Text>
            <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
              A small kind word. Not a chat.
            </Text>
          </View>
          <View style={styles.kinds}>
            {ENCOURAGEMENT_KINDS.map((kind) => (
              <Pressable
                key={kind}
                accessibilityRole="button"
                accessibilityLabel={ENCOURAGEMENT_COPY[kind]}
                accessibilityState={{ disabled: busy }}
                disabled={busy || !friend}
                onPress={() => onSelect(kind)}
                style={({ pressed }) => [styles.kind, pressed ? styles.kindPressed : null]}
              >
                <Text style={styles.kindLabel} maxFontSizeMultiplier={1.3}>
                  {ENCOURAGEMENT_COPY[kind].charAt(0).toUpperCase() +
                    ENCOURAGEMENT_COPY[kind].slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Not now"
            onPress={onClose}
            style={styles.close}
          >
            <Text style={styles.closeLabel} maxFontSizeMultiplier={1.3}>
              Not now
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.stage.floor,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  kinds: {
    gap: spacing.xs,
  },
  kind: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  kindPressed: {
    backgroundColor: colors.stage.chipSelected,
    borderColor: colors.stage.chipBorderSelected,
    transform: [{ scale: 0.98 }],
  },
  kindLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.stageChip,
    lineHeight: lineHeights.stageChip,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    textAlign: 'center',
  },
  close: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.heavy,
    color: colors.stage.copySoft,
  },
});
