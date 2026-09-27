/**
 * Shared timing for selection interactions. Keep these soft and short.
 */
export const MOTION_EASING_STANDARD = [0.33, 0, 0.2, 1] as const;

export const motion = {
  duration: {
    selection: 180,
    press: 240,
    screen: 280,
    loadingMark: 240,
    loadingPulse: 900,
    loadingHold: 560,
    pillReveal: 820,
    storyHold: 2800,
    journeySun: 820,
    journeyLeftCloud: 1040,
    journeyRightCloud: 980,
    journeyUpperCloud: 780,
  },
  scale: {
    press: 0.97,
    checkFrom: 0.7,
    loadingPop: 1.12,
    pillFrom: 0.98,
  },
  offset: {
    press: 8,
    journeySunRise: 12,
    journeyLeftCloudLift: 8,
    journeyRightCloudLift: -6,
    journeyUpperCloudX: 24,
    journeyUpperCloudY: -16,
    journeySkyEdgePad: 16,
  },
  delay: {
    journeyLeftCloud: 50,
    journeySun: 100,
    journeyRightCloud: 140,
    journeyUpperCloud: 200,
  },
  easing: {
    standard: MOTION_EASING_STANDARD,
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
    pillStaggerMs: 160,
  },
} as const;

export type Motion = typeof motion;
