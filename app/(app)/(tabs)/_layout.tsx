import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/ui';
import { colors, fontSizes, spacing } from '@/design-system';

const TAB_ICONS = {
  home: require('../../../assets/icons/tab-home.png'),
  journey: require('../../../assets/icons/tab-journey.png'),
  reflect: require('../../../assets/icons/tab-reflect.png'),
  world: require('../../../assets/icons/tab-world.png'),
  you: require('../../../assets/icons/tab-you.png'),
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.subtle,
          paddingTop: spacing.xxs,
        },
        tabBarLabelStyle: {
          fontSize: fontSizes.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon source={TAB_ICONS.home} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon source={TAB_ICONS.journey} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reflect"
        options={{
          title: 'Reflect',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon source={TAB_ICONS.reflect} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="world"
        options={{
          title: 'World',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon source={TAB_ICONS.world} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon source={TAB_ICONS.you} focused={focused} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
