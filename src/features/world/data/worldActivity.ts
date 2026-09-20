export type WorldActivityAvatar = 'strawHat' | 'greenHat';

export type WorldActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  avatar: WorldActivityAvatar;
};

/**
 * Mock recent-activity rows for the World sheet.
 * Isolated from reset/onboarding stores — not a live friends feed.
 */
export const WORLD_RECENT_ACTIVITY: readonly WorldActivityItem[] = [
  {
    id: 'day-7',
    title: 'a friend completed day 7!',
    subtitle: 'proud of you',
    timeLabel: '2h ago',
    avatar: 'strawHat',
  },
  {
    id: 'encouragement',
    title: 'someone sent you encouragement',
    subtitle: '"you got this"',
    timeLabel: '5h ago',
    avatar: 'greenHat',
  },
];

export const WORLD_ACTIVITY_SEE_ALL_NOTICE = {
  title: 'recent activity',
  body: 'a live friends feed will land here later.',
} as const;
