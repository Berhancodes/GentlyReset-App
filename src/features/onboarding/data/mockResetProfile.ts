import type { ResetProfile } from '@/features/onboarding/types/onboarding';

export const MOCK_RESET_PROFILE: ResetProfile = {
  id: 'overloaded-dreamer',
  name: 'The Overloaded Dreamer',
  summary: "you don't lack ambition.",
  description:
    'you care about changing so many things that sometimes you end up changing none of them.',
  advice: "your reset isn't about trying harder.",
  emphasized: "it's about doing less — consistently.",
  biggestPattern: 'trying to fix too much at once',
  whatUsuallyHelps: 'smaller commitments + visible progress + forgiving restarts',
  strengths: ['ambitious', 'self-aware', 'hopeful'],
  challenges: ['overthinking', 'inconsistent energy', 'trying to fix everything'],
  shareQuote: "apparently I don't need a new life.\nI need to stop trying to fix mine all at once.",
  illustrationKey: 'overloadedDreamer',
};

const RESET_PROFILES: Record<string, ResetProfile> = {
  [MOCK_RESET_PROFILE.id]: MOCK_RESET_PROFILE,
};

export function getResetProfile(profileId: string): ResetProfile {
  return RESET_PROFILES[profileId] ?? MOCK_RESET_PROFILE;
}
