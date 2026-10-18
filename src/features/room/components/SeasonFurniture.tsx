import type { ReactElement } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/design-system';
import { RoomFace } from '@/features/room/components/RoomFace';

/**
 * What makes each season's room *that* room: one signature piece of furniture on the left wall
 * and the view through the window. Everything else (walls, lamp, lights, little friends) is shared.
 * All pieces are drawn in HomeRoom's 390-wide box, standing on the floor line at y≈608.
 */

const C = colors.room;

export type WindowView = 'sun' | 'moon' | 'rainbow' | 'bubbles' | 'garden' | 'cafe';

/** In SEASON_ROOMS order. */
const WINDOW_VIEWS: readonly WindowView[] = [
  'sun', // cozy corner
  'moon', // reading nook
  'cafe', // little kitchen
  'garden', // garden window
  'rainbow', // art corner
  'sun', // music room
  'garden', // tea room
  'moon', // star attic
  'bubbles', // bubble bath
  'sun', // craft table
  'sun', // sunroom
  'garden', // front porch
];

export function getSeasonWindowView(seasonIndex: number): WindowView {
  return WINDOW_VIEWS[seasonIndex % WINDOW_VIEWS.length] ?? 'sun';
}

function Leaf({
  x,
  y,
  angle,
  size = 1,
  fill = C.leaf,
}: {
  x: number;
  y: number;
  angle: number;
  size?: number;
  fill?: string;
}) {
  const s = size;
  return (
    <G transform={`translate(${x} ${y}) rotate(${angle})`}>
      <Path
        d={`M0 0 q${8 * s} ${-11 * s} 0 ${-24 * s} q${-8 * s} ${13 * s} 0 ${24 * s} z`}
        fill={fill}
        stroke={C.ink}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d={`M0 ${-3 * s} V${-19 * s}`} stroke={C.ink} strokeWidth={1} opacity={0.5} />
    </G>
  );
}

function SmallStar({ x, y, fill = C.gold }: { x: number; y: number; fill?: string }) {
  return (
    <Path
      d={`M${x} ${y - 6} l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z`}
      fill={fill}
      stroke={C.ink}
      strokeWidth={1}
    />
  );
}

function Pot({
  x,
  bottom,
  width,
  height,
  fill,
}: {
  x: number;
  bottom: number;
  width: number;
  height: number;
  fill: string;
}) {
  return (
    <Path
      d={`M${x} ${bottom - height} h${width} l-4 ${height} h${-(width - 8)} z`}
      fill={fill}
      stroke={C.ink}
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  );
}

/** Extra bits inside the arched window, drawn over its sky. */
export function WindowScene({ view }: { view: WindowView }) {
  switch (view) {
    case 'moon':
      return (
        <G>
          <Circle cx={282} cy={440} r={16} fill={C.butter} stroke={C.ink} strokeWidth={2.5} />
          <Circle cx={292} cy={433} r={14} fill={C.night} />
          <SmallStar x={246} y={428} fill={C.butter} />
          <SmallStar x={254} y={476} fill={C.butter} />
          <SmallStar x={300} y={480} fill={C.butter} />
          <SmallStar x={266} y={410} fill={C.butter} />
        </G>
      );
    case 'rainbow':
      return (
        <G>
          <Path d="M232 500 a38 38 0 0 1 76 0" fill="none" stroke={C.blush} strokeWidth={7} />
          <Path d="M240 500 a30 30 0 0 1 60 0" fill="none" stroke={C.butter} strokeWidth={7} />
          <Path d="M248 500 a22 22 0 0 1 44 0" fill="none" stroke={C.skyBlue} strokeWidth={7} />
          <Path
            d="M232 498 a7 7 0 0 1 8 -7 a9 9 0 0 1 16 2 a6 6 0 0 1 3 5 z"
            fill={C.trim}
            stroke={C.ink}
            strokeWidth={2}
          />
          <Path
            d="M284 498 a7 7 0 0 1 8 -7 a9 9 0 0 1 16 2 a6 6 0 0 1 3 5 z"
            fill={C.trim}
            stroke={C.ink}
            strokeWidth={2}
          />
        </G>
      );
    case 'bubbles':
      return (
        <G>
          {[
            [250, 432, 10],
            [284, 418, 7],
            [294, 462, 12],
            [256, 476, 6],
            [272, 450, 4],
          ].map(([cx = 0, cy = 0, r = 0]) => (
            <G key={`${cx}-${cy}`}>
              <Circle cx={cx} cy={cy} r={r} fill="none" stroke={C.trim} strokeWidth={2.5} />
              <Path
                d={`M${cx - r * 0.5} ${cy - r * 0.2} a${r * 0.55} ${r * 0.55} 0 0 1 ${r * 0.45} ${-r * 0.4}`}
                fill="none"
                stroke={C.trim}
                strokeWidth={1.6}
              />
            </G>
          ))}
        </G>
      );
    case 'garden':
      return (
        <G>
          <Path d="M244 486 V472 M270 486 V468 M296 486 V474" stroke={C.leaf} strokeWidth={2.5} />
          <Leaf x={236} y={486} angle={-50} size={0.6} />
          <Leaf x={258} y={486} angle={-25} size={0.65} />
          <Leaf x={282} y={486} angle={25} size={0.65} />
          <Leaf x={304} y={486} angle={50} size={0.6} />
          <Circle cx={244} cy={468} r={6} fill={C.blush} stroke={C.ink} strokeWidth={2} />
          <Circle cx={270} cy={464} r={6} fill={C.butter} stroke={C.ink} strokeWidth={2} />
          <Circle cx={296} cy={470} r={6} fill={C.blush} stroke={C.ink} strokeWidth={2} />
          <Circle cx={244} cy={468} r={2} fill={C.gold} />
          <Circle cx={270} cy={464} r={2} fill={C.gold} />
          <Circle cx={296} cy={470} r={2} fill={C.gold} />
          <Rect
            x={228}
            y={484}
            width={84}
            height={15}
            rx={3}
            fill={C.plank}
            stroke={C.ink}
            strokeWidth={2.5}
          />
        </G>
      );
    case 'cafe':
      return (
        <G>
          <Rect
            x={226}
            y={462}
            width={88}
            height={36}
            fill={C.blush}
            stroke={C.ink}
            strokeWidth={2.5}
          />
          <Path
            d="M242 462 V498 M258 462 V498 M274 462 V498 M290 462 V498 M306 462 V498 M226 474 H314 M226 486 H314"
            stroke={C.trim}
            strokeWidth={2}
            opacity={0.8}
          />
          <Path d="M218 462 H322" stroke={C.cocoa} strokeWidth={3} strokeLinecap="round" />
        </G>
      );
    case 'sun':
      return null;
  }
}

/** Season 1, cozy corner: a little shelf of books and treasures. */
function CozyShelf() {
  return (
    <G>
      <Rect
        x={22}
        y={440}
        width={78}
        height={168}
        rx={14}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Path d="M22 498 H100 M22 556 H100" stroke={C.ink} strokeWidth={3} />
      <Rect
        x={32}
        y={470}
        width={11}
        height={28}
        rx={3}
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Rect
        x={45}
        y={474}
        width={11}
        height={24}
        rx={3}
        fill={C.butter}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Rect
        x={58}
        y={466}
        width={12}
        height={32}
        rx={3}
        fill={C.skyBlue}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Path d="M76 498 v-20 a8 8 0 0 1 16 0 v20 z" fill={C.trim} stroke={C.ink} strokeWidth={2} />
      <Path d="M81 484 l2 -4 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 z" fill={C.gold} />
      <Path d="M40 556 v-16 h24 v16 z" fill={C.peach} stroke={C.ink} strokeWidth={2} />
      <RoomFace x={52} y={547} size={0.55} />
      <Ellipse cx={52} cy={536} rx={10} ry={7} fill={C.blush} stroke={C.ink} strokeWidth={2} />
    </G>
  );
}

const BOOK_WIDTHS = [10, 13, 9, 12, 11, 10, 13, 9];
const BOOK_HEIGHTS = [36, 44, 32, 40, 38, 30, 42, 34];
const BOOK_COLORS = [C.blush, C.butter, C.skyBlue, C.peach, C.leafSoft, C.cocoa];

/** Season 2, reading nook: a tall bookcase packed with books. */
function Bookcase() {
  const books: { x: number; bottom: number; width: number; height: number; fill: string }[] = [];
  [478, 542, 606].forEach((bottom, shelf) => {
    let x = 24;
    let index = shelf * 3;
    while (true) {
      const width = BOOK_WIDTHS[index % BOOK_WIDTHS.length] ?? 10;
      if (x + width > 106) break;
      books.push({
        x,
        bottom,
        width,
        height: BOOK_HEIGHTS[index % BOOK_HEIGHTS.length] ?? 36,
        fill: BOOK_COLORS[index % BOOK_COLORS.length] ?? C.blush,
      });
      x += width + 1;
      index += 1;
    }
  });
  return (
    <G>
      <Rect
        x={18}
        y={414}
        width={94}
        height={194}
        rx={10}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Path d="M18 478 H112 M18 542 H112" stroke={C.ink} strokeWidth={3} />
      {books.map((book) => (
        <Rect
          key={`${book.x}-${book.bottom}`}
          x={book.x}
          y={book.bottom - book.height}
          width={book.width}
          height={book.height}
          rx={2}
          fill={book.fill}
          stroke={C.ink}
          strokeWidth={1.8}
        />
      ))}
    </G>
  );
}

/** Season 3, little kitchen: tiles, a counter, a kettle with a face and hanging pans. */
function KitchenCounter() {
  return (
    <G>
      <Rect x={14} y={468} width={104} height={44} fill={C.trim} stroke={C.ink} strokeWidth={2} />
      <Path
        d="M27 468 V512 M40 468 V512 M53 468 V512 M66 468 V512 M79 468 V512 M92 468 V512 M105 468 V512 M14 483 H118 M14 497 H118"
        stroke={C.skyBlue}
        strokeWidth={1.5}
      />
      <Path d="M24 436 H112" stroke={C.cocoa} strokeWidth={3} strokeLinecap="round" />
      <Path d="M40 436 V454 M62 436 V452 M90 436 V446" stroke={C.ink} strokeWidth={2} />
      <Ellipse cx={40} cy={460} rx={4} ry={7} fill={C.butter} stroke={C.ink} strokeWidth={2} />
      <Rect
        x={56}
        y={452}
        width={12}
        height={14}
        rx={3}
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Circle cx={90} cy={458} r={12} fill={C.cocoa} stroke={C.ink} strokeWidth={2.5} />
      <Path
        d="M30 510 q-2 -30 20 -30 q22 0 20 30 z"
        fill={C.cream}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Path d="M40 482 q10 -8 20 0" fill={C.butter} stroke={C.ink} strokeWidth={2} />
      <Circle cx={50} cy={476} r={3} fill={C.gold} stroke={C.ink} strokeWidth={1.5} />
      <Path
        d="M70 500 l12 -10 l3 4 l-11 12"
        fill={C.cream}
        stroke={C.ink}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <RoomFace x={50} y={497} size={0.55} />
      <Path
        d="M94 482 q-4 -6 0 -12 M104 482 q-4 -6 0 -12"
        fill="none"
        stroke={C.cocoa}
        strokeWidth={1.5}
      />
      <Rect
        x={84}
        y={490}
        width={30}
        height={20}
        rx={5}
        fill={C.skyBlue}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Path
        d="M82 490 h34 M84 497 h-5 M114 497 h5"
        stroke={C.ink}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Rect
        x={10}
        y={510}
        width={112}
        height={12}
        rx={4}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Rect
        x={14}
        y={522}
        width={104}
        height={86}
        rx={6}
        fill={C.peach}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Path d="M66 528 V602" stroke={C.ink} strokeWidth={2} />
      <Circle cx={58} cy={562} r={3} fill={C.ink} />
      <Circle cx={74} cy={562} r={3} fill={C.ink} />
    </G>
  );
}

/** Season 4, garden window: a plant stand and a hanging plant. */
function PlantStand() {
  return (
    <G>
      <Path d="M64 330 V406" stroke={C.cocoa} strokeWidth={2} />
      <Path
        d="M52 424 q-6 12 0 24 M76 424 q6 12 0 22"
        fill="none"
        stroke={C.leaf}
        strokeWidth={2.5}
      />
      <Leaf x={50} y={440} angle={-120} size={0.55} />
      <Leaf x={80} y={438} angle={120} size={0.55} />
      <Path
        d="M48 406 h32 l-5 18 h-22 z"
        fill={C.peach}
        stroke={C.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Rect x={22} y={500} width={6} height={108} fill={C.plank} stroke={C.ink} strokeWidth={2} />
      <Rect x={100} y={500} width={6} height={108} fill={C.plank} stroke={C.ink} strokeWidth={2} />
      <Leaf x={43} y={480} angle={-40} />
      <Leaf x={43} y={480} angle={0} />
      <Leaf x={43} y={480} angle={40} />
      <Leaf x={84} y={478} angle={-22} size={1.3} />
      <Leaf x={84} y={478} angle={18} size={1.4} fill={C.leafSoft} />
      <Pot x={30} bottom={500} width={26} height={22} fill={C.peach} />
      <Pot x={70} bottom={500} width={28} height={24} fill={C.blush} />
      <Rect
        x={16}
        y={500}
        width={96}
        height={9}
        rx={4}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Leaf x={63} y={534} angle={-55} size={1.05} />
      <Leaf x={63} y={534} angle={-18} size={1.1} fill={C.leafSoft} />
      <Leaf x={63} y={534} angle={20} size={1.1} />
      <Leaf x={63} y={534} angle={55} size={1.05} fill={C.leafSoft} />
      <Pot x={46} bottom={556} width={34} height={24} fill={C.butter} />
      <RoomFace x={63} y={544} size={0.5} />
      <Rect
        x={16}
        y={556}
        width={96}
        height={9}
        rx={4}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={2.5}
      />
    </G>
  );
}

/** Season 5, art corner: an easel with a rainbow painting and a palette. */
function Easel() {
  return (
    <G>
      <Path d="M64 432 L64 608" stroke={C.cocoa} strokeWidth={5} strokeLinecap="round" />
      <Path
        d="M64 432 L28 608 M64 432 L100 608"
        stroke={C.cocoa}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Rect
        x={26}
        y={440}
        width={76}
        height={66}
        rx={4}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Path d="M38 494 a26 26 0 0 1 52 0" fill="none" stroke={C.blush} strokeWidth={6} />
      <Path d="M45 494 a19 19 0 0 1 38 0" fill="none" stroke={C.butter} strokeWidth={6} />
      <Path d="M52 494 a12 12 0 0 1 24 0" fill="none" stroke={C.skyBlue} strokeWidth={6} />
      <Rect
        x={22}
        y={506}
        width={84}
        height={9}
        rx={3}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Ellipse cx={64} cy={584} rx={28} ry={17} fill={C.plank} stroke={C.ink} strokeWidth={2.5} />
      <Circle cx={80} cy={590} r={4} fill={C.cream} stroke={C.ink} strokeWidth={1.5} />
      <Circle cx={48} cy={580} r={5} fill={C.blush} stroke={C.ink} strokeWidth={1.2} />
      <Circle cx={60} cy={575} r={5} fill={C.butter} stroke={C.ink} strokeWidth={1.2} />
      <Circle cx={73} cy={577} r={5} fill={C.skyBlue} stroke={C.ink} strokeWidth={1.2} />
      <Circle cx={56} cy={590} r={5} fill={C.leaf} stroke={C.ink} strokeWidth={1.2} />
      <Circle cx={112} cy={452} r={4} fill={C.blush} />
      <Circle cx={106} cy={470} r={3} fill={C.skyBlue} />
      <Circle cx={16} cy={470} r={4} fill={C.butter} />
    </G>
  );
}

function MusicNote({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={y} rx={5} ry={4} fill={C.ink} />
      <Path
        d={`M${x + 4.5} ${y} V${y - 18} q6 3 8 8`}
        fill="none"
        stroke={C.ink}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </G>
  );
}

const PIANO_KEYS = 10;
const KEY_WIDTH = 9.2;

/** Season 6, music room: an upright piano with a face and notes floating up. */
function Piano() {
  const dividers = Array.from(
    { length: PIANO_KEYS - 1 },
    (_, index) => 18 + KEY_WIDTH * (index + 1),
  );
  const blackKeys = [1, 2, 4, 5, 6, 8, 9].map((index) => 18 + KEY_WIDTH * index - 2.5);
  return (
    <G>
      <MusicNote x={26} y={444} />
      <MusicNote x={104} y={432} />
      <Rect
        x={40}
        y={446}
        width={48}
        height={26}
        rx={3}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Path d="M46 454 h36 M46 461 h36" stroke={C.cocoa} strokeWidth={1.5} />
      <Rect
        x={14}
        y={482}
        width={100}
        height={126}
        rx={6}
        fill={C.cocoa}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Rect
        x={10}
        y={470}
        width={108}
        height={12}
        rx={4}
        fill={C.cocoa}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Circle cx={56} cy={499} r={2.1} fill={C.cream} />
      <Circle cx={72} cy={499} r={2.1} fill={C.cream} />
      <Path
        d="M61 503 q3 3 6 0"
        fill="none"
        stroke={C.cream}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Rect
        x={18}
        y={526}
        width={92}
        height={20}
        rx={2}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Path d={dividers.map((x) => `M${x} 526 V546`).join(' ')} stroke={C.ink} strokeWidth={1.2} />
      {blackKeys.map((x) => (
        <Rect key={x} x={x} y={526} width={5} height={12} rx={1} fill={C.ink} />
      ))}
      <Rect
        x={28}
        y={558}
        width={72}
        height={36}
        rx={4}
        fill="none"
        stroke={C.plankLine}
        strokeWidth={2}
      />
      <Rect x={54} y={598} width={6} height={9} rx={2} fill={C.gold} />
      <Rect x={68} y={598} width={6} height={9} rx={2} fill={C.gold} />
    </G>
  );
}

function TeaCup({ x, fill }: { x: number; fill: string }) {
  return (
    <G>
      <Path d={`M${x + 4} 514 q-3 -5 0 -10`} fill="none" stroke={C.cocoa} strokeWidth={1.5} />
      <Path
        d={`M${x} 520 h14 v8 a4 4 0 0 1 -4 4 h-6 a4 4 0 0 1 -4 -4 z`}
        fill={fill}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Path d={`M${x + 14} 522 q5 0 4 4 q-1 3 -4 3`} fill="none" stroke={C.ink} strokeWidth={1.8} />
    </G>
  );
}

/** Season 7, tea room: a sideboard with a teapot, cups and a shelf of tea jars. */
function TeaSideboard() {
  return (
    <G>
      <Rect
        x={22}
        y={428}
        width={22}
        height={6}
        rx={2}
        fill={C.cocoa}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <Rect
        x={24}
        y={432}
        width={18}
        height={26}
        rx={5}
        fill={C.skyBlue}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Rect
        x={48}
        y={434}
        width={22}
        height={6}
        rx={2}
        fill={C.cocoa}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <Rect
        x={50}
        y={438}
        width={18}
        height={20}
        rx={5}
        fill={C.butter}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Rect
        x={74}
        y={426}
        width={24}
        height={6}
        rx={2}
        fill={C.cocoa}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <Rect
        x={76}
        y={430}
        width={20}
        height={28}
        rx={5}
        fill={C.leafSoft}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Rect
        x={18}
        y={458}
        width={92}
        height={7}
        rx={3}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={2}
      />
      <Path
        d="M24 514 l-12 -8 l-2 4 l10 10"
        fill={C.cream}
        stroke={C.ink}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M64 508 q12 2 8 14 q-2 4 -8 4" fill="none" stroke={C.ink} strokeWidth={2.5} />
      <Ellipse cx={44} cy={516} rx={20} ry={15} fill={C.cream} stroke={C.ink} strokeWidth={2.5} />
      <Path d="M34 503 q10 -8 20 0 z" fill={C.blush} stroke={C.ink} strokeWidth={2} />
      <Circle cx={44} cy={496} r={3} fill={C.gold} stroke={C.ink} strokeWidth={1.5} />
      <RoomFace x={44} y={516} size={0.55} />
      <TeaCup x={78} fill={C.blush} />
      <TeaCup x={98} fill={C.skyBlue} />
      <Rect
        x={10}
        y={532}
        width={108}
        height={10}
        rx={4}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Rect
        x={14}
        y={542}
        width={100}
        height={66}
        rx={6}
        fill={C.peach}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Path d="M64 548 V602" stroke={C.ink} strokeWidth={2} />
      <Circle cx={56} cy={574} r={3} fill={C.ink} />
      <Circle cx={72} cy={574} r={3} fill={C.ink} />
    </G>
  );
}

/** Season 8, star attic: a sloped roof and a telescope pointed at the window. */
function AtticTelescope({ roomLeft, roomRadius, walls }: SeasonFurnitureProps) {
  return (
    <G>
      {walls ? (
        <G>
          <Path
            d={`M${roomLeft} ${330 + roomRadius} A${roomRadius} ${roomRadius} 0 0 1 ${roomLeft + roomRadius} 330 H150 L${roomLeft} 456 Z`}
            fill={C.plank}
            stroke={C.ink}
            strokeWidth={3}
          />
          <Path
            d={`M${roomLeft} 384 L84 330 M${roomLeft} 420 L124 330`}
            stroke={C.plankLine}
            strokeWidth={2}
          />
        </G>
      ) : null}
      <SmallStar x={40} y={480} />
      <SmallStar x={100} y={462} />
      <SmallStar x={22} y={530} />
      <Path
        d="M62 548 L38 608 M62 548 L86 608 M62 548 L62 608"
        stroke={C.cocoa}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <G transform="rotate(-30 62 548)">
        <Rect
          x={22}
          y={542}
          width={8}
          height={12}
          rx={2}
          fill={C.cocoa}
          stroke={C.ink}
          strokeWidth={2}
        />
        <Rect
          x={28}
          y={538}
          width={74}
          height={20}
          rx={8}
          fill={C.skyBlue}
          stroke={C.ink}
          strokeWidth={3}
        />
        <Rect
          x={98}
          y={534}
          width={10}
          height={28}
          rx={4}
          fill={C.butter}
          stroke={C.ink}
          strokeWidth={2.5}
        />
        <RoomFace x={64} y={546} size={0.5} />
      </G>
    </G>
  );
}

/** Season 9, bubble bath: a clawfoot tub full of foam, a rubber duck and a towel. */
function BubbleTub() {
  const foam = [
    [20, 542, 9],
    [34, 536, 11],
    [50, 540, 9],
    [64, 534, 12],
    [80, 540, 10],
    [96, 536, 11],
    [112, 542, 9],
  ];
  return (
    <G>
      <Path d="M26 452 H74" stroke={C.cocoa} strokeWidth={3} strokeLinecap="round" />
      <Rect
        x={32}
        y={452}
        width={36}
        height={48}
        rx={4}
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Path d="M33 486 h34 M33 492 h34" stroke={C.trim} strokeWidth={3} />
      {[
        [30, 512, 6],
        [48, 492, 4],
        [104, 490, 5],
        [92, 470, 3],
      ].map(([cx = 0, cy = 0, r = 0]) => (
        <Circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={C.skyBlue}
          strokeWidth={2}
        />
      ))}
      <Path
        d="M12 552 H120 V570 a34 34 0 0 1 -34 34 H46 a34 34 0 0 1 -34 -34 Z"
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={3}
      />
      {foam.map(([cx = 0, cy = 0, r = 0]) => (
        <Circle key={cx} cx={cx} cy={cy} r={r} fill={C.trim} stroke={C.ink} strokeWidth={1.8} />
      ))}
      <Ellipse cx={94} cy={524} rx={12} ry={8} fill={C.gold} stroke={C.ink} strokeWidth={2} />
      <Circle cx={102} cy={514} r={7} fill={C.gold} stroke={C.ink} strokeWidth={2} />
      <Path d="M108 514 l6 1 l-6 3 z" fill={C.peach} stroke={C.ink} strokeWidth={1.5} />
      <Circle cx={103} cy={512} r={1.3} fill={C.ink} />
      <Rect
        x={8}
        y={546}
        width={116}
        height={10}
        rx={5}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <RoomFace x={66} y={578} size={0.8} />
      <Circle cx={32} cy={605} r={5} fill={C.gold} stroke={C.ink} strokeWidth={2} />
      <Circle cx={100} cy={605} r={5} fill={C.gold} stroke={C.ink} strokeWidth={2} />
    </G>
  );
}

function Spool({ x, fill }: { x: number; fill: string }) {
  return (
    <G>
      <Rect x={x + 2} y={450} width={10} height={14} fill={fill} stroke={C.ink} strokeWidth={1.5} />
      <Rect
        x={x}
        y={446}
        width={14}
        height={4}
        rx={1}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <Rect
        x={x}
        y={464}
        width={14}
        height={4}
        rx={1}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={1.5}
      />
    </G>
  );
}

/** Season 10, craft table: yarn and knitting on a little table, spools on a pegboard. */
function CraftTable() {
  return (
    <G>
      <Rect
        x={18}
        y={434}
        width={92}
        height={50}
        rx={6}
        fill={C.cream}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Spool x={30} fill={C.blush} />
      <Spool x={56} fill={C.skyBlue} />
      <Spool x={82} fill={C.leafSoft} />
      <Path
        d="M60 520 L92 548 M66 516 L94 544"
        stroke={C.cocoa}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Circle cx={40} cy={532} r={16} fill={C.blush} stroke={C.ink} strokeWidth={2.5} />
      <Path
        d="M28 524 q12 -6 24 4 M26 540 q12 -8 26 0"
        fill="none"
        stroke={C.trim}
        strokeWidth={2}
      />
      <RoomFace x={40} y={533} size={0.6} />
      <Circle cx={78} cy={536} r={12} fill={C.skyBlue} stroke={C.ink} strokeWidth={2.5} />
      <Path d="M70 530 q8 -4 16 4 M68 540 q8 -4 18 2" fill="none" stroke={C.trim} strokeWidth={2} />
      <Circle cx={60} cy={520} r={2.5} fill={C.gold} />
      <Circle cx={66} cy={516} r={2.5} fill={C.gold} />
      <Rect
        x={10}
        y={548}
        width={110}
        height={10}
        rx={4}
        fill={C.plank}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Rect x={18} y={558} width={8} height={50} fill={C.plank} stroke={C.ink} strokeWidth={2} />
      <Rect x={104} y={558} width={8} height={50} fill={C.plank} stroke={C.ink} strokeWidth={2} />
      <Circle cx={52} cy={584} r={7} fill={C.butter} stroke={C.ink} strokeWidth={2} />
      <Circle cx={72} cy={584} r={7} fill={C.leafSoft} stroke={C.ink} strokeWidth={2} />
      <Path
        d="M36 586 h56 l-4 22 h-48 z"
        fill={C.peach}
        stroke={C.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path d="M38 596 h52" stroke={C.cocoa} strokeWidth={1.5} />
    </G>
  );
}

/** Season 11, sunroom: a big palm and a comfy armchair soaking up the sun. */
function SunLounger() {
  return (
    <G>
      <Path
        d="M30 578 q-6 -56 6 -110"
        fill="none"
        stroke={C.cocoa}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <Leaf x={36} y={470} angle={-85} size={2} />
      <Leaf x={36} y={470} angle={-45} size={2.1} fill={C.leafSoft} />
      <Leaf x={36} y={470} angle={-5} size={2} />
      <Leaf x={36} y={470} angle={40} size={2.1} fill={C.leafSoft} />
      <Leaf x={36} y={470} angle={80} size={2} />
      <Pot x={14} bottom={608} width={34} height={32} fill={C.peach} />
      <Path
        d="M70 594 L66 608 M114 594 L118 608"
        stroke={C.cocoa}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Path
        d="M62 560 V518 q0 -16 16 -16 h28 q16 0 16 16 V560 z"
        fill={C.butter}
        stroke={C.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path
        d="M78 504 V556 M92 502 V556 M106 504 V556"
        stroke={C.gold}
        strokeWidth={3}
        opacity={0.6}
      />
      <RoomFace x={92} y={526} size={0.6} />
      <Rect
        x={56}
        y={556}
        width={72}
        height={22}
        rx={9}
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Rect
        x={50}
        y={540}
        width={14}
        height={50}
        rx={7}
        fill={C.butter}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Rect
        x={120}
        y={540}
        width={14}
        height={50}
        rx={7}
        fill={C.butter}
        stroke={C.ink}
        strokeWidth={2.5}
      />
      <Rect
        x={58}
        y={578}
        width={68}
        height={16}
        rx={5}
        fill={C.butter}
        stroke={C.ink}
        strokeWidth={2.5}
      />
    </G>
  );
}

/** Season 12, front porch: a front door with a wreath and a welcome mat. */
function FrontDoor() {
  return (
    <G>
      <Rect
        x={16}
        y={414}
        width={96}
        height={194}
        rx={10}
        fill={C.trim}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Rect
        x={24}
        y={422}
        width={80}
        height={186}
        rx={6}
        fill={C.skyBlue}
        stroke={C.ink}
        strokeWidth={3}
      />
      <Rect
        x={34}
        y={552}
        width={60}
        height={44}
        rx={4}
        fill="none"
        stroke={C.ink}
        strokeWidth={2}
      />
      <Circle cx={64} cy={454} r={14} fill={C.sky} stroke={C.ink} strokeWidth={2.5} />
      <Path d="M64 440 V468 M50 454 H78" stroke={C.ink} strokeWidth={2} />
      <Circle cx={64} cy={512} r={16} fill="none" stroke={C.leaf} strokeWidth={7} />
      <Circle cx={64} cy={512} r={19.5} fill="none" stroke={C.ink} strokeWidth={1.8} />
      <Circle cx={64} cy={512} r={12.5} fill="none" stroke={C.ink} strokeWidth={1.8} />
      <Path
        d="M64 528 l-8 -5 v10 z M64 528 l8 -5 v10 z"
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <Circle cx={94} cy={540} r={4} fill={C.gold} stroke={C.ink} strokeWidth={2} />
      <Rect
        x={18}
        y={602}
        width={92}
        height={10}
        rx={3}
        fill={C.blush}
        stroke={C.ink}
        strokeWidth={2}
      />
    </G>
  );
}

type SeasonFurnitureProps = {
  seasonIndex: number;
  /** Left edge of the room's walls at this stage, for pieces that follow the wall (the attic roof). */
  roomLeft: number;
  /** Corner radius of the room's walls at this stage, so the attic roof follows the rounded corner. */
  roomRadius: number;
  /** False when the room is drawn without walls ('open' look). */
  walls: boolean;
};

const PIECES: readonly ((props: SeasonFurnitureProps) => ReactElement)[] = [
  CozyShelf,
  Bookcase,
  KitchenCounter,
  PlantStand,
  Easel,
  Piano,
  TeaSideboard,
  AtticTelescope,
  BubbleTub,
  CraftTable,
  SunLounger,
  FrontDoor,
];

/** The signature piece that arrives with week 2 and makes the room look like its name. */
export function SeasonFurniture(props: SeasonFurnitureProps) {
  const Piece = PIECES[props.seasonIndex % PIECES.length] ?? CozyShelf;
  return <Piece {...props} />;
}
