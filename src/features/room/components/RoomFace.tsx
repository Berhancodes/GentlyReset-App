import { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/design-system';

const C = colors.room;

/** The little kawaii face every friend and piece of furniture in the room wears. */
export function RoomFace({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <G>
      <Circle cx={x - 6 * size} cy={y} r={2.1 * size} fill={C.ink} />
      <Circle cx={x + 6 * size} cy={y} r={2.1 * size} fill={C.ink} />
      <Path
        d={`M${x - 3 * size} ${y + 4 * size} q${3 * size} ${3 * size} ${6 * size} 0`}
        fill="none"
        stroke={C.ink}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Ellipse cx={x - 11 * size} cy={y + 5 * size} rx={3.4 * size} ry={2 * size} fill={C.blush} />
      <Ellipse cx={x + 11 * size} cy={y + 5 * size} rx={3.4 * size} ry={2 * size} fill={C.blush} />
    </G>
  );
}
