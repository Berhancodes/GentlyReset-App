import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { MOOD_LABELS } from '@/features/reflect/utils/journalHistory';
import type { JournalMood } from '@/features/reset/types';

type MoodFaceProps = {
  mood: JournalMood;
  selected: boolean;
  size?: number;
  /** Fill and face color; defaults to the neutral cream face. */
  tint?: { well: string; ink: string };
};

export function MoodFace({ mood, selected, size = spacing.hitTarget, tint }: MoodFaceProps) {
  const isFrown = mood <= 2;
  const isNeutral = mood === 3;
  const scale = size / spacing.hitTarget;
  const mouthWidth = (mood === 1 || mood === 5 ? 16 : 12) * scale;
  const eye = Math.max(4, Math.round(6 * scale));

  return (
    <View
      style={[
        styles.face,
        selected ? styles.faceSelected : styles.faceIdle,
        tint ? { backgroundColor: tint.well, borderColor: selected ? undefined : tint.well } : null,
        {
          width: size,
          height: size,
          gap: Math.max(3, Math.round(4 * scale)),
        },
      ]}
    >
      <View style={[styles.eyeRow, { gap: Math.max(5, Math.round(8 * scale)) }]}>
        <View
          style={[
            styles.eye,
            { width: eye, height: eye },
            tint ? { backgroundColor: tint.ink } : null,
          ]}
        />
        <View
          style={[
            styles.eye,
            { width: eye, height: eye },
            tint ? { backgroundColor: tint.ink } : null,
          ]}
        />
      </View>
      {isNeutral ? (
        <View
          style={[
            styles.neutralMouth,
            {
              width: Math.max(8, Math.round(10 * scale)),
              height: Math.max(2, Math.round(2 * scale)),
              marginTop: Math.max(2, Math.round(4 * scale)),
            },
            tint ? { backgroundColor: tint.ink } : null,
          ]}
        />
      ) : (
        <View
          style={[
            styles.curveMouth,
            {
              width: mouthWidth,
              height: Math.max(6, Math.round(8 * scale)),
              transform: [{ rotate: isFrown ? '180deg' : '0deg' }],
            },
            tint ? { borderColor: tint.ink } : null,
          ]}
        />
      )}
    </View>
  );
}

type MoodSelectorProps = {
  value: JournalMood | undefined;
  onChange: (mood: JournalMood) => void;
};

const MOODS = [1, 2, 3, 4, 5] as const satisfies readonly JournalMood[];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {MOODS.map((mood) => {
        const selected = value === mood;
        const label = MOOD_LABELS[mood];
        return (
          <Pressable
            key={mood}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            onPress={() => onChange(mood)}
            style={styles.slot}
          >
            <MoodFace mood={mood} selected={selected} />
            <AppText
              variant={selected ? 'moodLabelSelected' : 'moodLabel'}
              color={selected ? 'primary' : 'helper'}
              align="center"
              numberOfLines={1}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  slot: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.xxs,
    paddingVertical: spacing.xxs,
  },
  face: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderWidth: 2,
  },
  faceIdle: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.background.secondary,
  },
  faceSelected: {
    backgroundColor: colors.surface.choiceSelected,
    borderColor: colors.border.gold,
    ...shadows.whisper,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
  curveMouth: {
    height: 8,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.text.primary,
    borderBottomLeftRadius: spacing.xs,
    borderBottomRightRadius: spacing.xs,
    marginTop: 2,
  },
  neutralMouth: {
    width: 10,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
    marginTop: spacing.xxs,
    opacity: 0.7,
  },
});
