import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { UnlockLayout } from '@/features/onboarding/components/UnlockLayout';
import { UNLOCK_ART } from '@/features/onboarding/data/unlockArt';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { PlanReadyStep } from '@/features/onboarding/types/onboarding';
import { getMascotIntroName } from '@/features/onboarding/utils/answerReaders';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { getPlanReady, type PlanReadyRow } from '@/features/onboarding/utils/getPlanReady';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';

const TYPE_MASCOT_SIZE = 84;
const ICON_WELL = 34;
const ICON_SIZE = 16;
const SPARKLE_SIZE = 22;

const ROW_ICONS: Record<PlanReadyRow['id'], { path: string; well: string }> = {
  workingToward: {
    path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    well: colors.unlock.iconButter,
  },
  eachDay: {
    path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
    well: colors.unlock.iconPeach,
  },
  helps: {
    path: 'M5 12.5l4.5 4.5L19 7.5',
    well: colors.unlock.iconSky,
  },
};

const SPARKLE =
  'M12 1.5C12.9 7.6 16.4 11.1 22.5 12 16.4 12.9 12.9 16.4 12 22.5 11.1 16.4 7.6 12.9 1.5 12 7.6 11.1 11.1 7.6 12 1.5Z';

type PlanReadyScreenProps = {
  step: PlanReadyStep;
};

/** Unlock 1 of 3: their answers handed back as a plan, so it feels made for them. */
export function PlanReadyScreen({ step }: PlanReadyScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfileForAnswers(answers);
  const plan = getPlanReady(answers, profile);
  const name = getMascotIntroName(answers);
  const title = capitalizeHeading(name ? `${name}, ${step.title}` : step.title);

  return (
    <UnlockLayout
      stepId="planReady"
      eyebrow={step.eyebrow}
      title={title}
      onBack={canGoBack ? goBack : undefined}
      anchored={
        <View style={styles.note}>
          <Svg width={SPARKLE_SIZE} height={SPARKLE_SIZE} viewBox="0 0 24 24">
            <Path
              d={SPARKLE}
              fill={colors.unlock.gold}
              stroke={colors.unlock.ink}
              strokeWidth={1.2}
            />
          </Svg>
          <Text style={styles.noteText}>{plan.note}</Text>
        </View>
      }
      footer={<StageButton label={step.ctaLabel} onPress={goToNext} />}
    >
      <View
        style={styles.typeCard}
        accessible
        accessibilityLabel={`You're ${profile.name}. ${profile.shortSummary}`}
      >
        <Image
          source={UNLOCK_ART.plan.source}
          resizeMode="contain"
          style={styles.typeMascot}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
        <View style={styles.typeCopy}>
          <Text style={styles.label}>you’re</Text>
          <Text style={styles.typeName}>{profile.name}</Text>
          <Text style={styles.body}>{capitalizeHeading(profile.shortSummary)}</Text>
        </View>
      </View>

      <View style={styles.rows}>
        {plan.rows.map((row) => (
          <View
            key={row.id}
            style={styles.row}
            accessible
            accessibilityLabel={`${row.label}: ${row.value}`}
          >
            <View style={[styles.iconWell, { backgroundColor: ROW_ICONS[row.id].well }]}>
              <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
                <Path
                  d={ROW_ICONS[row.id].path}
                  stroke={colors.unlock.ink}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </UnlockLayout>
  );
}

const styles = StyleSheet.create({
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm + 2,
    borderRadius: radius.card + 2,
    borderWidth: 2.5,
    borderColor: colors.unlock.ink,
    backgroundColor: colors.unlock.sticker,
    ...shadows.unlockSticker,
  },
  typeMascot: {
    width: TYPE_MASCOT_SIZE,
    height: TYPE_MASCOT_SIZE,
  },
  typeCopy: {
    flex: 1,
    gap: 3,
  },
  typeName: {
    ...textVariants.unlockName,
    color: colors.unlock.ink,
  },
  label: {
    ...textVariants.unlockLabel,
    color: colors.unlock.muted,
  },
  body: {
    ...textVariants.unlockBody,
    color: colors.unlock.copy,
  },
  rows: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm - 1,
    borderRadius: radius.lg + 2,
    borderWidth: 2,
    borderColor: colors.unlock.rowBorder,
    backgroundColor: colors.unlock.row,
  },
  iconWell: {
    width: ICON_WELL,
    height: ICON_WELL,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.unlock.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: {
    flex: 1,
    gap: 1,
  },
  value: {
    ...textVariants.unlockValue,
    color: colors.unlock.ink,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg + 2,
    backgroundColor: colors.unlock.note,
  },
  noteText: {
    ...textVariants.unlockBody,
    flex: 1,
    fontWeight: textVariants.unlockValue.fontWeight,
    color: colors.unlock.ink,
  },
});
