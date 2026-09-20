import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors, radius } from '@/design-system';
import type { WorldStatGlyph } from '@/features/world/data/worldStats';

export type WorldActionGlyph = 'plus' | 'heart' | 'group';

/** Pale yellow stats badges — small enough that 1,200+ / people here stay unclipped. */
const WORLD_STAT_CIRCLE_SIZE = 26;
const WORLD_STAT_GLYPH_SIZE = 14;
const WORLD_STAT_PEOPLE_SIZE = 16;

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

function PeopleThreeGlyph({ color, size }: { color: string; size: number }) {
  const sideHead = size * 0.28;
  const centerHead = size * 0.36;
  const sideBodyWidth = size * 0.34;
  const centerBodyWidth = size * 0.5;
  const sideBodyHeight = size * 0.22;
  const centerBodyHeight = size * 0.28;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.mark,
          {
            width: sideHead,
            height: sideHead,
            borderRadius: sideHead / 2,
            left: size * 0.04,
            top: size * 0.22,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          {
            width: sideHead,
            height: sideHead,
            borderRadius: sideHead / 2,
            right: size * 0.04,
            top: size * 0.22,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          bodyMark(sideBodyWidth, sideBodyHeight, color),
          {
            left: size * 0.02,
            bottom: 0,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          bodyMark(sideBodyWidth, sideBodyHeight, color),
          {
            right: size * 0.02,
            bottom: 0,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          {
            width: centerHead,
            height: centerHead,
            borderRadius: centerHead / 2,
            left: (size - centerHead) / 2,
            top: size * 0.1,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          bodyMark(centerBodyWidth, centerBodyHeight, color),
          {
            left: (size - centerBodyWidth) / 2,
            bottom: 0,
          },
        ]}
      />
    </View>
  );
}

function bodyMark(width: number, height: number, color: string) {
  return {
    width,
    height,
    backgroundColor: color,
    borderBottomLeftRadius: width / 2,
    borderBottomRightRadius: width / 2,
  };
}

function PeopleTwoGlyph({ color, size }: { color: string; size: number }) {
  const leftHead = size * 0.3;
  const rightHead = size * 0.34;
  const leftBodyWidth = size * 0.4;
  const rightBodyWidth = size * 0.5;
  const leftBodyHeight = size * 0.24;
  const rightBodyHeight = size * 0.3;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.mark,
          {
            width: leftHead,
            height: leftHead,
            borderRadius: leftHead / 2,
            left: size * 0.06,
            top: size * 0.18,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          bodyMark(leftBodyWidth, leftBodyHeight, color),
          {
            left: size * 0.02,
            bottom: 0,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          {
            width: rightHead,
            height: rightHead,
            borderRadius: rightHead / 2,
            right: size * 0.04,
            top: size * 0.12,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.mark,
          bodyMark(rightBodyWidth, rightBodyHeight, color),
          {
            right: 0,
            bottom: 0,
          },
        ]}
      />
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
  return (
    <CircleIcon size={WORLD_STAT_CIRCLE_SIZE} backgroundColor={colors.world.statCircle}>
      {glyph === 'people' ? (
        <PeopleThreeGlyph color={colors.world.glyph} size={WORLD_STAT_PEOPLE_SIZE} />
      ) : (
        <Ionicons
          name={glyph === 'globe' ? 'globe-outline' : 'heart-outline'}
          size={WORLD_STAT_GLYPH_SIZE}
          color={colors.world.glyph}
        />
      )}
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

  return (
    <CircleIcon size={WORLD_ACTION_CIRCLE_SIZE} backgroundColor={colors.world.actionGroup}>
      <PeopleTwoGlyph color={colors.world.glyph} size={WORLD_ACTION_GLYPH_SIZE} />
    </CircleIcon>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mark: {
    position: 'absolute',
  },
});
