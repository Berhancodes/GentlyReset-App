export type AppEntryInput = {
  isPro: boolean;
  /** The old local pass, still kept on the device. */
  hasPreviewAccess: boolean;
  /** `__DEV__`: Expo Go and the web preview, where store purchases can't run. */
  isDevelopmentBuild: boolean;
};

/**
 * Only an active Pro entitlement opens the app. The local preview pass counts in
 * development builds alone, so a release build always goes through the store.
 */
export function canEnterApp(input: AppEntryInput): boolean {
  return input.isPro || (input.isDevelopmentBuild && input.hasPreviewAccess);
}
