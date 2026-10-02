import { useRef, useState } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/design-system';
import { PAYWALL_MASCOT_ART } from '@/features/onboarding/data/onboardingAssets';

const ART_WIDTH = 854;
const ART_HEIGHT = 472;

/**
 * Full-bleed rest scene between the plans and the unlock button.
 * Sized to the artwork’s aspect ratio so web cannot stretch or clip the right edge.
 */
export function PaywallRestMascot() {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const lastHeight = useRef(0);
  const [slotHeight, setSlotHeight] = useState(0);

  const widthScale = windowWidth / ART_WIDTH;
  const heightScale = slotHeight > 0 ? slotHeight / ART_HEIGHT : widthScale;
  const scale = Math.min(widthScale, heightScale);
  const artWidth = Math.round(ART_WIDTH * scale);
  const artHeight = Math.round(ART_HEIGHT * scale);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      onLayout={(event) => {
        const nextHeight = Math.round(event.nativeEvent.layout.height);
        if (nextHeight !== lastHeight.current) {
          lastHeight.current = nextHeight;
          setSlotHeight(nextHeight);
        }
      }}
      style={[
        styles.wrap,
        {
          width: windowWidth,
          marginLeft: -(spacing.lg + insets.left),
        },
      ]}
    >
      {artHeight > 0 ? (
        <Image
          source={PAYWALL_MASCOT_ART}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: artWidth, height: artHeight }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
});
