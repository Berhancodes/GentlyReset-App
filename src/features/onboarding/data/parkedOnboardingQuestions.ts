import type { OnboardingOption, ScalePoint } from '../types/onboarding';

/**
 * Questions parked from the active flow. Options stay available so older
 * persisted answers and later surfaces can still resolve labels.
 */
export const PARKED_QUESTION_OPTIONS: Record<string, readonly OnboardingOption[]> = {
  recurringThought: [
    { id: 'further-ahead', label: 'I should be further ahead.' },
    { id: 'get-it-together', label: "Why can't I just get it together?" },
    { id: 'start-tomorrow', label: "I'll start tomorrow." },
    { id: 'tired-of-starting-over', label: "I'm tired of starting over." },
    { id: 'dont-know-life', label: "I don't know what I'm doing with my life." },
    { id: 'miss-old-me', label: 'I miss the old me.' },
    { id: 'capable-of-more', label: "I know I'm capable of more." },
  ],
  selfTalkAfterSlip: [
    { id: 'here-we-go', label: 'here we go again.' },
    { id: 'ruined-progress', label: 'I ruined my progress.' },
    { id: 'restart-monday', label: "I'll restart Monday." },
    { id: 'just-lazy', label: "maybe I'm just lazy." },
    { id: 'knew-i-wouldnt', label: "I knew I wouldn't stick with it." },
    { id: 'try-again', label: "it's okay, I'll try again." },
  ],
  desiredFeelings: [
    { id: 'calm', label: 'calm' },
    { id: 'confident', label: 'confident' },
    { id: 'motivated', label: 'motivated' },
    { id: 'proud', label: 'proud of myself' },
    { id: 'energized', label: 'energized' },
    { id: 'present', label: 'present' },
    { id: 'hopeful', label: 'hopeful' },
    { id: 'in-control', label: 'in control' },
  ],
  desiredDailyLife: [
    { id: 'structure', label: 'structure' },
    { id: 'exercise', label: 'exercise' },
    { id: 'sleep', label: 'better sleep' },
    { id: 'less-phone', label: 'time away from my phone' },
    { id: 'meaningful-work', label: 'meaningful work' },
    { id: 'time-for-myself', label: 'time for myself' },
    { id: 'healthier-routines', label: 'healthier routines' },
    { id: 'people', label: 'people I care about' },
  ],
  successStatement: [
    { id: 'stuck-with-it', label: 'I actually stuck with it.' },
    { id: 'feel-better', label: 'I feel so much better.' },
    { id: 'taking-care', label: "I'm finally taking care of myself." },
    { id: 'less-hard', label: 'I stopped being so hard on myself.' },
    { id: 'routine-back', label: 'I have my routine back.' },
    { id: 'trust-myself', label: 'I trust myself again.' },
    { id: 'something-else', label: 'something else...' },
  ],
  churnRisk: [
    { id: 'asks-too-much', label: 'it asks too much from me' },
    { id: 'forget-apps', label: 'I forget about apps' },
    { id: 'no-progress', label: 'I stop seeing progress' },
    { id: 'repetitive', label: 'it becomes repetitive' },
    { id: 'too-busy', label: 'I get too busy' },
    { id: 'lose-motivation', label: 'I lose motivation' },
    { id: 'not-sure', label: "I'm not sure" },
  ],
  thirtyDayCommitment: [
    { id: 'in', label: "I'm in.", description: 'one day at a time.', selectHaptic: 'success' },
    {
      id: 'not-sure',
      label: "I'm not sure yet.",
      description: 'I still want to see what this could look like.',
    },
  ],
};

export const PARKED_SCALE_POINTS: Record<string, readonly ScalePoint[]> = {
  readiness: [
    { value: 1, label: 'just thinking about it' },
    { value: 2, label: 'not quite ready' },
    { value: 3, label: 'getting there' },
    { value: 4, label: 'pretty ready' },
    { value: 5, label: "I'm ready" },
  ],
};
