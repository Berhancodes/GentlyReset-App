import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText, MainTabHeader, PrimaryButton, Screen } from '@/components/ui';
import { colors, radius, spacing, textVariants } from '@/design-system';
import { MoodSelector } from '@/features/reflect/components/MoodSelector';
import {
  MOOD_LABELS,
  moodForDate,
  recentReflections,
  thisWeekDates,
  weekdayLetter,
} from '@/features/reflect/utils/journalHistory';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { toLocalDateKey } from '@/features/reset/utils/calendar';
import { getJournalPrompt } from '@/features/reset/utils/journalPrompt';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';
import type { JournalEntry, JournalMood } from '@/features/reset/types';

export function ReflectScreen() {
  useSyncResetDay();
  const currentDay = useResetStore((state) => state.currentDay);
  const personalization = useResetStore((state) => state.personalization);
  const reflections = useResetStore((state) => state.reflections);
  const saveReflection = useResetStore((state) => state.saveReflection);
  const task = getTaskForDay(currentDay, personalization);
  const prompt = getJournalPrompt(task.title, personalization);
  const savedToday = reflections.find((entry) => entry.day === currentDay);
  const week = useMemo(() => thisWeekDates(), []);
  const recent = useMemo(() => recentReflections(reflections), [reflections]);

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="journal" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TodayComposer
          key={`${currentDay}-${savedToday?.savedAt ?? 'new'}`}
          prompt={prompt}
          saved={savedToday}
          onSave={(mood, text) => saveReflection({ mood, text, prompt })}
        />

        <View style={styles.section}>
          <AppText variant="optionTitle">this week</AppText>
          <View style={styles.weekRow}>
            {week.map((dateKey) => {
              const weekMood = moodForDate(reflections, dateKey);
              const isToday = dateKey === toLocalDateKey(new Date());
              return (
                <View key={dateKey} style={styles.weekSlot}>
                  <AppText variant="label" color={isToday ? 'primary' : 'helper'} align="center">
                    {weekdayLetter(dateKey)}
                  </AppText>
                  <View
                    style={[styles.weekDot, weekMood ? styles.weekDotFilled : null]}
                    accessibilityLabel={
                      weekMood
                        ? `${weekdayLetter(dateKey)}, ${MOOD_LABELS[weekMood]}`
                        : `${weekdayLetter(dateKey)}, no reflection`
                    }
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="optionTitle">recent</AppText>
          {recent.length === 0 ? (
            <AppText variant="caption" color="helper">
              saved reflections will show up here.
            </AppText>
          ) : (
            recent.map((item) => (
              <View key={`${item.day}-${item.savedAt}`} style={styles.recentRow}>
                <AppText variant="label" color="helper">
                  {`day ${item.day} · ${MOOD_LABELS[item.mood]}`}
                </AppText>
                <AppText variant="body" numberOfLines={2}>
                  {item.text}
                </AppText>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function TodayComposer({
  prompt,
  saved,
  onSave,
}: {
  prompt: string;
  saved: JournalEntry | undefined;
  onSave: (mood: JournalMood, text: string) => void;
}) {
  const [mood, setMood] = useState<JournalMood | undefined>(saved?.mood);
  const [entry, setEntry] = useState(saved?.text ?? '');
  const canSave = Boolean(mood) && entry.trim().length > 0;

  return (
    <>
      <View style={styles.card}>
        <AppText variant="optionTitle">how are you feeling?</AppText>
        <MoodSelector value={mood} onChange={setMood} />
      </View>

      <View style={styles.card}>
        <AppText variant="label" color="helper">
          {"today's prompt"}
        </AppText>
        <AppText variant="body" color="secondary">
          {prompt}
        </AppText>
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
      </View>

      <PrimaryButton
        label={saved ? 'update reflection' : 'save reflection'}
        disabled={!canSave}
        onPress={() => {
          if (!mood) {
            return;
          }
          onSave(mood, entry);
        }}
      />
    </>
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
  },
  composer: {
    minHeight: 140,
    borderRadius: radius.lg,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    ...textVariants.body,
  },
  section: {
    gap: spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekSlot: {
    alignItems: 'center',
    gap: spacing.xxs,
    minWidth: 28,
  },
  weekDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.choice,
  },
  weekDotFilled: {
    backgroundColor: colors.action.primaryBackground,
    borderColor: colors.action.primaryBackground,
  },
  recentRow: {
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
  },
});
