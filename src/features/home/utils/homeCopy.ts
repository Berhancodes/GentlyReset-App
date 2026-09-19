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

export function getHomeSupportLine(obstacle?: string): string {
  if (obstacle === 'too-much' || obstacle === 'overthink') {
    return "you don't need to fix everything today.";
  }

  if (obstacle === 'afraid-wont-stick') {
    return 'showing up once still counts.';
  }

  return 'give your mind somewhere quiet to go.';
}

export const HOME_IDLE_SUBTITLE = 'small steps still move you forward.';
export const HOME_COMPLETION_MESSAGE = "that's a real day. I'm proud of you.";
