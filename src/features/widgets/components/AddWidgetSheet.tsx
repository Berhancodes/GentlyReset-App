import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';

const MASCOT = require('../../../../assets/images/mascot/stage/idle-listen.png');

const STEPS = ['hold your home screen', 'tap the +', 'search Gently Reset', 'pick a size'] as const;

type AddWidgetSheetProps = {
  visible: boolean;
  day: number;
  onClose: () => void;
};

const C = colors.room;

/** Walks people through adding the widget; iOS doesn't let apps add it for them. */
export function AddWidgetSheet({ visible, day, onClose }: AddWidgetSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.grabber} />
          <View style={styles.copy}>
            <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
              want me on your home screen? 🤍
            </Text>
            <Text style={styles.body} maxFontSizeMultiplier={1.3}>
              I’ll keep your day and our room close by. No notifications, just me, waving when you
              unlock your phone.
            </Text>
          </View>

          <View style={styles.steps}>
            {STEPS.map((step, index) => (
              <View
                key={step}
                style={styles.step}
                accessible
                accessibilityLabel={`Step ${index + 1}: ${step}`}
              >
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText} maxFontSizeMultiplier={1.2}>
                  {step}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.preview}>
            <View
              style={styles.miniWidget}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Text style={styles.miniKicker}>SEASON 1</Text>
              <Text style={styles.miniDay}>{`Day ${day}`}</Text>
              <Image source={MASCOT} resizeMode="contain" style={styles.miniMascot} />
            </View>
            <Text style={styles.previewText} maxFontSizeMultiplier={1.3}>
              Pick small or medium. You can find this again any time on the You page.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.primary, pressed ? styles.pressed : null]}
            >
              <Text style={styles.primaryLabel} maxFontSizeMultiplier={1.3}>
                got it, I’ll add you
              </Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.secondary}>
              <Text style={styles.secondaryLabel} maxFontSizeMultiplier={1.3}>
                maybe later
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay.scrim,
  },
  sheet: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg - 4,
    gap: spacing.md - 2,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderTopWidth: 3,
    borderColor: C.ink,
    backgroundColor: C.trim,
  },
  grabber: {
    alignSelf: 'center',
    width: spacing.hitTarget,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: C.lockedBorder,
  },
  copy: {
    gap: spacing.xxs,
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg + 2,
    lineHeight: fontSizes.lg + 7,
    fontWeight: fontWeights.heavy,
    color: C.ink,
  },
  body: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm - 1,
    lineHeight: fontSizes.sm + 6,
    fontWeight: fontWeights.bold,
    color: colors.text.secondary,
  },
  steps: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs + 2,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.xxs,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.default,
    backgroundColor: C.cream,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: C.ink,
    backgroundColor: C.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: C.ink,
  },
  stepText: {
    textAlign: 'center',
    fontFamily: fontFamilies.rounded,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeights.heavy,
    color: C.ink,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm - 2,
    borderRadius: radius.lg + 2,
    backgroundColor: C.wall,
  },
  miniWidget: {
    width: 74,
    height: 74,
    padding: spacing.xs - 1,
    borderRadius: radius.lg,
    backgroundColor: C.cream,
    overflow: 'hidden',
  },
  miniKicker: {
    fontFamily: fontFamilies.rounded,
    fontSize: 7,
    fontWeight: fontWeights.heavy,
    color: C.kicker,
  },
  miniDay: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: C.ink,
  },
  miniMascot: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 44,
    height: 44,
  },
  previewText: {
    flex: 1,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs + 5,
    fontWeight: fontWeights.bold,
    color: colors.text.secondary,
  },
  actions: {
    gap: spacing.xxs,
  },
  primary: {
    minHeight: spacing.xxl + 4,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.cta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colors.stage.ctaPressed,
  },
  primaryLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.inverse,
  },
  secondary: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.heavy,
    color: C.locked,
  },
});
