import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarScenePadding, Screen } from '@/components/ui';
import { colors, fontSizes, lineHeights, spacing, textVariants } from '@/design-system';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { JournalHistoryModal } from '@/features/reflect/components/JournalHistoryModal';
import { JournalRecentList } from '@/features/reflect/components/JournalRecentList';
import { JournalTodayComposer } from '@/features/reflect/components/JournalTodayComposer';
import {
  formatJournalHeadingDate,
  recentReflections,
} from '@/features/reflect/utils/journalHistory';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getJournalPrompt } from '@/features/reset/utils/journalPrompt';
import { getCurrentResetTask } from '@/features/reset/utils/resetSelectors';

const THINKING = STAGE_POSE_ART['react-thinking'];
const THINKING_HEIGHT = 88;

/**
 * The journal, built like an onboarding question: today's date, him thinking,
 * the day's question, one line to write, how heavy today was, and Save.
 */
export function ReflectScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [tucked, setTucked] = useState(false);
  const currentDay = useResetStore((state) => state.currentDay);
  const personalization = useResetStore((state) => state.personalization);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const reflections = useResetStore((state) => state.reflections);
  const saveReflection = useResetStore((state) => state.saveReflection);
  const todayTask = getCurrentResetTask({ currentDay, personalization, resetTypeId });
  const prompt = getJournalPrompt(todayTask.title, personalization, resetTypeId, currentDay);
  const recent = useMemo(() => recentReflections(reflections, 3), [reflections]);

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.stage.floor}
    >
      <StageBackdrop />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          testID="journal-scroll"
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top + spacing.md,
              paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.lg,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
            {`${formatJournalHeadingDate()} · Day ${currentDay}`}
          </Text>
          {tucked ? null : (
            <Image
              source={THINKING.source}
              resizeMode="contain"
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={[
                styles.thinking,
                {
                  height: THINKING_HEIGHT,
                  width: (THINKING.width / THINKING.height) * THINKING_HEIGHT,
                },
              ]}
            />
          )}
          <View style={styles.question} accessibilityRole="header">
            <Text style={styles.title} maxFontSizeMultiplier={1.25}>
              {capitalizeHeading(prompt)}
            </Text>
            <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
              One line is enough.
            </Text>
          </View>

          <JournalTodayComposer
            key={currentDay}
            day={currentDay}
            onSave={(mood, text) => saveReflection({ mood, text, prompt })}
            onTuckedChange={setTucked}
          />

          <JournalRecentList entries={recent} onSeeAll={() => setHistoryOpen(true)} />
        </ScrollView>
      </KeyboardAvoidingView>

      <JournalHistoryModal
        visible={historyOpen}
        entries={reflections}
        onClose={() => setHistoryOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  thinking: {
    alignSelf: 'center',
    marginVertical: -spacing.xs,
  },
  question: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textVariants.stageTitle,
    fontSize: fontSizes.lg + 1,
    lineHeight: lineHeights.lg,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
});
