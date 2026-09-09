import { Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

/** Display size on a standard iPhone. Assets are square; contain keeps sparkles uncropped. */
const OPTION_ICON_SIZE = 48;

type OptionIconProps = {
  source: ImageSourcePropType;
  size?: number;
};

export function OptionIcon({ source, size = OPTION_ICON_SIZE }: OptionIconProps) {
  return (
    <Image
      source={source}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{ width: size, height: size }}
    />
  );
}
