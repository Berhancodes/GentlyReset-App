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
  /** The onboarding intro's soft speech-bubble shadow. */
  onboardingBubble:
    Platform.OS === 'web'
      ? ({
          boxShadow: '0 5px 12px rgba(0, 0, 0, 0.06)',
        } satisfies ViewStyle)
      : ({
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 2,
        } satisfies ViewStyle),
  /** A crisp blush "sticker" shadow under Home's speech bubble. */
  homeBubble:
    Platform.OS === 'web'
      ? ({
          boxShadow: '0 4px 0 #F6B7A8',
        } satisfies ViewStyle)
      : ({
          shadowColor: '#F6B7A8',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 2,
        } satisfies ViewStyle),
  /** The unlock screens' white cards: a crisp blush sticker edge. */
  unlockSticker:
    Platform.OS === 'web'
      ? ({
          boxShadow: `0 4px 0 ${colors.unlock.stickerShadow}`,
        } satisfies ViewStyle)
      : ({
          shadowColor: colors.unlock.stickerShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 2,
        } satisfies ViewStyle),
  /** Journey's day-complete sticker: a deeper blush sticker edge. */
  celebrationSticker:
    Platform.OS === 'web'
      ? ({
          boxShadow: `0 6px 0 ${colors.celebration.shadow}`,
        } satisfies ViewStyle)
      : ({
          shadowColor: colors.celebration.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 3,
        } satisfies ViewStyle),
  soft: createShadow(6, 0.08, 16, 3),
  medium: createShadow(8, 0.12, 20, 5),
  button: createShadow(5, 0.26, 12, 5),
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
