import { useState } from 'react';
import { Image, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { getWorldCoverLayout } from '@/features/world/layout/worldHeroLayout';

const WORLD_FRIENDS_BACKGROUND = require('../../../../assets/images/app/world-friends-background.png');

type WorldBackgroundProps = {
  accessibilityLabel: string;
};

/**
 * Hero-only landscape. Cover-crops `world-friends-background.png` (never stretched)
 * so the two mascots on the log stay the focus with the tree left and cabin right.
 */
export function WorldBackground({ accessibilityLabel }: WorldBackgroundProps) {
  const [frame, setFrame] = useState({ width: 0, height: 0 });
  const cover = getWorldCoverLayout(frame.width, frame.height);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setFrame((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  };

  return (
    <View style={styles.frame} pointerEvents="none" onLayout={onLayout}>
      {frame.width > 0 && frame.height > 0 ? (
        <Image
          source={WORLD_FRIENDS_BACKGROUND}
          accessibilityLabel={accessibilityLabel}
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          style={[styles.image, cover]}
        />
      ) : null}
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
