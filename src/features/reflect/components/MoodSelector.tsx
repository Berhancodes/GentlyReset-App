import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/design-system';

type MoodFaceProps = {
  mood: 1 | 2 | 3 | 4 | 5;
  selected: boolean;
};

export function MoodFace({ mood, selected }: MoodFaceProps) {
  const eyeHeight = mood <= 2 ? 5 : mood >= 5 ? 8 : 6;
  const mouthWidth = mood <= 2 ? 10 : 14;

  return (
    <View style={[styles.face, selected ? styles.faceSelected : styles.faceIdle]}>
      <View style={styles.eyeRow}>
        <View style={[styles.eye, { height: eyeHeight }]} />
        <View style={[styles.eye, { height: eyeHeight }]} />
      </View>
      <View
        style={[
          styles.mouth,
          {
            width: mouthWidth,
            transform: [{ scaleY: mood <= 2 ? -1 : 1 }],
            opacity: mood === 3 ? 0.35 : 0.7,
          },
        ]}
      />
    </View>
  );
}

type MoodSelectorProps = {
  value: number | undefined;
  onChange: (mood: 1 | 2 | 3 | 4 | 5) => void;
};

const MOODS = [1, 2, 3, 4, 5] as const;

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <View style={styles.row}>
      {MOODS.map((mood) => {
        const selected = value === mood;
        return (
          <Pressable
            key={mood}
            accessibilityRole="button"
            accessibilityLabel={`Mood ${mood}`}
            accessibilityState={{ selected }}
            onPress={() => onChange(mood)}
            style={styles.slot}
          >
            <MoodFace mood={mood} selected={selected} />
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
  },
  slot: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: 44,
    height: 44,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  faceIdle: {
    backgroundColor: colors.background.primary,
  },
  faceSelected: {
    backgroundColor: colors.surface.choiceSelected,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  eye: {
    width: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
  mouth: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
});
