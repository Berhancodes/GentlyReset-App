import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { MascotIcon, type MascotIllustrationName } from '@/components/ui';
import { colors, radius } from '@/design-system';
import type { WorldStatGlyph } from '@/features/world/data/worldStats';

export type WorldActionGlyph = 'plus' | 'heart' | 'group';

const ICON_GROUP_FILLED = require('../../../../assets/images/app/world/icon-group-filled.png');

/** People mark sits inside a larger pale-yellow circle. Globe/heart stay bare. */
const WORLD_STAT_PEOPLE_CIRCLE_SIZE = 40;
const WORLD_STAT_PEOPLE_GLYPH_SIZE = 22;
const WORLD_STAT_OUTLINE_SIZE = 28;

const WORLD_STAT_ICON_NAME = {
  globe: 'globe',
  heart: 'heart',
} as const satisfies Record<Exclude<WorldStatGlyph, 'people'>, MascotIllustrationName>;

/** Action-row circles match the 44pt hit target, with modest glyphs inside. */
const WORLD_ACTION_CIRCLE_SIZE = 44;
const WORLD_ACTION_GLYPH_SIZE = 18;
const WORLD_ACTION_PLUS_SIZE = 16;
const WORLD_ACTION_PLUS_THICKNESS = 2;

type CircleIconProps = {
  size: number;
  backgroundColor: string;
  children: ReactNode;
};

function SheetIcon({ source, size }: { source: ImageSourcePropType; size: number }) {
  return (
    <Image
      source={source}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
}

function CircleIcon({ size, backgroundColor, children }: CircleIconProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          backgroundColor,
        },
      ]}
    >
      {children}
    </View>
  );
}

function PlusGlyph({ color, size, thickness }: { color: string; size: number; thickness: number }) {
  const cap = thickness / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: thickness,
          borderRadius: cap,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: thickness,
          height: size,
          borderRadius: cap,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function WorldStatIcon({ glyph }: { glyph: WorldStatGlyph }) {
  if (glyph === 'people') {
    return (
      <CircleIcon size={WORLD_STAT_PEOPLE_CIRCLE_SIZE} backgroundColor={colors.world.statCircle}>
        <MascotIcon name="people" size={WORLD_STAT_PEOPLE_GLYPH_SIZE} />
      </CircleIcon>
    );
  }

  return (
    <MascotIcon
      name={WORLD_STAT_ICON_NAME[glyph]}
      size={WORLD_STAT_OUTLINE_SIZE}
      style={styles.statGlyph}
    />
  );
}

export function WorldActionIcon({ glyph }: { glyph: WorldActionGlyph }) {
  if (glyph === 'plus') {
    return (
      <CircleIcon size={WORLD_ACTION_CIRCLE_SIZE} backgroundColor={colors.world.actionPlus}>
        <PlusGlyph
          color={colors.world.actionPlusGlyph}
          size={WORLD_ACTION_PLUS_SIZE}
          thickness={WORLD_ACTION_PLUS_THICKNESS}
        />
      </CircleIcon>
    );
  }

  if (glyph === 'heart') {
    return (
      <CircleIcon size={WORLD_ACTION_CIRCLE_SIZE} backgroundColor={colors.world.actionHeart}>
        <MascotIcon name="heart" size={WORLD_ACTION_GLYPH_SIZE} />
      </CircleIcon>
    );
  }

  return <SheetIcon source={ICON_GROUP_FILLED} size={WORLD_ACTION_CIRCLE_SIZE} />;
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statGlyph: {
    flexShrink: 0,
  },
});
