import { Image, type ImageSourcePropType, StyleSheet } from 'react-native';

type TabBarIconProps = {
  source: ImageSourcePropType;
  size: number;
  focused: boolean;
};

export function TabBarIcon({ source, size, focused }: TabBarIconProps) {
  return (
    <Image
      source={source}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      style={[styles.icon, { width: size, height: size, opacity: focused ? 1 : 0.48 }]}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
