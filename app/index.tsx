import { Redirect } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { getRootHref } from '@/navigation/getRootHref';

export default function Index() {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);

  return <Redirect href={getRootHref({ hasCompletedOnboarding })} />;
}
