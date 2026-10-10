import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/design-system';

/** Ink-only marks. Small enough that fills would not read, so they take a color. */
export type MascotMarkName = 'chevron' | 'arrow' | 'check' | 'plus' | 'snow';

/** Outline plus flat fill, drawn like the mascot and the tab bar icons. Colors are fixed. */
export type MascotIllustrationName =
  | 'leaf'
  | 'sprout'
  | 'checkCircle'
  | 'clock'
  | 'book'
  | 'map'
  | 'chart'
  | 'tag'
  | 'help'
  | 'door'
  | 'person'
  | 'personAdd'
  | 'people'
  | 'target'
  | 'heart'
  | 'star'
  | 'globe';

export type MascotIconName = MascotMarkName | MascotIllustrationName;

type SharedProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export type MascotIconProps =
  | (SharedProps & { name: MascotMarkName; color?: string })
  | (SharedProps & { name: MascotIllustrationName; color?: never });

const DEFAULT_SIZE = 24;
const ink = colors.icon.ink;
const OUTLINE = 2;
const DETAIL = 1.7;
/** Target on-screen outline thickness, so small icons keep room for their fill. */
const OUTLINE_PIXELS = 1.75;
const MIN_OUTLINE_WEIGHT = 0.7;

/** Scales stroke widths so the outline stays about the same number of pixels at any size. */
function outlineWeight(size: number): number {
  const weight = (OUTLINE_PIXELS * 24) / (OUTLINE * size);
  return Math.min(1, Math.max(MIN_OUTLINE_WEIGHT, weight));
}

/**
 * Gently Reset's icon set: a thick rounded brown outline with flat warm fills,
 * matching the straw-hat mascot. Decorative; give the parent the accessibility label.
 */
export function MascotIcon(props: MascotIconProps) {
  const size = props.size ?? DEFAULT_SIZE;
  const drawing =
    props.name === 'chevron' ||
    props.name === 'arrow' ||
    props.name === 'check' ||
    props.name === 'plus' ||
    props.name === 'snow'
      ? drawMark(props.name, props.color ?? ink)
      : drawIllustration(props.name, size);

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={props.style}
      aria-hidden
      pointerEvents="none"
    >
      {drawing}
    </Svg>
  );
}

function drawMark(name: MascotMarkName, color: string): ReactNode {
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'chevron':
      return <Path d="M9 5.5 15.5 12 9 18.5" strokeWidth={2.6} {...stroke} />;
    case 'arrow':
      return <Path d="M4.5 12h14M13 6.5 18.5 12 13 17.5" strokeWidth={2.6} {...stroke} />;
    case 'check':
      return <Path d="M5 12.5 10 17.5 19 7" strokeWidth={2.8} {...stroke} />;
    case 'plus':
      return <Path d="M12 5v14M5 12h14" strokeWidth={2.6} {...stroke} />;
    case 'snow':
      return (
        <G {...stroke} strokeWidth={OUTLINE}>
          <Path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
          <Path d="M9.5 4.5 12 6.5 14.5 4.5M9.5 19.5 12 17.5 14.5 19.5" />
        </G>
      );
  }
}

function drawIllustration(name: MascotIllustrationName, size: number): ReactNode {
  const stroke = (width: number) => width * outlineWeight(size);
  const outline = {
    stroke: ink,
    strokeWidth: stroke(OUTLINE),
    strokeLinejoin: 'round' as const,
  };
  const line = {
    fill: 'none',
    stroke: ink,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const { icon } = colors;

  switch (name) {
    case 'leaf':
      return (
        <>
          <Path d="M5 19C4 11 9 4.5 19.5 4.5 20 14 14 19.5 5 19Z" fill={icon.gold} {...outline} />
          <Path
            d="M5 19C9 14 12 11.5 15.5 9.5M10.5 14.5 10.8 11M10.5 14.5 14 14.3"
            strokeWidth={stroke(DETAIL)}
            {...line}
          />
        </>
      );
    case 'sprout':
      return (
        <>
          <Path d="M12 21V12" strokeWidth={stroke(OUTLINE)} {...line} />
          <Path
            d="M12 13C12 8 9 5.5 3.8 5.5 3.6 10.5 6.5 13 12 13Z"
            fill={icon.sage}
            {...outline}
          />
          <Path
            d="M12 11.5C12 7 14.8 4 20.2 4 20.4 9 17.5 11.5 12 11.5Z"
            fill={icon.sageLight}
            {...outline}
          />
        </>
      );
    case 'checkCircle':
      return (
        <>
          <Circle cx={12} cy={12} r={9} fill={icon.sage} {...outline} />
          <Path
            d="M7.8 12.3 10.8 15.2 16.3 9.3"
            strokeWidth={stroke(2.4)}
            {...line}
            stroke={icon.highlight}
          />
        </>
      );
    case 'clock':
      return (
        <>
          <Circle cx={12} cy={12.5} r={8.5} fill={icon.creamWarm} {...outline} />
          <Path d="M12 8v4.7l3 2M9.5 2.8h5" strokeWidth={stroke(OUTLINE)} {...line} />
        </>
      );
    case 'book':
      return (
        <>
          <Path
            d="M6.5 3.5h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"
            fill={icon.cream}
            {...outline}
          />
          <Path d="M8.5 3.5v17" strokeWidth={stroke(OUTLINE)} {...line} />
          <Path d="M11.5 9h5M11.5 12.5h5" strokeWidth={stroke(OUTLINE)} {...line} />
        </>
      );
    case 'map':
      return (
        <>
          <Path
            d="M3.5 6.5 8.5 4.5 15.5 7 20.5 5v12.5l-5 2-7-2.5-5 2Z"
            fill={icon.cream}
            {...outline}
          />
          <Path d="M8.5 4.5V17M15.5 7v12.5" strokeWidth={stroke(1.6)} {...line} />
          <Path
            d="M5.5 14.5c2-1 3.5-.5 5-2s3-3 6.5-2.5"
            strokeWidth={stroke(OUTLINE)}
            strokeDasharray="0.1 2.6"
            {...line}
            stroke={icon.gold}
          />
        </>
      );
    case 'chart':
      return (
        <>
          <Rect x={3.5} y={12} width={4.5} height={8.5} rx={1.6} fill={icon.peach} {...outline} />
          <Rect
            x={9.75}
            y={8}
            width={4.5}
            height={12.5}
            rx={1.6}
            fill={icon.goldLight}
            {...outline}
          />
          <Rect x={16} y={3.5} width={4.5} height={17} rx={1.6} fill={icon.gold} {...outline} />
        </>
      );
    case 'tag':
      return (
        <>
          <Path
            d="M3.5 5.5v5.2a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8l-8-8a2 2 0 0 0-1.4-.6H5.5a2 2 0 0 0-2 2Z"
            fill={icon.goldLight}
            {...outline}
          />
          <Circle
            cx={8}
            cy={8}
            r={1.6}
            fill={icon.highlight}
            {...outline}
            strokeWidth={stroke(1.6)}
          />
        </>
      );
    case 'help':
      return (
        <>
          <Path
            d="M12 3.5c4.9 0 8.5 3.3 8.5 7.6s-3.6 7.6-8.5 7.6c-.9 0-1.8-.1-2.6-.3L5 20.5l1-3.6c-1.5-1.4-2.5-3.4-2.5-5.8 0-4.3 3.6-7.6 8.5-7.6Z"
            fill={icon.creamWarm}
            {...outline}
          />
          <Path
            d="M9.9 9.2c.2-1.2 1.1-1.9 2.2-1.9 1.3 0 2.2.8 2.2 1.9 0 1.6-2.2 1.7-2.2 3.3"
            strokeWidth={stroke(1.9)}
            {...line}
          />
          <Circle cx={12.1} cy={15} r={1.1} fill={ink} />
        </>
      );
    case 'door':
      return (
        <>
          <Path d="M4.5 4.5h8v15h-8Z" fill={icon.peach} {...outline} />
          <Circle cx={10} cy={12} r={1} fill={ink} />
          <Path d="M14.5 12h6M18 9l3 3-3 3" strokeWidth={stroke(2.2)} {...line} />
        </>
      );
    case 'person':
      return (
        <>
          <Circle cx={12} cy={8} r={4} fill={icon.peach} {...outline} />
          <Path d="M4.5 20.5c0-4 3.3-6.5 7.5-6.5s7.5 2.5 7.5 6.5Z" fill={icon.gold} {...outline} />
        </>
      );
    case 'personAdd':
      return (
        <>
          <Circle cx={10} cy={8} r={3.6} fill={icon.peach} {...outline} />
          <Path d="M3.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6Z" fill={icon.gold} {...outline} />
          <Circle
            cx={18.5}
            cy={7.5}
            r={3.4}
            fill={icon.sage}
            {...outline}
            strokeWidth={stroke(1.8)}
          />
          <Path
            d="M18.5 6v3M17 7.5h3"
            strokeWidth={stroke(1.6)}
            {...line}
            stroke={icon.highlight}
          />
        </>
      );
    case 'people':
      return (
        <>
          <Circle
            cx={15.5}
            cy={7.5}
            r={3.2}
            fill={icon.goldLight}
            {...outline}
            strokeWidth={stroke(1.8)}
          />
          <Path
            d="M11 18.5c0-3 2-5 4.5-5s4.5 2 4.5 5Z"
            fill={icon.goldLight}
            {...outline}
            strokeWidth={stroke(1.8)}
          />
          <Circle cx={9} cy={9} r={3.6} fill={icon.peach} {...outline} />
          <Path d="M3 20.5c0-3.6 2.7-6 6-6s6 2.4 6 6Z" fill={icon.gold} {...outline} />
        </>
      );
    case 'target':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} fill={icon.creamWarm} {...outline} />
          <Circle cx={12} cy={12} r={5} fill={icon.peach} {...outline} strokeWidth={stroke(1.8)} />
          <Circle cx={12} cy={12} r={1.8} fill={ink} />
        </>
      );
    case 'heart':
      return (
        <>
          <Path
            d="M12 20s-7.5-4.6-7.5-10.2C4.5 7 6.5 5 9 5c1.4 0 2.4.7 3 1.7C12.6 5.7 13.6 5 15 5c2.5 0 4.5 2 4.5 4.8C19.5 15.4 12 20 12 20Z"
            fill={icon.peach}
            {...outline}
          />
          <Path
            d="M7.5 9.2c.2-1 .9-1.6 1.7-1.7"
            strokeWidth={stroke(1.5)}
            {...line}
            stroke={icon.highlight}
          />
        </>
      );
    case 'star':
      return (
        <Path
          d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z"
          fill={icon.gold}
          {...outline}
        />
      );
    case 'globe':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} fill={icon.sky} {...outline} />
          <Path
            d="M6 8.5c2 .3 3 1.5 2.6 3-.4 1.3.6 2 1.8 2.3 1 .3 1 1.8.4 3.4M14 4c-.6 1.5.2 2.6 1.7 2.8 1.6.2 2 1.6 1.3 2.8-.6 1-.2 2.2 1.2 2.6"
            strokeWidth={stroke(1.6)}
            {...line}
          />
          <Path
            d="M5.6 15.5c1 2.3 3 4 5.5 4.5"
            strokeWidth={stroke(1.8)}
            {...line}
            stroke={icon.sage}
          />
        </>
      );
  }
}
