export type ResetPersonalization = {
  dailyCommitment?: string;
  supportStyle?: string;
  primaryObstacle?: string;
  resetReason?: string;
  desiredFeelings: readonly string[];
  missedDayResponse?: string;
};

export type TodayTask = {
  id: string;
  day: number;
  title: string;
  description: string;
  minutes: number;
};

export type ResetSnapshot = {
  currentDay: number;
  completedDays: number[];
  todayCompleted: boolean;
  todayStarted: boolean;
  todayTask: TodayTask;
  resetStartedOn: string | null;
  lastSeenOn: string | null;
  lastCompletedOn: string | null;
  streak: number;
  missedYesterday: boolean;
  resetTypeId: string;
  personalization: ResetPersonalization;
};
