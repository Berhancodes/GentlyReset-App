import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';

type JourneyQuoteCardProps = {
  quote: string;
};

export function JourneyQuoteCard({ quote }: JourneyQuoteCardProps) {
  return (
    <View accessibilityRole="text" accessibilityLabel={quote} style={styles.card}>
      <AppText variant="caption" color="secondary" align="center">
        {quote}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    maxWidth: 280,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.whisper,
  },
});
