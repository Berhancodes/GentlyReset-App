import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  AppText,
  getTabBarScenePadding,
  MainTabHeader,
  NoticeDialog,
  PrimaryButton,
  Screen,
} from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { JournalBackground } from '@/features/reflect/components/JournalBackground';
import { JournalHistoryModal } from '@/features/reflect/components/JournalHistoryModal';
import { JournalWritingCard } from '@/features/reflect/components/JournalWritingCard';
import { MoodPickerDialog } from '@/features/reflect/components/MoodPickerDialog';
import { RecentEntryCard } from '@/features/reflect/components/RecentEntryCard';
import { getJournalWritingCardMinHeight } from '@/features/reflect/layout/journalLayout';
import { latestReflection } from '@/features/reflect/utils/journalHistory';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getJournalPrompt } from '@/features/reset/utils/journalPrompt';
import { getCurrentResetTask } from '@/features/reset/utils/resetSelectors';
import type { JournalEntry, JournalMood } from '@/features/reset/types';

export function ReflectScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const writingMinHeight = getJournalWritingCardMinHeight(windowHeight);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [photoNoticeOpen, setPhotoNoticeOpen] = useState(false);

  const currentDay = useResetStore((state) => state.currentDay);
  const personalization = useResetStore((state) => state.personalization);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const reflections = useResetStore((state) => state.reflections);
  const saveReflection = useResetStore((state) => state.saveReflection);
  const todayTask = getCurrentResetTask({ currentDay, personalization, resetTypeId });
  const prompt = getJournalPrompt(todayTask.title, personalization, resetTypeId, currentDay);
  const savedToday = reflections.find((entry) => entry.day === currentDay);
  const recent = useMemo(() => latestReflection(reflections), [reflections]);

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor="transparent"
    >
      <JournalBackground />
      <MainTabHeader
        title="journal"
        transparent
        rightAction={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="journal history"
            onPress={() => setHistoryOpen(true)}
            style={styles.mapButton}
          >
            <Ionicons name="map-outline" size={24} color={colors.text.primary} />
          </Pressable>
        }
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          testID="journal-scroll"
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <AppText variant="journalHero" align="center">
              {"what's on\nyour mind?"}
            </AppText>
            <AppText variant="questionHelper" color="secondary" align="center">
              take a moment for yourself.
            </AppText>
          </View>

          <TodayComposer
            key={`${currentDay}-${savedToday?.savedAt ?? 'new'}`}
            minHeight={writingMinHeight}
            saved={savedToday}
            lastMood={latestReflection(reflections)?.mood}
            onSave={(mood, text) => saveReflection({ mood, text, prompt })}
            onPressPhoto={() => setPhotoNoticeOpen(true)}
          />

          <View style={styles.recent}>
            <View style={styles.recentHeader}>
              <AppText variant="caption" color="secondary">
                recent entry
              </AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="see all entries"
                onPress={() => setHistoryOpen(true)}
                hitSlop={spacing.xs}
                style={styles.seeAll}
              >
                <AppText variant="caption" color="secondary">
                  {'see all →'}
                </AppText>
              </Pressable>
            </View>
            {recent ? (
              <RecentEntryCard entry={recent} onPress={() => setHistoryOpen(true)} />
            ) : (
              <AppText variant="caption" color="helper">
                your thoughts will collect here.
              </AppText>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <JournalHistoryModal
        visible={historyOpen}
        entries={reflections}
        onClose={() => setHistoryOpen(false)}
      />
      <NoticeDialog
        visible={photoNoticeOpen}
        title="coming later"
        body="photos will land here in a future update — for now, words are enough."
        onClose={() => setPhotoNoticeOpen(false)}
      />
    </Screen>
  );
}

function TodayComposer({
  minHeight,
  saved,
  lastMood,
  onSave,
  onPressPhoto,
}: {
  minHeight: number;
  saved: JournalEntry | undefined;
  lastMood: JournalMood | undefined;
  onSave: (mood: JournalMood, text: string) => void;
  onPressPhoto: () => void;
}) {
  const [mood, setMood] = useState<JournalMood | undefined>(saved?.mood ?? lastMood);
  const [entry, setEntry] = useState(saved?.text ?? '');
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const trimmed = entry.trim();
  const isUnchanged = saved != null && mood === saved.mood && trimmed === saved.text;
  const canSave = trimmed.length > 0 && !isUnchanged;

  return (
    <View style={styles.composer}>
      <JournalWritingCard
        value={entry}
        onChangeText={setEntry}
        moodSelected={mood != null}
        minHeight={minHeight}
        onPressMood={() => setMoodPickerOpen(true)}
        onPressPhoto={onPressPhoto}
      />
      <PrimaryButton
        label="save entry"
        disabled={!canSave}
        haptic="success"
        onPress={() => {
          if (!mood) {
            setMoodPickerOpen(true);
            return;
          }
          onSave(mood, entry);
        }}
      />
      <MoodPickerDialog
        visible={moodPickerOpen}
        value={mood}
        onChange={setMood}
        onClose={() => setMoodPickerOpen(false)}
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
    paddingTop: spacing.xxs,
    gap: spacing.md,
  },
  hero: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxs,
  },
  composer: {
    gap: spacing.md,
  },
  recent: {
    gap: spacing.sm,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: spacing.hitTarget / 2,
  },
  seeAll: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
  },
  mapButton: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
