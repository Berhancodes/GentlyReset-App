/**
 * Shared timing for selection interactions. Keep these soft and short.
 */
export const motion = {
  duration: {
    selection: 180,
    press: 120,
  },
  scale: {
    press: 0.97,
    checkFrom: 0.7,
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
    charMs: 26,
    commaPauseMs: 70,
    sentencePauseMs: 150,
    linePauseMs: 220,
    lineFadeMs: 180,
  },
} as const;

export type Motion = typeof motion;
