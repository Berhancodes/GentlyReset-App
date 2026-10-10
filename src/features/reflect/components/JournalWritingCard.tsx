import { useEffect, useState, type RefObject } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText, MascotIcon } from '@/components/ui';
import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { JOURNEY_SEASON_SCENES } from '@/features/journey/data/journeySeasonScenes';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';
import { JournalMoodRow } from '@/features/reflect/components/JournalMoodRow';
import { JOURNAL_STARTERS } from '@/features/reflect/data/journalStarters';
import type { JournalMood } from '@/features/reset/types';

const FOCUS_MS = 200;
/** How far the card lifts while you write. */
const FOCUS_LIFT = 2;
const RING_WIDTH = 1.5;
/** Seasonal piece tucked into the top-right corner. */
const CORNER_DECOR_SIZE = 26;

type JournalWritingCardProps = {
  value: string;
  onChangeText: (text: string) => void;
  mood: JournalMood | undefined;
  onChangeMood: (mood: JournalMood) => void;
  minHeight: number;
  season: JourneySeason;
  /** The text is safely kept as a draft (shown after a short pause in typing). */
  draftSaved: boolean;
  /** Lets the screen move focus into the text box. */
  inputRef?: RefObject<TextInput | null>;
};

export function JournalWritingCard({
  value,
  onChangeText,
  mood,
  onChangeMood,
  minHeight,
  season,
  draftSaved,
  inputRef,
}: JournalWritingCardProps) {
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  useEffect(() => {
    focus.value = withTiming(focused ? 1 : 0, { duration: reduceMotion ? 0 : FOCUS_MS });
  }, [focus, focused, reduceMotion]);

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [colors.overlay.clear, colors.journal.focusRing],
    ),
    transform: [{ translateY: -FOCUS_LIFT * focus.value }],
  }));

  const words = value.trim().split(/\s+/).filter(Boolean).length;

  const addStarter = (text: string) => {
    const trimmed = value.trimEnd();
    onChangeText(trimmed.length === 0 ? text : `${trimmed}\n${text}`);
    inputRef?.current?.focus();
  };

  return (
    <Animated.View style={[styles.card, { minHeight }, cardStyle]}>
      <CornerDecor season={season} />

      <View style={styles.starters}>
        {JOURNAL_STARTERS.map((starter) => (
          <Pressable
            key={starter.label}
            accessibilityRole="button"
            accessibilityLabel={`Start with: ${starter.label}`}
            onPress={() => addStarter(starter.text)}
            style={({ pressed }) => [styles.starter, pressed ? styles.starterPressed : null]}
          >
            <AppText variant="label" color="secondary">
              {starter.label}
            </AppText>
          </Pressable>
        ))}
      </View>

      <TextInput
        ref={inputRef}
        testID="journal-input"
        accessibilityLabel="journal entry"
        placeholder="Write anything..."
        placeholderTextColor={colors.text.helper}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        textAlignVertical="top"
        scrollEnabled
        underlineColorAndroid={colors.overlay.clear}
        allowFontScaling
        maxFontSizeMultiplier={1.15}
        style={styles.input}
      />

      <View style={styles.footer}>
        <AppText variant="label" color="helper">
          {words === 0 ? 'One line is enough.' : `${words} ${words === 1 ? 'word' : 'words'}`}
        </AppText>
        {draftSaved && words > 0 ? (
          <View style={styles.saved} accessibilityLabel="Draft saved">
            <MascotIcon name="checkCircle" size={14} />
            <AppText variant="label" color="helper">
              Draft saved
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.moodBlock}>
        <AppText variant="label" color="secondary">
          How are you feeling?
        </AppText>
        <JournalMoodRow value={mood} onChange={onChangeMood} />
      </View>
    </Animated.View>
  );
}

/** The season's leaf, petal or snowflake, resting in the card's top-right corner. */
function CornerDecor({ season }: { season: JourneySeason }) {
  const particles = JOURNEY_SEASON_SCENES[season].particles;
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.corner}
    >
      {particles.kind === 'snow' ? (
        <MascotIcon name="snow" size={CORNER_DECOR_SIZE * 0.8} color={colors.journeyShadow.cool} />
      ) : (
        <Image
          source={particles.source}
          style={{
            width: CORNER_DECOR_SIZE,
            height: CORNER_DECOR_SIZE * particles.aspect,
            transform: [{ rotate: '-24deg' }],
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    borderWidth: RING_WIDTH,
    backgroundColor: colors.journal.card,
    ...shadows.soft,
  },
  corner: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    opacity: 0.85,
  },
  starters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    // Leave the corner decoration its space.
    paddingRight: spacing.xl,
  },
  starter: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.journal.chip,
  },
  starterPressed: {
    opacity: 0.75,
  },
  input: {
    flexGrow: 1,
    minHeight: spacing.xxxl + spacing.xl,
    padding: 0,
    color: colors.text.primary,
    backgroundColor: colors.overlay.clear,
    ...textVariants.journalInput,
    borderWidth: 0,
    includeFontPadding: false,
    outlineWidth: 0,
    outlineColor: colors.overlay.clear,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  moodBlock: {
    gap: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.journal.divider,
  },
});
