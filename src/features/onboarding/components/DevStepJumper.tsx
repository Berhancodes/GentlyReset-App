import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

const SHOW_DEV_JUMPER = false;

export function DevStepJumper() {
  const [open, setOpen] = useState(false);
  const goToStep = useOnboardingStore((state) => state.goToStep);
  const currentStepIndex = useOnboardingStore((state) => state.currentStepIndex);

  if (!__DEV__ || !SHOW_DEV_JUMPER) {
    return null;
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open onboarding step jumper"
        onPress={() => setOpen(true)}
        style={styles.trigger}
      >
        <AppText variant="label" color="muted">
          dev {currentStepIndex + 1}
        </AppText>
      </Pressable>
      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <AppText variant="title">jump to step</AppText>
            <ScrollView style={styles.list}>
              {ONBOARDING_STEPS.map((step, index) => (
                <Pressable
                  key={step.id}
                  accessibilityRole="button"
                  onPress={() => {
                    goToStep(index);
                    setOpen(false);
                  }}
                  style={[styles.row, index === currentStepIndex ? styles.rowCurrent : null]}
                >
                  <AppText variant="caption" color="muted">
                    {index + 1}
                  </AppText>
                  <AppText variant="body">{step.title.split('\n').join(' ')}</AppText>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close step jumper"
              onPress={() => setOpen(false)}
              style={styles.close}
            >
              <AppText variant="button" color="secondary">
                close
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    zIndex: 20,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    minHeight: 48,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  rowCurrent: {
    backgroundColor: colors.surface.selected,
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  close: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
