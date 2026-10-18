import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
} from '@/design-system';
import { SummaryCard } from '@/features/profile/components/ProfileSummaryCards';

import { useNotificationSettings } from '../hooks/useNotificationSettings';

type NotificationSettingsCardProps = {
  /** Friend notifications need an account; without one only the reminder shows. */
  signedIn: boolean;
};

/** Profile's notification switches: the daily reminder and its time, and friend notifications. */
export function NotificationSettingsCard({ signedIn }: NotificationSettingsCardProps) {
  const settings = useNotificationSettings();
  if (!settings.available) {
    return null;
  }

  return (
    <SummaryCard title="Notifications">
      <SwitchRow
        label="Daily reminder"
        detail="one gentle nudge on days you haven’t checked in"
        value={settings.reminderOn}
        onChange={settings.toggleReminder}
      />
      {settings.reminderOn ? (
        <View style={[styles.row, styles.divided]}>
          <Text style={styles.label} maxFontSizeMultiplier={1.3}>
            Remind me at
          </Text>
          <View style={styles.stepper}>
            <StepButton symbol="−" label="Half an hour earlier" onPress={settings.earlier} />
            <Text
              style={styles.time}
              accessibilityLiveRegion="polite"
              accessibilityLabel={`Reminder at ${settings.timeLabel}`}
              maxFontSizeMultiplier={1.3}
            >
              {settings.timeLabel}
            </Text>
            <StepButton symbol="+" label="Half an hour later" onPress={settings.later} />
          </View>
        </View>
      ) : null}
      {signedIn ? (
        <SwitchRow
          label="Friend notifications"
          detail="encouragements and friend requests"
          value={settings.friendPushOn}
          onChange={settings.toggleFriendPush}
          divided
        />
      ) : null}
      {settings.blockedInSettings ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open iOS Settings to allow notifications"
          onPress={settings.openSettings}
          style={[styles.row, styles.divided]}
        >
          <Text style={styles.blocked} maxFontSizeMultiplier={1.3}>
            notifications are off for Gently Reset in iOS Settings.{' '}
            <Text style={styles.link}>Open Settings</Text>
          </Text>
        </Pressable>
      ) : null}
    </SummaryCard>
  );
}

function SwitchRow({
  label,
  detail,
  value,
  onChange,
  divided = false,
}: {
  label: string;
  detail: string;
  value: boolean;
  onChange: (value: boolean) => void;
  divided?: boolean;
}) {
  return (
    <View style={[styles.row, divided ? styles.divided : null]}>
      <View style={styles.copy}>
        <Text style={styles.label} maxFontSizeMultiplier={1.3}>
          {label}
        </Text>
        <Text style={styles.detail} maxFontSizeMultiplier={1.3}>
          {detail}
        </Text>
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityHint={detail}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.stage.track, true: colors.stage.cta }}
        thumbColor={colors.stage.knob}
        ios_backgroundColor={colors.stage.track}
      />
    </View>
  );
}

function StepButton({
  symbol,
  label,
  onPress,
}: {
  symbol: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.stepButton, pressed ? styles.stepPressed : null]}
    >
      <Text style={styles.stepSymbol} maxFontSizeMultiplier={1.3}>
        {symbol}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.stage.chipBorder,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  label: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  detail: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepButton: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.stage.floor,
  },
  stepPressed: {
    transform: [{ scale: 0.94 }],
  },
  stepSymbol: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  time: {
    textAlign: 'center',
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  blocked: {
    flex: 1,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
  },
  link: {
    color: colors.stage.ctaLink,
    fontWeight: fontWeights.heavy,
  },
});
