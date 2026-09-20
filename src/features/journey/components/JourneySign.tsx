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
    <View accessible accessibilityRole="text" accessibilityLabel={line} style={styles.wrap}>
      <Image
        source={JOURNEY_SPRITES.sign}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.sign}
      />
      <View style={styles.board}>
        <AppText variant="moodLabel" color="primary" align="center" numberOfLines={3}>
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
    pointerEvents: 'none',
  },
  sign: {
    width: SIGN_WIDTH,
    height: SIGN_HEIGHT,
  },
  board: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    height: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
