import { Share } from 'react-native';

const INVITE_MESSAGE =
  "I'm doing a 30-day Gently Reset — one small reset a day. Come reset with me.";

export async function inviteFriend(): Promise<void> {
  await Share.share({
    message: INVITE_MESSAGE,
  });
}
