export function getHomeGreeting(now = new Date()): string {
  const hour = now.getHours();

  if (hour < 12) {
    return 'good morning';
  }

  if (hour < 17) {
    return 'good afternoon';
  }

  return 'good evening';
}

export function getHomeTaskTitle(minutes: number): string {
  const unit = minutes === 1 ? 'minute' : 'minutes';
  return `journal for ${minutes} ${unit}`;
}

export const HOME_IDLE_SUBTITLE = 'small steps still move\nyou forward.';
export const HOME_TASK_DESCRIPTION = 'a calmer mind starts here.';
