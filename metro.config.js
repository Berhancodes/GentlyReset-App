// Sentry's Metro config: adds debug IDs so crash reports map back to the original source.
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

module.exports = getSentryExpoConfig(__dirname);
