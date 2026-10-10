import { StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';

import { useStageStore } from './stageStore';
import { useIsOutgoingStage } from './StageTransition';

/**
 * Empty space in a stage screen where the mascot should stand.
 * It reports its frame (relative to the stage, which the mascot overlay shares)
 * so the shared mascot can move and scale into it.
 */
export function MascotSlot() {
  const outgoing = useIsOutgoingStage();
  const setSlot = useStageStore((state) => state.setSlot);

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.slot}
      onLayout={(event) => {
        if (!outgoing) {
          setSlot(event.nativeEvent.layout);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    minHeight: spacing.xxxl + spacing.xl,
  },
});
