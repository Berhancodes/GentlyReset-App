import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { JourneyCheckpointNode } from '@/features/journey/components/JourneyCheckpointNode';
import {
  getJourneyMascotPose,
  JourneyCurrentMascot,
} from '@/features/journey/components/JourneyCurrentMascot';
import { JourneyDayNode } from '@/features/journey/components/JourneyDayNode';
import { JOURNEY_CHAPTER_IMAGES } from '@/features/journey/data/journeyChapterImages';
import type { JourneyChapterDefinition } from '@/features/journey/data/journeyChapters';
import { JOURNEY_CHAPTER_LAYOUTS } from '@/features/journey/layout/journeyChapterLayouts';
import {
  getJourneyArtLayout,
  mapJourneyArtPoint,
} from '@/features/journey/layout/journeySceneLayout';
import { getJourneyDayState } from '@/features/journey/utils/getJourneyDayState';
import { formatMinutesLabel } from '@/features/reset/utils/getTaskForDay';
import type { TodayTask } from '@/features/reset/types';

type JourneyChapterProps = {
  chapter: JourneyChapterDefinition;
  width: number;
  height: number;
  currentDay: number;
  completedDays: readonly number[];
  todayCompleted: boolean;
  tasksByDay: ReadonlyMap<number, TodayTask>;
  onPressDay: (day: number) => void;
};

export function JourneyChapter({
  chapter,
  width,
  height,
  currentDay,
  completedDays,
  todayCompleted,
  tasksByDay,
  onPressDay,
}: JourneyChapterProps) {
  const art = getJourneyArtLayout(width, height, chapter.artWidth, chapter.artHeight);
  const nodes = JOURNEY_CHAPTER_LAYOUTS[chapter.id];
  const image = JOURNEY_CHAPTER_IMAGES[chapter.id];

  return (
    <View style={[styles.root, { width, height }]}>
      <View
        style={[
          styles.art,
          {
            width: art.width,
            height: art.height,
            left: art.left,
            top: art.top,
          },
        ]}
      >
        <View style={styles.imageWrap} pointerEvents="none">
          <Image
            source={image}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={styles.image}
          />
        </View>
        <View style={styles.overlay} pointerEvents="box-none">
          {nodes.map((node) => {
            const point = mapJourneyArtPoint(art, node);
            const state = getJourneyDayState(node.day, currentDay, completedDays, todayCompleted);
            const task = tasksByDay.get(node.day);
            const isCurrent = state.kind === 'current';
            const mascotOffset = node.mascotOffset ?? {
              x: node.labelSide === 'left' ? -0.12 : 0.12,
              y: -0.03,
            };
            const mascotPoint = mapJourneyArtPoint(art, {
              x: node.x + mascotOffset.x,
              y: node.y + mascotOffset.y,
            });
            const nodeWidth = node.checkpoint ? 92 : 44;
            const nodeHeight = node.checkpoint ? 82 : 44;

            return (
              <View key={node.day} style={styles.marker} pointerEvents="box-none">
                {isCurrent ? (
                  <View
                    pointerEvents="none"
                    style={[
                      styles.mascot,
                      {
                        left: mascotPoint.x - 27,
                        top: mascotPoint.y - 54,
                      },
                    ]}
                  >
                    <JourneyCurrentMascot
                      pose={getJourneyMascotPose(node.day, Boolean(node.checkpoint))}
                    />
                  </View>
                ) : null}
                <View
                  style={[
                    styles.node,
                    {
                      left: point.x - nodeWidth / 2,
                      top: point.y - nodeHeight / 2,
                    },
                  ]}
                >
                  {node.checkpoint ? (
                    <JourneyCheckpointNode
                      state={state}
                      title={task?.title ?? ''}
                      labelSide={node.labelSide}
                      onPress={() => onPressDay(node.day)}
                    />
                  ) : (
                    <JourneyDayNode
                      state={state}
                      labelSide={node.labelSide}
                      currentTitle={task?.title}
                      currentMinutesLabel={
                        isCurrent && task ? formatMinutesLabel(task.minutes) : undefined
                      }
                      onPress={() => onPressDay(node.day)}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View
        style={[styles.caption, { left: art.left + spacing.sm, top: spacing.sm }]}
        pointerEvents="none"
      >
        <AppText variant="label" color="helper">
          {`${chapter.subtitle} · ${chapter.title}`}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
  },
  art: {
    position: 'absolute',
    overflow: 'visible',
  },
  imageWrap: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    overflow: 'visible',
  },
  marker: {
    ...StyleSheet.absoluteFill,
  },
  node: {
    position: 'absolute',
    zIndex: 3,
  },
  mascot: {
    position: 'absolute',
    zIndex: 4,
  },
  caption: {
    position: 'absolute',
    zIndex: 5,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.md,
    backgroundColor: colors.overlay.headerFadeStart,
  },
});
