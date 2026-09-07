import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/design-system';

type ScaleFaceProps = {
  mood: number;
  selected: boolean;
};

/**
 * Abstract placeholder faces. Replace with mascot expressions later.
 */
export function ScaleFace({ mood, selected }: ScaleFaceProps) {
  const eyeHeight = mood <= 2 ? 5 : mood >= 5 ? 8 : 6;
  const mouthWidth = mood <= 2 ? 10 : 14;
  const mouthColor = selected ? colors.text.inverse : colors.text.primary;

  return (
    <View style={[styles.face, selected ? styles.faceSelected : styles.faceIdle]}>
      <View style={styles.eyeRow}>
        <View style={[styles.eye, { height: eyeHeight, backgroundColor: mouthColor }]} />
        <View style={[styles.eye, { height: eyeHeight, backgroundColor: mouthColor }]} />
      </View>
      <View
        style={[
          styles.mouth,
          {
            width: mouthWidth,
            backgroundColor: mouthColor,
            transform: [{ scaleY: mood <= 2 ? -1 : 1 }],
            opacity: mood === 3 ? 0.35 : 0.7,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    width: 44,
    height: 44,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  faceIdle: {
    backgroundColor: colors.surface.selected,
  },
  faceSelected: {
    backgroundColor: colors.accent.peach,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  eye: {
    width: 6,
    borderRadius: radius.pill,
  },
  mouth: {
    height: 3,
    borderRadius: radius.pill,
  },
});
