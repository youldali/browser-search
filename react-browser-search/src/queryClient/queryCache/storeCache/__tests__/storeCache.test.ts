import { buildStoreCache } from '../storeCache';

describe ('buildStoreCache', () => {
  
  const storeId = 'storeId';

  describe('addValueToStoreCache', () => {
    it('adds a new value to the cache store and creates it if it does not exist', () => {
      const cache = buildStoreCache<string, number>();

      cache.addValueToStoreCache('key', 1, storeId);
      expect(cache.queryCache(storeId, 'key').extract()).toBe(1);

      cache.addValueToStoreCache('key2', 2, storeId);
      expect(cache.queryCache(storeId, 'key2').extract()).toBe(2);
    })
  })

  describe('queryCache', () => {
    it('adds gets the value or return Nothing if it does not exist', () => {
      const cache = buildStoreCache<string, number>();

      const nothing = cache.queryCache(storeId, 'key');
      expect(nothing.isNothing()).toBe(true);

      cache.addValueToStoreCache('key', 1, storeId);
      const just = cache.queryCache(storeId, 'key');
      expect(just.extract()).toBe(1);
    })
  })

  describe('deleteStoreCache', () => {
    it('deletes the cache associated to a store', () => {
      const cache = buildStoreCache<string, number>();
      
      cache.deleteStoreCache(storeId);
      cache.addValueToStoreCache('key', 1, storeId);
      cache.deleteStoreCache(storeId);

      const nothing = cache.queryCache(storeId, 'key');
      expect(nothing.isNothing()).toBe(true);
    })
  })

});