import { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { JournalNotebook } from '@/features/reflect/components/JournalNotebook';
import { MoodSelector } from '@/features/reflect/components/MoodSelector';
import { RecentReflectionList } from '@/features/reflect/components/RecentReflectionList';
import { WeekMoodRow } from '@/features/reflect/components/WeekMoodRow';
import {
  JOURNAL_LEAVES_ART,
  JOURNAL_LEAVES_LAYOUT,
  toPercent,
} from '@/features/reflect/layout/notebookLayout';
import {
  formatJournalHeadingDate,
  moodForDate,
  recentReflections,
  thisWeekDates,
} from '@/features/reflect/utils/journalHistory';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getJournalPrompt } from '@/features/reset/utils/journalPrompt';
import type { JournalEntry, JournalMood } from '@/features/reset/types';

const LEAVES_ART = require('../../../../assets/images/app/journal-leaves.png');

export function ReflectScreen() {
  useSyncResetDay();
  const currentDay = useResetStore((state) => state.currentDay);
  const personalization = useResetStore((state) => state.personalization);
  const todayTask = useResetStore((state) => state.todayTask);
  const reflections = useResetStore((state) => state.reflections);
  const saveReflection = useResetStore((state) => state.saveReflection);
  const prompt = getJournalPrompt(todayTask.title, personalization);
  const savedToday = reflections.find((entry) => entry.day === currentDay);
  const week = useMemo(() => thisWeekDates(), []);
  const recent = useMemo(() => recentReflections(reflections), [reflections]);

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <Image
        source={LEAVES_ART}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        accessibilityIgnoresInvertColors
        style={[
          styles.leaves,
          {
            width: toPercent(JOURNAL_LEAVES_LAYOUT.width),
            top: toPercent(JOURNAL_LEAVES_LAYOUT.top),
            right: toPercent(JOURNAL_LEAVES_LAYOUT.right),
            aspectRatio: JOURNAL_LEAVES_ART.width / JOURNAL_LEAVES_ART.height,
          },
        ]}
      />
      <MainTabHeader title="journal" subtitle="a calmer you, one entry at a time." />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <TodayComposer
            key={`${currentDay}-${savedToday?.savedAt ?? 'new'}`}
            dateLabel={formatJournalHeadingDate()}
            prompt={prompt}
            saved={savedToday}
            onSave={(mood, text) => saveReflection({ mood, text, prompt })}
          />

          <View style={styles.section}>
            <AppText variant="optionTitle">your week</AppText>
            <WeekMoodRow week={week} moodForDate={(dateKey) => moodForDate(reflections, dateKey)} />
          </View>

          <View style={styles.section}>
            <AppText variant="optionTitle">recent reflections</AppText>
            <RecentReflectionList entries={recent} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function TodayComposer({
  dateLabel,
  prompt,
  saved,
  onSave,
}: {
  dateLabel: string;
  prompt: string;
  saved: JournalEntry | undefined;
  onSave: (mood: JournalMood, text: string) => void;
}) {
  const [mood, setMood] = useState<JournalMood | undefined>(saved?.mood);
  const [entry, setEntry] = useState(saved?.text ?? '');
  const trimmed = entry.trim();
  const isUnchanged = saved != null && mood === saved.mood && trimmed === saved.text;
  const canSave = Boolean(mood) && trimmed.length > 0 && !isUnchanged;
  const showSaved = saved != null && isUnchanged;

  return (
    <View style={styles.composer}>
      <View style={styles.moodBlock}>
        <AppText variant="optionTitle">how are you feeling today?</AppText>
        <MoodSelector value={mood} onChange={setMood} />
      </View>

      <JournalNotebook
        dateLabel={dateLabel}
        heading="today's thought"
        prompt={prompt}
        value={entry}
        onChangeText={setEntry}
        canSave={canSave}
        showSaved={showSaved}
        onSave={() => {
          if (!mood) {
            return;
          }
          onSave(mood, entry);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  composer: {
    gap: spacing.lg,
  },
  moodBlock: {
    gap: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  leaves: {
    position: 'absolute',
    zIndex: 2,
    opacity: 0.92,
    pointerEvents: 'none',
  },
});
