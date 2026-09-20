import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

type JourneyQuoteCardProps = {
  quote: string;
};

export function JourneyQuoteCard({ quote }: JourneyQuoteCardProps) {
  return (
    <View accessibilityRole="text" accessibilityLabel={quote} style={styles.card}>
      <AppText variant="body" color="secondary" align="center">
        {quote}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderRadius: radius.quote,
    backgroundColor: colors.surface.quote,
  },
});
