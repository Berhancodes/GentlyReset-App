import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/design-system';

type GlyphMotif = 'cloud' | 'spark' | 'heart' | 'sun' | 'leaf' | 'orb' | 'path' | 'drop';

const MOTIF_BY_ID: Record<string, GlyphMotif> = {
  mind: 'cloud',
  energy: 'spark',
  habits: 'path',
  confidence: 'sun',
  relationships: 'heart',
  direction: 'path',
  routine: 'orb',
  everything: 'orb',
  overthink: 'cloud',
  'put-off': 'path',
  'no-energy': 'spark',
  'too-much': 'orb',
  'lose-motivation': 'drop',
  'afraid-wont-stick': 'heart',
  distracted: 'spark',
  'dont-know': 'orb',
  calm: 'drop',
  confident: 'sun',
  motivated: 'spark',
  proud: 'sun',
  energized: 'spark',
  present: 'leaf',
  hopeful: 'heart',
  'in-control': 'orb',
  structure: 'path',
  exercise: 'spark',
  sleep: 'cloud',
  'less-phone': 'orb',
  'meaningful-work': 'sun',
  'time-for-myself': 'leaf',
  'healthier-routines': 'path',
  people: 'heart',
  drained: 'drop',
  overwhelmed: 'cloud',
  disconnected: 'orb',
  'getting-through': 'path',
  'mostly-okay': 'leaf',
  'pretty-good': 'sun',
};

const MOTIF_COLOR: Record<GlyphMotif, string> = {
  cloud: colors.accent.blue,
  spark: colors.accent.gold,
  heart: colors.accent.peach,
  sun: colors.accent.gold,
  leaf: colors.accent.sage,
  orb: colors.accent.peach,
  path: colors.accent.sage,
  drop: colors.accent.blue,
};

type ChoiceGlyphProps = {
  optionId: string;
};

export function ChoiceGlyph({ optionId }: ChoiceGlyphProps) {
  const motif = MOTIF_BY_ID[optionId] ?? 'orb';
  const fill = MOTIF_COLOR[motif];

  return (
    <View style={styles.stage} accessibilityElementsHidden importantForAccessibility="no">
      <View style={[styles.blob, { backgroundColor: fill }]} />
      <MotifShape motif={motif} />
    </View>
  );
}

function MotifShape({ motif }: { motif: GlyphMotif }) {
  switch (motif) {
    case 'cloud':
      return <View style={[styles.mark, styles.wide]} />;
    case 'spark':
      return <View style={[styles.mark, styles.tall]} />;
    case 'heart':
      return <View style={[styles.mark, styles.round]} />;
    case 'sun':
      return <View style={[styles.mark, styles.dot]} />;
    case 'leaf':
      return <View style={[styles.mark, styles.leaf]} />;
    case 'path':
      return <View style={[styles.mark, styles.bar]} />;
    case 'drop':
      return <View style={[styles.mark, styles.drop]} />;
    default:
      return <View style={[styles.mark, styles.dot]} />;
  }
}

const styles = StyleSheet.create({
  stage: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
  },
  blob: {
    position: 'absolute',
    width: 28,
    height: 22,
    borderRadius: radius.md,
    opacity: 0.9,
  },
  mark: {
    backgroundColor: colors.text.primary,
    opacity: 0.55,
  },
  wide: {
    width: 16,
    height: 6,
    borderRadius: radius.pill,
  },
  tall: {
    width: 6,
    height: 14,
    borderRadius: radius.pill,
  },
  round: {
    width: 10,
    height: 10,
    borderRadius: radius.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  leaf: {
    width: 10,
    height: 14,
    borderRadius: radius.lg,
  },
  bar: {
    width: 18,
    height: 4,
    borderRadius: radius.pill,
  },
  drop: {
    width: 8,
    height: 12,
    borderRadius: radius.lg,
  },
});
