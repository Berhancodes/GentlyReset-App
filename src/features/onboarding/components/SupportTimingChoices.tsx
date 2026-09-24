import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { ChoiceCard } from '@/components/ui';
import { spacing } from '@/design-system';
import { OptionGrid } from '@/features/onboarding/components/OptionGrid';
import { OptionIcon } from '@/features/onboarding/components/OptionIcon';
import { WorriedMascot } from '@/features/onboarding/components/WorriedMascot';
import { getOptionIconSource } from '@/features/onboarding/data/onboardingAssets';
import type { OnboardingOption } from '@/features/onboarding/types/onboarding';

const CATCH_ALL_OPTION_ID = 'whenever-struggling';
const SHORT_PHONE_HEIGHT = 700;

type SupportTimingChoicesProps = {
  options: readonly OnboardingOption[];
  selectedId?: string;
  onSelect: (optionId: string) => void;
};

/**
 * Trial composition for "when would a reset help you most?" only.
 * 2×2 compact tiles, a full-width catch-all, then the worried mascot.
 */
export function SupportTimingChoices({ options, selectedId, onSelect }: SupportTimingChoicesProps) {
  const { height: windowHeight } = useWindowDimensions();
  const isShortPhone = windowHeight < SHORT_PHONE_HEIGHT;
  const gridOptions = options.filter((option) => option.id !== CATCH_ALL_OPTION_ID);
  const catchAllOption = options.find((option) => option.id === CATCH_ALL_OPTION_ID);
  const catchAllIcon = catchAllOption ? getOptionIconSource(catchAllOption.id) : undefined;

  const gridCards = gridOptions.map((option) => {
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
        {catchAllOption ? (
          <ChoiceCard
            key={catchAllOption.id}
            variant="row"
            label={catchAllOption.label}
            leading={catchAllIcon ? <OptionIcon source={catchAllIcon} size={40} /> : undefined}
            selected={selectedId === catchAllOption.id}
            haptic={catchAllOption.selectHaptic ?? 'selection'}
            onPress={() => {
              onSelect(catchAllOption.id);
            }}
          />
        ) : null}
      </View>
      <WorriedMascot />
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
