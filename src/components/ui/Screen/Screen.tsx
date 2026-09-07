import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/design-system';

type ScreenProps = {
  children: ReactNode;
  /**
   * When false, the bottom safe area is left to a tab bar or other chrome.
   */
  includeBottomSafeArea?: boolean;
  padded?: boolean;
  backgroundColor?: string;
  testID?: string;
};

export function Screen({
  children,
  includeBottomSafeArea = true,
  padded = true,
  backgroundColor = colors.background.primary,
  testID,
}: ScreenProps) {
  const edges: Edge[] = includeBottomSafeArea
    ? ['top', 'right', 'bottom', 'left']
    : ['top', 'right', 'left'];

  return (
    <SafeAreaView
      testID={testID}
      edges={edges}
      style={[styles.root, padded && styles.padded, { backgroundColor }]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});
