import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, fontWeights, radius } from '@/design-system';

type FriendAvatarProps = {
  letter: string;
  /** Picks one of the warm fills, so friends next to each other differ. */
  tone: number;
  size: number;
  /** Gold ring: they showed up today. */
  ringed?: boolean;
};

/** A friend's initial in a warm circle. */
export function FriendAvatar({ letter, tone, size, ringed = false }: FriendAvatarProps) {
  const fills = colors.stage.avatarFills;
  const letters = colors.stage.avatarLetters;
  const index = tone % fills.length;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, backgroundColor: fills[index] },
        ringed ? styles.ringed : null,
      ]}
    >
      <Text
        maxFontSizeMultiplier={1.2}
        style={[styles.letter, { fontSize: size * 0.38, color: letters[index] }]}
      >
        {letter}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringed: {
    borderWidth: 3,
    borderColor: colors.accent.gold,
  },
  letter: {
    fontFamily: fontFamilies.rounded,
    fontWeight: fontWeights.heavy,
  },
});
