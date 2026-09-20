import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';

const SIGN_WIDTH = 72;
const SIGN_HEIGHT = 78;

type JourneySignProps = {
  line: string;
};

export function JourneySign({ line }: JourneySignProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={line}
      style={styles.wrap}
      pointerEvents="none"
    >
      <Image
        source={JOURNEY_SPRITES.sign}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.sign}
      />
      <View style={styles.board} pointerEvents="none">
        <AppText variant="label" color="primary" align="center" numberOfLines={3}>
          {line}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIGN_WIDTH,
    height: SIGN_HEIGHT,
    alignItems: 'center',
  },
  sign: {
    width: SIGN_WIDTH,
    height: SIGN_HEIGHT,
  },
  board: {
    position: 'absolute',
    top: spacing.xs + 2,
    left: spacing.sm,
    right: spacing.sm,
    height: spacing.xxl - spacing.xxs,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
  },
});
