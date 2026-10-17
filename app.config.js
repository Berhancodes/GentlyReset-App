/**
 * Extends app.json. Google sign-in's native setup needs the iOS client ID's URL scheme,
 * so its plugin only switches on once EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID is set (in .env
 * and on EAS); until then the app builds without the Google button.
 */
module.exports = ({ config }) => {
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  if (!googleIosClientId) {
    return config;
  }

  // "123-abc.apps.googleusercontent.com" → "com.googleusercontent.apps.123-abc"
  const iosUrlScheme = `com.googleusercontent.apps.${googleIosClientId.replace('.apps.googleusercontent.com', '')}`;
  return {
    ...config,
    plugins: [...config.plugins, ['@react-native-google-signin/google-signin', { iosUrlScheme }]],
  };
};
