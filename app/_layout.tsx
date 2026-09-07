import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { colors } from '@/design-system';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background.primary);
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Protected guard={!hasCompletedOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>
        <Stack.Protected guard={hasCompletedOnboarding}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
