import type { ViewStyle } from 'react-native';

import { colors } from './colors';

export const shadows = {
  none: {} satisfies ViewStyle,
  soft: {
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  } satisfies ViewStyle,
  medium: {
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  } satisfies ViewStyle,
} as const;

export type Shadows = typeof shadows;
