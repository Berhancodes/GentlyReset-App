import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { JournalSprite } from '@/features/reflect/components/JournalSprite';
import {
  JOURNAL_MASCOT_WRITING_ASPECT,
  JOURNAL_MASCOT_WRITING_LAYOUT,
  JOURNAL_WRITING_CARD,
  toPercent,
} from '@/features/reflect/layout/journalLayout';

const MASCOT_ART = require('../../../../assets/images/app/journal-mascot-writing.png');

const ICON_SIZE = 26;

type JournalWritingCardProps = {
  value: string;
  onChangeText: (text: string) => void;
  moodSelected: boolean;
  minHeight: number;
  onPressMood: () => void;
  onPressPhoto: () => void;
};

export function JournalWritingCard({
  value,
  onChangeText,
  moodSelected,
  minHeight,
  onPressMood,
  onPressPhoto,
}: JournalWritingCardProps) {
  const [cardHeight, setCardHeight] = useState(0);
  const lineGap = JOURNAL_WRITING_CARD.lineGap;
  const firstLine = spacing.lg + spacing.md;
  const footerReserve = spacing.xxxl;
  const lineCount =
    cardHeight > 0
      ? Math.max(4, Math.floor((cardHeight - firstLine - footerReserve) / lineGap))
      : 6;

  return (
    <View
      style={[styles.card, { minHeight }]}
      onLayout={(event) => {
        setCardHeight(event.nativeEvent.layout.height);
      }}
    >
      <View pointerEvents="none" style={styles.lines}>
        {Array.from({ length: lineCount }, (_, lineIndex) => (
          <View key={lineIndex} style={[styles.line, { top: firstLine + lineIndex * lineGap }]} />
        ))}
      </View>

      <TextInput
        testID="journal-input"
        accessibilityLabel="journal entry"
        placeholder="write anything..."
        placeholderTextColor={colors.text.helper}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        scrollEnabled
        underlineColorAndroid={colors.overlay.clear}
        allowFontScaling
        maxFontSizeMultiplier={1.15}
        style={[styles.input, { lineHeight: lineGap }]}
      />

      <View style={styles.footer}>
        <ComposerIconButton
          icon="happy-outline"
          label="mood"
          selected={moodSelected}
          onPress={onPressMood}
        />
        <ComposerIconButton icon="image-outline" label="add photo" onPress={onPressPhoto} />
      </View>

      <JournalSprite
        source={MASCOT_ART}
        width={toPercent(JOURNAL_MASCOT_WRITING_LAYOUT.width)}
        aspectRatio={JOURNAL_MASCOT_WRITING_ASPECT}
        right={toPercent(JOURNAL_MASCOT_WRITING_LAYOUT.right)}
        bottom={toPercent(JOURNAL_MASCOT_WRITING_LAYOUT.bottom)}
        zIndex={1}
      />
    </View>
  );
}

function ComposerIconButton({
  icon,
  label,
  selected = false,
  onPress,
}: {
  icon: 'happy-outline' | 'image-outline';
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const color = selected ? colors.text.primary : colors.text.secondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed ? styles.iconPressed : null]}
    >
      <Ionicons name={icon} size={ICON_SIZE} color={color} />
      <AppText variant="moodLabel" color={selected ? 'primary' : 'secondary'} align="center">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.primary,
    overflow: 'hidden',
    ...shadows.soft,
  },
  lines: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  line: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.notebook,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    color: colors.text.primary,
    backgroundColor: colors.overlay.clear,
    ...textVariants.body,
    zIndex: 2,
    borderWidth: 0,
    includeFontPadding: false,
  },
  footer: {
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
    paddingRight: toPercent(JOURNAL_MASCOT_WRITING_LAYOUT.width),
    minHeight: spacing.xxl + spacing.sm,
  },
  iconButton: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xxs,
    paddingVertical: spacing.xxs,
  },
  iconPressed: {
    opacity: 0.7,
  },
});
