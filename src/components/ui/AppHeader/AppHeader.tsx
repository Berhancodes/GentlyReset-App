import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/Text';
import { colors, spacing } from '@/design-system';

const MASCOT_HEAD = require('../../../../assets/images/mascot/mascot-head.png');

const HEADER_ROW_HEIGHT = spacing.xxxl;
const MASCOT_SIZE = 40;
const MASCOT_LEFT = spacing.md;

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <Image
          source={MASCOT_HEAD}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.mascot}
        />
        <View style={styles.titleLayer}>
          <AppText variant="navTitle" align="center">
            {title}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.primary,
  },
  row: {
    height: HEADER_ROW_HEIGHT,
  },
  mascot: {
    position: 'absolute',
    left: MASCOT_LEFT,
    top: (HEADER_ROW_HEIGHT - MASCOT_SIZE) / 2,
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    zIndex: 1,
  },
  titleLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    pointerEvents: 'none',
  },
});
