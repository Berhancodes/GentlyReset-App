import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { MASCOT_INTRO_LAYOUT } from '@/features/onboarding/utils/mascotIntroLayout';

type MascotNameFieldProps = {
  value: string;
  canSubmit: boolean;
  focused: boolean;
  maxLength: number;
  onChangeText: (nextValue: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
};

export function MascotNameField({
  value,
  canSubmit,
  focused,
  maxLength,
  onChangeText,
  onFocus,
  onBlur,
  onSubmit,
}: MascotNameFieldProps) {
  return (
    <View style={styles.fieldWrapper}>
      <View style={[styles.field, focused ? styles.fieldFocused : null]}>
        <TextInput
          accessibilityLabel="your name"
          placeholder="your name"
          placeholderTextColor={colors.text.helper}
          value={value}
          maxLength={maxLength}
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="name"
          textContentType="name"
          returnKeyType="done"
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          allowFontScaling
          maxFontSizeMultiplier={1.4}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="continue"
          accessibilityState={{ disabled: !canSubmit }}
          disabled={!canSubmit}
          onPress={onSubmit}
          hitSlop={spacing.xxs}
          style={({ pressed }) => [
            styles.submit,
            canSubmit ? styles.submitEnabled : styles.submitDisabled,
            pressed && canSubmit ? styles.submitPressed : null,
          ]}
        >
          <View
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={[styles.arrow, canSubmit ? styles.arrowEnabled : styles.arrowDisabled]}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    width: '100%',
  },
  field: {
    height: MASCOT_INTRO_LAYOUT.fieldHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.whisper,
    backgroundColor: colors.surface.primary,
    paddingLeft: spacing.md + spacing.xxs,
    paddingRight: spacing.xs,
    ...shadows.whisper,
  },
  fieldFocused: {
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.primary,
  },
  input: {
    ...textVariants.body,
    flex: 1,
    height: '100%',
    color: colors.text.primary,
    textAlign: 'left',
    paddingRight: spacing.sm,
    borderWidth: 0,
    ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as const) : null),
  },
  submit: {
    width: MASCOT_INTRO_LAYOUT.submitSize,
    height: MASCOT_INTRO_LAYOUT.submitSize,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitEnabled: {
    backgroundColor: colors.action.primaryBackground,
  },
  submitDisabled: {
    backgroundColor: colors.surface.disabled,
  },
  submitPressed: {
    backgroundColor: colors.action.primaryBackgroundPressed,
    transform: [{ scale: 0.96 }],
  },
  arrow: {
    width: 7,
    height: 7,
    marginLeft: -1,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  arrowEnabled: {
    borderColor: colors.action.primaryText,
  },
  arrowDisabled: {
    borderColor: colors.text.helper,
  },
});
