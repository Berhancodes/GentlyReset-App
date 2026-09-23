import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import type { AppTextColor } from '@/components/ui/Text';
import { spacing, type TextVariant } from '@/design-system';
import {
  type TypewriterLine,
  useStagedTypewriter,
} from '@/features/onboarding/hooks/useStagedTypewriter';

export type StoryCopyLine = TypewriterLine & {
  color: AppTextColor;
  variant: TextVariant;
};

type StoryCopyProps = {
  lines: readonly StoryCopyLine[];
};

export function StoryCopy({ lines }: StoryCopyProps) {
  const signature = lines.map((line) => `${line.id}:${line.text}`).join('\n');

  return <TypedStoryCopy key={signature} lines={lines} />;
}

function TypedStoryCopy({ lines }: StoryCopyProps) {
  const { revealRemaining, visibleText } = useStagedTypewriter(lines);
  const spoken = lines.map((line) => line.text).join(' ');

  return (
    <Pressable
      accessibilityRole="text"
      accessibilityLabel={spoken}
      accessibilityHint="Reveals the rest of this message"
      onPress={revealRemaining}
    >
      <View style={styles.stack}>
        {lines.map((line, index) => (
          <View key={line.id} style={styles.line}>
            <View accessibilityElementsHidden importantForAccessibility="no" style={styles.reserve}>
              <AppText variant={line.variant} color={line.color}>
                {line.text}
              </AppText>
            </View>
            <View accessibilityElementsHidden importantForAccessibility="no" style={styles.typed}>
              <AppText variant={line.variant} color={line.color}>
                {visibleText(index)}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  line: {
    position: 'relative',
  },
  reserve: {
    opacity: 0,
  },
  typed: {
    ...StyleSheet.absoluteFill,
  },
});
