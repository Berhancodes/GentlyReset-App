export type JourneyDayKind = 'current' | 'completed' | 'future';

export type JourneyDayState = {
  day: number;
  kind: JourneyDayKind;
  todayCompleted: boolean;
};

export function getJourneyDayState(
  day: number,
  currentDay: number,
  completedDays: readonly number[],
  todayCompleted: boolean,
): JourneyDayState {
  if (day === currentDay) {
    return {
      day,
      kind: 'current',
      todayCompleted,
    };
  }

  if (completedDays.includes(day)) {
    return {
      day,
      kind: 'completed',
      todayCompleted: false,
    };
  }

  return {
    day,
    kind: 'future',
    todayCompleted: false,
  };
}

export function isJourneyDayVisuallyComplete(state: JourneyDayState): boolean {
  return state.kind === 'completed' || (state.kind === 'current' && state.todayCompleted);
}
