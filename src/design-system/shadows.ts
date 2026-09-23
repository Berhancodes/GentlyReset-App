import { Platform, type ViewStyle } from 'react-native';

import { colors } from './colors';

/**
 * iOS uses native shadow props. Web uses boxShadow because RN Web deprecates shadow*.
 */
function createShadow(
  offsetY: number,
  opacity: number,
  blur: number,
  elevation: number,
): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0 ${offsetY}px ${blur}px rgba(74, 44, 24, ${opacity})`,
    };
  }

  return {
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation,
  };
}

export const shadows = {
  none: {} satisfies ViewStyle,
  whisper: createShadow(2, 0.07, 8, 2),
  soft: createShadow(6, 0.08, 16, 3),
  medium: createShadow(8, 0.12, 20, 5),
  mascotGlow:
    Platform.OS === 'web'
      ? ({
          boxShadow: `0 0 36px 14px ${colors.overlay.mascotGlow}, 0 0 64px 22px ${colors.overlay.mascotGlowCore}`,
        } satisfies ViewStyle)
      : ({
          shadowColor: colors.accent.gold,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 28,
          elevation: 0,
        } satisfies ViewStyle),
} as const;

export type Shadows = typeof shadows;
