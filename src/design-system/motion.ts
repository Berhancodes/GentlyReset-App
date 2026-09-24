/**
 * Shared timing for selection interactions. Keep these soft and short.
 */
export const motion = {
  duration: {
    selection: 180,
    press: 120,
    loadingMark: 240,
    loadingPulse: 900,
    loadingHold: 560,
    pillReveal: 560,
  },
  scale: {
    press: 0.97,
    checkFrom: 0.7,
    loadingPop: 1.12,
  },
  spring: {
    release: {
      damping: 20,
      stiffness: 280,
      mass: 0.35,
      overshootClamping: true,
    },
  },
  typewriter: {
    charMs: 52,
    commaPauseMs: 120,
    sentencePauseMs: 260,
    linePauseMs: 400,
    lineFadeMs: 220,
    eraseMs: 320,
    pillStaggerMs: 90,
  },
} as const;

export type Motion = typeof motion;
