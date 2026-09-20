import type { ReactNode } from 'react';
import { Image, Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/design-system';

const MASCOT_HEAD = require('../../../../assets/images/mascot/mascot-head.png');

const MASCOT_CIRCLE_SIZE = spacing.hitTarget;
const MASCOT_ART_SIZE = spacing.xl;
const HEADER_ROW_HEIGHT = MASCOT_CIRCLE_SIZE + spacing.xs;

/**
 * Soft cream wash behind the header only. Uses React Native's built-in
 * `experimental_backgroundImage` on native and CSS `backgroundImage` on web —
 * no extra gradient package.
 */
const HEADER_FADE_GRADIENT = `linear-gradient(to bottom, ${colors.overlay.headerFadeStart} 0%, ${colors.overlay.headerFadeMid} 58%, ${colors.overlay.headerFadeEnd} 100%)`;

type WebViewStyle = ViewStyle & {
  backgroundImage?: string;
};

type MainTabHeaderProps = {
  title: string;
  subtitle?: string;
  showMascot?: boolean;
  rightAction?: ReactNode;
  transparent?: boolean;
  fade?: boolean;
  /**
   * Extra top padding for cream tab screens (Journey) without shifting
   * Home / World illustrated headers that sit on a cover image.
   */
  contentSpacing?: 'default' | 'roomy';
};

export function MainTabHeader({
  title,
  subtitle,
  showMascot = true,
  rightAction,
  transparent = false,
  fade = false,
  contentSpacing = 'default',
}: MainTabHeaderProps) {
  const insets = useSafeAreaInsets();
  const roomy = contentSpacing === 'roomy';

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + (roomy ? spacing.sm : spacing.xxs),
          paddingBottom: roomy ? spacing.xs : spacing.none,
        },
        transparent || fade ? styles.transparent : null,
      ]}
    >
      {fade ? <HeaderReadabilityFade /> : null}
      <View style={styles.row}>
        {showMascot ? (
          <View
            style={styles.mascotAnchor}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            <View style={styles.mascotCircle}>
              <Image
                source={MASCOT_HEAD}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
                style={styles.mascot}
              />
            </View>
          </View>
        ) : (
          <View style={styles.mascotAnchor} />
        )}
        <View style={styles.titleLayer} pointerEvents="none">
          <AppText variant="navTitle" color="primary" align="center" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              variant="tabHeaderSubtitle"
              color="secondaryStrong"
              align="center"
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <View style={styles.rightSlot}>{rightAction}</View>
      </View>
    </View>
  );
}

function HeaderReadabilityFade() {
  return <View pointerEvents="none" style={headerFadeStyle()} />;
}

function headerFadeStyle(): WebViewStyle {
  const fill: WebViewStyle = {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  };

  if (Platform.OS === 'web') {
    return {
      ...fill,
      backgroundImage: HEADER_FADE_GRADIENT,
    };
  }

  return {
    ...fill,
    experimental_backgroundImage: HEADER_FADE_GRADIENT,
  };
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.primary,
    zIndex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  row: {
    height: HEADER_ROW_HEIGHT,
    justifyContent: 'center',
  },
  mascotAnchor: {
    position: 'absolute',
    left: spacing.md,
    top: 0,
    bottom: 0,
    width: MASCOT_CIRCLE_SIZE,
    justifyContent: 'center',
    zIndex: 1,
  },
  mascotCircle: {
    width: MASCOT_CIRCLE_SIZE,
    height: MASCOT_CIRCLE_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.whisper,
  },
  mascot: {
    width: MASCOT_ART_SIZE,
    height: MASCOT_ART_SIZE,
  },
  titleLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  rightSlot: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    minWidth: spacing.hitTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1,
  },
});
