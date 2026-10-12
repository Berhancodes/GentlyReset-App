import { router } from 'expo-router';

import { clearDeviceData } from '@/features/account/clearDeviceData';

/**
 * Commands to type in the React Native DevTools console (press `j` where Expo is
 * running) or the browser console while testing. Development builds only.
 */
export function registerDevCommands(): void {
  if (!__DEV__) {
    return;
  }
  Object.assign(globalThis, {
    /** Wipes this device's Gently Reset data and goes back to the welcome screen. */
    restartOnboarding() {
      clearDeviceData();
      router.replace('/(onboarding)/flow');
      console.log('Onboarding restarted from the welcome screen.');
    },
  });
}
