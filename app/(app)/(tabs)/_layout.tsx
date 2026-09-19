import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabBar, getTabBarScenePadding } from '@/components/ui';
import { colors } from '@/design-system';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background.primary,
          paddingBottom: getTabBarScenePadding(insets.bottom),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          sceneStyle: {
            backgroundColor: colors.background.primary,
            paddingBottom: 0,
          },
        }}
      />
      <Tabs.Screen name="journey" options={{ title: 'Journey' }} />
      <Tabs.Screen name="reflect" options={{ title: 'Journal' }} />
      <Tabs.Screen
        name="world"
        options={{
          title: 'World',
          sceneStyle: {
            backgroundColor: colors.background.primary,
            paddingBottom: 0,
          },
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'You' }} />
    </Tabs>
  );
}
