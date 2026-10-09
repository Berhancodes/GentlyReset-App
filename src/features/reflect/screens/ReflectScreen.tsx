import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, getTabBarScenePadding, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { TactileButton } from '@/features/journey/components/JourneySheetMotion';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { getJourneySeason, type JourneySeason } from '@/features/journey/utils/getJourneySeason';
import { JournalEmptyState } from '@/features/reflect/components/JournalEmptyState';
import { JournalHistoryModal } from '@/features/reflect/components/JournalHistoryModal';
import { JournalSeasonHero } from '@/features/reflect/components/JournalSeasonHero';
import { JournalWritingCard } from '@/features/reflect/components/JournalWritingCard';
import { MoodPickerDialog } from '@/features/reflect/components/MoodPickerDialog';
import { RecentEntryCard } from '@/features/reflect/components/RecentEntryCard';
import { JOURNAL_HERO_BY_SEASON } from '@/features/reflect/data/journalSeasonArt';
import { getJournalWritingCardMinHeight } from '@/features/reflect/layout/journalLayout';
import { useJournalDraftStore } from '@/features/reflect/store/useJournalDraftStore';
import { latestReflection } from '@/features/reflect/utils/journalHistory';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getJournalPrompt } from '@/features/reset/utils/journalPrompt';
import { getCurrentResetTask } from '@/features/reset/utils/resetSelectors';
import type { JournalEntry, JournalMood } from '@/features/reset/types';
import { hapticSuccess } from '@/utils/haptics';

/** The writing card is a little shorter than the old notebook so the page fits like the mockup. */
const WRITING_CARD_SCALE = 0.85;
/** Scroll distance after which the header gets its cream background. */
const SCROLLED_PAST = 8;
/** How far the heading tucks up into the fading bottom of the scenery. */
const HERO_OVERLAP = 0.12;

export function ReflectScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const writingMinHeight = Math.round(
    getJournalWritingCardMinHeight(windowHeight) * WRITING_CARD_SCALE,
  );
  const [historyOpen, setHistoryOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  // Once the page scrolls, the floating header fills in so it never sits on top of text.
  const [scrolled, setScrolled] = useState(false);

  const devSeason = useJourneyVisualStore((state) => state.devSeason);
  const season = devSeason ?? getJourneySeason(new Date());
  const heroArt = JOURNAL_HERO_BY_SEASON[season];
  const heroHeight = windowWidth * (heroArt.height / heroArt.width);
  // Scenery strips fade under the heading; illustrated bands sit above it.
  const contentOffset = heroArt.kind === 'scenery' ? -heroHeight * HERO_OVERLAP : spacing.sm;
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
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          testID="journal-scroll"
          style={styles.flex}
          contentContainerStyle={{
            paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={32}
          onScroll={(event) => {
            const next = event.nativeEvent.contentOffset.y > SCROLLED_PAST;
            if (next !== scrolled) {
              setScrolled(next);
            }
          }}
        >
          <JournalSeasonHero season={season} headerHeight={headerHeight} />

          <View style={[styles.content, { marginTop: contentOffset }]}>
            <View style={styles.heading}>
              <AppText variant="profileName">What&apos;s on your mind?</AppText>
              <AppText variant="body" color="secondary">
                {prompt}
              </AppText>
            </View>

            <TodayComposer
              key={currentDay}
              day={currentDay}
              season={season}
              minHeight={writingMinHeight}
              saved={savedToday}
              lastMood={latestReflection(reflections)?.mood}
              onSave={(mood, text) => saveReflection({ mood, text, prompt })}
            />

            <View style={styles.recent}>
              <View style={styles.recentHeader}>
                <AppText variant="optionTitle">Recent entries</AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="see all entries"
                  onPress={() => setHistoryOpen(true)}
                  hitSlop={spacing.xs}
                  style={styles.seeAll}
                >
                  <AppText variant="caption" color="secondary">
                    {'See all →'}
                  </AppText>
                </Pressable>
              </View>
              {recent ? (
                <RecentEntryCard entry={recent} onPress={() => setHistoryOpen(true)} />
              ) : (
                <JournalEmptyState season={season} />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floats over the scenery so the painting reaches the top edge. */}
      <View
        style={styles.header}
        pointerEvents="box-none"
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <MainTabHeader title="journal" transparent={!scrolled} />
      </View>

      <JournalHistoryModal
        visible={historyOpen}
        entries={reflections}
        onClose={() => setHistoryOpen(false)}
      />
    </Screen>
  );
}

/** "Draft saved" shows once typing pauses for this long. */
const DRAFT_SETTLE_MS = 700;

function TodayComposer({
  day,
  season,
  minHeight,
  saved,
  lastMood,
  onSave,
}: {
  day: number;
  season: JourneySeason;
  minHeight: number;
  saved: JournalEntry | undefined;
  lastMood: JournalMood | undefined;
  onSave: (mood: JournalMood, text: string) => void;
}) {
  const draftDay = useJournalDraftStore((state) => state.day);
  const draftText = useJournalDraftStore((state) => state.text);
  const setDraft = useJournalDraftStore((state) => state.setDraft);
  const clearDraft = useJournalDraftStore((state) => state.clearDraft);
  const [mood, setMood] = useState<JournalMood | undefined>(saved?.mood ?? lastMood);
  // Pick up an unsaved draft from earlier today.
  const [entry, setEntry] = useState(draftDay === day ? draftText : '');
  const [typingSettled, setTypingSettled] = useState(true);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const canSave = entry.trim().length > 0;

  useEffect(() => {
    if (typingSettled) {
      return;
    }
    const timer = setTimeout(() => setTypingSettled(true), DRAFT_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [entry, typingSettled]);

  const changeEntry = (text: string) => {
    setEntry(text);
    setDraft(day, text);
    setTypingSettled(false);
  };

  return (
    <View style={styles.composer}>
      <JournalWritingCard
        value={entry}
        onChangeText={changeEntry}
        mood={mood}
        onChangeMood={setMood}
        minHeight={minHeight}
        season={season}
        draftSaved={typingSettled}
        inputRef={inputRef}
      />
      <TactileButton
        accessibilityLabel="Save entry"
        accessibilityHint={canSave ? undefined : 'Write something first'}
        celebrate={false}
        onPress={() => {
          if (!canSave) {
            // Nothing to save yet: take them to the page instead of a dead button.
            inputRef.current?.focus();
            return;
          }
          if (!mood) {
            setMoodPickerOpen(true);
            return;
          }
          void hapticSuccess();
          onSave(mood, entry);
          setEntry('');
          clearDraft();
        }}
      >
        <AppText variant="button" color="inverse" align="center">
          Save entry
        </AppText>
      </TactileButton>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
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
    paddingHorizontal: spacing.xs,
  },
  seeAll: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
  },
});
