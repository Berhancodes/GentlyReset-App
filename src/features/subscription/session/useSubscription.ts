import { useContext } from 'react';

import { SubscriptionContext, type SubscriptionContextValue } from './SubscriptionProvider';

export function useSubscription(): SubscriptionContextValue {
  const value = useContext(SubscriptionContext);
  if (!value) {
    throw new Error('useSubscription must be used inside SubscriptionProvider.');
  }
  return value;
}
