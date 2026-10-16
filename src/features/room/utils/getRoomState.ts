import {
  NAME_TOKEN,
  ROOM_ITEM_COUNT,
  ROOM_STAGES,
  SEASON_LENGTH_DAYS,
  type RoomStage,
} from '../data/roomStages';

export type RoomState = {
  stage: RoomStage;
  stageIndex: number;
  /** Check-ins counted toward this season (0–30). */
  checkIns: number;
  /** How many of the drawn little friends are in the room. */
  itemCount: number;
  /** The friend that arrived with the latest check-in, while it is still one of the drawn ones. */
  newestItem: number | null;
  seasonComplete: boolean;
};

export function getRoomState(completedCount: number): RoomState {
  const checkIns = Math.max(0, Math.min(SEASON_LENGTH_DAYS, Math.floor(completedCount)));
  let stageIndex = 0;
  ROOM_STAGES.forEach((stage, index) => {
    if (checkIns >= stage.fromCheckIns) {
      stageIndex = index;
    }
  });
  const stage = ROOM_STAGES[stageIndex] ?? ROOM_STAGES[0]!;

  return {
    stage,
    stageIndex,
    checkIns,
    itemCount: Math.min(ROOM_ITEM_COUNT, checkIns),
    newestItem: checkIns >= 1 && checkIns <= ROOM_ITEM_COUNT ? checkIns : null,
    seasonComplete: checkIns >= SEASON_LENGTH_DAYS,
  };
}

export function getRoomLabel(state: RoomState): string {
  return `${state.stage.name} · ${state.checkIns} ${state.checkIns === 1 ? 'thing' : 'things'}`;
}

export function getSeasonLabel(state: RoomState, seasonNumber: number): string {
  return state.seasonComplete ? `Season ${seasonNumber} complete` : `Season ${seasonNumber}`;
}

/**
 * The milestone to celebrate, if the room reached a stage the user hasn't seen celebrated.
 * Only the latest stage is celebrated, so jumping ahead never stacks cards.
 */
export function getPendingRoomMilestone(
  state: RoomState,
  celebratedStageIndex: number,
): RoomStage | null {
  if (state.stageIndex <= celebratedStageIndex) {
    return null;
  }
  return state.stage.milestone ? state.stage : null;
}

export function fillMascotName(line: string, firstName: string | undefined): string {
  const trimmed = firstName?.trim();
  if (trimmed) {
    const name = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return line.split(NAME_TOKEN).join(name);
  }
  return line.split(` ${NAME_TOKEN}`).join('').split(NAME_TOKEN).join('');
}
