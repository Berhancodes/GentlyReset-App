import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing, textVariants } from '@/design-system';
import { JournalSprite } from '@/features/reflect/components/JournalSprite';
import {
  getNotebookLineHeight,
  getNotebookWritingFontSize,
  JOURNAL_FLORA_ASPECT,
  JOURNAL_FLORA_LAYOUT,
  JOURNAL_MASCOT_ASPECT,
  JOURNAL_MASCOT_LAYOUT,
  JOURNAL_NOTEBOOK_ASPECT,
  JOURNAL_NOTEBOOK_CONTENT,
  toPercent,
} from '@/features/reflect/layout/notebookLayout';
import { hapticSuccess } from '@/utils/haptics';

const NOTEBOOK_ART = require('../../../../assets/images/app/journal-notebook.png');
const MASCOT_ART = require('../../../../assets/images/app/journal-mascot.png');
const FLORA_ART = require('../../../../assets/images/app/journal-corner-flora.png');

type JournalNotebookProps = {
  dateLabel: string;
  heading: string;
  prompt: string;
  value: string;
  onChangeText: (text: string) => void;
  canSave: boolean;
  showSaved: boolean;
  onSave: () => void;
};

export function JournalNotebook({
  dateLabel,
  heading,
  prompt,
  value,
  onChangeText,
  canSave,
  showSaved,
  onSave,
}: JournalNotebookProps) {
  const [notebookSize, setNotebookSize] = useState({ width: 0, height: 0 });
  const lineHeight = notebookSize.height > 0 ? getNotebookLineHeight(notebookSize.height) : 16;
  const fontSize = getNotebookWritingFontSize(lineHeight);
  const saveClearance = notebookSize.width * JOURNAL_MASCOT_LAYOUT.width * 0.85;

  return (
    <View style={styles.scene}>
      <View
        style={styles.notebook}
        onLayout={(event) => {
          setNotebookSize({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          });
        }}
      >
        <JournalSprite
          source={FLORA_ART}
          width={toPercent(JOURNAL_FLORA_LAYOUT.width)}
          aspectRatio={JOURNAL_FLORA_ASPECT}
          left={toPercent(JOURNAL_FLORA_LAYOUT.left)}
          bottom={toPercent(JOURNAL_FLORA_LAYOUT.bottom)}
          zIndex={0}
        />

        <Image
          source={NOTEBOOK_ART}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          accessibilityIgnoresInvertColors
          style={styles.notebookArt}
        />

        <View
          style={[
            styles.overlay,
            {
              top: toPercent(JOURNAL_NOTEBOOK_CONTENT.top),
              right: toPercent(JOURNAL_NOTEBOOK_CONTENT.right),
              bottom: toPercent(JOURNAL_NOTEBOOK_CONTENT.bottom),
              left: toPercent(JOURNAL_NOTEBOOK_CONTENT.left),
            },
          ]}
        >
          <View style={styles.headingBlock}>
            <AppText variant="notebookDate" color="helper" numberOfLines={1}>
              {dateLabel}
            </AppText>
            <AppText variant="notebookHeading" numberOfLines={1}>
              {heading}
            </AppText>
            <AppText variant="notebookPrompt" color="secondary" numberOfLines={3}>
              {prompt}
            </AppText>
          </View>

          <TextInput
            accessibilityLabel="today's thought"
            placeholder="write what's on your mind..."
            placeholderTextColor={colors.text.helper}
            value={value}
            onChangeText={onChangeText}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            underlineColorAndroid={colors.overlay.clear}
            allowFontScaling
            maxFontSizeMultiplier={1.15}
            style={[styles.input, { fontSize, lineHeight }]}
          />

          <View style={[styles.saveRow, { paddingRight: saveClearance }]}>
            {showSaved ? (
              <View style={styles.savedState} accessibilityRole="text" accessibilityLabel="saved">
                <AppText variant="journalSave" color="primary">
                  ✓ saved
                </AppText>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="save reflection"
                accessibilityState={{ disabled: !canSave }}
                disabled={!canSave}
                onPress={() => {
                  void hapticSuccess();
                  onSave();
                }}
                style={({ pressed }) => [
                  styles.saveButton,
                  !canSave ? styles.saveDisabled : null,
                  pressed && canSave ? styles.savePressed : null,
                ]}
              >
                <Text allowFontScaling maxFontSizeMultiplier={1.3} style={styles.saveLabel}>
                  {'save reflection →'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <JournalSprite
          source={MASCOT_ART}
          width={toPercent(JOURNAL_MASCOT_LAYOUT.width)}
          aspectRatio={JOURNAL_MASCOT_ASPECT}
          right={toPercent(JOURNAL_MASCOT_LAYOUT.right)}
          bottom={toPercent(JOURNAL_MASCOT_LAYOUT.bottom)}
          zIndex={3}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    position: 'relative',
    width: '100%',
    overflow: 'visible',
    paddingBottom: spacing.lg,
  },
  notebook: {
    width: '100%',
    aspectRatio: JOURNAL_NOTEBOOK_ASPECT,
    overflow: 'visible',
    zIndex: 1,
  },
  notebookArt: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  headingBlock: {
    gap: spacing.xxs,
    paddingBottom: spacing.xs,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: spacing.xxl,
    marginTop: spacing.xxs,
    paddingHorizontal: spacing.none,
    paddingVertical: spacing.none,
    color: colors.text.primary,
    backgroundColor: colors.overlay.clear,
    ...textVariants.body,
    borderWidth: 0,
    includeFontPadding: false,
  },
  saveRow: {
    alignItems: 'flex-end',
    minHeight: spacing.hitTarget,
    justifyContent: 'flex-end',
    paddingTop: spacing.xs,
  },
  saveButton: {
    minHeight: spacing.hitTarget,
    minWidth: spacing.hitTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.action.saveBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePressed: {
    backgroundColor: colors.action.saveBackgroundPressed,
  },
  saveDisabled: {
    opacity: 0.45,
  },
  saveLabel: {
    ...textVariants.journalSave,
    color: colors.action.saveText,
  },
  savedState: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
});
