import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/Text';
import { colors, spacing } from '@/design-system';

const MASCOT_HEAD = require('../../../../assets/images/mascot/mascot-head.png');

const HEADER_CONTENT_HEIGHT = spacing.xxl;
const MASCOT_SIZE = 20;

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <View style={styles.titleWrap}>
          <AppText variant="navTitle" align="center">
            {title}
          </AppText>
        </View>
        <Image
          source={MASCOT_HEAD}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.mascot}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.primary,
  },
  bar: {
    height: HEADER_CONTENT_HEIGHT,
    justifyContent: 'center',
  },
  titleWrap: {
    width: '100%',
  },
  mascot: {
    position: 'absolute',
    left: spacing.md,
    top: (HEADER_CONTENT_HEIGHT - MASCOT_SIZE) / 2,
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
  },
});
