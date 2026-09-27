import { Redirect } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { getRootHref } from '@/navigation/getRootHref';

export default function Index() {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const { isPro } = useSubscription();

  return <Redirect href={getRootHref({ hasCompletedOnboarding, isPro })} />;
}
