import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { ChoiceCard } from '@/components/ui';
import { spacing } from '@/design-system';
import { BeltMascot } from '@/features/onboarding/components/BeltMascot';
import { OptionGrid } from '@/features/onboarding/components/OptionGrid';
import { OptionIcon } from '@/features/onboarding/components/OptionIcon';
import { getOptionIconSource } from '@/features/onboarding/data/onboardingAssets';
import type { OnboardingOption } from '@/features/onboarding/types/onboarding';

const SHORT_PHONE_HEIGHT = 700;

type MissedDayChoicesProps = {
  options: readonly OnboardingOption[];
  selectedId?: string;
  onSelect: (optionId: string) => void;
};

/**
 * Missed-day question layout: 2×2 compact tiles, then the belt mascot.
 */
export function MissedDayChoices({ options, selectedId, onSelect }: MissedDayChoicesProps) {
  const { height: windowHeight } = useWindowDimensions();
  const isShortPhone = windowHeight < SHORT_PHONE_HEIGHT;

  const gridCards = options.map((option) => {
    const icon = getOptionIconSource(option.id);
    return (
      <ChoiceCard
        key={option.id}
        variant="illustrated"
        compact
        label={option.label}
        leading={icon ? <OptionIcon source={icon} size={isShortPhone ? 36 : 40} /> : undefined}
        selected={selectedId === option.id}
        haptic={option.selectHaptic ?? 'selection'}
        onPress={() => {
          onSelect(option.id);
        }}
      />
    );
  });

  return (
    <View style={[styles.block, isShortPhone ? styles.blockShort : styles.blockTall]}>
      <View style={[styles.choices, isShortPhone ? styles.choicesShort : null]}>
        <OptionGrid columns={2}>{gridCards}</OptionGrid>
      </View>
      <BeltMascot />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flexGrow: 1,
  },
  blockShort: {
    gap: spacing.xs,
    justifyContent: 'flex-start',
  },
  blockTall: {
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  choices: {
    gap: spacing.sm,
  },
  choicesShort: {
    gap: spacing.xs,
  },
});
