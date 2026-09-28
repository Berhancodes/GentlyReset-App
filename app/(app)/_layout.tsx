import { Stack } from 'expo-router';

import { colors } from '@/design-system';
import { FriendInviteResume } from '@/features/friends/components/FriendInviteResume';

export default function AppLayout() {
  return (
    <>
      <FriendInviteResume />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      />
    </>
  );
}
