import type { PurchaseActionResult } from '../types';

type PurchaseErrorShape = {
  code?: string | number;
  userCancelled?: boolean;
  message?: string;
};

const CANCELLED: PurchaseActionResult = {
  ok: false,
  kind: 'cancelled',
  message: '',
};

const NETWORK_MESSAGE = 'we couldn’t reach the store. check your connection.';
const FALLBACK_MESSAGE = 'the purchase didn’t go through. try again.';

export function mapPurchaseError(error: unknown): PurchaseActionResult {
  if (error && typeof error === 'object') {
    const shape = error as PurchaseErrorShape;
    if (shape.userCancelled === true || shape.code === '1' || shape.code === 1) {
      return CANCELLED;
    }

    const message = (shape.message ?? '').toLowerCase();
    if (message.includes('cancel')) {
      return CANCELLED;
    }
    if (
      message.includes('network') ||
      message.includes('offline') ||
      message.includes('failed to fetch')
    ) {
      return { ok: false, kind: 'failed', message: NETWORK_MESSAGE };
    }
  }

  if (error instanceof TypeError) {
    return { ok: false, kind: 'failed', message: NETWORK_MESSAGE };
  }

  return { ok: false, kind: 'failed', message: FALLBACK_MESSAGE };
}
