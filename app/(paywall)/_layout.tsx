import { Stack } from 'expo-router';

import { colors } from '@/design-system';

export default function PaywallLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    />
  );
}
