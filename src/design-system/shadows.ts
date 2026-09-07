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
  soft: createShadow(6, 0.08, 16, 3),
  medium: createShadow(8, 0.12, 20, 5),
} as const;

export type Shadows = typeof shadows;
