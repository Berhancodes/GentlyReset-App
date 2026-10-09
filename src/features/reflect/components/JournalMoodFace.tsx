import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/design-system';
import type { JournalMood } from '@/features/reset/types';

const FACE_SIZE = 44;
const STROKE = 2;

/**
 * Hand-built kawaii faces, one personality per mood:
 * awful (worried brows, frown, tear), tired (sleepy eyes, small frown),
 * okay (dots, straight mouth), good (smile, blush), amazing (^ ^ eyes, grin, blush).
 */
export function JournalMoodFace({ mood }: { mood: JournalMood }) {
  const { well, ink } = colors.journal.mood[mood];

  return (
    <View style={[styles.face, { backgroundColor: well }]}>
      {mood === 1 ? <Brows ink={ink} /> : null}
      <View style={styles.eyes}>
        <Eye mood={mood} ink={ink} />
        <Eye mood={mood} ink={ink} />
      </View>
      <Mouth mood={mood} ink={ink} />
      {mood >= 4 ? <Blush /> : null}
      {mood === 1 ? <View style={styles.tear} /> : null}
    </View>
  );
}

function Eye({ mood, ink }: { mood: JournalMood; ink: string }) {
  if (mood === 2) {
    // Sleepy: a short closed line.
    return <View style={[styles.eyeLine, { backgroundColor: ink }]} />;
  }
  if (mood === 5) {
    // Happy closed eyes: the top half of a ring, like ^.
    return (
      <View style={styles.eyeArcClip}>
        <View style={[styles.eyeArc, { borderColor: ink }]} />
      </View>
    );
  }
  return <View style={[styles.eyeDot, { backgroundColor: ink }]} />;
}

function Mouth({ mood, ink }: { mood: JournalMood; ink: string }) {
  if (mood === 3) {
    return <View style={[styles.mouthFlat, { backgroundColor: ink }]} />;
  }
  if (mood === 5) {
    return <View style={[styles.mouthGrin, { backgroundColor: ink }]} />;
  }
  if (mood === 4) {
    return <View style={[styles.mouthCurve, styles.mouthSmile, { borderColor: ink }]} />;
  }
  // Awful frowns harder than tired.
  return (
    <View
      style={[
        styles.mouthCurve,
        mood === 1 ? styles.mouthFrownWide : styles.mouthFrownSmall,
        { borderColor: ink },
      ]}
    />
  );
}

function Brows({ ink }: { ink: string }) {
  return (
    <View style={styles.brows} pointerEvents="none">
      <View style={[styles.brow, styles.browLeft, { backgroundColor: ink }]} />
      <View style={[styles.brow, styles.browRight, { backgroundColor: ink }]} />
    </View>
  );
}

function Blush() {
  return (
    <View style={styles.blushRow} pointerEvents="none">
      <View style={styles.blushDot} />
      <View style={styles.blushDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    width: FACE_SIZE,
    height: FACE_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  eyes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 6,
  },
  eyeDot: {
    width: 5,
    height: 6,
    borderRadius: radius.pill,
  },
  eyeLine: {
    width: 7,
    height: STROKE,
    borderRadius: radius.pill,
  },
  eyeArcClip: {
    width: 9,
    height: 5,
    overflow: 'hidden',
  },
  eyeArc: {
    width: 9,
    height: 9,
    borderRadius: radius.pill,
    borderWidth: STROKE,
  },
  mouthFlat: {
    width: 9,
    height: STROKE,
    borderRadius: radius.pill,
    marginTop: 2,
  },
  mouthCurve: {
    borderLeftWidth: STROKE,
    borderRightWidth: STROKE,
    borderBottomWidth: STROKE,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  mouthSmile: {
    width: 13,
    height: 7,
  },
  mouthFrownWide: {
    width: 13,
    height: 6,
    marginTop: 2,
    transform: [{ rotate: '180deg' }],
  },
  mouthFrownSmall: {
    width: 9,
    height: 4,
    marginTop: 3,
    transform: [{ rotate: '180deg' }],
  },
  mouthGrin: {
    width: 14,
    height: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  brows: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    gap: 7,
  },
  brow: {
    width: 7,
    height: STROKE,
    borderRadius: radius.pill,
  },
  /** Worried brows tilt up toward the middle. */
  browLeft: {
    transform: [{ rotate: '-20deg' }],
  },
  browRight: {
    transform: [{ rotate: '20deg' }],
  },
  blushRow: {
    position: 'absolute',
    top: 24,
    flexDirection: 'row',
    gap: 18,
  },
  blushDot: {
    width: 7,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.journal.blush,
  },
  tear: {
    position: 'absolute',
    top: 22,
    left: 11,
    width: 4,
    height: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.journal.tear,
  },
});
