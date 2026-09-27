/**
 * Production legal URLs are not in this repo yet.
 * Set these only when the real pages exist. Do not invent URLs.
 */
export function getLegalUrls(): {
  termsOfUse: string | null;
  privacyPolicy: string | null;
} {
  return {
    termsOfUse: readPublicUrl(process.env.EXPO_PUBLIC_TERMS_URL),
    privacyPolicy: readPublicUrl(process.env.EXPO_PUBLIC_PRIVACY_URL),
  };
}

function readPublicUrl(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  if (trimmed.length === 0) {
    return null;
  }
  if (!/^https:\/\//i.test(trimmed)) {
    return null;
  }
  return trimmed;
}
