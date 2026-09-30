import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing, textVariants } from '@/design-system';
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
    <View style={styles.root}>
      <AppText variant="label" color="helper" align="left">
        your name
      </AppText>
      <View style={[styles.field, focused ? styles.fieldFocused : null]}>
        <TextInput
          accessibilityLabel="your name"
          placeholder="type your name"
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
  root: {
    gap: MASCOT_INTRO_LAYOUT.labelGap,
  },
  field: {
    height: MASCOT_INTRO_LAYOUT.fieldHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.primary,
    paddingLeft: spacing.md + spacing.xxs,
    paddingRight: spacing.xxs,
  },
  fieldFocused: {
    borderColor: colors.border.gold,
    backgroundColor: colors.surface.selected,
  },
  input: {
    ...textVariants.body,
    flex: 1,
    height: '100%',
    color: colors.text.primary,
    textAlign: 'left',
    paddingRight: spacing.sm,
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
    backgroundColor: colors.action.primaryBackgroundDisabled,
  },
  submitPressed: {
    backgroundColor: colors.action.primaryBackgroundPressed,
    transform: [{ scale: 0.96 }],
  },
  arrow: {
    width: 10,
    height: 10,
    marginLeft: -2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  arrowEnabled: {
    borderColor: colors.action.primaryText,
  },
  arrowDisabled: {
    borderColor: colors.action.primaryTextDisabled,
  },
});
