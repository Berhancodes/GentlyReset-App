import { Linking } from 'react-native';
import { router } from 'expo-router';

import { getLegalUrls } from '@/features/subscription/utils/legalUrls';

export type LegalDocumentKind = 'terms' | 'privacy';

/**
 * Opens the hosted page when its URL is configured (EXPO_PUBLIC_TERMS_URL /
 * EXPO_PUBLIC_PRIVACY_URL), otherwise the in-app copy.
 */
export function openLegalDocument(kind: LegalDocumentKind): void {
  const urls = getLegalUrls();
  const hosted = kind === 'terms' ? urls.termsOfUse : urls.privacyPolicy;
  const inApp = kind === 'terms' ? '/legal/terms' : '/legal/privacy';
  if (hosted) {
    void Linking.openURL(hosted).catch(() => router.push(inApp));
    return;
  }
  router.push(inApp);
}
