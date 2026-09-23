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
    idleMs: 500,
    inhaleMs: 2500,
    holdMs: 400,
    exhaleMs: 3000,
    restMs: 700,
    eyeCrossfadeMs: 450,
    scaleX: 1.018,
    scaleY: 1.03,
    translateY: -3,
    indicatorRestWidth: 40,
    indicatorPeakWidth: 58,
    indicatorHeight: 6,
  },
} as const;

export type Motion = typeof motion;
