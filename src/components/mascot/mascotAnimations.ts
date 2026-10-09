export const MASCOT_ANIMATIONS = ['idle', 'wave', 'jump', 'hug', 'wiggle'] as const;

export type MascotAnimation = (typeof MASCOT_ANIMATIONS)[number];
export type MascotReaction = Exclude<MascotAnimation, 'idle'>;

export type MascotState = { type: 'idle' } | { type: 'reaction'; animation: MascotReaction };

export const MASCOT_REACTIONS: readonly MascotReaction[] = ['wave', 'jump', 'hug', 'wiggle'];

export function getMascotReactionPool(
  previousReaction?: MascotReaction,
): readonly MascotReaction[] {
  if (!previousReaction) {
    return MASCOT_REACTIONS;
  }

  return MASCOT_REACTIONS.filter((reaction) => reaction !== previousReaction);
}

export function pickMascotReaction(
  previousReaction?: MascotReaction,
  random = Math.random,
): MascotReaction {
  const pool = getMascotReactionPool(previousReaction);
  const firstReaction = pool[0];
  if (firstReaction == null) {
    return 'wave';
  }

  const poolIndex = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  return pool[poolIndex] ?? firstReaction;
}

export function getVisibleMascotAnimation(state: MascotState): MascotAnimation {
  return state.type === 'idle' ? 'idle' : state.animation;
}
