import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing, textVariants } from '@/design-system';

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoComplete?: 'email' | 'password' | 'new-password' | 'one-time-code';
  textContentType?: 'emailAddress' | 'password' | 'newPassword' | 'oneTimeCode';
  keyboardType?: 'email-address' | 'default' | 'number-pad';
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
};

export function AuthTextField({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  autoComplete,
  textContentType,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
}: AuthTextFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const hidden = secureTextEntry && !revealed;
  const fieldId = label.replace(/\s+/g, '-');

  return (
    <View style={styles.root}>
      <AppText variant="label" color="helper">
        {label}
      </AppText>
      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={error}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor={colors.text.helper}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          allowFontScaling
          maxFontSizeMultiplier={1.4}
          style={styles.input}
          nativeID={fieldId}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? `Hide ${label}` : `Show ${label}`}
            onPress={() => setRevealed((current) => !current)}
            hitSlop={spacing.xs}
            style={styles.reveal}
          >
            <AppText variant="caption" color="secondary">
              {revealed ? 'hide' : 'show'}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color="secondary">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xxs,
  },
  inputWrap: {
    minHeight: spacing.hitTarget + spacing.xs,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.choice,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
    ...shadows.soft,
  },
  inputWrapError: {
    borderColor: colors.border.selected,
  },
  input: {
    ...textVariants.body,
    flex: 1,
    minHeight: spacing.hitTarget + spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
  },
  reveal: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
