import type { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/Text';
import { colors, spacing } from '@/design-system';

const MASCOT_HEAD = require('../../../../assets/images/mascot/mascot-head.png');

const HEADER_ROW_HEIGHT = spacing.xxl;
const MASCOT_SIZE = spacing.xl;

type MainTabHeaderProps = {
  title: string;
  showMascot?: boolean;
  rightAction?: ReactNode;
  transparent?: boolean;
};

export function MainTabHeader({
  title,
  showMascot = true,
  rightAction,
  transparent = false,
}: MainTabHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.root, { paddingTop: insets.top }, transparent ? styles.transparent : null]}
    >
      <View style={styles.row}>
        {showMascot ? (
          <Image
            source={MASCOT_HEAD}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={styles.mascot}
          />
        ) : (
          <View style={styles.mascotSlot} />
        )}
        <View style={styles.titleLayer} pointerEvents="none">
          <AppText variant="navTitle" align="center" numberOfLines={1}>
            {title}
          </AppText>
        </View>
        <View style={styles.rightSlot}>{rightAction}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.primary,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  row: {
    height: HEADER_ROW_HEIGHT,
    justifyContent: 'center',
  },
  mascot: {
    position: 'absolute',
    left: spacing.md,
    top: (HEADER_ROW_HEIGHT - MASCOT_SIZE) / 2,
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    zIndex: 1,
  },
  mascotSlot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
  },
  titleLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  rightSlot: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1,
  },
});
