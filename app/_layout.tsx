import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/design-system';
import { AuthProvider } from '@/features/auth/session/AuthProvider';
import { useAuth } from '@/features/auth/session/useAuth';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { ResetSyncController } from '@/features/reset/sync/ResetSyncController';
import { SubscriptionProvider } from '@/features/subscription/session/SubscriptionProvider';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { usePersistedStoresHydrated } from '@/hooks/usePersistedStoresHydrated';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <RootLayoutReady />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

function RootLayoutReady() {
  const storesHydrated = usePersistedStoresHydrated();
  const { initializing: authInitializing } = useAuth();
  const { initializing: subscriptionInitializing, isPro } = useSubscription();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const hasLocalAppAccess = useOnboardingStore((state) => state.hasLocalAppAccess);
  const canEnterApp = isPro || hasLocalAppAccess;
  const ready = storesHydrated && !authInitializing && !subscriptionInitializing;

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background.primary);
  }, []);

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return <View style={styles.root} />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="dark" />
        <ResetSyncController />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: colors.background.primary },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="friend-invite/[token]" />
          {/* Readable from anywhere, including the paywall and sign-up. */}
          <Stack.Screen name="legal/terms" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="legal/privacy" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(auth)" />
          <Stack.Protected guard={!hasCompletedOnboarding}>
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>
          <Stack.Protected guard={hasCompletedOnboarding && !canEnterApp}>
            <Stack.Screen name="(paywall)" />
          </Stack.Protected>
          <Stack.Protected guard={hasCompletedOnboarding && canEnterApp}>
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
