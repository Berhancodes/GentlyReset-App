import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/design-system';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { usePersistedStoresHydrated } from '@/hooks/usePersistedStoresHydrated';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const storesHydrated = usePersistedStoresHydrated();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background.primary);
  }, []);

  useEffect(() => {
    if (storesHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [storesHydrated]);

  if (!storesHydrated) {
    return <View style={styles.root} />;
  }

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
