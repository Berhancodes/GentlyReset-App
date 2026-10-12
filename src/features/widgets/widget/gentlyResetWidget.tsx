import { Gauge, HStack, Image, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  aspectRatio,
  background,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  gaugeStyle,
  lineLimit,
  padding,
  resizable,
  shapes,
  tint,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget } from 'expo-widgets';

import type { GentlyResetWidgetProps } from '@/features/widgets/utils/getWidgetTimeline';

/** Must match the widget `name` in app.json's expo-widgets plugin config. */
export const GENTLY_RESET_WIDGET_NAME = 'GentlyReset';

/**
 * The home screen and lock screen widget.
 *
 * The `'widget'` function is turned into a string at build time and runs inside the widget
 * extension on its own, so it can't read anything outside itself. That is why its colours
 * are written inline here instead of coming from `src/design-system` (they mirror
 * `colors.room`), and why its parameters carry no type annotations.
 */
export const gentlyResetWidget = createWidget<GentlyResetWidgetProps>(
  GENTLY_RESET_WIDGET_NAME,
  function GentlyResetWidget(props, environment) {
    'widget';
    const ink = '#3A2112';
    const muted = '#8A7565';
    const kickerRose = '#C2716A';
    const cream = '#FFF9F1';
    const butter = '#F7E9B0';
    const peach = '#FFE3D6';
    const cocoa = '#6B4630';
    const gold = '#E6B84A';
    const openJourney = widgetURL('gentlyreset://journey');
    const done = props.mood === 'done' || props.mood === 'upgrade';
    const family = environment.widgetFamily;

    if (family === 'accessoryInline') {
      return <Text modifiers={[openJourney]}>{`Day ${props.day} · ${props.headline}`}</Text>;
    }

    if (family === 'accessoryCircular') {
      return (
        <Gauge
          value={props.progress}
          modifiers={[gaugeStyle('circularCapacity'), openJourney]}
          currentValueLabel={
            <Text modifiers={[font({ size: 20, weight: 'heavy', design: 'rounded' })]}>
              {String(props.day)}
            </Text>
          }
        >
          <Text>DAY</Text>
        </Gauge>
      );
    }

    if (family === 'accessoryRectangular') {
      return (
        <VStack alignment="leading" spacing={1} modifiers={[openJourney]}>
          <Text modifiers={[font({ size: 11, weight: 'heavy', design: 'rounded' })]}>
            {`GENTLY RESET · DAY ${props.day}`}
          </Text>
          <Text modifiers={[font({ size: 15, weight: 'heavy', design: 'rounded' })]}>
            {props.headline}
          </Text>
          <Text
            modifiers={[font({ size: 12, weight: 'semibold', design: 'rounded' }), lineLimit(1)]}
          >
            {props.step}
          </Text>
        </VStack>
      );
    }

    const chip = (
      <Text
        modifiers={[
          font({ size: 11, weight: 'heavy', design: 'rounded' }),
          foregroundStyle(ink),
          padding({ horizontal: 8, vertical: 3 }),
          background(done ? cream : butter, shapes.capsule()),
        ]}
      >
        {props.chip}
      </Text>
    );

    if (family === 'systemMedium') {
      return (
        <HStack
          spacing={12}
          modifiers={[containerBackground(done ? butter : cream, 'widget'), openJourney]}
        >
          <ZStack
            alignment="bottom"
            modifiers={[
              frame({ width: 118, height: 132 }),
              background(peach, shapes.roundedRectangle({ cornerRadius: 18 })),
            ]}
          >
            <Image
              uiImage={props.mascot}
              modifiers={[
                resizable(),
                aspectRatio({ contentMode: 'fit' }),
                frame({ width: 104, height: 104 }),
              ]}
            />
          </ZStack>
          <VStack alignment="leading" spacing={4}>
            <Text
              modifiers={[
                font({ size: 11, weight: 'heavy', design: 'rounded' }),
                foregroundStyle(kickerRose),
              ]}
            >
              {`DAY ${props.day} · ${props.roomName.toUpperCase()}`}
            </Text>
            <Text
              modifiers={[
                font({ size: 12, weight: 'bold', design: 'rounded' }),
                foregroundStyle(muted),
              ]}
            >
              {done ? props.headline : 'today’s step'}
            </Text>
            <Text
              modifiers={[
                font({ size: 17, weight: 'heavy', design: 'rounded' }),
                foregroundStyle(ink),
                lineLimit(2),
              ]}
            >
              {props.step}
            </Text>
            <Spacer />
            <Gauge value={props.progress} modifiers={[gaugeStyle('linearCapacity'), tint(gold)]}>
              <Text> </Text>
            </Gauge>
            <Text
              modifiers={[
                font({ size: 12, weight: 'heavy', design: 'rounded' }),
                foregroundStyle(done ? ink : cream),
                padding({ horizontal: 12, vertical: 5 }),
                background(done ? cream : cocoa, shapes.capsule()),
              ]}
            >
              {done ? props.chip : 'check in ›'}
            </Text>
          </VStack>
          <Spacer />
        </HStack>
      );
    }

    // systemSmall (and anything larger falls back to the small layout).
    return (
      <ZStack
        alignment="bottomTrailing"
        modifiers={[containerBackground(done ? butter : cream, 'widget'), openJourney]}
      >
        <VStack
          alignment="leading"
          spacing={2}
          modifiers={[frame({ maxWidth: 1000, maxHeight: 1000, alignment: 'topLeading' })]}
        >
          <Text
            modifiers={[
              font({ size: 11, weight: 'heavy', design: 'rounded' }),
              foregroundStyle(kickerRose),
            ]}
          >
            {props.kicker}
          </Text>
          <Text
            modifiers={[
              font({ size: 26, weight: 'heavy', design: 'rounded' }),
              foregroundStyle(ink),
            ]}
          >
            {`Day ${props.day}`}
          </Text>
          <Text
            modifiers={[
              font({ size: 12, weight: 'heavy', design: 'rounded' }),
              foregroundStyle(done ? cocoa : muted),
              lineLimit(2),
              frame({ maxWidth: 90, alignment: 'leading' }),
            ]}
          >
            {props.headline}
          </Text>
          <Spacer />
          {chip}
        </VStack>
        <Image
          uiImage={props.mascot}
          modifiers={[
            resizable(),
            aspectRatio({ contentMode: 'fit' }),
            frame({ width: 76, height: 76 }),
          ]}
        />
      </ZStack>
    );
  },
);
