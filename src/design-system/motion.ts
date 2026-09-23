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
    charMs: 52,
    commaPauseMs: 120,
    sentencePauseMs: 260,
    linePauseMs: 400,
    lineFadeMs: 220,
  },
  breathing: {
    restHoldMs: 600,
    inhaleEndMs: 3000,
    holdEndMs: 3800,
    exhaleEndMs: 6500,
    cycleMs: 7500,
    scaleX: 1.008,
    scaleY: 1.015,
    translateY: -1.5,
  },
} as const;

export type Motion = typeof motion;
