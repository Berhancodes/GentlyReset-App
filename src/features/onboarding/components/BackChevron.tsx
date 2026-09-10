import { StyleSheet, View } from 'react-native';

import { colors } from '@/design-system';

export function BackChevron({ tone = 'default' }: { tone?: 'default' | 'inverse' }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.glyph, tone === 'inverse' ? styles.inverse : null]}
    />
  );
}

const styles = StyleSheet.create({
  glyph: {
    width: 12,
    height: 12,
    borderLeftWidth: 2.4,
    borderBottomWidth: 2.4,
    borderColor: colors.text.primary,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  inverse: {
    borderColor: colors.text.inverse,
  },
});
