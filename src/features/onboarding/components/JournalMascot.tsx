import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const JOURNAL_ART = require('../../../../assets/images/onboarding/reset-reason/reset-mascot-journal.png');
const ART_WIDTH = 587;
const ART_HEIGHT = 656;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/**
 * Decorative journal mascot under the "I'm doing this because..." field.
 * Not interactive — does not participate in text entry.
 */
export function JournalMascot() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxHeight = Math.round(windowHeight * 0.22);
  const widthFromHeight = Math.round(maxHeight * ART_ASPECT);
  const artWidth = Math.max(spacing.xxxl, Math.min(availableWidth, widthFromHeight));
  const artHeight = Math.round(artWidth / ART_ASPECT);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.wrap}
    >
      <Image
        source={JOURNAL_ART}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ width: artWidth, height: artHeight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: spacing.xs,
    flexShrink: 0,
    pointerEvents: 'none',
  },
});
