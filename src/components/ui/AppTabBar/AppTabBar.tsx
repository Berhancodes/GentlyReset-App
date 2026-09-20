import type { BottomTabBarProps } from 'expo-router/tabs';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/design-system';

const TAB_ICON_SIZE = 24;

const TABS = {
  home: {
    label: 'home',
    idle: require('../../../../assets/icons/tab-home.png'),
    active: require('../../../../assets/icons/tab-home-active.png'),
  },
  journey: {
    label: 'journey',
    idle: require('../../../../assets/icons/tab-journey.png'),
    active: require('../../../../assets/icons/tab-journey-active.png'),
  },
  reflect: {
    label: 'journal',
    idle: require('../../../../assets/icons/tab-reflect.png'),
    active: require('../../../../assets/icons/tab-reflect-active.png'),
  },
  world: {
    label: 'world',
    idle: require('../../../../assets/icons/tab-world.png'),
    active: require('../../../../assets/icons/tab-world-active.png'),
  },
  profile: {
    label: 'you',
    idle: require('../../../../assets/icons/tab-you.png'),
    active: require('../../../../assets/icons/tab-you-active.png'),
  },
} as const;

type TabRouteName = keyof typeof TABS;

export const TAB_BAR_HEIGHT = 80;
export const TAB_BAR_SIDE_INSET = spacing.md;
export const TAB_BAR_BOTTOM_GAP = spacing.sm;

export function getTabBarScenePadding(bottomInset: number) {
  return TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_GAP + bottomInset + spacing.xs;
}

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.dock, { paddingBottom: insets.bottom + TAB_BAR_BOTTOM_GAP }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const meta = TABS[route.name as TabRouteName];
          if (!meta) {
            return <View key={route.key} style={styles.slot} />;
          }

          const focused = state.index === index;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.slot}
            >
              <View style={[styles.item, focused ? styles.itemActive : null]}>
                <Image
                  source={focused ? meta.active : meta.idle}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                  style={styles.icon}
                />
                <AppText
                  variant={focused ? 'tabLabelActive' : 'tabLabel'}
                  color={focused ? 'primary' : 'helper'}
                  align="center"
                  numberOfLines={1}
                >
                  {meta.label}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: TAB_BAR_SIDE_INSET,
    pointerEvents: 'box-none',
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.tabBar,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    ...shadows.whisper,
  },
  slot: {
    flex: 1,
    minHeight: spacing.hitTarget,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: 58,
    minWidth: spacing.hitTarget,
    minHeight: 62,
    borderRadius: radius.tabItem,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
  },
  itemActive: {
    backgroundColor: colors.surface.tabSelected,
  },
  icon: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
  },
});
