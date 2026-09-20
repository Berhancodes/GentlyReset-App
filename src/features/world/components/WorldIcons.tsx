import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors, radius } from '@/design-system';
import type { WorldStatGlyph } from '@/features/world/data/worldStats';

export type WorldActionGlyph = 'plus' | 'heart' | 'group';

const ICON_PEOPLE = require('../../../../assets/images/app/world/icon-people.png');
const ICON_GROUP_FILLED = require('../../../../assets/images/app/world/icon-group-filled.png');

/** Pale yellow stats badges — small enough that 1,200+ / people here stay unclipped. */
const WORLD_STAT_CIRCLE_SIZE = 26;
const WORLD_STAT_GLYPH_SIZE = 15;

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
    return <SheetIcon source={ICON_PEOPLE} size={WORLD_STAT_CIRCLE_SIZE} />;
  }

  return (
    <CircleIcon size={WORLD_STAT_CIRCLE_SIZE} backgroundColor={colors.world.statCircle}>
      <Ionicons
        name={glyph === 'globe' ? 'globe-outline' : 'heart-outline'}
        size={WORLD_STAT_GLYPH_SIZE}
        color={colors.world.glyph}
      />
    </CircleIcon>
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
        <Ionicons
          name="heart"
          size={WORLD_ACTION_GLYPH_SIZE}
          color={colors.world.actionHeartGlyph}
        />
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
});
