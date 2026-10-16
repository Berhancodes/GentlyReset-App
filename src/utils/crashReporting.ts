import * as Sentry from '@sentry/react-native';

/**
 * Crash and error reporting. Only release builds send anything, and only when a
 * DSN is set (EXPO_PUBLIC_SENTRY_DSN). No personal data: no IPs, no user emails,
 * no screenshots, no session replays — just what broke and where.
 */
export function initCrashReporting(): void {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) {
    return;
  }
  Sentry.init({
    dsn,
    enabled: !__DEV__,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    attachScreenshot: false,
    attachViewHierarchy: false,
  });
}

export const wrapWithCrashReporting = Sentry.wrap;
