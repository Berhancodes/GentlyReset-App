import type { MascotAnimation } from '@/components/mascot/mascotAnimations';

export const MASCOT_VIDEO_SOURCES: Record<MascotAnimation, number> = {
  idle: require('../../../assets/videos/mascot/idle.mov'),
  wave: require('../../../assets/videos/mascot/wave.mov'),
  jump: require('../../../assets/videos/mascot/jump.mov'),
  hug: require('../../../assets/videos/mascot/hug.mov'),
  wiggle: require('../../../assets/videos/mascot/wiggle.mov'),
};

export const MASCOT_IDLE_STILL = require('../../../assets/images/mascot/home/idle.png');
