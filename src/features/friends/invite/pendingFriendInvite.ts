const memory = {
  token: null as string | null,
};

export function rememberFriendInviteToken(token: string): void {
  const trimmed = token.trim();
  memory.token = trimmed.length > 0 ? trimmed : null;
}

export function peekFriendInviteToken(): string | null {
  return memory.token;
}

export function takeFriendInviteToken(): string | null {
  const token = memory.token;
  memory.token = null;
  return token;
}

export function clearFriendInviteToken(): void {
  memory.token = null;
}

export function buildFriendInvitePath(token: string): string {
  return `/friend-invite/${encodeURIComponent(token)}`;
}

export function buildFriendInviteDeepLink(token: string): string {
  return `gentlyreset://friend-invite/${encodeURIComponent(token)}`;
}

export function classifyInviteToken(input: {
  token: string;
  revokedAt: string | null;
  expiresAt: string | null;
  nowMs: number;
}): 'invalid' | 'revoked' | 'expired' | 'resolved' {
  if (input.token.trim().length === 0) {
    return 'invalid';
  }
  if (input.revokedAt) {
    return 'revoked';
  }
  if (input.expiresAt && Date.parse(input.expiresAt) <= input.nowMs) {
    return 'expired';
  }
  return 'resolved';
}

export function isOpaqueInviteToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}
