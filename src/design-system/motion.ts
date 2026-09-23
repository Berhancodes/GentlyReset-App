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
    charMs: 42,
    commaPauseMs: 90,
    sentencePauseMs: 200,
    linePauseMs: 340,
  },
} as const;

export type Motion = typeof motion;
