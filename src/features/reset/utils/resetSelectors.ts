export {
  getCompanionState,
  isCompanionMilestoneDay,
  COMPANION_MILESTONE_DAYS,
} from '../../../domain/reset/companionState';
export type { CompanionState, CompanionStateSource } from '../../../domain/reset/companionState';
export {
  getCompletedDayCount,
  getCurrentPlanDay,
  getCurrentResetTask,
  getResetProgress,
  isResetDayCompleted,
} from '../../../domain/reset/selectors';
export type {
  ResetDaySource,
  ResetProgressSource,
  ResetTaskSource,
} from '../../../domain/reset/selectors';
