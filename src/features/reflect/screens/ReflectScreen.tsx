import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText, MainTabHeader, PrimaryButton, Screen } from '@/components/ui';
import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { MoodSelector } from '@/features/reflect/components/MoodSelector';

export function ReflectScreen() {
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [entry, setEntry] = useState('');

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="journal" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="body" color="secondary">
          a space for your thoughts.
        </AppText>
        <View style={styles.card}>
          <AppText variant="optionTitle">how are you feeling today?</AppText>
          <MoodSelector value={mood} onChange={setMood} />
        </View>
        <TextInput
          accessibilityLabel="Journal entry"
          placeholder="write anything..."
          placeholderTextColor={colors.text.helper}
          value={entry}
          onChangeText={setEntry}
          multiline
          textAlignVertical="top"
          style={styles.composer}
        />
        <PrimaryButton label="save entry" onPress={() => undefined} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.soft,
  },
  composer: {
    minHeight: 140,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    ...textVariants.body,
  },
});
