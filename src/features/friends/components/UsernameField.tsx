import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing, textVariants } from '@/design-system';

type UsernameFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  onSubmitEditing?: () => void;
};

export function UsernameField({ value, onChangeText, error, onSubmitEditing }: UsernameFieldProps) {
  return (
    <View style={styles.root}>
      <AppText variant="label" color="helper">
        username
      </AppText>
      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        <View style={styles.prefix}>
          <AppText variant="body" color="helper">
            @
          </AppText>
        </View>
        <TextInput
          accessibilityLabel="username"
          accessibilityHint={error}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          returnKeyType="done"
          onSubmitEditing={onSubmitEditing}
          placeholder="yourname"
          placeholderTextColor={colors.text.helper}
          value={value}
          onChangeText={onChangeText}
          allowFontScaling
          maxFontSizeMultiplier={1.4}
          style={styles.input}
        />
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
    paddingLeft: spacing.md,
    ...shadows.soft,
  },
  inputWrapError: {
    borderColor: colors.border.selected,
  },
  prefix: {
    marginRight: spacing.xxs,
    justifyContent: 'center',
  },
  input: {
    ...textVariants.body,
    flex: 1,
    minHeight: spacing.hitTarget + spacing.xs,
    paddingRight: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
  },
});
