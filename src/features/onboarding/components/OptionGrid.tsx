import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';

type OptionGridProps = {
  columns: 2 | 3;
  children: readonly ReactNode[];
};

export function OptionGrid({ columns, children }: OptionGridProps) {
  const rows: ReactNode[][] = [];
  for (let index = 0; index < children.length; index += columns) {
    rows.push(children.slice(index, index + columns));
  }

  return (
    <View style={styles.stack}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((child, childIndex) => (
            <View key={`cell-${rowIndex}-${childIndex}`} style={styles.cell}>
              {child}
            </View>
          ))}
          {Array.from({ length: columns - row.length }, (_, spacerIndex) => (
            <View key={`spacer-${rowIndex}-${spacerIndex}`} style={styles.cell} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
  },
});
