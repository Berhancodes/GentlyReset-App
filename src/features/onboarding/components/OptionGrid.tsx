import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';

type OptionGridProps = {
  columns: 2 | 3;
  compact?: boolean;
  children: readonly ReactNode[];
};

export function OptionGrid({ columns, compact = false, children }: OptionGridProps) {
  const rows: ReactNode[][] = [];
  for (let index = 0; index < children.length; index += columns) {
    rows.push(children.slice(index, index + columns));
  }

  return (
    <View style={[styles.stack, compact ? styles.stackCompact : null]}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.row, compact ? styles.rowCompact : null]}>
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
  stackCompact: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  rowCompact: {
    gap: spacing.xs,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
});
