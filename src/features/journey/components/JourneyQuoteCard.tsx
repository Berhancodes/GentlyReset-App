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
    alignSelf: 'center',
    width: '100%',
    maxWidth: 300,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.primary,
  },
});
