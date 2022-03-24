import * as BS from 'browser-search';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';

type StoreCache<CacheKey, CacheValue> = Map<CacheKey, CacheValue>;
type GlobalCache<CacheKey, CacheValue> = Map<BS.StoreId, StoreCache<CacheKey, CacheValue>>

export const buildStoreCache = <CacheKey, CacheValue>() => {
  const globalCache: GlobalCache<CacheKey, CacheValue> = new Map();

  const queryCache = (storeId: BS.StoreId, cacheKey: CacheKey): Maybe<CacheValue> => {
    const storeCache = globalCache.get(storeId);
    return (
      storeCache === undefined ? Nothing
      : storeCache.has(cacheKey) ? Just(storeCache.get(cacheKey) as CacheValue) 
      : Nothing
    );
  }

  const addValueToStoreCache = (key: CacheKey, value: CacheValue, storeId: BS.StoreId): void => {
    const storeCache = globalCache.get(storeId) ?? new Map() as StoreCache<CacheKey, CacheValue>;
    storeCache.set(key, value);
    globalCache.set(storeId, storeCache);
  }

  const deleteStoreCache = (storeId: BS.StoreId): void => {
    globalCache.delete(storeId)
  }

  return {
    queryCache,
    addValueToStoreCache,
    deleteStoreCache,
  }
}
