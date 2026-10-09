import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { JournalMoodFace } from '@/features/reflect/components/JournalMoodFace';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { MOOD_LABELS } from '@/features/reflect/utils/journalHistory';
import type { JournalMood } from '@/features/reset/types';

const MOODS = [1, 2, 3, 4, 5] as const satisfies readonly JournalMood[];
/** Once a mood is picked, the others step back to this opacity. */
const UNPICKED_OPACITY = 0.5;
const RING_WIDTH = 3;

type JournalMoodRowProps = {
  value: JournalMood | undefined;
  onChange: (mood: JournalMood) => void;
};

/** Five tinted faces from awful to amazing; the chosen one gets a gold ring and a pop. */
export function JournalMoodRow({ value, onChange }: JournalMoodRowProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="mood">
      {MOODS.map((mood) => (
        <MoodChoice
          key={mood}
          mood={mood}
          selected={value === mood}
          dimmed={value !== undefined && value !== mood}
          onPress={() => onChange(mood)}
        />
      ))}
    </View>
  );
}

function MoodChoice({
  mood,
  selected,
  dimmed,
  onPress,
}: {
  mood: JournalMood;
  selected: boolean;
  dimmed: boolean;
  onPress: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const pop = useSharedValue(1);
  const wasSelected = useRef(selected);

  useEffect(() => {
    if (selected && !wasSelected.current && !reduceMotion) {
      pop.value = withSequence(
        withTiming(0.85, { duration: 70 }),
        withSpring(1, { damping: 9, stiffness: 320 }),
      );
    }
    wasSelected.current = selected;
  }, [pop, reduceMotion, selected]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={MOOD_LABELS[mood]}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.slot, dimmed ? styles.slotDimmed : null]}
    >
      <Animated.View style={[styles.ring, selected ? styles.ringSelected : null, popStyle]}>
        <JournalMoodFace mood={mood} />
      </Animated.View>
      <AppText
        variant={selected ? 'moodLabelSelected' : 'moodLabel'}
        color={selected ? 'primary' : 'secondary'}
        align="center"
        numberOfLines={1}
      >
        {capitalizeHeading(MOOD_LABELS[mood])}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slot: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget + spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  slotDimmed: {
    opacity: UNPICKED_OPACITY,
  },
  ring: {
    padding: RING_WIDTH,
    borderRadius: radius.pill,
    borderWidth: RING_WIDTH,
    borderColor: colors.overlay.clear,
  },
  ringSelected: {
    borderColor: colors.journal.moodRing,
  },
});
