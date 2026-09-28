export const ENCOURAGEMENT_KINDS = [
  'proud_of_you',
  'keep_going',
  'thinking_of_you',
  'you_got_this',
  'gentle_nudge',
] as const;

export type EncouragementKind = (typeof ENCOURAGEMENT_KINDS)[number];

/** Same sender → same recipient → same kind, once per 24 hours. */
export const ENCOURAGEMENT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const ENCOURAGEMENT_COPY: Record<EncouragementKind, string> = {
  proud_of_you: 'proud of you 🌱',
  keep_going: "keep going, you've got this",
  thinking_of_you: 'thinking of you today',
  you_got_this: 'you got this',
  gentle_nudge: 'just a little nudge 💛',
};

export function isEncouragementKind(value: string): value is EncouragementKind {
  return (ENCOURAGEMENT_KINDS as readonly string[]).includes(value);
}

export function canSendEncouragementKind(input: {
  lastSentAt: string | null;
  nowMs: number;
}): boolean {
  if (!input.lastSentAt) {
    return true;
  }
  const lastMs = Date.parse(input.lastSentAt);
  if (!Number.isFinite(lastMs)) {
    return true;
  }
  return input.nowMs - lastMs >= ENCOURAGEMENT_COOLDOWN_MS;
}

export function encouragementTimeLabel(createdAt: string, nowMs: number): string {
  const createdMs = Date.parse(createdAt);
  if (!Number.isFinite(createdMs)) {
    return '';
  }
  const elapsedMs = Math.max(0, nowMs - createdMs);
  const minutes = Math.floor(elapsedMs / 60000);
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}
