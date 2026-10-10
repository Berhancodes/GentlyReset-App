import { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  motion,
  radius,
  spacing,
} from '@/design-system';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { JournalSackMood } from '@/features/reflect/components/JournalSackMood';
import { JOURNAL_STARTERS } from '@/features/reflect/data/journalStarters';
import { useJournalDraftStore } from '@/features/reflect/store/useJournalDraftStore';
import type { JournalMood } from '@/features/reset/types';
import { hapticSuccess } from '@/utils/haptics';

/** "Draft saved" shows once typing pauses for this long. */
const DRAFT_SETTLE_MS = 700;
/** Ruled lines on the writing card. */
const LINE_HEIGHT = lineHeights.md + 2;
const WRITING_LINES = 4;
const TUCKED_HEIGHT = 130;
const TUCKED = STAGE_POSE_ART['tuck-note'];

type JournalTodayComposerProps = {
  day: number;
  onSave: (mood: JournalMood, text: string) => void;
  /** Lets the page hide its own mascot while he tucks the note away here. */
  onTuckedChange?: (tucked: boolean) => void;
};

/**
 * Today's entry: starter chips, a ruled card to write on, how heavy today was,
 * and Save. After saving he tucks the note away.
 */
export function JournalTodayComposer({ day, onSave, onTuckedChange }: JournalTodayComposerProps) {
  const reduceMotion = useReducedMotion();
  const draftDay = useJournalDraftStore((state) => state.day);
  const draftText = useJournalDraftStore((state) => state.text);
  const setDraft = useJournalDraftStore((state) => state.setDraft);
  const clearDraft = useJournalDraftStore((state) => state.clearDraft);
  // Pick up an unsaved draft from earlier today.
  const [entry, setEntry] = useState(draftDay === day ? draftText : '');
  const [mood, setMood] = useState<JournalMood | undefined>(undefined);
  const [typingSettled, setTypingSettled] = useState(true);
  const [justSaved, setJustSaved] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const words = entry.trim().split(/\s+/).filter(Boolean).length;
  const canSave = words > 0 && mood !== undefined;

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

  if (justSaved) {
    return (
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(motion.duration.stagePoseFade)}
        style={styles.tucked}
      >
        <View style={styles.bubble}>
          <Text style={styles.bubbleText} maxFontSizeMultiplier={1.2}>
            Tucked away. See you tomorrow.
          </Text>
          <View style={styles.bubbleTail} />
        </View>
        <Image
          source={TUCKED.source}
          resizeMode="contain"
          accessibilityLabel="He tucks your note away"
          style={{
            height: TUCKED_HEIGHT,
            width: (TUCKED.width / TUCKED.height) * TUCKED_HEIGHT,
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Write another entry"
          onPress={() => {
            setJustSaved(false);
            onTuckedChange?.(false);
          }}
          style={styles.again}
        >
          <Text style={styles.againLabel} maxFontSizeMultiplier={1.3}>
            Write another
          </Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.starters}>
        {JOURNAL_STARTERS.map((starter) => (
          <Pressable
            key={starter.label}
            accessibilityRole="button"
            accessibilityLabel={`Start with: ${starter.label}`}
            onPress={() => {
              const trimmed = entry.trimEnd();
              changeEntry(trimmed.length === 0 ? starter.text : `${trimmed}\n${starter.text}`);
              inputRef.current?.focus();
            }}
            style={({ pressed }) => [styles.chip, pressed ? styles.chipPressed : null]}
          >
            <Text style={styles.chipLabel} maxFontSizeMultiplier={1.3}>
              {starter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.rules} pointerEvents="none">
          {Array.from({ length: WRITING_LINES }, (_, index) => (
            <View key={index} style={styles.rule} />
          ))}
        </View>
        <TextInput
          ref={inputRef}
          testID="journal-input"
          accessibilityLabel="Journal entry"
          placeholder="Write anything…"
          placeholderTextColor={colors.stage.ctaDisabled}
          value={entry}
          onChangeText={changeEntry}
          multiline
          textAlignVertical="top"
          underlineColorAndroid={colors.overlay.clear}
          maxFontSizeMultiplier={1.15}
          style={styles.input}
        />
        {words > 0 ? (
          <Text style={styles.footer} maxFontSizeMultiplier={1.3}>
            {`${words} ${words === 1 ? 'word' : 'words'}${typingSettled ? ' · Draft saved' : ''}`}
          </Text>
        ) : null}
      </View>

      <JournalSackMood mood={mood} onChange={setMood} />

      <StageButton
        label="save entry"
        disabled={!canSave}
        onPress={() => {
          if (!canSave || mood === undefined) {
            return;
          }
          void hapticSuccess();
          onSave(mood, entry);
          setEntry('');
          setMood(undefined);
          clearDraft();
          setJustSaved(true);
          onTuckedChange?.(true);
        }}
      />
      {canSave ? null : (
        <Text style={styles.hint} maxFontSizeMultiplier={1.3}>
          {words === 0 ? 'Write a line, then slide to answer.' : 'Slide to answer, then save.'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  starters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  chip: {
    minHeight: spacing.hitTarget - spacing.xxs,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  chipPressed: {
    backgroundColor: colors.stage.chipSelected,
    transform: [{ scale: 0.96 }],
  },
  chipLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  card: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
    borderRadius: radius.card,
    backgroundColor: colors.stage.chip,
    gap: spacing.xs,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  rules: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  rule: {
    height: LINE_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.stage.track,
  },
  input: {
    minHeight: LINE_HEIGHT * WRITING_LINES,
    padding: 0,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    lineHeight: LINE_HEIGHT,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as const) : null),
  },
  footer: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
  },
  hint: {
    marginTop: -spacing.xs,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  tucked: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  bubble: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    backgroundColor: colors.stage.bubble,
  },
  bubbleText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -7,
    width: 14,
    height: 14,
    backgroundColor: colors.stage.bubble,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    transform: [{ rotate: '45deg' }],
  },
  again: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  againLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.heavy,
    color: colors.stage.ctaLink,
  },
});
