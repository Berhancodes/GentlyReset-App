import { memo } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  Pattern,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import { colors } from '@/design-system';
import { RoomFace } from '@/features/room/components/RoomFace';
import {
  getSeasonWindowView,
  SeasonFurniture,
  WindowScene,
  type WindowView,
} from '@/features/room/components/SeasonFurniture';
import { SEASON_ROOM_ICONS } from '@/features/room/data/roomStages';
import type { HomeMascotBackdropLayout } from '@/features/home/components/HomeMascot';

/** The room is drawn in a 390-wide box; this slice of it holds the wall and floor. */
const VIEW_TOP = 330;
const VIEW_WIDTH = 390;
const VIEW_HEIGHT = 432;
/** Where the mascot's feet stand, in the same box. */
export const ROOM_FEET_Y = 728 - VIEW_TOP;
export const ROOM_ASPECT = VIEW_HEIGHT / VIEW_WIDTH;

const C = colors.room;

type RoomShape = { x: number; width: number; radius: number; edge: number; cushionX: number };

/** The room widens at each weekly upgrade until it fills the screen. */
const SHAPES: readonly RoomShape[] = [
  { x: 56, width: 278, radius: 70, edge: 3, cushionX: 96 },
  { x: 22, width: 346, radius: 54, edge: 3, cushionX: 106 },
  { x: 10, width: 370, radius: 40, edge: 3, cushionX: 106 },
  { x: -4, width: 398, radius: 0, edge: 0, cushionX: 106 },
  { x: -4, width: 398, radius: 0, edge: 0, cushionX: 106 },
];

/**
 * `room`: a walled kawaii room behind the mascot.
 * `open`: the same pieces placed straight on Home's background, standing on a soft floor patch.
 */
export type RoomLook = 'room' | 'open';

type HomeRoomProps = {
  look?: RoomLook;
  /** Index into ROOM_STAGES: corner, nook, cozy, yours, home. */
  stageIndex: number;
  /** How many little friends are in the room (0–5). */
  itemCount: number;
  /** Which friend just arrived, for its sparkle. */
  newestItem: number | null;
  width: number;
  /** 0-based season; each season's room has its own wallpaper. */
  seasonIndex?: number;
};

function Heart({ x, y, scale = 1, fill }: { x: number; y: number; scale?: number; fill: string }) {
  return (
    <Path
      d={`M${x} ${y} c${-10 * scale} ${-7 * scale} ${-10 * scale} ${-17 * scale} ${-3 * scale} ${-17 * scale} c${2 * scale} 0 ${3 * scale} ${1 * scale} ${3 * scale} ${3 * scale} c0 ${-2 * scale} ${1 * scale} ${-3 * scale} ${3 * scale} ${-3 * scale} c${7 * scale} 0 ${7 * scale} ${10 * scale} ${-3 * scale} ${17 * scale} z`}
      fill={fill}
      stroke={C.ink}
      strokeWidth={1.6}
    />
  );
}

function Sparkle({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const s = size;
  return (
    <Path
      d={`M${x} ${y} l${3 * s} ${8 * s} l${8 * s} ${3 * s} l${-8 * s} ${3 * s} l${-3 * s} ${8 * s} l${-3 * s} ${-8 * s} l${-8 * s} ${-3 * s} l${8 * s} ${-3 * s} z`}
      fill={C.gold}
      stroke={C.ink}
      strokeWidth={1.2}
    />
  );
}

function Bunting({ shape }: { shape: RoomShape }) {
  const flags: { x: number; y: number; fill: string }[] = [];
  for (let x = shape.x + 16; x < shape.x + shape.width - 24; x += 30) {
    const t = (x + 10 - 195) / (shape.width / 2);
    flags.push({
      x,
      y: 344 + 15 * (1 - t * t),
      fill: C.lights[flags.length % C.lights.length] ?? C.blush,
    });
  }
  return (
    <G>
      <Path
        d={`M${shape.x + 8} 346 Q195 376 ${shape.x + shape.width - 8} 346`}
        fill="none"
        stroke={C.cocoa}
        strokeWidth={2}
      />
      {flags.map((flag) => (
        <Path
          key={flag.x}
          d={`M${flag.x} ${flag.y} l20 0 l-10 18 z`}
          fill={flag.fill}
          stroke={C.ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      ))}
    </G>
  );
}

function ArchedWindow({ golden, view }: { golden: boolean; view: WindowView }) {
  return (
    <G>
      <Path
        d="M226 500 V430 a44 44 0 0 1 88 0 V500 Z"
        fill={view === 'moon' ? C.night : golden ? C.sunsetSky : C.sky}
        stroke={C.ink}
        strokeWidth={3}
      />
      {view === 'moon' || view === 'rainbow' || view === 'bubbles' ? null : (
        <G>
          <Circle
            cx={270}
            cy={446}
            r={18}
            fill={golden ? C.sunset : C.butter}
            stroke={C.ink}
            strokeWidth={2.5}
          />
          <RoomFace x={270} y={444} size={0.8} />
          <Path
            d="M236 486 a8 8 0 0 1 10 -8 a10 10 0 0 1 18 2 a7 7 0 0 1 4 8 z"
            fill={C.trim}
            stroke={C.ink}
            strokeWidth={2}
          />
        </G>
      )}
      <WindowScene view={view} />
      <Path
        d="M218 412 q18 46 -2 92 h-8 v-92 z"
        fill={C.peach}
        stroke={C.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path
        d="M322 412 q-18 46 2 92 h8 v-92 z"
        fill={C.peach}
        stroke={C.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path
        d="M206 452 l8 -5 l0 10 z M220 452 l-8 -5 l0 10 z"
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <Path
        d="M320 452 l8 -5 l0 10 z M334 452 l-8 -5 l0 10 z"
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <Rect
        x={220}
        y={498}
        width={100}
        height={10}
        rx={5}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={2.5}
      />
    </G>
  );
}

/** The mushroom lamp that arrives with week 2 in every season. */
function MushroomLamp() {
  return (
    <G>
      <Circle cx={350} cy={560} r={46} fill={C.lampGlow} />
      <Path d="M318 566 a32 30 0 0 1 64 0 z" fill={C.blush} stroke={C.ink} strokeWidth={3} />
      <Circle cx={336} cy={552} r={5} fill={C.trim} />
      <Circle cx={358} cy={546} r={6} fill={C.trim} />
      <Circle cx={370} cy={560} r={4} fill={C.trim} />
      <Rect
        x={340}
        y={566}
        width={20}
        height={44}
        rx={8}
        fill={C.cream}
        stroke={C.ink}
        strokeWidth={3}
      />
      <RoomFace x={350} y={584} size={0.6} />
    </G>
  );
}

type SeasonWallpaper = (typeof C.seasons)[number];

/** Season 1 frames a heart; later seasons frame their room's own picture. */
function FramedPicture({ seasonIndex }: { seasonIndex: number }) {
  const icon = seasonIndex > 0 ? SEASON_ROOM_ICONS[seasonIndex] : undefined;
  if (!icon) {
    return <Heart x={155} y={466} scale={1.5} fill={C.blush} />;
  }
  return (
    <SvgText x={155} y={464} fontSize={32} textAnchor="middle">
      {icon}
    </SvgText>
  );
}

function PersonalTouches({
  seasonIndex,
  wallpaper,
}: {
  seasonIndex: number;
  wallpaper: SeasonWallpaper;
}) {
  const lights = Array.from({ length: 9 }, (_, index) => ({
    x: 4 + index * 48,
    y: 388 + (index % 2 === 1 ? 8 : 0),
    fill: C.lights[index % C.lights.length] ?? C.butter,
  }));
  return (
    <G>
      <Path
        d="M0 392 q48 18 97 0 q48 18 97 0 q48 18 97 0 q48 18 99 0"
        fill="none"
        stroke={C.cocoa}
        strokeWidth={2}
      />
      {lights.map((light) => (
        <Path
          key={light.x}
          d={`M${light.x} ${light.y} l3 6 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 z`}
          fill={light.fill}
          stroke={C.ink}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      ))}
      <Rect
        x={124}
        y={424}
        width={62}
        height={54}
        rx={10}
        fill={C.cream}
        stroke={C.ink}
        strokeWidth={3}
      />
      <FramedPicture seasonIndex={seasonIndex} />
      <Path
        d="M58 726 a20 20 0 0 1 30 -18 a30 30 0 0 1 54 -6 a30 30 0 0 1 54 0 a30 30 0 0 1 54 6 a20 20 0 0 1 30 18 a16 16 0 0 1 -16 18 h-190 a16 16 0 0 1 -16 -18 z"
        fill={wallpaper.rug}
        stroke={C.ink}
        strokeWidth={3}
      />
    </G>
  );
}

function Confetti() {
  const pieces = [
    [24, 352],
    [88, 420],
    [140, 362],
    [208, 400],
    [262, 350],
    [330, 420],
    [372, 368],
    [60, 470],
    [190, 452],
    [300, 470],
    [118, 344],
    [356, 452],
  ];
  return (
    <G>
      {pieces.map(([x = 0, y = 0], index) => (
        <Path
          key={`${x}-${y}`}
          d={`M${x} ${y} l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 z`}
          fill={C.lights[index % C.lights.length] ?? C.gold}
        />
      ))}
    </G>
  );
}

/** The little friends that move in, one per check-in, each with a face. */
function Friends({ count, cushionX }: { count: number; cushionX: number }) {
  return (
    <G>
      {count >= 1 ? (
        <G>
          <Ellipse
            cx={cushionX}
            cy={714}
            rx={36}
            ry={19}
            fill={C.peach}
            stroke={C.ink}
            strokeWidth={3}
          />
          <RoomFace x={cushionX} y={711} />
        </G>
      ) : null}
      {count >= 2 ? (
        <G>
          <Heart x={297} y={646} scale={0.6} fill={C.blush} />
          <Rect
            x={282}
            y={654}
            width={30}
            height={32}
            rx={9}
            fill={C.cream}
            stroke={C.ink}
            strokeWidth={3}
          />
          <Path d="M312 662 q10 2 8 10 q-2 6 -8 6" fill="none" stroke={C.ink} strokeWidth={3} />
          <RoomFace x={297} y={668} size={0.8} />
        </G>
      ) : null}
      {count >= 3 ? (
        <G>
          <Path
            d="M306 744 h44 a11 11 0 0 0 2 -22 a15 15 0 0 0 -27 -8 a12 12 0 0 0 -19 11 a10 10 0 0 0 0 19 z"
            fill={C.trim}
            stroke={C.ink}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <RoomFace x={328} y={731} size={0.8} />
        </G>
      ) : null}
      {count >= 4 ? (
        <G>
          <Rect
            x={34}
            y={676}
            width={46}
            height={13}
            rx={4}
            fill={C.skyBlue}
            stroke={C.ink}
            strokeWidth={2.5}
          />
          <Rect
            x={38}
            y={663}
            width={40}
            height={13}
            rx={4}
            fill={C.butter}
            stroke={C.ink}
            strokeWidth={2.5}
          />
          <Rect
            x={36}
            y={650}
            width={42}
            height={13}
            rx={4}
            fill={C.blush}
            stroke={C.ink}
            strokeWidth={2.5}
          />
          <Circle cx={52} cy={670} r={1.6} fill={C.ink} />
          <Circle cx={62} cy={670} r={1.6} fill={C.ink} />
        </G>
      ) : null}
      {count >= 5 ? (
        <G>
          <Rect
            x={350}
            y={668}
            width={22}
            height={28}
            rx={7}
            fill={C.cream}
            stroke={C.ink}
            strokeWidth={2.5}
          />
          <Path
            d="M361 664 q-8 -9 0 -18 q8 9 0 18 z"
            fill={C.gold}
            stroke={C.ink}
            strokeWidth={1.8}
          />
          <RoomFace x={361} y={680} size={0.6} />
        </G>
      ) : null}
    </G>
  );
}

function sparkleSpot(item: number, cushionX: number): { x: number; y: number } | null {
  switch (item) {
    case 1:
      return { x: cushionX + 24, y: 678 };
    case 2:
      return { x: 318, y: 636 };
    case 3:
      return { x: 354, y: 700 };
    case 4:
      return { x: 80, y: 628 };
    case 5:
      return { x: 374, y: 640 };
    default:
      return null;
  }
}

/** Home's growing kawaii room, drawn behind the mascot. */
export const HomeRoom = memo(function HomeRoom({
  stageIndex,
  itemCount,
  newestItem,
  width,
  look = 'room',
  seasonIndex = 0,
}: HomeRoomProps) {
  const wallpaper = C.seasons[seasonIndex % C.seasons.length] ?? C.seasons[0]!;
  const shape = SHAPES[Math.max(0, Math.min(SHAPES.length - 1, stageIndex))] ?? SHAPES[0]!;
  const golden = stageIndex >= 4;
  const sparkle = newestItem ? sparkleSpot(newestItem, shape.cushionX) : null;

  return (
    <Svg
      width={width}
      height={width * ROOM_ASPECT}
      viewBox={`0 ${VIEW_TOP} ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
    >
      <Defs>
        <Pattern id="roomDots" width={26} height={26} patternUnits="userSpaceOnUse">
          <Circle cx={6} cy={6} r={2.6} fill={wallpaper.dot} />
          <Circle cx={19} cy={19} r={2.6} fill={wallpaper.accent} />
        </Pattern>
        <Pattern id="roomPlanks" width={60} height={30} patternUnits="userSpaceOnUse">
          <Rect width={60} height={30} fill={C.plank} />
          <Path d="M0 29 H60 M30 0 V29" stroke={C.plankLine} strokeWidth={2} />
        </Pattern>
      </Defs>

      {look === 'room' ? (
        <G>
          <Rect
            x={shape.x}
            y={330}
            width={shape.width}
            height={320}
            rx={shape.radius}
            fill={wallpaper.wall}
            stroke={C.ink}
            strokeWidth={shape.edge}
          />
          <Rect
            x={shape.x}
            y={330}
            width={shape.width}
            height={320}
            rx={shape.radius}
            fill="url(#roomDots)"
          />
          <Rect
            x={shape.x}
            y={612}
            width={shape.width}
            height={150}
            fill="url(#roomPlanks)"
            stroke={C.ink}
            strokeWidth={shape.edge}
          />
          <Rect
            x={shape.x}
            y={604}
            width={shape.width}
            height={12}
            rx={6}
            fill={C.trim}
            stroke={C.ink}
            strokeWidth={2.5}
          />
        </G>
      ) : (
        <Ellipse
          cx={195}
          cy={700}
          rx={shape.width / 2 + 24}
          ry={62}
          fill={C.plank}
          opacity={0.55}
        />
      )}

      {stageIndex === 1 || stageIndex === 2 ? <Bunting shape={shape} /> : null}
      {stageIndex >= 1 ? (
        <ArchedWindow golden={golden} view={getSeasonWindowView(seasonIndex % C.seasons.length)} />
      ) : null}
      {stageIndex >= 2 ? (
        <G>
          <SeasonFurniture
            seasonIndex={seasonIndex % C.seasons.length}
            roomLeft={shape.x}
            roomRadius={shape.radius}
            walls={look === 'room'}
          />
          <MushroomLamp />
        </G>
      ) : null}
      {stageIndex >= 3 ? (
        <PersonalTouches seasonIndex={seasonIndex % C.seasons.length} wallpaper={wallpaper} />
      ) : null}
      <Friends count={itemCount} cushionX={shape.cushionX} />
      {sparkle ? (
        <G>
          <Sparkle x={sparkle.x} y={sparkle.y} />
          <Sparkle x={sparkle.x + 20} y={sparkle.y + 16} size={0.6} />
        </G>
      ) : null}
      {golden ? (
        <G>
          {look === 'room' ? (
            <Rect x={-4} y={330} width={398} height={432} fill={C.goldenHour} />
          ) : (
            <Ellipse cx={195} cy={560} rx={230} ry={210} fill={C.goldenHour} />
          )}
          <Confetti />
        </G>
      ) : null}
    </Svg>
  );
});

type HomeRoomBackdropProps = Omit<HomeRoomProps, 'width'> & {
  layout: HomeMascotBackdropLayout;
  /** Room above the feet before it would reach the greeting; the room shrinks to fit. */
  maxRise?: number;
};

/** The room, as wide as the screen allows, with its floor under the mascot's feet. */
export function HomeRoomBackdrop({ layout, maxRise, ...room }: HomeRoomBackdropProps) {
  const widthScale = layout.windowWidth / VIEW_WIDTH;
  const scale = maxRise && maxRise > 0 ? Math.min(widthScale, maxRise / ROOM_FEET_Y) : widthScale;
  const width = VIEW_WIDTH * scale;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        position: 'absolute',
        left: (layout.frameWidth - width) / 2,
        top: layout.feetY - ROOM_FEET_Y * scale,
        width,
      }}
    >
      <HomeRoom {...room} width={width} />
    </View>
  );
}
