import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/design-system';

type MoodFaceProps = {
  mood: 1 | 2 | 3 | 4 | 5;
  selected: boolean;
};

export function MoodFace({ mood, selected }: MoodFaceProps) {
  const isFrown = mood <= 2;
  const isNeutral = mood === 3;
  const mouthWidth = mood === 1 || mood === 5 ? 16 : 12;

  return (
    <View style={[styles.face, selected ? styles.faceSelected : styles.faceIdle]}>
      <View style={styles.eyeRow}>
        <View style={styles.eye} />
        <View style={styles.eye} />
      </View>
      {isNeutral ? (
        <View style={styles.neutralMouth} />
      ) : (
        <View
          style={[
            styles.curveMouth,
            {
              width: mouthWidth,
              transform: [{ rotate: isFrown ? '180deg' : '0deg' }],
            },
          ]}
        />
      )}
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
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 2,
  },
  neutralMouth: {
    width: 10,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
    marginTop: 4,
    opacity: 0.7,
  },
});
