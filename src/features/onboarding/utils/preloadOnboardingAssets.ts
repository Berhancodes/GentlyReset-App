import { Asset } from 'expo-asset';
import { Image, type ImageSourcePropType } from 'react-native';

import { getOnboardingStepAssetSourcesAt } from '@/features/onboarding/data/onboardingStepAssets';

/** How many upcoming screens to decode while the current one is visible. */
export const ONBOARDING_ASSET_LOOKAHEAD = 3;

/** Max hold before presenting the next screen if a decode is still in flight. */
export const ONBOARDING_ASSET_WAIT_MS = 3000;

type SourceKey = string | number;

const loadedKeys = new Set<SourceKey>();
const inflight = new Map<SourceKey, Promise<void>>();
const listeners = new Map<SourceKey, Set<() => void>>();

export function getImageSourceKey(source: ImageSourcePropType): SourceKey | null {
  if (typeof source === 'number' || typeof source === 'string') {
    return source;
  }

  if (Array.isArray(source) || source == null || typeof source !== 'object') {
    return null;
  }

  if ('uri' in source && typeof source.uri === 'string' && source.uri.length > 0) {
    return source.uri;
  }

  return null;
}

export function uniqueImageSources(sources: readonly ImageSourcePropType[]): ImageSourcePropType[] {
  const seen = new Set<SourceKey>();
  const unique: ImageSourcePropType[] = [];

  for (const source of sources) {
    const key = getImageSourceKey(source);
    if (key === null || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(source);
  }

  return unique;
}

export function isOnboardingAssetLoaded(source: ImageSourcePropType): boolean {
  const key = getImageSourceKey(source);
  return key !== null && loadedKeys.has(key);
}

export function markOnboardingAssetLoaded(source: ImageSourcePropType) {
  const key = getImageSourceKey(source);
  if (key === null || loadedKeys.has(key)) {
    return;
  }

  loadedKeys.add(key);
  const pending = listeners.get(key);
  if (!pending) {
    return;
  }

  listeners.delete(key);
  pending.forEach((notify) => {
    notify();
  });
}

function subscribeToAsset(source: ImageSourcePropType, notify: () => void): () => void {
  const key = getImageSourceKey(source);
  if (key === null || loadedKeys.has(key)) {
    notify();
    return () => undefined;
  }

  const pending = listeners.get(key) ?? new Set<() => void>();
  pending.add(notify);
  listeners.set(key, pending);

  return () => {
    pending.delete(notify);
    if (pending.size === 0) {
      listeners.delete(key);
    }
  };
}

type AssetModule = number | string | { uri: string; width: number; height: number };

function toAssetModule(source: ImageSourcePropType): AssetModule | null {
  if (typeof source === 'number' || typeof source === 'string') {
    return source;
  }

  if (Array.isArray(source) || source == null || typeof source !== 'object' || !('uri' in source)) {
    return null;
  }

  if (typeof source.uri !== 'string' || source.uri.length === 0) {
    return null;
  }

  if (typeof source.width === 'number' && typeof source.height === 'number') {
    return { uri: source.uri, width: source.width, height: source.height };
  }

  return source.uri;
}

function assetFromModule(moduleId: AssetModule) {
  if (typeof moduleId === 'object') {
    return Asset.fromModule(moduleId);
  }

  if (typeof moduleId === 'string' && moduleId.includes('://')) {
    return Asset.fromURI(moduleId);
  }

  return Asset.fromModule(moduleId);
}

async function downloadOne(source: ImageSourcePropType): Promise<void> {
  const key = getImageSourceKey(source);
  if (key === null || loadedKeys.has(key)) {
    return;
  }

  const existing = inflight.get(key);
  if (existing) {
    await existing;
    return;
  }

  const work = (async () => {
    const moduleId = toAssetModule(source);
    if (moduleId === null) {
      return;
    }

    const asset = assetFromModule(moduleId);
    if (!asset.downloaded) {
      await asset.downloadAsync();
    }

    const uri = asset.localUri ?? asset.uri;
    if (uri) {
      await Image.prefetch(uri);
    }

    markOnboardingAssetLoaded(source);
  })()
    .catch(() => undefined)
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, work);
  await work;
}

export async function preloadOnboardingAssets(
  sources: readonly ImageSourcePropType[],
): Promise<void> {
  const unique = uniqueImageSources(sources);
  if (unique.length === 0) {
    return;
  }

  await Promise.all(unique.map((source) => downloadOne(source)));
}

export async function preloadOnboardingStepsFrom(
  startIndex: number,
  lookahead: number = ONBOARDING_ASSET_LOOKAHEAD,
): Promise<void> {
  for (let offset = 0; offset <= lookahead; offset += 1) {
    await preloadOnboardingAssets(getOnboardingStepAssetSourcesAt(startIndex + offset));
  }
}

export function collectOnboardingWarmupSources(
  currentStepIndex: number,
  lookahead: number = ONBOARDING_ASSET_LOOKAHEAD,
): ImageSourcePropType[] {
  const sources: ImageSourcePropType[] = [];
  for (let offset = 1; offset <= lookahead; offset += 1) {
    sources.push(...getOnboardingStepAssetSourcesAt(currentStepIndex + offset));
  }
  return uniqueImageSources(sources);
}

export function waitForOnboardingStepAssets(
  stepIndex: number,
  timeoutMs: number = ONBOARDING_ASSET_WAIT_MS,
): Promise<void> {
  const sources = uniqueImageSources(getOnboardingStepAssetSourcesAt(stepIndex));
  if (sources.length === 0 || sources.every(isOnboardingAssetLoaded)) {
    return Promise.resolve();
  }

  void preloadOnboardingAssets(sources);

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      unsubscribers.forEach((unsubscribe) => {
        unsubscribe();
      });
      resolve();
    };

    const timer = setTimeout(finish, timeoutMs);
    const unsubscribers = sources.map((source) =>
      subscribeToAsset(source, () => {
        if (sources.every(isOnboardingAssetLoaded)) {
          finish();
        }
      }),
    );

    if (sources.every(isOnboardingAssetLoaded)) {
      finish();
    }
  });
}
