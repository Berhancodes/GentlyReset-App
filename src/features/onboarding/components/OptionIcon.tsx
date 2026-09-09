import { Image, StyleSheet } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

/** Display size on a standard iPhone. Assets are square; contain keeps sparkles uncropped. */
const OPTION_ICON_SIZE = 44;

type OptionIconProps = {
  source: ImageSourcePropType;
};

export function OptionIcon({ source }: OptionIconProps) {
  return (
    <Image
      source={source}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: OPTION_ICON_SIZE,
    height: OPTION_ICON_SIZE,
  },
});
