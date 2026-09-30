import {
  isResetTypeId,
  LEGACY_FALLBACK_RESET_TYPE_ID,
  type ResetTypeId,
} from '@/features/reset/types';

export type NoticedCopy = {
  insight: string;
  pattern: readonly [string, string];
  closerLead: string;
  closerEmphasis: string;
  closerRest: string;
};

export const NOTICED_COPY: Record<ResetTypeId, NoticedCopy> = {
  'soft-restarter': {
    insight: "You're more self-aware than you give yourself credit for.",
    pattern: [
      "When things slip, you don't struggle because you don't care.",
      'You struggle with coming back.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'returning feel easier,',
    closerRest: 'not make you try harder.',
  },
  'overloaded-dreamer': {
    insight: 'You care about more futures than most people even imagine.',
    pattern: [
      "When things stall, you don't stall because you don't want it.",
      'You stall because too many starting points compete.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'one thing feel possible,',
    closerRest: 'not make you try everything.',
  },
  'almost-starter': {
    insight: 'You take this more seriously than you give yourself credit for.',
    pattern: [
      "When you don't begin, it isn't because you don't care.",
      'You wait until it feels ready enough.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'starting feel smaller,',
    closerRest: 'not make you plan harder.',
  },
  'fading-flame': {
    insight: "You can start. You just don't stay once it feels ordinary.",
    pattern: [
      "When things fade, it isn't because you don't care.",
      'You struggle once the excitement is gone.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'ordinary days feel enough,',
    closerRest: 'not make you chase the spark.',
  },
  'all-in-heart': {
    insight: "You care with your whole chest. That isn't the problem.",
    pattern: [
      "When you crash, it isn't because you don't mean it.",
      'You spend it all in the first week.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'enough feel like enough,',
    closerRest: 'not make you try bigger.',
  },
  'quiet-drain': {
    insight: "You're still here, even on days that already cost a lot.",
    pattern: [
      "When things slip, it isn't because you don't care.",
      'The day just asks more than you have.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'a small day feel enough,',
    closerRest: 'not make you push harder.',
  },
  'drifting-compass': {
    insight: "You want your days to mean something. That's already there.",
    pattern: [
      "When you don't start, it isn't because you don't care.",
      'You struggle with not knowing which way is yours.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'one direction feel walkable,',
    closerRest: 'not make you find the whole map.',
  },
  'quiet-stranger': {
    insight: 'You can still tell when something feels like you.',
    pattern: [
      "When you drift, it isn't because you don't care.",
      "You've just gotten a little far from yourself.",
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'coming closer feel easier,',
    closerRest: 'not make you become someone else.',
  },
  'soft-scatter': {
    insight: 'You care. The day just has too many exits.',
    pattern: [
      "When things leak, it isn't because you don't care.",
      'You struggle because the day has no edges.',
    ],
    closerLead: 'Your reset should make',
    closerEmphasis: 'the day feel smaller,',
    closerRest: 'not make you need more willpower.',
  },
};

export function getNoticedCopy(profileId: string): NoticedCopy {
  if (isResetTypeId(profileId)) {
    return NOTICED_COPY[profileId];
  }
  return NOTICED_COPY[LEGACY_FALLBACK_RESET_TYPE_ID];
}
