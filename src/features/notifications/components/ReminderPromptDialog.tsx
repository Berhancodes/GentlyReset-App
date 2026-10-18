import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';

type ReminderPromptDialogProps = {
  visible: boolean;
  /** e.g. "6:00 pm" */
  timeLabel: string;
  onAnswer: (wantsReminders: boolean) => void;
};

/** Asked once, right after a check-in, before Apple's own permission prompt. */
export function ReminderPromptDialog({ visible, timeLabel, onAnswer }: ReminderPromptDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onAnswer(false)}
      accessibilityViewIsModal
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji} accessible={false}>
            🔔
          </Text>
          <View style={styles.copy}>
            <AppText variant="title">want a little reminder?</AppText>
            <AppText variant="body" color="secondary">
              {`I’ll send one gentle nudge at ${timeLabel} on days you haven’t checked in yet, and let you know when a friend sends you some love. change it anytime in Profile.`}
            </AppText>
          </View>
          <PrimaryButton label="yes, remind me" onPress={() => onAnswer(true)} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Not now"
            onPress={() => onAnswer(false)}
            style={styles.notNow}
          >
            <Text style={styles.notNowLabel} maxFontSizeMultiplier={1.3}>
              not now
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
    backgroundColor: colors.surface.raised,
  },
  emoji: {
    fontSize: fontSizes.xl,
    textAlign: 'center',
  },
  copy: {
    gap: spacing.sm,
  },
  notNow: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notNowLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.heavy,
    color: colors.text.secondary,
  },
});
