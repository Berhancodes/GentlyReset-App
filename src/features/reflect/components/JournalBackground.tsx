import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { getJournalSkyCoverLayout } from '@/features/reflect/layout/journalLayout';

const SKY_ART = require('../../../../assets/images/app/journal-sky-background.png');

/**
 * Full-screen cream sky. Cover-cropped so the sun and clouds stay in frame.
 */
export function JournalBackground() {
  const { width, height } = useWindowDimensions();
  const layout = getJournalSkyCoverLayout(width, height);

  return (
    <View
      style={styles.frame}
      accessibilityElementsHidden
      importantForAccessibility="no"
      pointerEvents="none"
    >
      <Image
        source={SKY_ART}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        style={[styles.image, layout]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
});
