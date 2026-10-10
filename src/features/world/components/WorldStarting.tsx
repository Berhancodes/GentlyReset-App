import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';

const MASCOT = STAGE_POSE_ART['react-hopeful'];
const MASCOT_HEIGHT = 128;

type WorldStartingProps = {
  hasUsername: boolean;
  onChooseUsername: () => void;
  onInvite: () => void;
  onFindFriend: () => void;
};

/** World before you have friends: what it's for, and the one next step. */
export function WorldStarting({
  hasUsername,
  onChooseUsername,
  onInvite,
  onFindFriend,
}: WorldStartingProps) {
  return (
    <View style={styles.root}>
      <View style={styles.bubble} accessibilityElementsHidden>
        <Text style={styles.bubbleText} maxFontSizeMultiplier={1.2}>
          Kind words from friends land here.
        </Text>
        <View style={styles.bubbleTail} />
      </View>
      <Image
        source={MASCOT.source}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{
          height: MASCOT_HEIGHT,
          width: (MASCOT.width / MASCOT.height) * MASCOT_HEIGHT,
          marginLeft: -MASCOT.bodyOffset * (MASCOT_HEIGHT / MASCOT.height) * 2,
        }}
      />
      <View style={styles.copy} accessibilityRole="header">
        <Text style={styles.title} maxFontSizeMultiplier={1.25}>
          Don’t reset alone
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
          {hasUsername
            ? 'Invite someone you trust. They can see your day and send you a kind word. Nothing else.'
            : 'Pick a name so friends can find you. They can see your day and send you a kind word. Nothing else.'}
        </Text>
      </View>
      <View style={styles.actions}>
        <StageButton
          label={hasUsername ? 'invite a friend' : 'choose a username'}
          onPress={hasUsername ? onInvite : onChooseUsername}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hasUsername ? 'Find a friend' : 'Invite a friend'}
          onPress={hasUsername ? onFindFriend : onInvite}
          style={({ pressed }) => [styles.secondary, pressed ? styles.secondaryPressed : null]}
        >
          <Text style={styles.secondaryLabel} maxFontSizeMultiplier={1.3}>
            {hasUsername ? 'Find a friend' : 'Invite a friend'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  bubble: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    backgroundColor: colors.stage.bubble,
    marginBottom: spacing.xxs,
  },
  bubbleText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -7,
    width: 14,
    height: 14,
    backgroundColor: colors.stage.bubble,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    transform: [{ rotate: '45deg' }],
  },
  copy: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
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
  actions: {
    alignSelf: 'stretch',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  secondary: {
    minHeight: spacing.xxl + spacing.xxs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
  },
  secondaryPressed: {
    transform: [{ scale: 0.98 }],
  },
  secondaryLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
});
