import { useLayoutEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, spacing } from '@/design-system';
import { JourneyDayNode } from '@/features/journey/components/JourneyDayNode';
import { JourneyHeroCopy } from '@/features/journey/components/JourneyHeroCopy';
import { JourneyProgressMascot } from '@/features/journey/components/JourneyProgressMascot';
import { JourneySkyDecor } from '@/features/journey/components/JourneySkyDecor';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import { getJourneyChapterForDay } from '@/features/journey/data/journeyChapters';
import { getJourneySignLine } from '@/features/journey/data/journeyCopy';
import {
  getJourneyStageLayout,
  type JourneyRect,
  type JourneyStageLayout,
} from '@/features/journey/layout/journeyStageLayout';
import type { JourneyProgressionPresentation } from '@/features/journey/hooks/useJourneyProgression';

const NODE_SLOT_WIDTH = spacing.xxl + spacing.md;

type JourneyLinearStageProps = {
  presentation: JourneyProgressionPresentation;
  onPressDay: (day: number) => void;
  focused: boolean;
};

function rectStyle(rect: JourneyRect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export function JourneyLinearStage({ presentation, onPressDay, focused }: JourneyLinearStageProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const layout =
    stageSize.width > 0 && stageSize.height > 0
      ? getJourneyStageLayout(stageSize.width, stageSize.height)
      : null;
  const chapter = getJourneyChapterForDay(presentation.headingDay);
  const signLabel = chapter ? getJourneySignLine(chapter.id) : 'you can do this';

  return (
    <View
      style={styles.stage}
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width;
        const nextHeight = event.nativeEvent.layout.height;
        if (nextWidth !== stageSize.width || nextHeight !== stageSize.height) {
          setStageSize({ width: nextWidth, height: nextHeight });
        }
      }}
    >
      <Image
        source={JOURNEY_SPRITES.mascotProgress}
        resizeMode="contain"
        fadeDuration={0}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.preload}
      />
      {layout ? <JourneySkyDecor layout={layout} focused={focused} /> : null}

      <JourneyHeroCopy day={presentation.headingDay} title={presentation.headingTitle} />

      <View style={styles.midStage}>
        {layout ? (
          <JourneyPathBand
            layout={layout}
            presentation={presentation}
            signLabel={signLabel}
            onPressDay={onPressDay}
          />
        ) : null}
      </View>
    </View>
  );
}

type JourneyPathBandProps = {
  layout: JourneyStageLayout;
  presentation: JourneyProgressionPresentation;
  signLabel: string;
  onPressDay: (day: number) => void;
};

function JourneyPathBand({ layout, presentation, signLabel, onPressDay }: JourneyPathBandProps) {
  const reduceMotion = useReducedMotion() === true;
  const translateX = useSharedValue(0);
  const nodePop = useSharedValue(1);
  const leftDay = presentation.visibleDays[0] ?? presentation.toDay;
  const rightDay = presentation.visibleDays[1];

  useLayoutEffect(() => {
    if (reduceMotion || presentation.phase === 'idle' || presentation.phase === 'holding') {
      translateX.value = 0;
      return;
    }

    if (presentation.phase === 'walking') {
      translateX.value = 0;
      translateX.value = withTiming(layout.travelDistance, {
        duration: motion.duration.journeyProgressWalk,
        easing: Easing.inOut(Easing.cubic),
      });
      return;
    }

    translateX.value = layout.travelDistance;
  }, [layout.travelDistance, presentation.phase, reduceMotion, translateX]);

  useLayoutEffect(() => {
    if (presentation.phase !== 'celebrating' || reduceMotion) {
      nodePop.value = 1;
      return;
    }

    nodePop.value = 0.94;
    nodePop.value = withSequence(
      withTiming(1.04, {
        duration: 140,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1, {
        duration: 160,
        easing: Easing.inOut(Easing.cubic),
      }),
    );
  }, [nodePop, presentation.phase, reduceMotion]);

  const mascotMotionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const rightNodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nodePop.value }],
  }));

  return (
    <View style={[styles.pathBand, { height: layout.pathHeight }]}>
      <Image
        source={JOURNEY_SPRITES.bush}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.vegetationLayer, rectStyle(layout.bushLeft)]}
      />
      <Image
        source={JOURNEY_SPRITES.bush}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.vegetationLayer, rectStyle(layout.bush)]}
      />

      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={signLabel}
        pointerEvents="none"
        style={[styles.signLayer, rectStyle(layout.sign)]}
      >
        <Image
          source={JOURNEY_SPRITES.signEncouragement}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.fillImage, { width: layout.sign.width, height: layout.sign.height }]}
        />
      </View>

      {presentation.showProgressMascot ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.mascotLayer, rectStyle(layout.progressMascot), mascotMotionStyle]}
        >
          <JourneyProgressMascot rect={layout.progressMascot} playing />
        </Animated.View>
      ) : (
        <Pressable
          accessible={false}
          onPress={() => onPressDay(leftDay)}
          style={[styles.mascotLayer, rectStyle(layout.mascot)]}
        >
          <Image
            source={JOURNEY_SPRITES.mascotStand}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={[styles.fillImage, { width: layout.mascot.width, height: layout.mascot.height }]}
          />
        </Pressable>
      )}

      <View
        pointerEvents="none"
        style={[
          styles.line,
          {
            left: layout.lineLeft,
            top: layout.lineY - layout.lineThickness / 2,
            width: layout.lineWidth,
            height: layout.lineThickness,
          },
        ]}
      />

      <View
        style={[
          styles.nodeSlot,
          {
            left: layout.day1X - NODE_SLOT_WIDTH / 2,
            top: layout.lineY - spacing.hitTarget / 2,
            width: NODE_SLOT_WIDTH,
          },
        ]}
      >
        <JourneyDayNode
          size={layout.nodeSize}
          state={presentation.leftNode}
          onPress={() => onPressDay(leftDay)}
        />
      </View>

      {rightDay !== undefined && presentation.rightNode ? (
        <Animated.View
          style={[
            styles.nodeSlot,
            {
              left: layout.day2X - NODE_SLOT_WIDTH / 2,
              top: layout.lineY - spacing.hitTarget / 2,
              width: NODE_SLOT_WIDTH,
            },
            rightNodeStyle,
          ]}
        >
          <JourneyDayNode
            size={layout.nodeSize}
            state={presentation.rightNode}
            onPress={() => onPressDay(rightDay)}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
  },
  preload: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  midStage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pathBand: {
    position: 'relative',
  },
  fillImage: {
    width: '100%',
    height: '100%',
  },
  vegetationLayer: {
    position: 'absolute',
    zIndex: 1,
  },
  signLayer: {
    position: 'absolute',
    zIndex: 2,
  },
  line: {
    position: 'absolute',
    backgroundColor: colors.text.primary,
    borderRadius: 1,
    zIndex: 4,
  },
  mascotLayer: {
    position: 'absolute',
    zIndex: 3,
    overflow: 'visible',
  },
  nodeSlot: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
});
