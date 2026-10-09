import type { ReactNode } from 'react';

import { OptionGrid } from '@/features/onboarding/components/OptionGrid';

type IllustratedChoiceGridProps = {
  compact?: boolean;
  children: readonly ReactNode[];
};

/** 2-column illustrated grid used by Page 2 and later short visual questions. */
export function IllustratedChoiceGrid({ compact = false, children }: IllustratedChoiceGridProps) {
  return (
    <OptionGrid columns={2} compact={compact}>
      {children}
    </OptionGrid>
  );
}
